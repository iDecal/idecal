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

const nav = document.querySelector<HTMLElement>('.site-header .wp-block-navigation');
const menu = nav?.querySelector<HTMLElement>('.wp-block-navigation__responsive-container');
const openButton = nav?.querySelector<HTMLButtonElement>('.wp-block-navigation__responsive-container-open');
const closeButton = nav?.querySelector<HTMLButtonElement>('.wp-block-navigation__responsive-container-close');
let previousOverflow = '';
if (menu && openButton) {
  menu.id ||= 'home-navigation-menu';
  openButton.setAttribute('aria-controls', menu.id);
  openButton.setAttribute('aria-expanded', 'false');
}
function setMenu(open: boolean) {
  if (!menu || !openButton) return;
  const wasOpen = openButton.getAttribute('aria-expanded') === 'true';
  if (open === wasOpen) return;
  menu.classList.toggle('is-menu-open', open);
  menu.classList.toggle('has-modal-open', open);
  openButton.setAttribute('aria-expanded', String(open));
  if (open) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-modal', 'true');
    menu.setAttribute('aria-label', 'Menu chính');
    document.querySelector('main')?.setAttribute('inert', '');
    document.querySelector('footer')?.setAttribute('inert', '');
    closeButton?.focus();
  } else {
    document.body.style.overflow = previousOverflow;
    menu.removeAttribute('role'); menu.removeAttribute('aria-modal'); menu.removeAttribute('aria-label');
    document.querySelector('main')?.removeAttribute('inert');
    document.querySelector('footer')?.removeAttribute('inert');
    openButton.focus();
  }
}
openButton?.addEventListener('click', () => setMenu(true));
closeButton?.addEventListener('click', () => setMenu(false));
nav?.querySelectorAll<HTMLButtonElement>('.wp-block-navigation-submenu__toggle').forEach((button,index) => {
  const submenu = button.parentElement?.querySelector<HTMLElement>(':scope > .wp-block-navigation__submenu-container');
  if (!submenu) return;
  submenu.id ||= `home-navigation-submenu-${index}`;
  button.setAttribute('aria-controls', submenu.id);
  button.addEventListener('click', () => button.setAttribute('aria-expanded', String(button.getAttribute('aria-expanded') !== 'true')));
});
menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
window.matchMedia('(min-width: 992px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
document.addEventListener('keydown', event => {
  if (openButton?.getAttribute('aria-expanded') !== 'true') return;
  if (event.key === 'Escape') setMenu(false);
  if (event.key === 'Tab' && menu) {
    const controls = Array.from(menu.querySelectorAll<HTMLElement>('a,button')).filter(element => element.getClientRects().length && element.offsetHeight > 0);
    const first = controls[0]; const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first && last) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last && first) { event.preventDefault(); first.focus(); }
  }
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
