import { defineCollection, z } from 'astro:content';

// PHẢI ĐỊNH NGHĨA blogCollection TRƯỚC KHI DÙNG
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    category: z.enum(['Kiến thức', 'Dự án', 'Khuyến mãi']),
    image: z.string(),
  }),
});

// ĐỊNH NGHĨA projectsCollection
const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: z.string(),
    category: z.enum(['Văn phòng', 'Căn hộ', 'Showroom', 'Sự kiện']),
    image: z.string(),
    description: z.string(),
    pubDate: z.date(),
  }),
});

// SAU ĐÓ MỚI EXPORT
export const collections = {
  'blog': blogCollection,
  'projects': projectsCollection,
};
