import { BusinessGoogleData } from '@/types/google-business';
import { business_detail_view_all } from '@prisma/client';

// Build LocalBusiness/Restaurant structured data from DB + Google data
export function buildLocalBusinessSchema(
  business: Partial<business_detail_view_all>,
  google: Partial<BusinessGoogleData> | undefined,
  pageUrl: string
) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.BUSINESS_NAME || google?.name || 'Business',
    url: pageUrl,
  };

  if (business.IMAGE_URL || (google?.photos && google.photos[0]?.photoUrl)) {
    schema.image = business.IMAGE_URL || google?.photos?.[0]?.photoUrl;
  }

  if (google?.rating && google.totalReviews !== undefined) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: google.rating,
      reviewCount: google.totalReviews,
    };
  }

  if (google?.openingHours && google.openingHours.length > 0) {
    // Provide human-readable opening hours as string list (simple & valid)
    schema.openingHours = google.openingHours.map((h) => `${h.day} ${h.hours}`);
  }

  // Basic address if present in business view (best-effort)
  const address: any = {
    '@type': 'PostalAddress',
  };
  if ((business as any).STREET_ADDRESS) address.streetAddress = (business as any).STREET_ADDRESS;
  if ((business as any).CITY_NAME) address.addressLocality = (business as any).CITY_NAME;
  if ((business as any).POSTAL_CODE) address.postalCode = (business as any).POSTAL_CODE;
  if ((business as any).COUNTRY_NAME) address.addressCountry = (business as any).COUNTRY_NAME;
  if (Object.keys(address).length > 1) {
    schema.address = address;
  }

  // Geo from Google geometry if available
  const lat = (google as any)?.geometry?.location?.lat;
  const lng = (google as any)?.geometry?.location?.lng;
  if (typeof lat === 'number' && typeof lng === 'number') {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: lat,
      longitude: lng,
    };
  }

  return schema;
}

export function buildBusinessBreadcrumbs(
  siteUrl: string,
  parts: { name: string; slug?: string; url?: string }[]
) {
  // Return an array [{ name, url }]
  const items = [{ name: 'Home', url: siteUrl }];
  for (const p of parts) {
    items.push({ name: p.name, url: p.url || (p.slug ? `${siteUrl}/${p.slug}` : siteUrl) });
  }
  return items;
}
