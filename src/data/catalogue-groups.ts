import { productCategories } from './catalogue';
import { productLandings } from './site-offerings';

const hiddenCategorySlugs = new Set(['phim-bao-ve', 'decal-trang-tri', 'decal-cat-cnc', 'decal-cat-vi-tinh']);
const additionalCatalogueCategories = productCategories.filter(
  category => category.editorCreated && !hiddenCategorySlugs.has(category.slug)
);

export const catalogueGroups = [...productLandings, ...additionalCatalogueCategories];
