const loginView = document.getElementById('login-view');
const accountView = document.getElementById('account-view');
const button = document.getElementById('github-login');
const statusEl = document.getElementById('status');
const errors = { configuration: 'Đăng nhập GitHub chưa được kích hoạt. Vui lòng liên hệ người quản trị để hoàn tất cấu hình.', authentication: 'Đăng nhập chưa hoàn tất hoặc phiên xác thực đã hết hạn. Vui lòng thử lại.', permission: 'Tài khoản này chưa có quyền chỉnh sửa website iDecal.' };
const query = new URLSearchParams(location.search);
const error = query.get('error');
const stages = { oauth_start: 'khởi tạo đăng nhập', oauth_state: 'kiểm tra phiên xác thực', oauth_exchange: 'nhận kết quả từ GitHub', github_permissions: 'kiểm tra quyền GitHub', session_create: 'tạo phiên đăng nhập', session_read: 'đọc phiên đăng nhập', session_permissions: 'kiểm tra lại tài khoản', github_request: 'đọc hoặc lưu sản phẩm' };
const stage = query.get('stage');
const serviceMessage = code => 'Đăng nhập tạm thời gặp lỗi ở bước ' + (stages[code] || 'kết nối máy chủ') + '. Vui lòng thử lại. Mã hỗ trợ: ' + (Object.hasOwn(stages, code) ? code : 'service') + '.';
errors.service = serviceMessage(stage);
errors.oauth_credentials = 'GitHub chưa chấp nhận Client ID hoặc Client Secret. Kiểm tra đúng cặp thông tin của OAuth App trong Cloudflare Production rồi triển khai lại.';
errors.oauth_code = 'Mã đăng nhập đã hết hạn hoặc đã dùng. Hãy bấm đăng nhập GitHub lại từ đầu.';
errors.oauth_callback = 'Địa chỉ callback trong GitHub OAuth App chưa khớp. Cần dùng https://idecal.pages.dev/api/admin/callback.';
if (error) history.replaceState(null, '', location.pathname);
async function check() {
  try {
    const response = await fetch('/api/admin/session', { cache: 'no-store', credentials: 'same-origin' });
    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      statusEl.textContent = serviceMessage(result.stage);
      statusEl.setAttribute('data-error', '');
      return;
    }
    const session = await response.json();
    loginView.hidden = session.authenticated === true;
    accountView.hidden = session.authenticated !== true;
    document.getElementById('account-name').textContent = session.user?.name || session.user?.login || '';
    button.setAttribute('aria-disabled', String(!session.configured));
    const allowedNames = ['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET', 'ADMIN_SESSION_SECRET'];
    const issues = Array.isArray(session.issues) ? session.issues.filter(issue => allowedNames.includes(issue.name)) : [];
    const configurationMessage = issues.length
      ? 'Chưa kích hoạt đăng nhập GitHub. ' + issues.map(issue => issue.reason === 'too_short' ? issue.name + ' cần ít nhất 32 ký tự.' : 'Chưa nhận được biến ' + issue.name + '.').join(' ') + ' Kiểm tra Variables and secrets của môi trường Production trong Cloudflare Pages, lưu rồi triển khai lại.'
      : errors.configuration;
    statusEl.textContent = !session.configured ? configurationMessage : error ? errors[error] || errors.authentication : '';
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
