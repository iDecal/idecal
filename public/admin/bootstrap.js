const script = document.getElementById('cms-script');
const loading = document.getElementById('cms-loading');
script?.addEventListener('load', () => loading?.remove());
script?.addEventListener('error', () => {
  const message = loading?.querySelector('p');
  if (message) message.textContent = 'Chưa tải được trình quản lý. Kiểm tra kết nối rồi tải lại trang.';
});
