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
  variantSlugs?: string[];
  catalogue?: { pdf: string; page: number; note?: string; collection?: string };
  installationImages?: { src: string; alt: string; caption?: string; projectSlug?: string }[];
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
// CMS omits empty optional fields; keep stable defaults for catalogue rendering.
export const products: Product[] = productData.map(product => ({
  ...product,
  price: product.price ?? null,
  subcategory: product.subcategory ?? '',
  code: product.code ?? '',
  paragraphs: product.paragraphs ?? [],
  uses: product.uses ?? [],
}));
export const productCategories: ProductCategory[] = categoryData;
export const productsInCategory = (slug: string) => products.filter(product => product.category === slug);
export const formatPrice = (price: number | null) => price ? `${price.toLocaleString('vi-VN')} ₫` : 'Liên hệ báo giá';
export const productSpecs = (product: Product) => [
  { label: 'Nhóm sản phẩm', value: product.subcategory },
  ...(product.brand ? [{ label: 'Thương hiệu', value: product.brand }] : []),
  ...Object.entries(product.attributes).filter(([key]) => key !== 'thuong-hieu').map(([key, value]) => ({
    label: ({ 'quy-cach': 'Quy cách', 'xuat-xu': 'Xuất xứ', 'chat-lieu': 'Chất liệu', 'mau-sac': 'Màu sắc', 'be-mat': 'Bề mặt', 'cat-le': 'Cắt lẻ' } as Record<string, string>)[key] ?? key,
    value: value?.join(', ') ?? '',
  })),
];
