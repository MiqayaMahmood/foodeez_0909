import { generatePageMetadata } from '@/lib/seo';
import { Metadata } from 'next';

export const metadata: Metadata = generatePageMetadata({
  title: 'Frequently Asked Questions (FAQ)',
  description: 'Find answers to common questions about Foodeez. Learn about account management, reviews, business listings, and more.',
  url: 'https://foodeez.ch/faq',
});
