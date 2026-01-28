import type { SiteConfig, CategoryInfo } from './types';
import siteConfigData from '../data/site-config.json';

export const SITE_CONFIG: SiteConfig = {
  title: siteConfigData.title,
  description: siteConfigData.description,
  author: {
    name: siteConfigData.author.name,
    title: siteConfigData.author.title,
    credentials: ['Gerontóloga', 'Especialista en Envejecimiento Activo'],
    bio: siteConfigData.author.bio,
    photo: siteConfigData.author.photo
  },
  contact: {
    email: siteConfigData.contact.email,
    phone: siteConfigData.contact.phone,
    whatsapp: siteConfigData.contact.whatsapp,
    address: siteConfigData.contact.address
  },
  social: {
    instagram: siteConfigData.social.instagram,
    linkedin: siteConfigData.social.linkedin
  },
  seo: {
    keywords: ['gerontóloga', 'gerontología', 'adulto mayor', 'envejecimiento activo', 'consulta gerontológica', 'Viviana Tonguino'],
    ogImage: '/images/og-image.jpg'
  }
};

export const CATEGORIES: CategoryInfo = {
  geriatria: 'Geriatría',
  nutricion: 'Nutrición',
  ejercicio: 'Ejercicio',
  'salud-mental': 'Salud Mental'
} as const;

// Navigation items
export const NAVIGATION_ITEMS = [
  { label: 'Inicio', href: '/' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Recursos', href: '/recursos' }
] as const;

// Social media links with icons
export const SOCIAL_LINKS = [
  {
    platform: 'Instagram',
    url: SITE_CONFIG.social.instagram || '',
    icon: 'instagram',
    label: 'Síguenos en Instagram'
  },
  {
    platform: 'LinkedIn',
    url: SITE_CONFIG.social.linkedin || '',
    icon: 'linkedin',
    label: 'Conéctate en LinkedIn'
  }
].filter(link => link.url) as const;

// WhatsApp message template
export const WHATSAPP_MESSAGE = encodeURIComponent(
  `Hola ${SITE_CONFIG.author.name}, me gustaría agendar una consulta gerontológica. ¿Cuál es su disponibilidad?`
);

// Blog pagination settings
export const BLOG_PAGINATION = {
  postsPerPage: 9,
  maxPaginationLinks: 5
} as const;

// SEO defaults
export const SEO_DEFAULTS = {
  titleTemplate: '%s | ' + SITE_CONFIG.title,
  defaultTitle: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.seo.keywords,
  ogImage: SITE_CONFIG.seo.ogImage,
  twitterCard: 'summary_large_image'
} as const;