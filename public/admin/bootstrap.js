const script = document.getElementById('cms-script');
const loading = document.getElementById('cms-loading');
script?.addEventListener('load', () => loading?.remove());
script?.addEventListener('error', () => {
  const message = loading?.querySelector('p');
  if (message) message.textContent = 'Chưa tải được trình quản lý. Kiểm tra kết nối rồi tải lại trang.';
});

// Return to the storefront on the same origin so its editor sees the CMS session.
const storefrontLink = document.createElement('a');
storefrontLink.href = '/';
storefrontLink.textContent = 'Xem website →';
storefrontLink.setAttribute('aria-label', 'Về website để chỉnh sửa sản phẩm');
storefrontLink.style.cssText = 'position:fixed;bottom:16px;left:16px;z-index:2147483647;padding:10px 16px;border:1px solid #d1b581;border-radius:8px;background:#e4cfaa;color:#031245;font:500 13px sans-serif;text-decoration:none;box-shadow:0 2px 12px #03124522';
document.body.append(storefrontLink);
