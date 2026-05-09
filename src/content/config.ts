import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // Khớp với trường 'date' trong file .md của bạn
    // Dùng z.coerce để tự động sửa các lỗi định dạng ngày tháng
    date: z.coerce.date(),
    // WordPress dùng 'categories' dạng mảng, chúng ta để optional để không lỗi nếu thiếu
    categories: z.array(z.string()).optional().default(['Mẫu thiết kế']),
    // Chuyển description thành optional để fix lỗi "Required"
    description: z.string().optional().default("Dịch vụ decal chuyên nghiệp iDecal"),
    image: z.string().optional().default('/images/default-thumb.jpg'),
    slug: z.string().optional(),
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
    date: z.coerce.date().optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
  'projects': projectsCollection,
};
