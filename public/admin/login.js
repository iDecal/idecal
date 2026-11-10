const loginView = document.getElementById('login-view');
const accountView = document.getElementById('account-view');
const button = document.getElementById('github-login');
const statusEl = document.getElementById('status');
const errors = { configuration: 'Đăng nhập GitHub chưa được kích hoạt. Vui lòng liên hệ người quản trị để hoàn tất cấu hình.', authentication: 'Đăng nhập chưa hoàn tất hoặc phiên xác thực đã hết hạn. Vui lòng thử lại.', permission: 'Tài khoản này chưa có quyền chỉnh sửa website iDecal.' };
const error = new URLSearchParams(location.search).get('error');
if (error) history.replaceState(null, '', location.pathname);
async function check() {
  try {
    const response = await fetch('/api/admin/session', { cache: 'no-store', credentials: 'same-origin' });
    if (!response.ok) throw new Error();
    const session = await response.json();
    loginView.hidden = session.authenticated === true;
    accountView.hidden = session.authenticated !== true;
    document.getElementById('account-name').textContent = session.user?.name || session.user?.login || '';
    button.setAttribute('aria-disabled', String(!session.configured));
    statusEl.textContent = error ? errors[error] || errors.authentication : session.configured ? '' : errors.configuration;
    statusEl.toggleAttribute('data-error', Boolean(error) || !session.configured);
  } catch {
    statusEl.textContent = 'Chưa kết nối được dịch vụ đăng nhập. Vui lòng thử lại sau.';
    statusEl.setAttribute('data-error', '');
  }
}
button.addEventListener('click', event => { if (button.getAttribute('aria-disabled') === 'true') event.preventDefault(); });
document.getElementById('logout').addEventListener('click', async () => {
  try {
    const response = await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' });
    if (!response.ok) throw new Error();
    location.replace('/admin/');
  } catch { statusEl.textContent = 'Chưa đăng xuất được. Vui lòng thử lại.'; }
});
void check();
