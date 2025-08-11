import { generatePageMetadata } from '@/lib/seo';
import { Metadata } from 'next';

export const metadata: Metadata = generatePageMetadata({
  title: 'Discover Restaurants',
  description: 'Find the best restaurants near you with Foodeez. Browse listings, read reviews, view menus, and make reservations.',
  keywords: ['restaurants', 'find restaurants', 'local dining', 'restaurant browser'],
  url: 'https://foodeez.ch/business',
});
