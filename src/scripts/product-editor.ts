const API = '/api/admin/github';
const repo = '/repos/iDecal/idecal';
const path = `${repo}/contents/src/data/products.json`;
type RecordData = Record<string, unknown> & { slug: string };
type Snapshot = { sha: string; products: RecordData[]; product: RecordData };
class EditorError extends Error {}
const decode = (value: string) => new TextDecoder().decode(Uint8Array.from(atob(value.replace(/\s/g, '')), c => c.charCodeAt(0)));
const encode = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
};
async function request(route: string, init: RequestInit = {}) {
  const response = await fetch(`${API}?path=${encodeURIComponent(route)}`, { ...init, cache: 'no-store', credentials: 'same-origin', redirect: 'error', headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(init.body ? { 'Content-Type': 'application/json' } : {}) } });
  if (!response.ok) {
    if (response.status === 401) throw new EditorError('Phiên GitHub không hợp lệ hoặc đã hết hạn. Hãy đăng nhập lại tại /admin/.');
    if (response.status === 403 || response.status === 404) throw new EditorError('Không có quyền truy cập hoặc ghi repository. Kiểm tra quyền Contents: Read and write và phê duyệt của tổ chức nếu có.');
    if (response.status === 409 || response.status === 422) throw new EditorError('Dữ liệu vừa thay đổi hoặc GitHub từ chối lưu. Đóng và mở lại popup để tải bản mới; nội dung bạn nhập chưa được lưu.');
    throw new EditorError(`GitHub chưa xử lý được yêu cầu (HTTP ${response.status}). Vui lòng thử lại sau.`);
  }
  return response.json();
}
async function load(slug: string): Promise<Snapshot> {
  const file = await request(`${path}?ref=main`);
  if (file.encoding !== 'base64' || typeof file.content !== 'string' || typeof file.sha !== 'string') throw new EditorError('Không đọc được tệp sản phẩm từ GitHub.');
  const products: RecordData[] = JSON.parse(decode(file.content));
  if (!Array.isArray(products)) throw new EditorError('Dữ liệu sản phẩm không đúng định dạng.');
  const matches = products.filter(item => item.slug === slug);
  if (matches.length !== 1) throw new EditorError('Sản phẩm không còn tồn tại hoặc có URL trùng trên GitHub.');
  return { sha: file.sha, products, product: matches[0] };
}
for (const root of document.querySelectorAll<HTMLElement>('[data-product-editor]')) {
  const dialog = root.querySelector<HTMLDialogElement>('[data-editor-dialog]')!;
  const form = root.querySelector<HTMLFormElement>('[data-editor-form]')!;
  const status = root.querySelector<HTMLElement>('[data-editor-status]')!;
  const login = root.querySelector<HTMLAnchorElement>('[data-editor-login]')!;
  const open = root.querySelector<HTMLButtonElement>('[data-editor-open]')!;
  const logout = root.querySelector<HTMLButtonElement>('[data-editor-logout]')!;
  const slug = root.dataset.productSlug!;
  let baseline: Snapshot | undefined;
  let busy = false;
  let authenticated = false;
  const message = (text: string, error = false) => { status.textContent = text; status.toggleAttribute('data-error', error); };
  const fail = (error: unknown) => message(error instanceof EditorError ? error.message : 'Không kết nối được GitHub. Kiểm tra kết nối rồi thử lại.', true);
  const controls = () => { login.hidden = authenticated; open.hidden = !authenticated; logout.hidden = !authenticated; };
  const task = async (action: () => Promise<void>) => {
    if (busy) return;
    busy = true;
    root.querySelectorAll<HTMLButtonElement>('button').forEach(button => { button.disabled = true; });
    try { await action(); } catch (error) { fail(error); }
    finally { busy = false; root.querySelectorAll<HTMLButtonElement>('button').forEach(button => { button.disabled = false; }); }
  };
  const verify = async () => {
    await request('/user');
    const repository = await request(repo);
    if (repository.permissions?.push !== true) throw new EditorError('Tài khoản GitHub này không có quyền sửa repository iDecal/idecal.');
  };
  const fill = async () => {
    message('Đang tải sản phẩm mới nhất…');
    baseline = await load(slug);
    for (const name of ['name', 'code', 'brand', 'category', 'description']) (form.elements.namedItem(name) as HTMLInputElement).value = String(baseline.product[name] ?? '');
    (form.elements.namedItem('price') as HTMLInputElement).value = baseline.product.price == null ? '' : String(baseline.product.price);
    for (const name of ['images', 'paragraphs']) (form.elements.namedItem(name) as HTMLTextAreaElement).value = (baseline.product[name] as string[] ?? []).join(name === 'images' ? '\n' : '\n\n');
    form.hidden = false;
    message('Đã tải dữ liệu mới nhất. URL và các thông tin ngoài biểu mẫu được giữ nguyên.');
  };
  root.querySelector('[data-editor-close]')!.addEventListener('click', () => { if (!busy) dialog.close(); });
  dialog.addEventListener('cancel', event => { if (busy) event.preventDefault(); });
  open.addEventListener('click', () => { dialog.showModal(); form.hidden = true; void task(async () => { await verify(); await fill(); }); });
  const resetSession = () => { authenticated = false; baseline = undefined; form.reset(); form.hidden = true; controls(); };
  logout.addEventListener('click', () => { void task(async () => {
    const response = await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' });
    if (!response.ok) throw new EditorError('Chưa đăng xuất được. Vui lòng thử lại.');
    resetSession(); message('Đã đăng xuất quản trị.');
  }); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!authenticated || !baseline || !form.reportValidity()) return;
    void task(async () => {
      const values = new FormData(form);
      const images = String(values.get('images')).split(/\r?\n/).map(value => value.trim()).filter(Boolean);
      if (!images.length || images.some(value => !(/^\/(?!\/)/.test(value) || /^https:\/\//i.test(value)))) throw new EditorError('Ảnh cần dùng đường dẫn bắt đầu bằng / hoặc URL HTTPS.');
      const priceInput = String(values.get('price')).trim();
      const price = priceInput === '' ? null : Number(priceInput);
      if (price !== null && (!Number.isSafeInteger(price) || price < 0)) throw new EditorError('Giá phải là số nguyên không âm hoặc để trống.');
      const name = String(values.get('name')).trim();
      const description = String(values.get('description')).trim();
      if (!name || !description) throw new EditorError('Hãy nhập tên và mô tả sản phẩm.');
      message('Đang kiểm tra thay đổi và lưu sản phẩm…');
      const latest = await load(slug);
      if (JSON.stringify(latest.product) !== JSON.stringify(baseline!.product)) throw new EditorError('Sản phẩm đã được người khác chỉnh sửa. Nội dung của bạn chưa được ghi đè. Đóng và mở lại popup để tải bản mới.');
      const updated = { ...latest.product, name, description, price, code: String(values.get('code')).trim(), brand: String(values.get('brand')).trim(), category: String(values.get('category')), images, paragraphs: String(values.get('paragraphs')).split(/\r?\n\s*\r?\n/).map(value => value.trim()).filter(Boolean) };
      const products = latest.products.map(product => product.slug === slug ? updated : product);
      await request(path, { method: 'PUT', body: JSON.stringify({ message: `Update product ${slug} from storefront editor`, branch: 'main', sha: latest.sha, content: encode(JSON.stringify(products, null, 2) + '\n') }) });
      baseline = { sha: latest.sha, products, product: updated };
      message('Đã lưu sản phẩm lên GitHub. Bản mới sẽ xuất hiện sau khi website triển khai xong.');
    });
  });
  controls();
  let syncVersion = 0;
  const syncSession = async () => {
    if (busy) return;
    const version = ++syncVersion;
    try {
      const response = await fetch('/api/admin/session', { cache: 'no-store', credentials: 'same-origin' });
      const session = response.ok ? await response.json() : { authenticated: false };
      if (version !== syncVersion) return;
      if (!session.authenticated) { resetSession(); dialog.close(); return; }
      authenticated = true; controls();
    } catch { resetSession(); }
  };
  window.addEventListener('focus', () => { void syncSession(); });
  window.addEventListener('pageshow', () => { void syncSession(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) void syncSession(); });
  void syncSession();
}
