import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string; // canonical/page URL
  type?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  // Enhancements
  canonical?: string; // explicit canonical override
  noindex?: boolean;
  nofollow?: boolean;
  locale?: string; // e.g., en_US
  alternateLocales?: string[]; // e.g., ['de_CH','fr_CH']
  includeTwitter?: boolean; // default false (no twitter account)
  breadcrumbs?: { name: string; url: string }[]; // BreadcrumbList
  structuredData?: Record<string, any> | Record<string, any>[]; // Additional JSON-LD blocks
}

export default function SEO({
  title,
  description,
  keywords = "food, restaurants, discovery, reviews, dining, cuisine",
  image = "/images/og-default.jpg",
  url = "https://foodeez.ch",
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
  canonical,
  noindex = false,
  nofollow = false,
  locale = 'en_US',
  alternateLocales = [],
  includeTwitter = false,
  breadcrumbs,
  structuredData,
}: SEOProps) {
  const siteName = "Foodeez";
  const fullTitle = `${title} | ${siteName}`;
  const fullImageUrl = image.startsWith('http') ? image : `${url}${image}`;
  const robots = `${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`;
  const canonicalHref = canonical || url;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author || siteName} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonicalHref} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      {alternateLocales.map((loc) => (
        <meta key={loc} property="og:locale:alternate" content={loc} />
      ))}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && tags?.length > 0 && (
        <meta property="article:tag" content={tags.join(', ')} />
      )}

      {/* Twitter (optional) */}
      {includeTwitter && (
        <>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content={url} />
          <meta name="twitter:title" content={fullTitle} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={fullImageUrl} />
        </>
      )}

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': type === 'article' ? 'Article' : 'WebSite',
            name: fullTitle,
            url: url,
            description: description,
            image: fullImageUrl,
            ...(type === 'article' && {
              datePublished: publishedTime,
              dateModified: modifiedTime,
              author: {
                '@type': 'Person',
                name: author || siteName,
              },
              publisher: {
                '@type': 'Organization',
                name: siteName,
                logo: {
                  '@type': 'ImageObject',
                  url: `${url}/images/logo.png`,
                },
              },
            }),
          }),
        }}
      />
      {/* Additional structured data passed in */}
      {Array.isArray(structuredData)
        ? structuredData.map((block, idx) => (
            <script
              // eslint-disable-next-line react/no-danger
              key={`sd-${idx}`}
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
            />
          ))
        : structuredData && (
            <script
              // eslint-disable-next-line react/no-danger
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
          )}
      {/* BreadcrumbList */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <script
          // eslint-disable-next-line react/no-danger
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: breadcrumbs.map((bc, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: bc.name,
                item: bc.url,
              })),
            }),
          }}
        />
      )}
    </Head>
  );
}
