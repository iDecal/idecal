import productData from './products.json';
import categoryData from './product-categories.json';

export interface Product {
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  brand: string;
  price: number | null;
  code: string;
  description: string;
  paragraphs: string[];
  images: string[];
  attributes: Partial<Record<string, string[]>>;
  uses: string[];
}
export interface ProductCategory {
  slug: string;
  name: string;
  headline: string;
  description: string;
  benefits: { title: string; description: string }[];
  priceTitle: string;
  priceNote: string;
  prices: { name: string; price: string }[];
  faqs: { question: string; answer: string }[];
  service: string;
  image: string;
  needs: { label: string; tip: string; keywords: string[] }[];
}
export const products: Product[] = productData;
export const productCategories: ProductCategory[] = categoryData;
export const productsInCategory = (slug: string) => products.filter(product => product.category === slug);
export const formatPrice = (price: number | null) => price ? `${price.toLocaleString('vi-VN')} ₫` : 'Liên hệ báo giá';
export const productSpecs = (product: Product) => [
  { label: 'Nhóm sản phẩm', value: product.subcategory },
  ...(product.brand ? [{ label: 'Thương hiệu', value: product.brand }] : []),
  ...Object.entries(product.attributes).filter(([key]) => key !== 'thuong-hieu').map(([key, value]) => ({
    label: ({ 'quy-cach': 'Quy cách', 'xuat-xu': 'Xuất xứ', 'chat-lieu': 'Chất liệu' } as Record<string, string>)[key] ?? key,
    value: value?.join(', ') ?? '',
  })),
];
