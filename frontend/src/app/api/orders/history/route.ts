// app/api/orders/history/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  console.log('Orders history API called');

  try {
    // 1️⃣ Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    // 2️⃣ Get visitor account
    const user = await prisma.visitors_account.findUnique({
      where: { EMAIL_ADDRESS: session.user.email },
      select: {
        VISITORS_ACCOUNT_ID: true,
        EMAIL_ADDRESS: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found - No visitor account for this email' },
        { status: 404 }
      );
    }

    // 3️⃣ Fetch orders with details + product info
    const orders = await prisma.business_order.findMany({
      where: { 
        VISITOR_ID: Number(user.VISITORS_ACCOUNT_ID) 
      },
      orderBy: { 
        CREATION_DATETIME: 'desc' 
      },
    });

    console.log(`Found ${orders.length} orders for user`);

    // Get all order IDs
    const orderIds = orders
      .map(order => order.BUSINESS_ORDER_ID)
      .filter((id): id is number => id !== null);

    // Define the product type
    type Product = {
      TITLE: string | null;
      DESCRIPTION: string | null;
      PIC: string | null;
      PRODUCT_PRICE: number | null;
    };

    // Define the order detail type
    type OrderDetail = {
      BUSINESS_ORDER_DETAIL_ID: number;
      BUSINESS_ORDER_ID: number;
      BUSINESS_PRODUCT_ID: number | null;
      ORDER_QUANTITY: number | null;
      product: Product | null;
    };

    // Fetch order details with product info
    const orderDetails = await prisma.business_order_detail.findMany({
      where: {
        BUSINESS_ORDER_ID: {
          in: orderIds
        }
      },
      include: {
        product: {
          select: {
            TITLE: true,
            DESCRIPTION: true,
            PIC: true,
            PRODUCT_PRICE: true
          }
        }
      }
    }) as unknown as OrderDetail[];

    // Group details by order ID
    const detailsByOrderId = orderDetails.reduce<Record<number, OrderDetail[]>>((acc, detail) => {
      const orderId = detail.BUSINESS_ORDER_ID;
      if (!orderId) return acc; // Skip if orderId is null
      
      if (!acc[orderId]) {
        acc[orderId] = [];
      }
      acc[orderId].push(detail);
      return acc;
    }, {});

    // Format the response
    const formattedOrders = orders.map(order => ({
      ...order,
      details: detailsByOrderId[order.BUSINESS_ORDER_ID] || []
    }));

    console.log('Returning orders with details');
    return NextResponse.json({
      success: true,
      orders: formattedOrders,
      user: {
        email: user.EMAIL_ADDRESS,
        visitorId: user.VISITORS_ACCOUNT_ID,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Error in orders/history API:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch order history',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
