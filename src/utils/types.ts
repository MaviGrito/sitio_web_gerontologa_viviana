// TypeScript interfaces for Content Collections and data models

import type { CollectionEntry } from 'astro:content';

// Blog Post Model - matches the Content Collection schema
export interface BlogPost {
  id: string;
  slug: string;
  body: string;
  collection: 'blog';
  data: {
    title: string;
    description: string;
    publishDate: Date;
    featuredImage: string;
    category: 'geriatria' | 'nutricion' | 'ejercicio' | 'salud-mental';
    tags?: string[];
    author: string;
    draft: boolean;
  };
}

// Type alias for Astro's CollectionEntry
export type BlogEntry = CollectionEntry<'blog'>;

// Service Model - matches the services data structure
export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  benefits: string[];
  detailedDescription: string;
  duration?: string;
  price?: string;
}

// Site Configuration Model
export interface SiteConfig {
  title: string;
  description: string;
  author: {
    name: string;
    title: string;
    credentials: string[];
    bio: string;
    photo: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
  };
  social: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  seo: {
    keywords: string[];
    ogImage: string;
  };
}

// Category types
export type BlogCategory = 'geriatria' | 'nutricion' | 'ejercicio' | 'salud-mental';

export interface CategoryInfo {
  geriatria: string;
  nutricion: string;
  ejercicio: string;
  'salud-mental': string;
}

// Component Props interfaces
export interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  benefits: string[];
  ctaText: string;
  ctaLink: string;
}

export interface BlogCardProps {
  title: string;
  excerpt: string;
  publishDate: Date;
  featuredImage: string;
  slug: string;
  category: BlogCategory;
}

export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
  href?: string;
  type?: 'button' | 'submit';
  class?: string;
}

// SEO and Meta data interfaces
export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishDate?: Date;
  author?: string;
  canonical?: string;
}

// Navigation and Layout interfaces
export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  label: string;
}