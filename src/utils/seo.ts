import { SITE_CONFIG } from './constants';

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishDate?: Date;
  author?: string;
}

export function generateSEO({
  title,
  description = SITE_CONFIG.description,
  image = SITE_CONFIG.seo.ogImage,
  url = '',
  type = 'website',
  publishDate,
  author = SITE_CONFIG.author.name
}: SEOProps = {}) {
  const fullTitle = title ? `${title} | ${SITE_CONFIG.title}` : SITE_CONFIG.title;
  const fullUrl = `https://gerontologaviviana.com${url}`;

  return {
    title: fullTitle,
    description,
    canonical: fullUrl,
    openGraph: {
      type,
      title: fullTitle,
      description,
      url: fullUrl,
      image,
      siteName: SITE_CONFIG.title,
      ...(publishDate && { publishedTime: publishDate.toISOString() }),
      ...(author && { author })
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      image,
      creator: '@usuario' // Update with actual Twitter handle
    }
  };
}

export function generateSchemaOrg(type: 'Person' | 'Article' | 'WebSite', data: any = {}) {
  const baseSchema = {
    '@context': 'https://schema.org'
  };

  switch (type) {
    case 'Person':
      return {
        ...baseSchema,
        '@type': 'Person',
        name: SITE_CONFIG.author.name,
        jobTitle: SITE_CONFIG.author.title,
        description: SITE_CONFIG.author.bio,
        image: SITE_CONFIG.author.photo,
        email: SITE_CONFIG.contact.email,
        telephone: SITE_CONFIG.contact.phone,
        address: SITE_CONFIG.contact.address,
        sameAs: Object.values(SITE_CONFIG.social),
        ...data
      };

    case 'Article':
      return {
        ...baseSchema,
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        image: data.image,
        datePublished: data.publishDate?.toISOString(),
        dateModified: data.publishDate?.toISOString(),
        author: {
          '@type': 'Person',
          name: SITE_CONFIG.author.name
        },
        publisher: {
          '@type': 'Person',
          name: SITE_CONFIG.author.name
        },
        ...data
      };

    case 'WebSite':
      return {
        ...baseSchema,
        '@type': 'WebSite',
        name: SITE_CONFIG.title,
        description: SITE_CONFIG.description,
        url: 'https://gerontologaviviana.com',
        author: {
          '@type': 'Person',
          name: SITE_CONFIG.author.name
        },
        ...data
      };

    default:
      return baseSchema;
  }
}