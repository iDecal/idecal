interface ComparisonProduct {
  slug: string;
  name: string;
  brand: string;
  price: number | null;
  attributes: Partial<Record<string, string[]>>;
  uses: string[];
}
const normalize = (value: string) => value.toLocaleLowerCase('vi-VN').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').trim();
const priceText = (price: number | null) => price ? `${price.toLocaleString('vi-VN')} ₫` : 'Liên hệ báo giá';

document.querySelectorAll<HTMLElement>('[data-catalog]').forEach(root => {
  const grid = root.querySelector<HTMLElement>('[data-catalog-grid]');
  const search = root.querySelector<HTMLInputElement>('[data-catalog-search]');
  const brand = root.querySelector<HTMLSelectElement>('[data-catalog-brand]');
  const category = root.querySelector<HTMLSelectElement>('[data-catalog-category]');
  const sort = root.querySelector<HTMLSelectElement>('[data-catalog-sort]');
  const count = root.querySelector<HTMLElement>('[data-catalog-count]');
  const empty = root.querySelector<HTMLElement>('[data-catalog-empty]');
  const more = root.querySelector<HTMLButtonElement>('[data-catalog-more]');
  const cards = Array.from(root.querySelectorAll<HTMLElement>('.catalogue-card'));
  const products: ComparisonProduct[] = JSON.parse(root.querySelector('[data-comparison-data]')?.textContent ?? '[]');
  const selected = new Set<string>();
  let limit = 8;
  let goal: HTMLButtonElement | null = null;

  function filterProducts(resetLimit = true) {
    if (resetLimit) limit = 8;
    const query = normalize(search?.value ?? '');
    const keywords: string[] = JSON.parse(goal?.dataset.keywords ?? '[]');
    const filtered = cards.filter(card => (!keywords.length || keywords.some(keyword => normalize(card.dataset.search ?? '').includes(normalize(keyword)))) && normalize(card.dataset.search ?? '').includes(query) && (!brand?.value || card.dataset.brand === brand.value) && (!category?.value || card.dataset.category === category.value));
    if (sort?.value === 'name') filtered.sort((a,b) => (products.find(p => p.slug === a.dataset.productId)?.name ?? '').localeCompare(products.find(p => p.slug === b.dataset.productId)?.name ?? '', 'vi'));
    if (sort?.value === 'price-asc' || sort?.value === 'price-desc') {
      const ascending = sort.value === 'price-asc';
      filtered.sort((a,b) => {
        if (!a.dataset.price) return b.dataset.price ? 1 : 0;
        if (!b.dataset.price) return -1;
        return ascending ? Number(a.dataset.price) - Number(b.dataset.price) : Number(b.dataset.price) - Number(a.dataset.price);
      });
    }
    cards.forEach(card => { card.hidden = true; });
    filtered.forEach((card,index) => { card.hidden = index >= limit; grid?.append(card); });
    if (count) count.textContent = `Hiển thị ${Math.min(limit, filtered.length)} / ${filtered.length} mẫu`;
    if (empty) empty.hidden = filtered.length > 0;
    if (more) { more.hidden = filtered.length <= limit; more.textContent = `Xem thêm ${Math.min(8, Math.max(0, filtered.length - limit))} mẫu`; }
  }
  root.querySelectorAll<HTMLButtonElement>('[data-catalog-goal]').forEach(button => button.addEventListener('click', () => {
    goal = goal === button ? null : button;
    root.querySelectorAll<HTMLButtonElement>('[data-catalog-goal]').forEach(item => item.setAttribute('aria-pressed', String(item === goal)));
    const tip = root.querySelector<HTMLElement>('[data-catalog-tip]');
    if (tip) tip.textContent = goal?.dataset.tip ?? 'Chọn nhu cầu để xem gợi ý và các mẫu liên quan trong catalogue.';
    filterProducts();
  }));
  search?.addEventListener('input', () => filterProducts());
  [brand,category,sort].forEach(control => control?.addEventListener('change', () => filterProducts()));
  more?.addEventListener('click', () => { limit += 8; filterProducts(false); });
  root.querySelectorAll<HTMLButtonElement>('[data-catalog-reset]').forEach(button => button.addEventListener('click', () => {
    if (search) search.value = '';
    if (brand) brand.value = '';
    if (category) category.value = '';
    if (sort) sort.value = 'default';
    goal = null;
    root.querySelectorAll('[data-catalog-goal]').forEach(item => item.setAttribute('aria-pressed', 'false'));
    const tip = root.querySelector<HTMLElement>('[data-catalog-tip]');
    if (tip) tip.textContent = 'Chọn nhu cầu để xem gợi ý và các mẫu liên quan trong catalogue.';
    filterProducts();
    search?.focus();
  }));

  function renderComparison() {
    const chosen = products.filter(product => selected.has(product.slug));
    const panel = root.querySelector<HTMLElement>('[data-catalog-comparison]');
    const container = root.querySelector<HTMLElement>('[data-compare-table]');
    if (panel) panel.hidden = chosen.length === 0;
    root.querySelectorAll<HTMLButtonElement>('[data-compare-id]').forEach(button => {
      const active = selected.has(button.dataset.compareId ?? '');
      button.setAttribute('aria-pressed', String(active));
      button.textContent = active ? '✓ Đã chọn' : '+ So sánh';
    });
    if (!container) return;
    container.replaceChildren();
    if (!chosen.length) return;
    const table = document.createElement('table');
    table.className = 'w-full min-w-[600px] border-collapse text-left text-sm';
    const caption = table.createCaption(); caption.className = 'sr-only'; caption.textContent = 'Thông tin các mẫu sản phẩm được chọn';
    const header = table.createTHead().insertRow();
    const first = document.createElement('th'); first.scope = 'col'; first.textContent = 'Thông tin'; first.className = 'border-b border-border p-3'; header.append(first);
    chosen.forEach(product => {
      const th = document.createElement('th'); th.scope = 'col'; th.className = 'border-b border-border p-3';
      const link = document.createElement('a'); link.href = `/san-pham/${product.slug}`; link.textContent = product.name; link.className = 'text-primary hover:underline'; th.append(link); header.append(th);
    });
    const rows: [string,(product: ComparisonProduct) => string][] = [
      ['Thương hiệu', p => p.brand || 'Liên hệ xác nhận'],
      ['Giá tham khảo', p => priceText(p.price)],
      ['Quy cách', p => p.attributes['quy-cach']?.join(', ') || 'Liên hệ xác nhận'],
      ['Xuất xứ', p => p.attributes['xuat-xu']?.join(', ') || 'Liên hệ xác nhận'],
      ['Ứng dụng', p => p.uses.join(', ') || 'Tư vấn theo công trình'],
    ];
    const body = table.createTBody();
    rows.forEach(([label,value]) => {
      const row = body.insertRow();
      const th = document.createElement('th'); th.scope = 'row'; th.textContent = label; th.className = 'border-b border-border p-3 font-medium'; row.append(th);
      chosen.forEach(product => { const cell = row.insertCell(); cell.textContent = value(product); cell.className = 'border-b border-border p-3 align-top'; });
    });
    container.append(table);
  }
  root.querySelectorAll<HTMLButtonElement>('[data-compare-id]').forEach(button => button.addEventListener('click', () => {
    const slug = button.dataset.compareId;
    const status = root.querySelector<HTMLElement>('[data-compare-status]');
    if (!slug) return;
    if (selected.has(slug)) selected.delete(slug);
    else if (selected.size < 3) selected.add(slug);
    else { if (status) status.textContent = 'Bạn có thể so sánh tối đa 3 mẫu. Bỏ chọn một mẫu trước khi thêm mẫu khác.'; return; }
    if (status) status.textContent = `Đã chọn ${selected.size} mẫu để so sánh.`;
    renderComparison();
  }));
  root.querySelector('[data-compare-clear]')?.addEventListener('click', () => {
    selected.clear(); renderComparison();
    const status = root.querySelector<HTMLElement>('[data-compare-status]'); if (status) status.textContent = 'Đã bỏ chọn tất cả mẫu.';
  });
  filterProducts();
});
