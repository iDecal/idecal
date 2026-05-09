import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // WordPress dùng 'date', Astro cũ dùng 'pubDate'. Coerce giúp tự sửa định dạng.
    date: z.coerce.date().optional(),
    pubDate: z.coerce.date().optional(),
    // Khai báo slug để Astro không bỏ qua dữ liệu này từ file .md
    slug: z.string().optional(),
    // WordPress dùng 'categories' dạng mảng
    categories: z.array(z.string()).optional().default(['Mẫu thiết kế']),
    category: z.string().optional(),
    description: z.string().optional().default("Dịch vụ decal chuyên nghiệp iDecal"),
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
