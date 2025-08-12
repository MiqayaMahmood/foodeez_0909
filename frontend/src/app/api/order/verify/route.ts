import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { CartItem } from '@/stores/cartStore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

// A temporary workaround for non-autoincrementing primary keys
function generateTemporaryId() {
  return Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000000);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ success: false, error: 'Session ID is missing.' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items.data.price.product', 'customer_details'],
    });

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ success: false, error: 'Payment not successful.' }, { status: 402 });
    }

    // Extract line items and metadata
    const lineItems = session.line_items?.data;
    if (!lineItems || lineItems.length === 0) {
        return NextResponse.json({ success: false, error: 'No items found in order.' }, { status: 400 });
    }

    // --- Find Business ID from the first product --- 
    const firstProductId = parseInt((lineItems[0].price?.product as Stripe.Product).metadata.productId, 10);
    const productRecord = await prisma.business_product.findUnique({
        where: { BUSINESS_PRODUCT_ID: firstProductId },
        select: { BUSINESS_ID: true }
    });

    if (!productRecord || !productRecord.BUSINESS_ID) {
        return NextResponse.json({ success: false, error: 'Could not determine business for this order.' }, { status: 500 });
    }
    const businessId = productRecord.BUSINESS_ID;

    // --- Create Order in Database --- 
    const newOrderId = generateTemporaryId();
    const newOrder = await prisma.business_order.create({
        data: {
            BUSINESS_ORDER_ID: newOrderId,
            CREATION_DATETIME: new Date(),
            BUSINESS_ID: businessId,
            PAYMENT_DONE: 1,
            ORDER_STATUS: 1,
            ORDER_AMOUNT: (session.amount_total || 0) / 100,
            ORDER_FINAL_AMOUNT: (session.amount_total || 0) / 100,
            SHIPPING_CHARGES: (session.shipping_cost?.amount_total || 0) / 100,
            FIRST_NAME: session.customer_details?.name?.split(' ')[0] || '',
            LAST_NAME: session.customer_details?.name?.split(' ').slice(1).join(' ') || '',
            EMAIL_ADDRESS: session.customer_details?.email || '',
            order_detail: {
                create: lineItems.map(item => {
                    const product = item.price?.product as Stripe.Product;
                    return {
                        BUSINESS_ORDER_DETAIL_ID: generateTemporaryId(),
                        BUSINESS_PRODUCT_ID: parseInt(product.metadata.productId, 10),
                        PRODUCT_PRICE: (item.price?.unit_amount || 0) / 100,
                        ORDER_QUANTITY: item.quantity || 0,
                    };
                })
            }
        }
    });

    return NextResponse.json({ success: true, orderId: newOrder.BUSINESS_ORDER_ID });

  } catch (error) {
    console.error('Error verifying order:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ success: false, error: `Order verification failed: ${errorMessage}` }, { status: 500 });
  }
}
