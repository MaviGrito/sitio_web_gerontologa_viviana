import type { SiteConfig, CategoryInfo } from './types';

export const SITE_CONFIG: SiteConfig = {
  title: 'Dr. [Name] - Gerontólogo',
  description: 'Especialista en geriatría y cuidado del adulto mayor. Consultas médicas especializadas y atención integral.',
  author: {
    name: 'Dr. [Name]',
    title: 'Gerontólogo',
    credentials: ['Médico Especialista en Geriatría', 'Certificado en Medicina del Envejecimiento'],
    bio: 'Especialista en geriatría con más de [X] años de experiencia en el cuidado integral del adulto mayor.',
    photo: '/images/hero-photo.jpg'
  },
  contact: {
    email: 'contacto@ejemplo.com',
    phone: '+57 300 123 4567',
    whatsapp: '+573001234567',
    address: 'Dirección de la consulta'
  },
  social: {
    instagram: 'https://instagram.com/usuario',
    facebook: 'https://facebook.com/usuario',
    linkedin: 'https://linkedin.com/in/usuario'
  },
  seo: {
    keywords: ['gerontólogo', 'geriatría', 'adulto mayor', 'medicina del envejecimiento', 'consulta médica'],
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
    platform: 'Facebook',
    url: SITE_CONFIG.social.facebook || '',
    icon: 'facebook',
    label: 'Síguenos en Facebook'
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
  `Hola Dr. ${SITE_CONFIG.author.name}, me gustaría agendar una consulta. ¿Cuál es su disponibilidad?`
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