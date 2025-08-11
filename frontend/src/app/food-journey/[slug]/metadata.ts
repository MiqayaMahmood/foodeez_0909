import { getFoodJourneyById } from '@/services/FoodJourneyService';
import { generatePageMetadata } from '@/lib/seo';
import { parseSlug } from '@/lib/utils/genSlug';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { id } = parseSlug(params.slug);

  if (!id) {
    return generatePageMetadata({
      title: 'Food Journey Not Found',
      description: 'The food journey you are looking for could not be found.',
      url: `https://foodeez.ch/food-journey/${params.slug}`,
    });
  }

  const story = await getFoodJourneyById(Number(id));

  if (!story) {
    return generatePageMetadata({
      title: 'Food Journey Not Found',
      description: 'The food journey you are looking for could not be found.',
      url: `https://foodeez.ch/food-journey/${params.slug}`,
    });
  }

  const description = story.DESCRIPTION
    ? `${story.DESCRIPTION.substring(0, 155)}${story.DESCRIPTION.length > 155 ? '...' : ''}`
    : 'Explore this food journey on Foodeez.';

  return generatePageMetadata({
    title: story.TITLE || 'A Food Journey',
    description,
    keywords: story.TITLE?.split(' ') || ['food', 'journey', 'story'],
    image: story.PIC_1 || undefined,
    url: `https://foodeez.ch/food-journey/${params.slug}`,
  });
}
