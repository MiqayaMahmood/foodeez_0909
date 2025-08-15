import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

// Simple interface for the order items
interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
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
    // Retrieve the session with expanded line items and customer details
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items.data.price.product', 'customer', 'payment_intent'],
    });

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ success: false, error: 'Payment not successful.' }, { status: 402 });
    }

    // Extract line items and metadata
    const lineItems = session.line_items?.data;
    if (!lineItems || lineItems.length === 0) {
      return NextResponse.json({ success: false, error: 'No items found in order.' }, { status: 400 });
    }

    // Get the first product to determine the business
    const firstProductId = parseInt((lineItems[0].price?.product as Stripe.Product)?.metadata?.productId || '0', 10);
    if (!firstProductId) {
      return NextResponse.json({ success: false, error: 'Invalid product in order.' }, { status: 400 });
    }

    // Find the business associated with the first product
    const productRecord = await prisma.business_product.findUnique({
      where: { BUSINESS_PRODUCT_ID: firstProductId },
      select: { BUSINESS_ID: true }
    });

    if (!productRecord || !productRecord.BUSINESS_ID) {
      return NextResponse.json({ success: false, error: 'Could not determine business for this order.' }, { status: 500 });
    }
    const businessId = productRecord.BUSINESS_ID;

    // Get or create customer in our database
    let customerId: number | null = null;
    const sessionUser = await getServerSession(authOptions);
    
    if (sessionUser?.user?.email) {
      // For authenticated users
      const user = await prisma.visitors_account.findUnique({
        where: { EMAIL_ADDRESS: sessionUser.user.email },
        select: { VISITORS_ACCOUNT_ID: true }
      });
      
      if (user) {
        customerId = Number(user.VISITORS_ACCOUNT_ID);
      }
    } else if (session.customer_email) {
      // For guest users, check if they exist by email
      const existingUser = await prisma.visitors_account.findUnique({
        where: { EMAIL_ADDRESS: session.customer_email },
        select: { VISITORS_ACCOUNT_ID: true }
      });

      if (existingUser) {
        customerId = Number(existingUser.VISITORS_ACCOUNT_ID);
      } else if (session.metadata?.saveInfo === 'true') {
        // Create a guest user account if they chose to save their info
        const userData: any = {
          EMAIL_ADDRESS: session.customer_email,
          FIRST_NAME: session.metadata?.customerName?.split(' ')[0] || 'Guest',
          LAST_NAME: session.metadata?.customerName?.split(' ').slice(1).join(' ') || 'User',
        };
        
        // Only add phone if it exists in metadata
        if (session.metadata?.customerPhone) {
          userData.WHATSAPP_NUMBER = session.metadata.customerPhone;
        }
        
        const newUser = await prisma.visitors_account.create({
          data: userData,
        });
        customerId = Number(newUser.VISITORS_ACCOUNT_ID);
      }
    }

    // Calculate order totals
    const orderTotal = lineItems.reduce((sum, item) => {
      return sum + (item.amount_total || 0);
    }, 0) / 100; // Convert from cents to currency

    // Get shipping details from session or metadata
    const shippingAddress = (session as any).shipping?.address as Stripe.Address | null;
    const customerDetails = session.customer_details as Stripe.Checkout.Session.CustomerDetails | null;
    
    // Create the order in the database
    const newOrder = await prisma.business_order.create({
      data: {
        BUSINESS_ORDER_ID: generateTemporaryId(),
        CREATION_DATETIME: new Date(),
        BUSINESS_ID: businessId,
        VISITOR_ID: customerId || 0,
        PAYMENT_DONE: 1,
        PAYMENT_MODE: 'stripe',
        ORDER_STATUS: 1, // 1 = New order
        TERMINAL: 'web',
        FIRST_NAME: session.metadata?.customerName?.split(' ')[0] || 'Guest',
        LAST_NAME: session.metadata?.customerName?.split(' ').slice(1).join(' ') || 'User',
        ADDRESS_STREET: shippingAddress?.line1 || session.metadata?.deliveryAddress?.split(',')[0] || '',
        // Convert ZIP code to string to match the expected type
        ADDRESS_ZIP: shippingAddress?.postal_code ? String(shippingAddress.postal_code) : '',
        ADDRESS_TOWN: shippingAddress?.city || session.metadata?.deliveryAddress?.split(',').slice(-2, -1)[0]?.trim() || '',
        ADDRESS_COUNTRY_CODE: shippingAddress?.country || session.metadata?.deliveryAddress?.split(',').pop()?.trim() || 'CH',
        // Using PHONE_NUMBER to match the Prisma schema
        PHONE_NUMBER: customerDetails?.phone || session.metadata?.customerPhone || '',
        EMAIL_ADDRESS: session.customer_email || session.metadata?.customerEmail || '',
        ORDER_GROSS_AMOUNT: orderTotal,
        ORDER_NET_AMOUNT: orderTotal,
        ORDER_AMOUNT: orderTotal,
        ORDER_FINAL_AMOUNT: orderTotal,
        // Note: Additional order details will be stored in the database via raw SQL
      },
    });

    // Create order details for each item
    for (const item of lineItems) {
      const product = item.price?.product as Stripe.Product;
      const productId = parseInt(product.metadata?.productId || '0', 10);
      
      if (productId) {
        await prisma.$executeRaw`
          INSERT INTO business_order_detail (
            BUSINESS_ORDER_DETAIL_ID,
            CREATION_DATETIME,
            BUSINESS_ORDER_ID,
            BUSINESS_PRODUCT_ID,
            ORDER_QUANTITY,
            PRODUCT_SELL_PRICE,
            PRODUCT_PRICE,
            QUANTITY_BALANCE
          ) VALUES (
            ${generateTemporaryId()},
            NOW(),
            ${newOrder.BUSINESS_ORDER_ID},
            ${productId},
            ${item.quantity || 1},
            ${(item.price?.unit_amount || 0) / 100},
            ${(item.amount_total || 0) / 100},
            ${item.quantity || 1}
          )
        `;
      }
    }

    // Set delivery time to 1 hour from now
    const deliveryTime = new Date();
    deliveryTime.setHours(deliveryTime.getHours() + 1);
    
    // Update order with delivery time
    await prisma.$executeRaw`
      UPDATE business_order 
      SET DELIVERY_DATETIME = ${deliveryTime}
      WHERE BUSINESS_ORDER_ID = ${newOrder.BUSINESS_ORDER_ID}
    `;

    // Check if we already processed this payment to prevent duplicates
    // const existingOrder = await prisma.business_order.findFirst({
    //   where: {
    //     EMAIL_ADDRESS: session.customer_email || session.metadata?.customerEmail || '',
    //     CREATION_DATETIME: {
    //       gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
    //     },
    //     ORDER_AMOUNT: orderTotal
    //   }
    // });

    // if (existingOrder) {
    //   return NextResponse.json({ 
    //     success: true, 
    //     orderId: existingOrder.BUSINESS_ORDER_ID,
    //     orderNumber: `ORD-${existingOrder.BUSINESS_ORDER_ID}`,
    //     customerId: existingOrder.VISITOR_ID || undefined,
    //     message: 'Order already processed'
    //   });
    // }

    // Get order items from line items
    const orderItems: OrderItem[] = [];
    let subtotal = 0;

    // Process each line item from Stripe
    for (const item of lineItems) {
      const product = item.price?.product as Stripe.Product;
      const amount = item.amount_total || 0;
      const quantity = item.quantity || 1;
      
      orderItems.push({
        id: parseInt(product.metadata?.productId || '0', 10),
        name: product.name || 'Product',
        price: amount / 100, // Convert to currency
        quantity: quantity
      });
      
      subtotal += amount;
    }
    
    // Convert to currency
    subtotal = subtotal / 100;
    const total = subtotal; // Add shipping if needed

    return NextResponse.json({ 
      success: true, 
      orderId: newOrder.BUSINESS_ORDER_ID,
      orderNumber: `ORD-${newOrder.BUSINESS_ORDER_ID}`,
      customerId: customerId || undefined,
      customerName: session.metadata?.customerName || 'Customer',
      customerEmail: session.customer_email || session.metadata?.customerEmail || '',
      shipping: {
        address: {
          line1: shippingAddress?.line1 || session.metadata?.deliveryAddress?.split(',')[0] || '',
          city: shippingAddress?.city || session.metadata?.deliveryAddress?.split(',').slice(-2, -1)[0]?.trim() || '',
          postal_code: shippingAddress?.postal_code || '',
          country: shippingAddress?.country || session.metadata?.deliveryAddress?.split(',').pop()?.trim() || 'CH'
        }
      },
      items: orderItems.map(item => ({
        description: item.name,
        quantity: item.quantity,
        amount_total: item.price * 100, // In cents
        price: {
          unit_amount: item.price * 100 / item.quantity, // Per unit price in cents
          product: {
            name: item.name,
            metadata: {
              productId: item.id.toString()
            }
          }
        }
      })),
      amount_subtotal: subtotal * 100, // In cents
      amount_total: total * 100, // In cents
      payment_method_types: ['card']
    });

  } catch (error) {
    console.error('Error verifying order:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json(
      { success: false, error: `Order verification failed: ${errorMessage}` }, 
      { status: 500 }
    );
  }
}
