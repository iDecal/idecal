import { thermalPath } from './service-routes';
import { projectMenuCategories } from './project-types';

interface MenuItem { name: string; href: string }
interface MenuGroup { title?: string; href?: string; items: MenuItem[] }
interface MenuLink extends MenuItem { id: string; groups: MenuGroup[] }

export const aboutHref = '/gioi-thieu-idecal/';
export const contactHref = '/lien-he-idecal/';

export const navLinks: MenuLink[] = [
  { id: 'products', name: 'Sản phẩm', href: '/san-pham/', groups: [
    { title: 'Phim cách nhiệt', href: thermalPath, items: [
      { name: 'Phim cách nhiệt 3M chính hãng', href: '/thuong-hieu/3m/' },
      { name: 'Phim cách nhiệt LLumar', href: '/thuong-hieu/llumar/' },
      { name: 'Phim Nano Ceramic siêu cách nhiệt', href: '/blog/5-lua-chon-phim-cach-nhiet-tai-tphcm-gia-tham-khao/' },
      { name: 'Phim phản quang chống nắng', href: '/san-pham/phim-cach-nhiet-mau-bac-phan-guong/' },
    ] },
    { title: 'Decal dán kính', href: '/decal-mo-dan-kinh/', items: [
      { name: 'Decal dán kính mờ cát', href: '/decal-mo-dan-kinh/#mau-san-pham' },
      { name: 'Decal dán kính 3D vân sóng', href: '/decal-dan-kinh-3d-van-song/' },
      { name: 'Decal hoa văn trang trí kính', href: '/film-trang-tri-kinh/' },
      { name: 'Film bảo vệ kính an toàn', href: '/san-pham/phim-bao-ve-kinh-safety-4ml/' },
    ] },
    { title: 'Film dán nội thất', href: '/film-noi-that/', items: [
      { name: 'Film nội thất vân gỗ', href: '/san-pham/film-dan-noi-that-van-go/' },
      { name: 'Film nội thất vân đá, bê tông', href: '/dich-vu-film-dan-noi-that/#film-van-da' },
      { name: 'Film nội thất đơn sắc & kim loại', href: '/dich-vu-film-dan-noi-that/#film-don-sac' },
      { name: 'Film bảo vệ mặt bàn kính, đá', href: '/film-bao-ve-noi-that/' },
    ] },
    { title: 'Decal quảng cáo', href: '/decal-quang-cao/', items: [
      { name: 'Decal sữa & Decal trong in kỹ thuật số', href: '/blog/so-sanh-decal-sua-trong-va-luoi/' },
      { name: 'Decal PP ngoài trời / trong nhà', href: '/blog/pp-quang-cao/' },
      { name: 'Decal lưới dán kính mặt tiền', href: '/blog/decal-luoi/' },
      { name: 'Decal màu cắt chữ, tem nhãn', href: '/decal-pvc/' },
    ] },
  ] },
  { id: 'services', name: 'Dịch vụ', href: '/dich-vu/thi-cong-decal/', groups: [
    { title: 'Hạng mục thi công', items: [
      { name: 'Dán phim cách nhiệt nhà kính, văn phòng', href: thermalPath },
      { name: 'Dán decal kính mờ, cắt logo & kẻ chỉ', href: '/decal-dan-kinh-van-phong/' },
      { name: 'Dán film nội thất cải tạo tủ, bàn, vách', href: '/dich-vu-film-dan-noi-that/' },
      { name: 'In & Dán decal quảng cáo, cắt chữ lấy liền', href: '/decal-quang-cao/#giai-phap-quang-cao' },
    ] },
    { title: 'Khu vực phục vụ', items: [
      { name: 'Thi công tại TP. Hồ Chí Minh', href: '/khu-vuc/tp-hcm/' },
      { name: 'Thi công tại Bình Dương', href: '/khu-vuc/binh-duong/' },
      { name: 'Thi công tại Nha Trang', href: '/khu-vuc/nha-trang/' },
      { name: 'Thi công tại Quy Nhơn', href: '/khu-vuc/quy-nhon/' },
      { name: 'Thi công tại Đồng Nai & Vũng Tàu', href: '/khu-vuc/#dong-nai-vung-tau' },
    ] },
  ] },
  { id: 'pricing', name: 'Bảng giá', href: '/bang-gia/', groups: [{ items: [
    { name: 'Bảng giá dán phim cách nhiệt', href: '/bang-gia/#gia-phim-cach-nhiet' },
    { name: 'Bảng giá dán decal kính văn phòng', href: '/bang-gia/#gia-decal-mo' },
    { name: 'Bảng giá dán film nội thất', href: '/bang-gia/#gia-film-noi-that' },
    { name: 'Bảng giá in & thi công decal quảng cáo', href: '/decal-quang-cao/#bao-gia-quang-cao' },
  ] }] },
  { id: 'projects', name: 'Dự án', href: '/du-an/', groups: [{ items: projectMenuCategories.map(item => ({
    name: item.name,
    href: `/du-an/?nhom=${item.slug}#cong-trinh`,
  })) }] },
  { id: 'advice', name: 'Góc tư vấn', href: '/blog/', groups: [{ items: [
    { name: 'So sánh vật liệu', href: '/blog/chuyen-muc/so-sanh-vat-lieu/' },
    { name: 'Mẫu thiết kế đẹp', href: '/blog/chuyen-muc/mau-thiet-ke/' },
    { name: 'Hướng dẫn tự dán decal', href: '/blog/video-5-buoc-huong-dan-dan-decal-kinh-don-gian/' },
    { name: 'Về iDecal', href: aboutHref },
  ] }] },
];
