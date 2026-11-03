interface BookingProduct { slug: string; name: string; code: string; service?: string; }
const form = document.querySelector<HTMLFormElement>('#booking-form');
if (form) {
  form.hidden = false;
  const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
  const name = byId<HTMLInputElement>('booking-name');
  const phone = byId<HTMLInputElement>('booking-phone');
  const service = byId<HTMLSelectElement>('booking-service');
  const region = byId<HTMLSelectElement>('booking-region');
  const address = byId<HTMLInputElement>('booking-address');
  const date = byId<HTMLInputElement>('booking-date');
  const time = byId<HTMLSelectElement>('booking-time');
  const size = byId<HTMLInputElement>('booking-size');
  const notes = byId<HTMLTextAreaElement>('booking-notes');
  const preview = byId<HTMLElement>('booking-preview');
  const message = byId<HTMLTextAreaElement>('booking-message');
  const status = byId<HTMLElement>('booking-copy-status');
  const products: BookingProduct[] = JSON.parse(document.getElementById('booking-product-data')?.textContent ?? '[]');
  const params = new URLSearchParams(location.search);
  const product = products.find(item => item.slug === params.get('san-pham'));
  const requestedService = params.get('dich-vu') || product?.service;
  const legacyServices: Record<string,string> = { 'decal-dan-kinh-van-phong':'thi-cong-decal', 'phim-cach-nhiet':'thi-cong-decal', 'decal-mo-3d-van-song':'thi-cong-decal', 'film-noi-that':'thi-cong-decal', 'decal-quang-cao':'in-decal' };
  const desiredService = requestedService ? legacyServices[requestedService] || requestedService : undefined;
  if (desiredService && Array.from(service.options).some(option => option.value === desiredService)) {
    service.value = desiredService;
    service.selectedOptions[0].defaultSelected = true;
  }
  if (product) {
    byId<HTMLElement>('booking-product-info').hidden = false;
    byId<HTMLElement>('booking-product-name').textContent = `${product.name} · ${product.code}`;
    byId<HTMLAnchorElement>('booking-product-link').href = `/san-pham/${encodeURIComponent(product.slug)}`;
  }
  const parts = new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const part = (key: string) => parts.find(item => item.type === key)?.value;
  date.min = `${part('year')}-${part('month')}-${part('day')}`;
  phone.addEventListener('input', () => phone.setCustomValidity(''));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const digits = phone.value.replace(/[^0-9]/g, '');
    phone.setCustomValidity(/^(0\d{9}|84\d{9})$/.test(digits) ? '' : 'Vui lòng nhập số điện thoại Việt Nam hợp lệ.');
    name.setCustomValidity(name.value.trim() ? '' : 'Vui lòng nhập tên người liên hệ.');
    address.setCustomValidity(address.value.trim() ? '' : 'Vui lòng nhập địa chỉ công trình.');
    if (!form.reportValidity()) return;
    const selectedDate = date.value ? date.value.split('-').reverse().join('/') : 'Cần trao đổi';
    const lines = [
      'YÊU CẦU ĐẶT DỊCH VỤ IDECAL',
      `Họ tên: ${name.value.trim()}`,
      `Điện thoại: ${phone.value.trim()}`,
      `Dịch vụ: ${service.selectedOptions[0].textContent}`,
      ...(product ? [`Mẫu quan tâm: ${product.name} (${product.code})`] : []),
      `Khu vực: ${region.selectedOptions[0].textContent}`,
      `Địa chỉ: ${address.value.trim()}`,
      `Ngày mong muốn: ${selectedDate}`,
      `Khung giờ: ${time.value || 'Linh hoạt, cần trao đổi'}`,
      ...(size.value.trim() ? [`Kích thước / khối lượng: ${size.value.trim()}`] : []),
      ...(notes.value.trim() ? [`Nhu cầu / ghi chú: ${notes.value.trim()}`] : []),
      'Nhờ iDecal tư vấn, báo giá và xác nhận lịch phù hợp.',
    ];
    message.value = lines.join('\n');
    preview.hidden = false;
    status.textContent = '';
    byId<HTMLElement>('booking-preview-title').focus();
    preview.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'start'});
  });
  name.addEventListener('input', () => name.setCustomValidity(''));
  address.addEventListener('input', () => address.setCustomValidity(''));
  byId<HTMLButtonElement>('booking-copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(message.value);
      status.textContent = 'Đã sao chép. Mở Zalo và dán nội dung để gửi cho iDecal.';
    } catch {
      message.focus(); message.select();
      status.textContent = 'Hãy sao chép nội dung đang được chọn, sau đó dán vào cuộc trò chuyện Zalo.';
    }
  });
  form.addEventListener('reset', () => {
    phone.setCustomValidity(''); name.setCustomValidity(''); address.setCustomValidity('');
    preview.hidden = true;
    message.value = ''; status.textContent = '';
  });
}
