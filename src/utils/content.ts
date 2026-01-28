// Utility functions for working with Astro Content Collections

import type { BlogEntry, BlogCategory } from './types';

// Note: These functions that use getCollection are only available at Astro runtime
// For testing purposes, we export the utility functions separately

/**
 * Generate excerpt from blog post content
 */
export function generateExcerpt(content: string, maxLength: number = 150): string {
  // Remove markdown formatting and HTML tags
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove markdown headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
    .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  // Find the last complete word within the limit
  const truncated = plainText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
}

/**
 * Calculate estimated reading time for blog post
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const words = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  
  return Math.max(1, readingTime); // Minimum 1 minute
}

/**
 * Format date for display
 */
export function formatDate(date: Date, locale: string = 'es-ES'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/**
 * Format date for SEO (ISO format)
 */
export function formatDateISO(date: Date): string {
  return date.toISOString();
}

// Runtime-only functions that require Astro context
// These are only available when running in Astro environment

/**
 * Get all published blog posts sorted by publication date (newest first)
 * Note: Only available at Astro runtime
 */
export async function getPublishedBlogPosts(): Promise<BlogEntry[]> {
  if (typeof window !== 'undefined') {
    throw new Error('getPublishedBlogPosts is only available on the server');
  }
  
  try {
    const { getCollection } = await import('astro:content');
    const allPosts = await getCollection('blog');
    
    return allPosts
      .filter(post => !post.data.draft)
      .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());
  } catch (error) {
    console.warn('Astro Content Collections not available:', error);
    return [];
  }
}

/**
 * Get the latest N blog posts
 * Note: Only available at Astro runtime
 */
export async function getLatestBlogPosts(count: number = 3): Promise<BlogEntry[]> {
  const publishedPosts = await getPublishedBlogPosts();
  return publishedPosts.slice(0, count);
}

/**
 * Get blog posts by category
 * Note: Only available at Astro runtime
 */
export async function getBlogPostsByCategory(category: BlogCategory): Promise<BlogEntry[]> {
  const allPosts = await getPublishedBlogPosts();
  return allPosts.filter(post => post.data.category === category);
}

/**
 * Get blog posts by tag
 * Note: Only available at Astro runtime
 */
export async function getBlogPostsByTag(tag: string): Promise<BlogEntry[]> {
  const allPosts = await getPublishedBlogPosts();
  return allPosts.filter(post => post.data.tags?.includes(tag));
}

/**
 * Get a blog post by slug
 * Note: Only available at Astro runtime
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogEntry | undefined> {
  try {
    const { getCollection } = await import('astro:content');
    const allPosts = await getCollection('blog');
    return allPosts.find(post => post.slug === slug);
  } catch (error) {
    console.warn('Astro Content Collections not available:', error);
    return undefined;
  }
}

/**
 * Get previous and next blog posts for navigation
 * Note: Only available at Astro runtime
 */
export async function getAdjacentBlogPosts(currentSlug: string): Promise<{
  previous: BlogEntry | null;
  next: BlogEntry | null;
}> {
  const publishedPosts = await getPublishedBlogPosts();
  const currentIndex = publishedPosts.findIndex(post => post.slug === currentSlug);
  
  if (currentIndex === -1) {
    return { previous: null, next: null };
  }
  
  return {
    previous: currentIndex > 0 ? publishedPosts[currentIndex - 1] : null,
    next: currentIndex < publishedPosts.length - 1 ? publishedPosts[currentIndex + 1] : null
  };
}

/**
 * Get all unique categories from blog posts
 * Note: Only available at Astro runtime
 */
export async function getBlogCategories(): Promise<BlogCategory[]> {
  const allPosts = await getPublishedBlogPosts();
  const categories = new Set<BlogCategory>();
  
  allPosts.forEach(post => {
    categories.add(post.data.category);
  });
  
  return Array.from(categories);
}

/**
 * Get all unique tags from blog posts
 * Note: Only available at Astro runtime
 */
export async function getBlogTags(): Promise<string[]> {
  const allPosts = await getPublishedBlogPosts();
  const tags = new Set<string>();
  
  allPosts.forEach(post => {
    post.data.tags?.forEach(tag => tags.add(tag));
  });
  
  return Array.from(tags).sort();
}

/**
 * Get all services sorted by order
 * Note: Only available at Astro runtime
 */
export async function getServices(): Promise<any[]> {
  try {
    const { getCollection } = await import('astro:content');
    const allServices = await getCollection('services');
    
    return allServices
      .filter(service => service.data.active)
      .sort((a, b) => a.data.order - b.data.order);
  } catch (error) {
    console.warn('Astro Content Collections not available:', error);
    return [];
  }
}

/**
 * Get a service by ID
 * Note: Only available at Astro runtime
 */
export async function getServiceById(id: string): Promise<any | undefined> {
  try {
    const { getCollection } = await import('astro:content');
    const allServices = await getCollection('services');
    return allServices.find(service => service.data.id === id);
  } catch (error) {
    console.warn('Astro Content Collections not available:', error);
    return undefined;
  }
}