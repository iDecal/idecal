interface BookingProduct { slug: string; name: string; service?: string; pvc?: boolean; }
const form = document.querySelector<HTMLFormElement>('#booking-form');
if (form) {
  form.hidden = false;
  const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
  const name = byId<HTMLInputElement>('booking-name');
  const phone = byId<HTMLInputElement>('booking-phone');
  const service = byId<HTMLSelectElement>('booking-service');
  const region = byId<HTMLSelectElement>('booking-region');
  const address = byId<HTMLInputElement>('booking-address');
  const ward = byId<HTMLSelectElement>('booking-ward');
  const wardGroup = byId<HTMLElement>('booking-ward-group');
  const district = byId<HTMLSelectElement>('booking-district');
  const districtGroup = byId<HTMLElement>('booking-district-group');
  const date = byId<HTMLInputElement>('booking-date');
  const time = byId<HTMLSelectElement>('booking-time');
  const size = byId<HTMLInputElement>('booking-size');
  const notes = byId<HTMLTextAreaElement>('booking-notes');
  const finish = byId<HTMLSelectElement>('booking-finish');
  const pvcType = byId<HTMLSelectElement>('booking-pvc-type');
  const preview = byId<HTMLElement>('booking-preview');
  const message = byId<HTMLTextAreaElement>('booking-message');
  const status = byId<HTMLElement>('booking-copy-status');
  const products: BookingProduct[] = JSON.parse(document.getElementById('booking-product-data')?.textContent ?? '[]');
  const params = new URLSearchParams(location.search);
  const product = products.find(item => item.slug === params.get('san-pham'));
  const desiredRegion=params.get('khu-vuc');
  const desiredDistrict=params.get('dia-ban');
  const desiredWard=params.get('phuong-xa');
  const validWard=desiredWard && Array.from(ward.options).some(option=>option.value===desiredWard);
  const validDistrict=desiredDistrict && Array.from(district.options).some(option=>option.value===desiredDistrict);
  if (desiredRegion && Array.from(region.options).some(option=>option.value===desiredRegion)) {
    region.value=desiredRegion;region.selectedOptions[0].defaultSelected=true;
  } else if (!desiredRegion && (validDistrict || validWard)) {
    region.value='tp-hcm';region.selectedOptions[0].defaultSelected=true;
  }
  const updateDistrict=()=>{
    const enabled=region.value==='tp-hcm';
    wardGroup.hidden=!enabled;ward.disabled=!enabled;
    districtGroup.hidden=!enabled || !validDistrict || Boolean(ward.value);district.disabled=!enabled;
    if (!enabled) { district.value='';ward.value=''; }
  };
  updateDistrict();
  if (region.value==='tp-hcm' && validDistrict) {
    district.value=desiredDistrict!;district.selectedOptions[0].defaultSelected=true;
  }
  if (region.value==='tp-hcm' && validWard) {
    ward.value=desiredWard!;ward.selectedOptions[0].defaultSelected=true;
  }
  updateDistrict();
  region.addEventListener('change',updateDistrict);
  ward.addEventListener('change',updateDistrict);

  if (params.has('san-pham') || params.has('dich-vu') || params.has('dia-ban') || params.has('phuong-xa') || params.has('khu-vuc')) {
    requestAnimationFrame(() => document.getElementById('yeu-cau')?.scrollIntoView({block:'start'}));
  }
  const requestedService = params.get('dich-vu') || product?.service;
  const legacyServices: Record<string,string> = { 'decal-dan-kinh-van-phong':'thi-cong-decal', 'phim-cach-nhiet':'thi-cong-decal', 'decal-mo-3d-van-song':'thi-cong-decal', 'film-noi-that':'thi-cong-decal', 'decal-quang-cao':'in-decal' };
  const desiredService = requestedService ? legacyServices[requestedService] || requestedService : undefined;
  if (desiredService && Array.from(service.options).some(option => option.value === desiredService)) {
    service.value = desiredService;
    service.selectedOptions[0].defaultSelected = true;
  }
  if (product) {
    byId<HTMLElement>('booking-product-info').hidden = false;
    byId<HTMLElement>('booking-product-name').textContent = product.name;
    byId<HTMLAnchorElement>('booking-product-link').href = `/san-pham/${encodeURIComponent(product.slug)}`;
  }
  if (product?.pvc) {
    byId<HTMLElement>('booking-pvc-options').hidden = false;
    finish.disabled = false; finish.required = true; pvcType.disabled = false;
    const requestedFinish = params.get('be-mat');
    if (requestedFinish === 'bong' || requestedFinish === 'nham') {
      finish.value = requestedFinish;
      finish.selectedOptions[0].defaultSelected = true;
    }
    if (params.get('hinh-thuc') === 'cat-le') {
      pvcType.value = 'cat-le';
      pvcType.selectedOptions[0].defaultSelected = true;
      size.value = (params.get('kich-thuoc') ?? '').trim().slice(0,160);
      size.defaultValue = size.value;
    }
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
      'YÊU CẦU ĐẶT HÀNG & DỊCH VỤ IDECAL',
      `Họ tên: ${name.value.trim()}`,
      `Điện thoại: ${phone.value.trim()}`,
      `Nhu cầu: ${service.selectedOptions[0].textContent}`,
      ...(product ? [`Mẫu quan tâm: ${product.name}`] : []),
      ...(product?.pvc ? [`Bề mặt: ${finish.selectedOptions[0].textContent}`, `Hình thức mua: ${pvcType.selectedOptions[0].textContent}`, 'Quy cách cuộn: 1,2 × 50 m'] : []),
      `Khu vực: ${region.selectedOptions[0].textContent}`,
      ...(region.value==='tp-hcm' && ward.value ? [`Phường/xã: ${ward.selectedOptions[0].textContent}`] : []),
      ...(region.value==='tp-hcm' && !ward.value && district.value ? [`Địa bàn: ${district.selectedOptions[0].textContent}`] : []),
      `Địa chỉ nhận hàng / công trình: ${address.value.trim()}`,
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
    requestAnimationFrame(updateDistrict);
    phone.setCustomValidity(''); name.setCustomValidity(''); address.setCustomValidity('');
    preview.hidden = true;
    message.value = ''; status.textContent = '';
  });
}
