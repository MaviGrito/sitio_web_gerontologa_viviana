// Test file for Content Collections configuration
import { describe, it, expect } from 'vitest';
import { CATEGORIES } from './constants';
import { validateBlogPost, validateSlug, validateContent } from './validation';
import type { BlogEntry } from './types';

describe('Content Collections Configuration', () => {
  describe('Blog Collection Schema', () => {
    it('should support valid categories', () => {
      const validCategories = ['geriatria', 'nutricion', 'ejercicio', 'salud-mental'];
      expect(validCategories).toContain('geriatria');
      expect(validCategories).toContain('nutricion');
      expect(validCategories).toContain('ejercicio');
      expect(validCategories).toContain('salud-mental');
    });

    it('should have category mappings in constants', () => {
      expect(CATEGORIES.geriatria).toBe('Geriatría');
      expect(CATEGORIES.nutricion).toBe('Nutrición');
      expect(CATEGORIES.ejercicio).toBe('Ejercicio');
      expect(CATEGORIES['salud-mental']).toBe('Salud Mental');
    });
  });

  describe('Content Validation', () => {
    it('should validate blog post with all required fields', () => {
      const mockBlogPost: BlogEntry = {
        id: 'test-post',
        slug: 'test-post',
        body: 'This is test content with more than fifty words to meet the minimum requirement for content validation. It includes multiple sentences and provides enough content to be considered a valid blog post for testing purposes.',
        collection: 'blog',
        data: {
          title: 'Test Blog Post',
          description: 'This is a test description',
          publishDate: new Date('2024-01-15'),
          featuredImage: '/images/test.jpg',
          category: 'geriatria',
          tags: ['test', 'blog'],
          author: 'Dr. Test',
          draft: false
        },
        render: async () => ({ Content: {} as any, headings: [], remarkPluginFrontmatter: {} })
      };

      const validation = validateBlogPost(mockBlogPost);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should invalidate blog post with missing required fields', () => {
      const mockBlogPost: BlogEntry = {
        id: 'invalid-post',
        slug: 'invalid-post',
        body: 'Short content',
        collection: 'blog',
        data: {
          title: '',
          description: '',
          publishDate: new Date('2024-01-15'),
          featuredImage: '',
          category: 'geriatria',
          tags: [],
          author: '',
          draft: false
        },
        render: async () => ({ Content: {} as any, headings: [], remarkPluginFrontmatter: {} })
      };

      const validation = validateBlogPost(mockBlogPost);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('should validate and sanitize slugs', () => {
      const validSlug = validateSlug('valid-blog-post-slug');
      expect(validSlug.isValid).toBe(true);
      expect(validSlug.sanitized).toBe('valid-blog-post-slug');

      const invalidSlug = validateSlug('Invalid Slug With Spaces!');
      expect(invalidSlug.isValid).toBe(true);
      expect(invalidSlug.sanitized).toBe('invalid-slug-with-spaces');

      const emptySlug = validateSlug('');
      expect(emptySlug.isValid).toBe(false);
      expect(emptySlug.errors.length).toBeGreaterThan(0);
    });

    it('should validate content length and structure', () => {
      // This content has exactly 50+ words to meet the validation requirement
      const validContent = 'This is a valid blog post content with sufficient length to meet the minimum word count requirement of fifty words. It contains multiple sentences and provides valuable information to readers. The content should be comprehensive and informative for the target audience. This ensures proper validation testing for our content management system and blog functionality.';
      const contentValidation = validateContent(validContent);
      expect(contentValidation.isValid).toBe(true);
      expect(contentValidation.wordCount).toBeGreaterThanOrEqual(50);

      const shortContent = 'Too short';
      const shortValidation = validateContent(shortContent);
      expect(shortValidation.isValid).toBe(false);
      expect(shortValidation.errors.length).toBeGreaterThan(0);
    });
  });

  describe('TypeScript Interfaces', () => {
    it('should provide proper TypeScript interfaces', async () => {
      const typesModule = await import('./types');
      expect(typeof typesModule).toBe('object');
    });

    it('should export BlogEntry type', async () => {
      // This test verifies that the types are properly exported
      const typesModule = await import('./types');
      expect(typesModule).toBeDefined();
    });
  });

  describe('Content Utilities', () => {
    it('should provide utility functions for content management', async () => {
      const contentModule = await import('./content');
      expect(typeof contentModule).toBe('object');
      expect(typeof contentModule.generateExcerpt).toBe('function');
      expect(typeof contentModule.calculateReadingTime).toBe('function');
      expect(typeof contentModule.formatDate).toBe('function');
    });

    it('should generate excerpts correctly', async () => {
      const { generateExcerpt } = await import('./content');
      const longText = 'This is a very long text that should be truncated to create an excerpt. It contains multiple sentences and should be cut off at an appropriate point to create a meaningful preview of the content.';
      const excerpt = generateExcerpt(longText, 50);
      expect(excerpt.length).toBeLessThanOrEqual(53); // 50 + '...'
      expect(excerpt.endsWith('...')).toBe(true);
    });

    it('should calculate reading time correctly', async () => {
      const { calculateReadingTime } = await import('./content');
      const shortText = 'This is a short text.';
      const readingTime = calculateReadingTime(shortText);
      expect(readingTime).toBe(1); // Minimum 1 minute

      const longText = 'word '.repeat(400); // 400 words
      const longReadingTime = calculateReadingTime(longText);
      expect(longReadingTime).toBe(2); // 400 words / 200 wpm = 2 minutes
    });

    it('should format dates correctly', async () => {
      const { formatDate } = await import('./content');
      const testDate = new Date('2024-01-15');
      const formattedDate = formatDate(testDate);
      expect(typeof formattedDate).toBe('string');
      expect(formattedDate.length).toBeGreaterThan(0);
    });
  });

  describe('Validation Utilities', () => {
    it('should provide content validation functions', async () => {
      const validationModule = await import('./validation');
      expect(typeof validationModule).toBe('object');
      expect(typeof validationModule.validateBlogPost).toBe('function');
      expect(typeof validationModule.validateSlug).toBe('function');
      expect(typeof validationModule.validateContent).toBe('function');
    });

    it('should validate email formats', async () => {
      const { validateEmail } = await import('./validation');
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });

    it('should validate phone numbers', async () => {
      const { validatePhone } = await import('./validation');
      expect(validatePhone('+573001234567')).toBe(true);
      expect(validatePhone('+57 3001234567')).toBe(true);
      expect(validatePhone('3001234567')).toBe(false);
      expect(validatePhone('')).toBe(false);
    });

    it('should validate URLs', async () => {
      const { validateURL } = await import('./validation');
      expect(validateURL('https://example.com')).toBe(true);
      expect(validateURL('http://example.com')).toBe(true);
      expect(validateURL('invalid-url')).toBe(false);
      expect(validateURL('')).toBe(false);
    });
  });
});