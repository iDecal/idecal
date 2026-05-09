import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // WordPress dùng 'date', sử dụng coerce để tự sửa định dạng ngày tháng
    date: z.coerce.date().optional(),
    // Chấp nhận cả 'pubDate' nếu có, hoặc để mặc định để tránh lỗi build
    pubDate: z.coerce.date().optional(),
    // Chuyển description thành optional để không bị lỗi "Required"
    description: z.string().optional().default("Dịch vụ decal chuyên nghiệp iDecal"),
    // Khớp với file .md của bạn dùng 'categories' dạng mảng
    categories: z.array(z.string()).optional().default(['Mẫu thiết kế']),
    image: z.string().optional().default('/images/default-thumb.jpg'),
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
