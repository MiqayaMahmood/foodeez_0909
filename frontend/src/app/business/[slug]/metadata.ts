import { Metadata } from "next";
import { parseSlug } from "@/lib/utils/genSlug";
import { getBusinessById } from "@/services/BusinessProfilePageService";
import { UnifiedGoogleService } from '@/services/UnifiedGoogleService';
import { BusinessGoogleData } from "@/types/google-business";
import { generatePageMetadata, buildBusinessBreadcrumbs, buildLocalBusinessSchema } from '@/lib/seo';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  console.log(`[Metadata] Generating for slug: ${params.slug}`);
  const parsedId = parseSlug(params.slug as unknown as string);
  console.log(`[Metadata] Parsed ID: ${parsedId?.id}`);

  const business = await getBusinessById(Number(parsedId.id));
  console.log('[Metadata] Fetched Business:', business ? `ID: ${business.BUSINESS_ID}` : 'Not Found');

  if (!business) {
    return generatePageMetadata({
      title: 'Business Not Found',
      description: 'The business you are looking for could not be found.',
      url: `https://foodeez.ch/business/${params.slug}`,
      noindex: true,
    });
  }

  let googleBusinessData: BusinessGoogleData | null = null;
  if (business.PLACE_ID) {
    try {
      googleBusinessData = await UnifiedGoogleService.fetchGooglePlaceDetails(business.PLACE_ID);
    } catch (error) {
      console.error('Failed to fetch Google Business data:', error);
    }
  }

  const pageUrl = `https://foodeez.ch/business/${params.slug}`;

  return generatePageMetadata({
    title: business.BUSINESS_NAME || "Business",
    description: `Discover ${business.BUSINESS_NAME || "this restaurant"} on Foodeez. View photos, hours, reviews and more.`,
    url: pageUrl,
    breadcrumbs: buildBusinessBreadcrumbs('https://foodeez.ch', [
      { name: business.CITY_NAME || 'City' },
      { name: business.BUSINESS_NAME || 'Business', url: pageUrl },
    ]),
    structuredData: buildLocalBusinessSchema(business, googleBusinessData ?? undefined, pageUrl),
  });
}
