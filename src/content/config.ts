import { defineCollection, z } from 'astro:content';

// Định nghĩa blogCollection với các trường linh hoạt cho WordPress
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // Khớp với trường 'date' từ file .md của bạn
    date: z.coerce.date(), 
    // Cho phép có pubDate (bản cũ) hoặc không
    pubDate: z.coerce.date().optional(),
    // WordPress dùng 'categories' dạng mảng
    categories: z.array(z.string()).optional().default(['Mẫu thiết kế']),
    // Hỗ trợ trường 'category' bản cũ
    category: z.string().optional(),
    // Description là optional để tránh lỗi "Required"
    description: z.string().optional().default("Dịch vụ thi công decal chuyên nghiệp iDecal"),
    image: z.string().optional().default('/images/default-thumb.jpg'),
    slug: z.string().optional(),
  }),
});

// Định nghĩa projectsCollection
const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: z.string().optional().default('Khách hàng iDecal'),
    category: z.enum(['Văn phòng', 'Căn hộ', 'Showroom', 'Sự kiện']).default('Văn phòng'),
    image: z.string().optional(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
  'projects': projectsCollection,
};
