import { normalizeSearch } from '../lib/site-search';

const shop = document.querySelector<HTMLElement>('[data-shop]');
if (shop) {
  const filters = shop.querySelector<HTMLDetailsElement>('[data-shop-filters]')!;
  const form = shop.querySelector<HTMLFormElement>('[data-shop-form]')!;
  const sort = shop.querySelector<HTMLSelectElement>('[data-shop-sort] select')!;
  const grid = shop.querySelector<HTMLElement>('[data-shop-grid]')!;
  const count = shop.querySelector<HTMLElement>('[data-shop-count]')!;
  const empty = shop.querySelector<HTMLElement>('[data-shop-empty]')!;
  const more = shop.querySelector<HTMLButtonElement>('[data-shop-more]')!;
  const collator = new Intl.Collator('vi', { numeric: true });
  const pageSize = 24;
  let limit = pageSize;
  const items = Array.from(grid.querySelectorAll<HTMLElement>('[data-shop-item]'), element => {
    const card = element.querySelector<HTMLElement>('[data-product-id]')!;
    const price = Number(card.dataset.price) || null;
    return {
      element,
      price,
      name: card.dataset.productName ?? '',
      code: normalizeSearch(element.dataset.code ?? '').replaceAll(' ', ''),
      text: normalizeSearch(`${card.dataset.search} ${card.dataset.productId} ${element.dataset.code ?? ''}`),
      groups: (element.dataset.groups ?? '').split(' '),
      brand: element.dataset.brand,
    };
  });

  const query = form.elements.namedItem('q') as HTMLInputElement;
  const group = form.elements.namedItem('danh-muc') as HTMLSelectElement;
  const brand = form.elements.namedItem('thuong-hieu') as HTMLSelectElement;
  const price = form.elements.namedItem('gia') as HTMLSelectElement;
  const controls = [query, group, brand, price, sort];

  function readUrl() {
    const params = new URLSearchParams(location.search);
    for (const control of controls) {
      const value = params.get(control.name) ?? '';
      control.value = control instanceof HTMLSelectElement && !Array.from(control.options).some(option => option.value === value)
        ? '' : value;
    }
  }

  function showResults(updateUrl = false) {
    const terms = normalizeSearch(query.value).split(' ').filter(Boolean);
    const compactQuery = terms.join('');
    const matches = items.filter(item => {
      if (group.value && !item.groups.includes(group.value)) return false;
      if (brand.value && item.brand !== brand.value) return false;
      if (!terms.every(term => item.text.includes(term)) && item.code !== compactQuery) return false;
      switch (price.value) {
        case 'quote': return item.price === null;
        case 'under-100': return item.price !== null && item.price < 100_000;
        case '100-300': return item.price !== null && item.price >= 100_000 && item.price <= 300_000;
        case 'over-300': return item.price !== null && item.price > 300_000;
        default: return true;
      }
    });

    if (sort.value === 'name') matches.sort((a, b) => collator.compare(a.name, b.name));
    if (sort.value === 'price-asc' || sort.value === 'price-desc') {
      const direction = sort.value === 'price-asc' ? 1 : -1;
      matches.sort((a, b) => {
        if (a.price === null) return b.price === null ? 0 : 1;
        if (b.price === null) return -1;
        return direction * (a.price - b.price);
      });
    }

    const visible = matches.slice(0, limit);
    const visibleItems = new Set(visible);
    for (const item of items) item.element.hidden = !visibleItems.has(item);
    for (const item of visible) grid.append(item.element);

    count.textContent = visible.length < matches.length
      ? `Hiển thị ${visible.length} / ${matches.length} sản phẩm`
      : `${matches.length} sản phẩm`;
    empty.hidden = matches.length > 0;
    more.hidden = visible.length >= matches.length;

    if (updateUrl) {
      const url = new URL(location.href);
      for (const control of controls) {
        const value = control.value.trim();
        if (value) url.searchParams.set(control.name, value);
        else url.searchParams.delete(control.name);
      }
      history.replaceState(history.state, '', url);
    }
  }

  function refresh() {
    limit = pageSize;
    showResults(true);
  }

  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', refresh);
  form.addEventListener('reset', () => {
    sort.value = '';
    queueMicrotask(refresh);
  });
  sort.addEventListener('change', refresh);
  more.addEventListener('click', () => {
    limit += pageSize;
    showResults();
  });
  shop.querySelector('[data-shop-clear]')?.addEventListener('click', () => {
    form.reset();
    filters.open = true;
    query.focus();
  });
  window.addEventListener('popstate', () => {
    readUrl();
    limit = pageSize;
    showResults();
  });

  readUrl();
  filters.open = !matchMedia('(max-width: 767px)').matches || controls.some(control => control.value);
  filters.hidden = false;
  sort.closest<HTMLElement>('[data-shop-sort]')!.hidden = false;
  showResults();
}
