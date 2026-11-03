import palette from './pvc-colors.json';
const pvcSlugs = new Set(palette.colors.map(color => color.productSlug));
export const isPVCProduct = (slug: string) => pvcSlugs.has(slug);
export const pvcRollSize = '1,2 × 50 m';
export const pvcFinishes = [{ value: 'bong', label: 'Bóng' }, { value: 'nham', label: 'Nhám (mờ)' }];

export const pvcFinishImages = (slug: string) => ({ bong: `/images/pvc-finishes/${slug}-bong.svg`, nham: `/images/pvc-finishes/${slug}-nham.svg` });
