import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { projectTypes } from './data/project-types';

const fallbackImage = '/images/idecal-logo.png';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default('Dịch vụ decal chuyên nghiệp iDecal'),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    date: z.coerce.date().optional(),
    category: z.string().default('Kiến thức'),
    categories: z.array(z.string()).optional(),
    author: z.string().optional(),
    image: z.string().default(fallbackImage),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    client: z.string().default('Khách hàng iDecal'),
    category: z.enum([...projectTypes, 'Căn hộ']).transform(value => value === 'Căn hộ' ? 'Nhà ở dân dụng' : value),
    image: z.string().default(fallbackImage),
    description: z.string().default(''),
    pubDate: z.coerce.date(),
    gallery: z.array(z.string()).default([]),
    service: z.string().optional(),
    location: z.string().optional(),
  }),
});

export const collections = { blog, projects };
