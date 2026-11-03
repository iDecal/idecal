document.querySelectorAll<HTMLElement>('[data-catalog]').forEach(root => {
  const more = root.querySelector<HTMLButtonElement>('[data-catalog-more]');
  const cards = Array.from(root.querySelectorAll<HTMLElement>('.catalogue-card'));
  let limit = 8;

  function showProducts() {
    cards.forEach((card, index) => { card.hidden = index >= limit; });
    if (more) {
      more.hidden = cards.length <= limit;
      more.textContent = `Xem thêm ${Math.min(8, Math.max(0, cards.length - limit))} mẫu`;
    }
  }

  more?.addEventListener('click', () => {
    limit += 8;
    showProducts();
  });
  showProducts();
});
