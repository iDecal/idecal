import { defineCollection, z } from 'astro:content';

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

export const collections = {
  'blog': blogCollection, // Blog đã tạo trước đó
  'projects': projectsCollection, // Thêm mới Dự án
};
