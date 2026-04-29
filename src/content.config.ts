import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders'; // Thêm dòng này

const blog = defineCollection({
  // Thêm loader cho Astro 6
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  }),
});

export const collections = { blog };
