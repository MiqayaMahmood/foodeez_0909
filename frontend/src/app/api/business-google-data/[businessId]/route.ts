import { NextRequest, NextResponse } from 'next/server';
import { UnifiedGoogleService } from '@/services/UnifiedGoogleService';
import { 
  BusinessGoogleData, 
  BusinessGoogleDataResponse,
  GoogleReview,
  OpeningHourDay,
  GooglePhoto
} from '@/types/google-business';
import prisma from '@/lib/prisma';


export async function GET(
  request: NextRequest,
  { params }: { params: { businessId: string } }
) {
  try {
    const businessId = parseInt(params.businessId);
    if (!businessId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid business ID' 
      } as BusinessGoogleDataResponse, { status: 400 });
    }

    // Check for refresh parameter
    const url = new URL(request.url);
    const forceRefresh = url.searchParams.get('refresh') === 'true';

    // Get PLACE_ID from DB
    const business = await prisma.business_detail_view_all.findUnique({
      where: { BUSINESS_ID: businessId },
      select: { PLACE_ID: true }
    });

    if (!business?.PLACE_ID) {
      return NextResponse.json({ 
        success: false, 
        error: 'Business not found' 
      } as BusinessGoogleDataResponse, { status: 404 });
    }

    const placeId = business.PLACE_ID;

    // Check DB for cached data (unless force refresh)
    if (!forceRefresh) {
      const cachedData = await getCachedBusinessData(businessId, placeId);
      if (cachedData) {
        return NextResponse.json({
          ...cachedData,
          success: true
        } as BusinessGoogleDataResponse);
      }
    }

    // Fetch fresh data from Google API
    const freshData = await UnifiedGoogleService.fetchGooglePlaceDetails(placeId);
    
    // Save to database in background (don't await to return data quickly)
    saveBusinessDataToDb(businessId, placeId, freshData).catch(err => {
      console.error('Error saving Google data to DB:', err);
    });

    return NextResponse.json({
      ...freshData,
      success: true
    } as BusinessGoogleDataResponse);

  } catch (error) {
    console.error('Error in GET /business-google-data:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    } as BusinessGoogleDataResponse, { status: 500 });
  }
}

/**
 * Get cached business data from database
 */
async function getCachedBusinessData(
  businessId: number, 
  placeId: string
): Promise<BusinessGoogleData | null> {
  try {
    const [cachedReviews, cachedOpeningHours, cachedPhotos] = await Promise.all([
      prisma.business_google_review_view.findMany({ 
        where: { BUSINESS_ID: businessId, PLACE_ID: placeId } 
      }),
      prisma.business_opening_hours_view.findMany({ 
        where: { BUSINESS_ID: businessId, PLACE_ID: placeId } 
      }),
      prisma.business_google_images_view.findMany({ 
        where: { BUSINESS_ID: businessId, PLACE_ID: placeId } 
      }),
    ]);

    // Only return cached data if we have all three types
    if (cachedReviews.length === 0 || cachedOpeningHours.length === 0 || cachedPhotos.length === 0) {
      return null;
    }

    const reviews: GoogleReview[] = cachedReviews.map(r => ({
      author_name: r.AUTHOR || '',
      rating: parseFloat(r.RATING || '0'),
      text: r.REVIEW || '',
      relative_time_description: r.RELATIVE_TIME || '',
      profile_photo_url: r.PROFILE_PHOTO_URL || ""
    }));

    const openingHours: OpeningHourDay[] = cachedOpeningHours.map(h => ({
      day: h.DAY || '',
      hours: `${h.OPEN_1 || ''} - ${h.CLOSE_1 || ''}${h.OPEN_2 ? `, ${h.OPEN_2} - ${h.CLOSE_2}` : ''}`
    }));

    const photos: GooglePhoto[] = cachedPhotos.map(p => ({ 
      photoUrl: p.IMAGE_URL || '', 
      width: parseInt(String(p.WIDTH || '0')), 
      height: parseInt(String(p.HEIGHT || '0')) 
    }));

    // Get the most recent creation date for lastUpdated
    const timestamps = [
      ...cachedReviews.map(r => new Date().getTime()), // Fallback since view might not have CREATION_DATETIME
      ...cachedOpeningHours.map(h => new Date().getTime()),
      ...cachedPhotos.map(p => new Date().getTime())
    ];
    const lastUpdated = new Date(Math.max(...timestamps));

    return {
      name: '', // We don't store business name in cache, will be filled from business table if needed
      rating: 0, // Will be calculated from reviews if needed
      totalReviews: reviews.length,
      reviews,
      openingHours,
      photos,
      isOpenNow: false, // We don't cache this real-time data
      cached: true,
      lastUpdated
    };
  } catch (error) {
    console.error('Error fetching cached data:', error);
    return null;
  }
}

/**
 * Save business data to database
 * Fixed version with proper error handling and logging
 */
async function saveBusinessDataToDb(
  businessId: number, 
  placeId: string, 
  data: BusinessGoogleData
): Promise<void> {
  console.log(`Starting to save data for business ${businessId}, place ${placeId}`);
  console.log(`Data to save: ${data.reviews.length} reviews, ${data.openingHours.length} hours, ${data.photos.length} photos`);
  try {
    // Clear existing data first
    console.log('Clearing existing data...');
    const deleteResults = await Promise.all([
      prisma.business_google_reviews.deleteMany({ where: { BUSINESS_ID: businessId } }),
      prisma.business_opening_hours.deleteMany({ where: { BUSINESS_ID: businessId } }),
      prisma.business_google_images.deleteMany({ where: { BUSINESS_ID: businessId } })
    ]);
    console.log('Deleted:', deleteResults);

    // Save reviews
    console.log('Saving reviews...');
    for (let i = 0; i < data.reviews.length; i++) {
      const review = data.reviews[i];
      try {
        const result = await prisma.business_google_reviews.create({
          data: {
            BUSINESS_ID: businessId,
            PLACE_ID: placeId,
            AUTHOR: review.author_name,
            RATING: String(review.rating),
            REVIEW: review.text,
            RELATIVE_TIME: review.relative_time_description,
            CREATION_DATETIME: new Date(),
            PROFILE_PHOTO_URL: review.profile_photo_url,
          }
        });
        console.log(`Saved review ${i + 1}:`, result.BUSINESS_GOOGLE_REVIEWS_ID);
      } catch (err) {
        console.error(`Error saving review ${i + 1}:`, err);
        console.error('Review data:', review);
      }
    }

    // Save opening hours using direct SQL to avoid Prisma issues
    console.log('Saving opening hours...');
    for (let i = 0; i < data.openingHours.length; i++) {
      const hours = data.openingHours[i];
      try {
        const timeRanges = hours.hours.split(',').map(r => r.trim());
        const [open1, close1] = timeRanges[0]?.split(/[-–]/).map(t => t.trim()) || ['', ''];
        const [open2, close2] = timeRanges[1]?.split(/[-–]/).map(t => t.trim()) || ['', ''];
        
        const result = await prisma.$executeRaw`
          INSERT INTO business_opening_hours (CREATION_DATETIME, BUSINESS_ID, PLACE_ID, DAY, OPEN_1, CLOSE_1, OPEN_2, CLOSE_2, REMARKS)
          VALUES (NOW(), ${businessId}, ${placeId}, ${hours.day}, ${open1}, ${close1}, ${open2}, ${close2}, ${hours.hours})
        `;
        console.log(`Saved opening hours ${i + 1}:`, result);
      } catch (err) {
        console.error(`Error saving opening hours ${i + 1}:`, err);
        console.error('Hours data:', hours);
      }
    }

    // Save photos using direct SQL
    console.log('Saving photos...');
    for (let i = 0; i < data.photos.length; i++) {
      const photo = data.photos[i];
      try {
        const result = await prisma.$executeRaw`
          INSERT INTO business_google_images (CREATION_DATETIME, BUSINESS_ID, PLACE_ID, IMAGE_URL, WIDTH, HEIGHT)
          VALUES (NOW(), ${businessId}, ${placeId}, ${photo.photoUrl}, ${String(photo.width)}, ${String(photo.height)})
        `;
        console.log(`Saved photo ${i + 1}:`, result);
      } catch (err) {
        console.error(`Error saving photo ${i + 1}:`, err);
        console.error('Photo data:', photo);
      }
    }
    
    console.log('Successfully completed saving all data to database');
  } catch (error) {
    console.error('Critical error saving business data to database:', error);
    // Don't throw error to prevent API from failing if DB save fails
  }
}
