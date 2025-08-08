import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { businessId: string } }
) {
  try {
    const businessId = parseInt(params.businessId);
    
    if (!businessId) {
      return NextResponse.json(
        { error: 'Invalid business ID' },
        { status: 400 }
      );
    }

    // Check if we have cached data
    const [reviewsCount, openingHoursCount] = await Promise.all([
      prisma.business_google_reviews.count({
        where: { BUSINESS_ID: businessId }
      }),
      prisma.business_opening_hours.count({
        where: { BUSINESS_ID: businessId }
      })
    ]);

    const hasCachedData = reviewsCount > 0 && openingHoursCount > 0;

    return NextResponse.json({
      hasCachedData,
      reviewsCount,
      openingHoursCount,
      lastUpdated: hasCachedData ? new Date().toISOString() : null
    });

  } catch (error) {
    console.error('Error checking cached data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
