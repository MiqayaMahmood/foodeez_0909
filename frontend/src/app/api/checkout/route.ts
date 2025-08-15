import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { CartItem } from '@/stores/cartStore';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
  typescript: true,
});

type CustomerInfo = {
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  zip: string;
  city: string;
  country: string;
  // notes?: string;
  saveInfo: boolean;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { items, customerInfo } = body as { 
    items: CartItem[];
    customerInfo: CustomerInfo;
  };

  if (!items || items.length === 0) {
    return new NextResponse('Cart is empty', { status: 400 });
  }

  // Validate required customer information
  const requiredFields: (keyof CustomerInfo)[] = [
    'firstName', 'lastName', 'email', 'phone', 'street', 'zip', 'city', 'country'
  ];
  
  const missingFields = requiredFields.filter(field => !customerInfo[field]);
  if (missingFields.length > 0) {
    return new NextResponse(
      `Missing required fields: ${missingFields.join(', ')}`,
      { status: 400 }
    );
  }

  const origin = headers().get('origin') || 'http://localhost:3000';
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || customerInfo.userId;

  try {
    // Calculate total amount for metadata
    const totalAmount = items.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    );

    // Create line items for Stripe
    const line_items = items.map((item) => ({
      price_data: {
        currency: 'chf',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
          metadata: {
            productId: item.id,
          },
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create metadata for the order
    const metadata = {
      customerId: userId || 'guest',
      customerEmail: customerInfo.email,
      customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
      customerPhone: customerInfo.phone,
      deliveryAddress: `${customerInfo.street}, ${customerInfo.zip} ${customerInfo.city}, ${customerInfo.country}`,
      // orderNotes: customerInfo.notes || '',
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0).toString(),
      totalAmount: totalAmount.toFixed(2),
      saveInfo: customerInfo.saveInfo.toString(),
    };

    // Create a customer in Stripe (optional but recommended)
    let customer: Stripe.Customer | null = null;
    if (customerInfo.email) {
      // Check if customer already exists
      const existingCustomers = await stripe.customers.list({
        email: customerInfo.email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: customerInfo.email,
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          phone: customerInfo.phone,
          metadata: {
            userId: userId || 'guest',
            address: metadata.deliveryAddress,
          },
        });
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      customer: customer?.id,
      client_reference_id: userId || undefined,
      metadata,
      shipping_address_collection: {
        allowed_countries: ['CH'],
      },
      // phone_number_collection: {
      //   enabled: true,
      // },
      // customer_update: {
      //   address: 'auto',
      //   name: 'auto',
      // },
      submit_type: 'pay',
      billing_address_collection: 'required',
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'chf',
            },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 1,
              },
              maximum: {
                unit: 'business_day',
                value: 3,
              },
            },
          },
        },
      ],
    });

    return NextResponse.json({ 
      sessionId: session.id,
      customerId: customer?.id,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return new NextResponse(errorMessage, { status: 500 });
  }
}
