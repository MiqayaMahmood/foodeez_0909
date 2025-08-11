import { Metadata } from 'next';
import { extractBusinessId } from '@/lib/utils/genSlug';
import { getBusinessById } from '@/services/BusinessProfilePageService';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const businessId = extractBusinessId(params.slug);

  if (!businessId) {
    return generatePageMetadata({
      title: 'Reviews Not Found',
      description: 'The business reviews you are looking for could not be found.',
      url: `https://foodeez.ch/business/${params.slug}/reviews`,
    });
  }

  const business = await getBusinessById(businessId);

  if (!business) {
    return generatePageMetadata({
      title: 'Business Not Found',
      description: 'The business you are looking for could not be found.',
      url: `https://foodeez.ch/business/${params.slug}/reviews`,
    });
  }

  const businessName = business.BUSINESS_NAME || 'this restaurant';

  return generatePageMetadata({
    title: `Reviews for ${businessName}`,
    description: `Read customer reviews and ratings for ${businessName} on Foodeez. See what others are saying before you visit.`,
    keywords: [businessName, 'reviews', 'ratings', 'customer feedback', 'restaurant reviews'],
    url: `https://foodeez.ch/business/${params.slug}/reviews`,
  });
}
