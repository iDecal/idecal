import { defineCollection, z } from 'astro:content';

// ĐỊNH NGHĨA blogCollection
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // Chuyển sang optional() để không bị lỗi "Required" nếu quên viết mô tả
    description: z.string().optional().default("Dịch vụ thi công decal chuyên nghiệp iDecal"), 
    // Sử dụng coerce để tự động chuyển đổi chuỗi ngày tháng từ Markdown thành đối tượng Date
    pubDate: z.coerce.date(), 
    // Thêm 'Tin tức' hoặc các hạng mục khác nếu cần để tránh lỗi enum
    category: z.enum(['Kiến thức', 'Dự án', 'Khuyến mãi', 'Tin tức']).default('Kiến thức'),
    image: z.string().optional().default('/images/default-thumb.jpg'),
  }),
});

// ĐỊNH NGHĨA projectsCollection
const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: z.string().default('Khách hàng iDecal'),
    category: z.enum(['Văn phòng', 'Căn hộ', 'Showroom', 'Sự kiện']).default('Văn phòng'),
    image: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
  }),
});

// EXPORT
export const collections = {
  'blog': blogCollection,
  'projects': projectsCollection,
};
