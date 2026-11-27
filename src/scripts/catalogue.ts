import { normalizeSearch } from '../lib/site-search';

const batchSize = 8;
const nameOrder = new Intl.Collator('vi', { sensitivity: 'base', numeric: true });

document.querySelectorAll<HTMLElement>('[data-catalog]').forEach(root => {
  const form = root.querySelector<HTMLFormElement>('[data-catalog-filters]');
  const toolbarSort = root.querySelector<HTMLElement>('[data-catalog-sort]');
  const sort = toolbarSort?.querySelector('select');
  const grid = root.querySelector<HTMLElement>('[data-catalog-grid]');
  const more = root.querySelector<HTMLButtonElement>('[data-catalog-more]');
  const count = root.querySelector<HTMLElement>('[data-catalog-count]');
  const empty = root.querySelector<HTMLElement>('[data-catalog-empty]');
  if (!form || !grid || !more || !count || !empty) return;

  const entries = Array.from(grid.querySelectorAll<HTMLElement>('[data-catalog-item]')).flatMap(element => {
    const card = element.querySelector<HTMLElement>('[data-product-id]');
    if (!card) return [];
    return [{
      element,
      title: card.dataset.productName ?? '',
      search: normalizeSearch(card.dataset.search ?? ''),
      brand: element.dataset.shopBrand ?? '',
      groups: (element.dataset.shopGroups ?? '').split(' '),
      price: card.dataset.price ? Number(card.dataset.price) : null,
    }];
  });
  let limit = batchSize;

  function render() {
    if (!form || !grid || !more || !count || !empty) return;
    const values = new FormData(form);
    const words = normalizeSearch(String(values.get('query') ?? '')).split(' ').filter(Boolean);
    const group = values.get('group');
    const brand = values.get('brand');
    const min = values.get('min');
    const max = values.get('max');
    const matches = entries.filter(item =>
      words.every(word => item.search.includes(word)) &&
      (!group || item.groups.includes(String(group))) &&
      (!brand || item.brand === brand) &&
      (!min || (item.price !== null && item.price >= Number(min))) &&
      (!max || (item.price !== null && item.price <= Number(max)))
    );

    if (sort?.value === 'name') matches.sort((a, b) => nameOrder.compare(a.title, b.title));
    if (sort?.value === 'low' || sort?.value === 'high') {
      const direction = sort.value === 'low' ? 1 : -1;
      matches.sort((a, b) => {
        if (a.price === b.price) return 0;
        if (a.price === null) return 1;
        if (b.price === null) return -1;
        return (a.price - b.price) * direction;
      });
    }

    entries.forEach(item => { item.element.hidden = true; });
    matches.forEach((item, index) => {
      item.element.hidden = index >= limit;
      grid.append(item.element);
    });
    count.textContent = `${matches.length} sản phẩm`;
    empty.hidden = matches.length > 0;
    const remaining = Math.max(0, matches.length - limit);
    more.hidden = remaining === 0;
    more.textContent = `Xem thêm ${Math.min(batchSize, remaining)} mẫu`;
  }

  function filter() {
    limit = batchSize;
    render();
  }

  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', filter);
  form.addEventListener('reset', () => {
    if (sort) sort.value = '';
    requestAnimationFrame(filter);
  });
  sort?.addEventListener('change', filter);
  more.addEventListener('click', () => {
    limit += batchSize;
    render();
  });
  form.hidden = false;
  if (toolbarSort) toolbarSort.hidden = false;
  render();
});
