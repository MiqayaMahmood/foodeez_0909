import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  console.log('Orders history API called');
  
  try {
    const session = await getServerSession(authOptions);
    console.log('Session data:', session?.user?.email ? 'User authenticated' : 'No session');
    
    if (!session?.user?.email) {
      console.log('Unauthorized: No session or email');
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    console.log('Looking up user in database with email:', session.user.email);
    
    // Find the user in the database
    const user = await prisma.visitors_account.findUnique({
      where: { EMAIL_ADDRESS: session.user.email },
      select: { 
        VISITORS_ACCOUNT_ID: true,
        EMAIL_ADDRESS: true,
      },
    });

    console.log('User lookup result:', user ? 'User found' : 'User not found');
    
    if (!user) {
      return NextResponse.json(
        { 
          error: 'User not found',
          details: 'No visitor account found with this email'
        },
        { status: 404 }
      );
    }

    console.log(`Fetching orders for user ID: ${user.VISITORS_ACCOUNT_ID}`);
    
    // Fetch the user's orders with details
    const orders = await prisma.business_order.findMany({
      where: {
        VISITOR_ID: Number(user.VISITORS_ACCOUNT_ID),
      },
      orderBy: {
        CREATION_DATETIME: 'desc',
      },
    });
    
    console.log(`Found ${orders.length} orders for user`);
    
    // Only fetch details if there are orders
    type OrderWithDetails = typeof orders[number] & { details: any[] };
    const orderWithDetails: OrderWithDetails[] = [];
    
    if (orders.length > 0) {
      const orderIds = orders.map(order => order.BUSINESS_ORDER_ID);
      console.log('Fetching details for order IDs:', orderIds);
      
      const orderDetails = await prisma.business_order_detail.findMany({
        where: {
          BUSINESS_ORDER_ID: {
            in: orderIds,
          },
        },
      });
      
      console.log(`Found ${orderDetails.length} order details`);
      
      orders.forEach((order) => {
        orderWithDetails.push({
          ...order,
          details: orderDetails.filter(detail => 
            detail.BUSINESS_ORDER_ID === order.BUSINESS_ORDER_ID
          )
        });
      });
    }

    console.log('Returning orders with details');
    return NextResponse.json({
      success: true,
      orders: orderWithDetails,
      user: {
        email: user.EMAIL_ADDRESS,
        visitorId: user.VISITORS_ACCOUNT_ID
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error in orders/history API:', {
      error: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch order history',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
