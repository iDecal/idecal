import type { CollectionEntry } from 'astro:content';
export const blogCategorySlugs = ['huong-dan','so-sanh-vat-lieu','mau-thiet-ke','bao-gia','tin-khuyen-mai'] as const;
export const blogCategories = [
  {slug:'huong-dan',name:'Hướng dẫn',description:'Cách chọn mẫu, chuẩn bị kích thước và bảo quản Decal, film theo nhu cầu thực tế.'},
  {slug:'so-sanh-vat-lieu',name:'So sánh vật liệu',description:'Phân biệt các vật liệu để chọn đúng hiệu ứng, bề mặt và cách sử dụng.'},
  {slug:'mau-thiet-ke',name:'Mẫu thiết kế',description:'Ý tưởng bố cục Decal, logo và họa tiết cho văn phòng, cửa hàng và không gian sống.'},
  {slug:'bao-gia',name:'Báo giá',description:'Cách đọc báo giá, tính khối lượng và làm rõ các hạng mục vật liệu, thiết kế, gia công, thi công.'},
  {slug:'tin-khuyen-mai',name:'Tin khuyến mãi',description:'Thông tin và hướng dẫn cập nhật ưu đãi; điều kiện cụ thể được ghi rõ trong từng bài.'},
];
export const postCategory = (post: CollectionEntry<'blog'>) => blogCategories.find(category => category.slug === post.data.categorySlug)
  ?? blogCategories.find(category => category.name === post.data.category || post.data.categories?.includes(category.name))
  ?? blogCategories[0];
export const sortBlogPosts = (posts: CollectionEntry<'blog'>[]) => [...posts].sort((a,b) => (b.data.date ?? b.data.pubDate).valueOf() - (a.data.date ?? a.data.pubDate).valueOf() || a.id.localeCompare(b.id));
