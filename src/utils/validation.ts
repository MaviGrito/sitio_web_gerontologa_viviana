// Validation utilities for Content Collections and data integrity

import type { BlogEntry } from './types';
import { CATEGORIES } from './constants';

/**
 * Validate blog post data integrity
 */
export function validateBlogPost(post: BlogEntry): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check required fields
  if (!post.data.title?.trim()) {
    errors.push('Title is required and cannot be empty');
  }

  if (!post.data.description?.trim()) {
    errors.push('Description is required and cannot be empty');
  }

  if (!post.data.featuredImage?.trim()) {
    errors.push('Featured image is required');
  }

  // Validate category
  if (!Object.keys(CATEGORIES).includes(post.data.category)) {
    errors.push(`Invalid category: ${post.data.category}. Must be one of: ${Object.keys(CATEGORIES).join(', ')}`);
  }

  // Validate publication date
  if (!(post.data.publishDate instanceof Date) || isNaN(post.data.publishDate.getTime())) {
    errors.push('Publication date must be a valid date');
  }

  // Validate future publication dates for drafts
  if (!post.data.draft && post.data.publishDate > new Date()) {
    errors.push('Published posts cannot have future publication dates');
  }

  // Validate tags if present
  if (post.data.tags) {
    if (!Array.isArray(post.data.tags)) {
      errors.push('Tags must be an array');
    } else {
      const invalidTags = post.data.tags.filter(tag => typeof tag !== 'string' || !tag.trim());
      if (invalidTags.length > 0) {
        errors.push('All tags must be non-empty strings');
      }
    }
  }

  // Validate author
  if (!post.data.author?.trim()) {
    errors.push('Author is required and cannot be empty');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate featured image URL or path
 */
export function validateImagePath(imagePath: string): boolean {
  if (!imagePath?.trim()) return false;
  
  // Check if it's a valid URL
  try {
    new URL(imagePath);
    return true;
  } catch {
    // If not a URL, check if it's a valid relative path
    return imagePath.startsWith('/') || imagePath.startsWith('./') || imagePath.startsWith('../');
  }
}

/**
 * Sanitize and validate slug
 */
export function validateSlug(slug: string): {
  isValid: boolean;
  sanitized: string;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!slug?.trim()) {
    errors.push('Slug is required');
    return { isValid: false, sanitized: '', errors };
  }

  // Sanitize slug: lowercase, replace spaces and special chars with hyphens
  let sanitized = slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

  // Validate sanitized slug
  if (!sanitized) {
    errors.push('Slug must contain at least one alphanumeric character');
  }

  if (sanitized.length < 3) {
    errors.push('Slug must be at least 3 characters long');
  }

  if (sanitized.length > 100) {
    errors.push('Slug must be less than 100 characters long');
  }

  return {
    isValid: errors.length === 0,
    sanitized,
    errors
  };
}

/**
 * Validate content length and structure
 */
export function validateContent(content: string): {
  isValid: boolean;
  wordCount: number;
  readingTime: number;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!content?.trim()) {
    errors.push('Content is required and cannot be empty');
    return { isValid: false, wordCount: 0, readingTime: 0, errors };
  }

  // Calculate word count
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200); // 200 words per minute

  // Validate minimum content length
  if (wordCount < 50) {
    errors.push('Content must be at least 50 words long');
  }

  // Check for basic markdown structure
  const hasHeaders = /#{1,6}\s+/.test(content);
  if (wordCount > 200 && !hasHeaders) {
    errors.push('Long content should include headers for better readability');
  }

  return {
    isValid: errors.length === 0,
    wordCount,
    readingTime,
    errors
  };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (Colombian format)
 */
export function validatePhone(phone: string): boolean {
  // Colombian phone number format: +57 followed by 10 digits
  const phoneRegex = /^\+57\s?[0-9]{10}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate URL format
 */
export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Batch validate multiple blog posts
 */
export function validateBlogPosts(posts: BlogEntry[]): {
  validPosts: BlogEntry[];
  invalidPosts: Array<{ post: BlogEntry; errors: string[] }>;
  summary: {
    total: number;
    valid: number;
    invalid: number;
  };
} {
  const validPosts: BlogEntry[] = [];
  const invalidPosts: Array<{ post: BlogEntry; errors: string[] }> = [];

  posts.forEach(post => {
    const validation = validateBlogPost(post);
    if (validation.isValid) {
      validPosts.push(post);
    } else {
      invalidPosts.push({ post, errors: validation.errors });
    }
  });

  return {
    validPosts,
    invalidPosts,
    summary: {
      total: posts.length,
      valid: validPosts.length,
      invalid: invalidPosts.length
    }
  };
}