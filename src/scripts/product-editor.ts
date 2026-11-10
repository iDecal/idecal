import configuredBrands from '../data/product-brands.json';
import imageSeo from '../data/image-seo.json';
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
  const brandSelect = form.elements.namedItem('brand') as HTMLSelectElement;
  const brandNew = form.elements.namedItem('brandNew') as HTMLInputElement;
  const brandNewField = form.querySelector<HTMLElement>('[data-brand-new-field]')!;
  const categorySelect = form.elements.namedItem('category') as HTMLSelectElement;
  const categoryNew = form.querySelector<HTMLElement>('[data-category-new]')!;
  const categoryName = form.elements.namedItem('categoryName') as HTMLInputElement;
  const categorySlug = form.elements.namedItem('categorySlug') as HTMLInputElement;
  const imageList = form.querySelector<HTMLElement>('[data-editor-images]')!;
  type ImageMetadata = { src: string; alt: string; title: string };
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
  const updateBrands = (records: RecordData[], selected: string) => {
    const brands = [...configuredBrands.map(brand => brand.name), ...records.map(product => String(product.brand || '')), selected].filter(Boolean);
    const unique = [...new Map(brands.map(name => [name.toLocaleLowerCase('vi-VN'), name])).values()].sort((a, b) => a.localeCompare(b, 'vi'));
    brandSelect.replaceChildren(new Option('Chưa chọn', ''), ...unique.map(name => new Option(name, name)));
    brandSelect.value = unique.find(name => name.toLowerCase() === selected.toLowerCase()) || '';
    brandNew.value = ''; brandNewField.hidden = true;
  };
  root.querySelector('[data-brand-add]')!.addEventListener('click', () => {
    brandNewField.hidden = !brandNewField.hidden;
    if (!brandNewField.hidden) { brandNew.focus(); } else { brandNew.value = ''; }
  });
  brandSelect.addEventListener('change', () => { brandNew.value = ''; brandNewField.hidden = true; });
  let autoCategorySlug = '';
  root.querySelector('[data-category-add]')!.addEventListener('click', () => { categoryNew.hidden = !categoryNew.hidden; if (!categoryNew.hidden) categoryName.focus(); });
  categoryName.addEventListener('input', () => {
    const next = categoryName.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!categorySlug.value || categorySlug.value === autoCategorySlug) categorySlug.value = next;
    autoCategorySlug = next;
  });
  root.querySelector('[data-category-create]')!.addEventListener('click', () => { void task(async () => {
    const name = categoryName.value.trim();
    const newSlug = categorySlug.value.trim();
    if (!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(newSlug)) throw new EditorError('Nhập tên và đường dẫn danh mục (chữ không dấu, số, dấu gạch ngang).');
    message('Đang tạo danh mục…');
    const response = await fetch('/api/admin/categories', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, slug: newSlug, sourceCategory: categorySelect.value }) });
    if (!response.ok) throw new EditorError(response.status === 409 ? 'Đường dẫn danh mục đã có hoặc dữ liệu vừa thay đổi. Hãy chọn đường dẫn khác hoặc mở lại popup.' : 'Chưa tạo được danh mục. Kiểm tra phiên đăng nhập và quyền GitHub.');
    const result = await response.json();
    if (!result.category?.slug || !result.category?.name) throw new EditorError('Không đọc được danh mục vừa tạo.');
    if (!Array.from(categorySelect.options).some(option => option.value === result.category.slug)) categorySelect.add(new Option(result.category.name, result.category.slug));
    categorySelect.value = result.category.slug;
    categoryName.value = ''; categorySlug.value = ''; autoCategorySlug = ''; categoryNew.hidden = true;
    message('Đã tạo và chọn danh mục. Bấm Lưu sản phẩm để chuyển sản phẩm vào danh mục này.');
  }); });
  const imageRow = (image: ImageMetadata) => {
    const row = document.createElement('div');
    row.className = 'editor-image-row';
    row.innerHTML = '<div class="editor-image-top"><img alt="Xem trước ảnh sản phẩm" /><button type="button" data-image-upload class="editor-small-button">Upload ảnh</button><button type="button" data-image-remove class="editor-small-button">Xóa ảnh</button></div><input data-image-file type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" /><label>URL ảnh<input data-image-src required /></label><label>ALT – mô tả ảnh<input data-image-alt required maxlength="500" /></label><label>Tiêu đề ảnh<input data-image-title required maxlength="500" /></label>';
    const src = row.querySelector<HTMLInputElement>('[data-image-src]')!;
    const alt = row.querySelector<HTMLInputElement>('[data-image-alt]')!;
    const title = row.querySelector<HTMLInputElement>('[data-image-title]')!;
    const preview = row.querySelector<HTMLImageElement>('img')!;
    const file = row.querySelector<HTMLInputElement>('[data-image-file]')!;
    src.value = image.src; alt.value = image.alt; title.value = image.title;
    const refresh = () => { const value = src.value.trim(); preview.hidden = !(/^(\/(?!\/)|https:\/\/)/i.test(value)); if (!preview.hidden) preview.src = value; else preview.removeAttribute('src'); };
    refresh(); src.addEventListener('change', refresh);
    row.querySelector('[data-image-remove]')!.addEventListener('click', () => row.remove());
    row.querySelector('[data-image-upload]')!.addEventListener('click', () => file.click());
    file.addEventListener('change', () => {
      const selected = file.files?.[0];
      if (!selected) return;
      void task(async () => {
        if (selected.size > 5 * 1024 * 1024) throw new EditorError('Mỗi ảnh tối đa 5 MB.');
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'].includes(selected.type)) throw new EditorError('Chọn ảnh JPG, PNG, WebP, GIF hoặc AVIF.');
        message('Đang upload ảnh…');
        const bytes = new Uint8Array(await selected.arrayBuffer());
        let binary = '';
        for (const byte of bytes) binary += String.fromCharCode(byte);
        const response = await fetch('/api/admin/upload', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: selected.name, content: btoa(binary) }) });
        if (!response.ok) throw new EditorError(response.status === 401 ? 'Phiên đăng nhập hết hạn. Đăng nhập lại trước khi upload.' : 'Upload ảnh chưa thành công. Kiểm tra định dạng, kích thước và quyền GitHub rồi thử lại.');
        const result = await response.json();
        if (typeof result.url !== 'string' || !result.url.startsWith('/images/uploads/')) throw new EditorError('Không nhận được đường dẫn ảnh upload.');
        src.value = result.url;
        const objectURL = URL.createObjectURL(selected);
        preview.src = objectURL; preview.hidden = false;
        preview.addEventListener('load', () => URL.revokeObjectURL(objectURL), { once: true });
        if (!alt.value.trim()) alt.value = String((form.elements.namedItem('name') as HTMLInputElement).value || selected.name);
        if (!title.value.trim()) title.value = alt.value;
        message('Đã upload ảnh. Điền ALT và tiêu đề, sau đó bấm Lưu sản phẩm để áp dụng.');
      });
      file.value = '';
    });
    imageList.append(row);
  };
  root.querySelector('[data-image-add]')!.addEventListener('click', () => imageRow({ src: '', alt: '', title: '' }));
  const fill = async () => {
    message('Đang tải sản phẩm mới nhất…');
    baseline = await load(slug);
    const categoryResponse = await fetch('/api/admin/categories', { cache: 'no-store', credentials: 'same-origin' });
    if (!categoryResponse.ok) throw new EditorError('Không tải được danh mục mới nhất. Vui lòng mở lại popup.');
    const categoryData = await categoryResponse.json();
    categorySelect.replaceChildren(...categoryData.categories.map((category: {name: string; slug: string}) => new Option(category.name, category.slug)));
    categoryNew.hidden = true; categoryName.value = ''; categorySlug.value = ''; autoCategorySlug = '';
    for (const name of ['name', 'code', 'category', 'description']) (form.elements.namedItem(name) as HTMLInputElement).value = String(baseline.product[name] ?? '');
    (form.elements.namedItem('price') as HTMLInputElement).value = baseline.product.price == null ? '' : String(baseline.product.price);
    (form.elements.namedItem('paragraphs') as HTMLTextAreaElement).value = (baseline.product.paragraphs as string[] ?? []).join('\n\n');
    updateBrands(baseline.products, String(baseline.product.brand ?? ''));
    imageList.replaceChildren();
    const metadata = baseline.product.imageMetadata as ImageMetadata[] ?? [];
    for (const src of baseline.product.images as string[] ?? []) {
      const custom = metadata.find(item => item.src === src);
      const existing = imageSeo.find(item => item.src === src);
      imageRow({ src, alt: custom?.alt || existing?.alt || String(baseline.product.name), title: custom?.title || existing?.title || String(baseline.product.name) });
    }
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
      if (!categoryNew.hidden && categoryName.value.trim()) throw new EditorError('Bấm Tạo danh mục trước khi lưu sản phẩm, hoặc đóng phần thêm danh mục.');
      const values = new FormData(form);
      const imageMetadata = Array.from(imageList.querySelectorAll<HTMLElement>('.editor-image-row')).map(row => ({
        src: row.querySelector<HTMLInputElement>('[data-image-src]')!.value.trim(),
        alt: row.querySelector<HTMLInputElement>('[data-image-alt]')!.value.trim(),
        title: row.querySelector<HTMLInputElement>('[data-image-title]')!.value.trim(),
      }));
      const images = imageMetadata.map(image => image.src);
      if (!images.length || images.some(value => !(/^\/(?!\/)/.test(value) || /^https:\/\//i.test(value)))) throw new EditorError('Ảnh cần dùng đường dẫn bắt đầu bằng / hoặc URL HTTPS.');
      if (new Set(images).size !== images.length) throw new EditorError('URL ảnh bị trùng. Mỗi ảnh chỉ cần thêm một lần.');
      if (imageMetadata.some(image => !image.alt || !image.title)) throw new EditorError('Điền ALT và tiêu đề cho từng ảnh.');
      const enteredBrand = brandNewField.hidden ? '' : brandNew.value.trim();
      const requestedBrand = enteredBrand || brandSelect.value;
      const knownBrands = [...configuredBrands.map(brand => brand.name), ...baseline!.products.map(product => String(product.brand || ''))];
      const brand = knownBrands.find(name => name.toLowerCase() === requestedBrand.toLowerCase()) || requestedBrand;
      const priceInput = String(values.get('price')).trim();
      const price = priceInput === '' ? null : Number(priceInput);
      if (price !== null && (!Number.isSafeInteger(price) || price < 0)) throw new EditorError('Giá phải là số nguyên không âm hoặc để trống.');
      const name = String(values.get('name')).trim();
      const description = String(values.get('description')).trim();
      if (!name || !description) throw new EditorError('Hãy nhập tên và mô tả sản phẩm.');
      message('Đang kiểm tra thay đổi và lưu sản phẩm…');
      const latest = await load(slug);
      if (JSON.stringify(latest.product) !== JSON.stringify(baseline!.product)) throw new EditorError('Sản phẩm đã được người khác chỉnh sửa. Nội dung của bạn chưa được ghi đè. Đóng và mở lại popup để tải bản mới.');
      const updated = { ...latest.product, name, description, price, code: String(values.get('code')).trim(), brand, category: String(values.get('category')), images, imageMetadata, paragraphs: String(values.get('paragraphs')).split(/\r?\n\s*\r?\n/).map(value => value.trim()).filter(Boolean) };
      const products = latest.products.map(product => product.slug === slug ? updated : product);
      await request(path, { method: 'PUT', body: JSON.stringify({ message: `Update product ${slug} from storefront editor`, branch: 'main', sha: latest.sha, content: encode(JSON.stringify(products, null, 2) + '\n') }) });
      baseline = { sha: latest.sha, products, product: updated };
      updateBrands(products, brand);
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
