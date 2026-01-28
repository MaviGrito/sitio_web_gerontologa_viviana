import { defineCollection, z } from 'astro:content';

// Blog collection schema with comprehensive validation
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
    description: z.string().min(1, 'Description is required').max(200, 'Description must be less than 200 characters'),
    publishDate: z.date(),
    featuredImage: z.string().url('Featured image must be a valid URL or path'),
    category: z.enum(['geriatria', 'nutricion', 'ejercicio', 'salud-mental'], {
      errorMap: () => ({ message: 'Category must be one of: geriatria, nutricion, ejercicio, salud-mental' })
    }),
    tags: z.array(z.string()).optional().default([]),
    author: z.string().default('Dr. [Name]'),
    draft: z.boolean().default(false),
    // Additional optional fields for enhanced functionality
    excerpt: z.string().max(300, 'Excerpt must be less than 300 characters').optional(),
    readingTime: z.number().positive().optional(),
    lastModified: z.date().optional()
  })
});

// Services collection schema for structured service data
const servicesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string().min(1, 'Service ID is required'),
    icon: z.string().min(1, 'Icon is required'),
    title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
    description: z.string().min(1, 'Description is required').max(300, 'Description must be less than 300 characters'),
    benefits: z.array(z.string()).min(1, 'At least one benefit is required'),
    detailedDescription: z.string().min(1, 'Detailed description is required'),
    duration: z.string().optional(),
    price: z.string().optional(),
    order: z.number().default(0),
    active: z.boolean().default(true)
  })
});

export const collections = {
  blog: blogCollection,
  services: servicesCollection
};