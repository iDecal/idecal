// Replace WordPress interactivity with local, accessible event handlers.
document.querySelectorAll<HTMLElement>('.gs-accordion').forEach(group => {
  group.querySelectorAll<HTMLElement>('.gs-accordion-item__title').forEach(trigger => {
    const item = trigger.closest('.gs-accordion-item');
    const content = document.getElementById(trigger.getAttribute('aria-controls') ?? '');
    if (!item || !content) return;
    content.inert = true;
    content.setAttribute('aria-hidden', 'true');
    function toggle() {
      const expanded = trigger.getAttribute('aria-expanded') !== 'true';
      group.querySelectorAll<HTMLElement>('.gs-accordion-item__title').forEach(other => {
        const active = other === trigger && expanded;
        other.setAttribute('aria-expanded', String(active));
        const parent = other.closest('.gs-accordion-item');
        parent?.classList.toggle('gsopen', active);
        parent?.classList.toggle('gsclose', !active);
        const panel = document.getElementById(other.getAttribute('aria-controls') ?? '');
        if (panel) { panel.inert = !active; panel.setAttribute('aria-hidden', String(!active)); }
      });
    }
    trigger.addEventListener('click', toggle);
    trigger.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); }
    });
  });
});

document.querySelectorAll<HTMLImageElement>('img[data-home-fallback]').forEach(image => {
  const fallback = () => {
    if (image.dataset.fallbackActive) return;
    const src = image.dataset.homeFallback;
    if (src) { image.dataset.fallbackActive = 'true'; image.removeAttribute('srcset'); image.src = src; }
  };
  image.addEventListener('error', fallback);
  if (image.complete && !image.naturalWidth) fallback();
});
