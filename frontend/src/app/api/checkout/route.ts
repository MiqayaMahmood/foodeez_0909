import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { CartItem } from '@/stores/cartStore';

// IMPORTANT: Ensure you have STRIPE_SECRET_KEY in your .env.local file
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
  typescript: true,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const cartItems = body.items as CartItem[];

  if (!cartItems || cartItems.length === 0) {
    return new NextResponse('Cart is empty', { status: 400 });
  }

  const origin = headers().get('origin') || 'http://localhost:3000';

  try {
    const line_items = cartItems.map((item) => {
      return {
        price_data: {
          currency: 'chf',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100), // Price in cents
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return new NextResponse(errorMessage, { status: 500 });
  }
}
