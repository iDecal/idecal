import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // WordPress thường xuất ra trường 'slug' riêng
    slug: z.string().optional(),
    // File của bạn dùng 'date' thay vì 'pubDate', dùng coerce để xử lý định dạng ISO
    date: z.coerce.date(),
    // File của bạn dùng 'categories' (số nhiều) và là một mảng string
    categories: z.array(z.string()).default(['Mẫu thiết kế']),
    // Các trường sau đây không có trong file mẫu nên để .optional() để tránh lỗi build
    description: z.string().optional().default("Dịch vụ thi công decal chuyên nghiệp iDecal"),
    image: z.string().optional().default('/images/default-thumb.jpg'),
    author: z.string().optional().default('iDecal'),
  }),
});

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: z.string().optional().default('Khách hàng iDecal'),
    category: z.enum(['Văn phòng', 'Căn hộ', 'Showroom', 'Sự kiện']).default('Văn phòng'),
    image: z.string().optional(),
    description: z.string().optional(),
    // Đồng bộ dùng 'date' thay vì 'pubDate' cho nhất quán với blog
    date: z.coerce.date(),
  }),
});

export const collections = {
  'blog': blogCollection,
  'projects': projectsCollection,
};
