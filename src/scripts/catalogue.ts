const normalize = (value: string) => value.toLocaleLowerCase('vi-VN').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').trim();

document.querySelectorAll<HTMLElement>('[data-catalog]').forEach(root => {
  const grid = root.querySelector<HTMLElement>('[data-catalog-grid]');
  const search = root.querySelector<HTMLInputElement>('[data-catalog-search]');
  const category = root.querySelector<HTMLSelectElement>('[data-catalog-category]');
  const sort = root.querySelector<HTMLSelectElement>('[data-catalog-sort]');
  const count = root.querySelector<HTMLElement>('[data-catalog-count]');
  const empty = root.querySelector<HTMLElement>('[data-catalog-empty]');
  const more = root.querySelector<HTMLButtonElement>('[data-catalog-more]');
  const cards = Array.from(root.querySelectorAll<HTMLElement>('.catalogue-card'));
  let limit = 8;
  let goal: HTMLButtonElement | null = null;

  function filterProducts(resetLimit = true) {
    if (resetLimit) limit = 8;
    const query = normalize(search?.value ?? '');
    const keywords: string[] = JSON.parse(goal?.dataset.keywords ?? '[]');
    const filtered = cards.filter(card => (!keywords.length || keywords.some(keyword => normalize(card.dataset.search ?? '').includes(normalize(keyword)))) && normalize(card.dataset.search ?? '').includes(query) && (!category?.value || card.dataset.category === category.value));
    if (sort?.value === 'name') filtered.sort((a,b) => (a.dataset.productName ?? '').localeCompare(b.dataset.productName ?? '', 'vi'));
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
  [category,sort].forEach(control => control?.addEventListener('change', () => filterProducts()));
  more?.addEventListener('click', () => { limit += 8; filterProducts(false); });
  root.querySelectorAll<HTMLButtonElement>('[data-catalog-reset]').forEach(button => button.addEventListener('click', () => {
    if (search) search.value = '';
    if (category) category.value = '';
    if (sort) sort.value = 'default';
    goal = null;
    root.querySelectorAll('[data-catalog-goal]').forEach(item => item.setAttribute('aria-pressed', 'false'));
    const tip = root.querySelector<HTMLElement>('[data-catalog-tip]');
    if (tip) tip.textContent = 'Chọn nhu cầu để xem gợi ý và các mẫu liên quan trong catalogue.';
    filterProducts();
    search?.focus();
  }));

  filterProducts();
});
