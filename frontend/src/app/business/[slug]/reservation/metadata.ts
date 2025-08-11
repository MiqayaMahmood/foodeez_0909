import { Metadata } from 'next';
import { extractBusinessId } from '@/lib/utils/genSlug';
import { getBusinessById } from '@/services/BusinessProfilePageService';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const businessId = extractBusinessId(params.slug);

  if (!businessId) {
    return generatePageMetadata({
      title: 'Reservation Not Found',
      description: 'The business you are trying to book does not seem to exist.',
      url: `https://foodeez.ch/business/${params.slug}/reservation`,
    });
  }

  const business = await getBusinessById(businessId);

  if (!business) {
    return generatePageMetadata({
      title: 'Business Not Found',
      description: 'The business you are trying to book does not seem to exist.',
      url: `https://foodeez.ch/business/${params.slug}/reservation`,
    });
  }

  const businessName = business.BUSINESS_NAME || 'this restaurant';

  return generatePageMetadata({
    title: `Book a Table at ${businessName}`,
    description: `Make a reservation at ${businessName} through Foodeez. Fast, easy, and convenient online booking.`,
    keywords: [businessName, 'reservation', 'booking', 'table', 'restaurant booking'],
    url: `https://foodeez.ch/business/${params.slug}/reservation`,
  });
}
