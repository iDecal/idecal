import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    category: z.enum(['Kiến thức', 'Dự án', 'Khuyến mãi']),
    image: z.string(), // Hoặc dùng image() nếu bạn tối ưu ảnh của Astro
  }),
});

export const collections = {
  'blog': blogCollection,
};
