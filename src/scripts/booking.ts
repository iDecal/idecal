interface BookingData {
  products: { slug: string; name: string; pvc: boolean }[];
  regions: Record<string, string>;
  districts: Record<string, string>;
  wards: Record<string, string>;
  finishes: Record<string, string>;
}

const form = document.querySelector<HTMLFormElement>('#booking-form');
if (form) {
  const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
  const name = byId<HTMLInputElement>('booking-name');
  const phone = byId<HTMLInputElement>('booking-phone');
  const service = byId<HTMLSelectElement>('booking-service');
  const notes = byId<HTMLTextAreaElement>('booking-notes');
  const preview = byId<HTMLElement>('booking-preview');
  const message = byId<HTMLTextAreaElement>('booking-message');
  const status = byId<HTMLElement>('booking-copy-status');
  const data: BookingData = JSON.parse(byId('booking-product-data').textContent ?? '');
  const params = new URLSearchParams(location.search);
  const lookup = (entries: Record<string, string>, param: string) => {
    const key = params.get(param);
    return key && Object.hasOwn(entries, key) ? entries[key] : '';
  };

  const product = data.products.find(item => item.slug === params.get('san-pham'));
  const region = lookup(data.regions, 'khu-vuc');
  const useHcmContext = !params.has('khu-vuc') || params.get('khu-vuc') === 'tp-hcm';
  const locality = useHcmContext ? lookup(data.wards, 'phuong-xa') || lookup(data.districts, 'dia-ban') : '';
  const area = [locality, region || (locality ? data.regions['tp-hcm'] : '')].filter(Boolean).join(', ');

  const legacyServices: Record<string, string> = {
    'decal-dan-kinh-van-phong': 'thi-cong-decal',
    'phim-cach-nhiet': 'thi-cong-decal',
    'decal-mo-3d-van-song': 'thi-cong-decal',
    'film-noi-that': 'thi-cong-decal',
    'decal-quang-cao': 'in-decal',
  };
  const requestedService = params.get('dich-vu') || (product ? product.pvc ? 'cat-decal' : 'thi-cong-decal' : '');
  const desiredService = Object.hasOwn(legacyServices, requestedService) ? legacyServices[requestedService] : requestedService;
  const serviceOption = Array.from(service.options).find(option => option.value === desiredService);
  if (serviceOption) {
    service.value = serviceOption.value;
    serviceOption.defaultSelected = true;
  }

  if (product) {
    byId<HTMLElement>('booking-product-info').hidden = false;
    byId<HTMLElement>('booking-product-name').textContent = product.name;
    byId<HTMLAnchorElement>('booking-product-link').href = `/san-pham/${encodeURIComponent(product.slug)}`;
  }
  const pvcFinish = product?.pvc ? lookup(data.finishes, 'be-mat') : '';
  const pvcPurchase = product?.pvc ? params.get('hinh-thuc') : null;
  const size = pvcPurchase === 'cat-le' ? (params.get('kich-thuoc') ?? '').trim().slice(0, 160) : '';
  const context = [
    ...(product ? [`Mẫu quan tâm: ${product.name}`] : []),
    ...(pvcFinish ? [`Bề mặt: ${pvcFinish}`] : []),
    ...(pvcPurchase === 'cat-le' ? ['Hình thức mua: Cắt lẻ theo yêu cầu'] : []),
    ...(pvcPurchase === 'cuon' ? ['Hình thức mua: Nguyên cuộn · 1,2 × 50 m'] : []),
    ...(size ? [`Kích thước: ${size}`] : []),
    ...(area ? [`Khu vực: ${area}`] : []),
  ];

  form.hidden = false;
  if (['san-pham', 'dich-vu', 'dia-ban', 'phuong-xa', 'khu-vuc'].some(key => params.has(key))) {
    requestAnimationFrame(() => document.getElementById('yeu-cau')?.scrollIntoView({ block: 'start' }));
  }
  name.addEventListener('input', () => name.setCustomValidity(''));
  phone.addEventListener('input', () => phone.setCustomValidity(''));

  form.addEventListener('submit', event => {
    event.preventDefault();
    const digits = phone.value.replace(/[^0-9]/g, '');
    phone.setCustomValidity(/^(0\d{9}|84\d{9})$/.test(digits) ? '' : 'Vui lòng nhập số điện thoại Việt Nam hợp lệ.');
    name.setCustomValidity(name.value.trim() ? '' : 'Vui lòng nhập tên người liên hệ.');
    if (!form.reportValidity()) return;

    message.value = [
      'YÊU CẦU ĐẶT HÀNG & DỊCH VỤ IDECAL',
      `Họ tên: ${name.value.trim()}`,
      `Điện thoại: ${phone.value.trim()}`,
      `Nhu cầu: ${service.selectedOptions[0].textContent}`,
      ...context,
      ...(notes.value.trim() ? [`Ghi chú: ${notes.value.trim()}`] : []),
    ].join('\n');
    preview.hidden = false;
    status.textContent = '';
    byId('booking-preview-title').focus();
    preview.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });

  byId<HTMLButtonElement>('booking-copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(message.value);
      status.textContent = 'Đã sao chép. Mở Zalo và dán nội dung để gửi cho iDecal.';
    } catch {
      message.focus();
      message.select();
      status.textContent = 'Hãy sao chép nội dung đang được chọn, sau đó dán vào cuộc trò chuyện Zalo.';
    }
  });
  form.addEventListener('reset', () => {
    phone.setCustomValidity('');
    name.setCustomValidity('');
    preview.hidden = true;
    message.value = '';
    status.textContent = '';
  });
}
