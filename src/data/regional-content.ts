import data from './regional-content.json';
export interface RegionalPageContent {
  title: string;
  lead: string;
  description: string;
  introduction: string[];
  heroImage: string;
  imageAlt: string;
  areas: string[];
  areaNote: string;
  services: { slug: string; title: string; text: string }[];
  benefits: { title: string; text: string }[];
  prices: { item: string; price: string; note: string }[];
  priceNote: string;
  references: string[];
  faqs: { question: string; answer: string }[];
}
export const updatedRegionalContent: Record<string, RegionalPageContent> = data;
