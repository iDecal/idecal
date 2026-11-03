export interface ServicePresentation {
  title: string;
  introduction: string;
  category: string;
  productSlugs?: string[];
  photos: { src: string; caption: string }[];
}
export const servicePresentation: Record<string, ServicePresentation> = {
  'decal-dan-kinh-van-phong': {
    title: 'Riêng tư vừa đủ. Không gian vẫn kết nối.',
    introduction: 'Từ vách phòng họp đến cửa ra vào, phối hợp Decal mờ, đường kẻ và logo để không gian có dấu ấn riêng.',
    category: 'decal-mo-dan-kinh',
    photos: [
      { src: '/images/cong-trinh/thi-cong-decal-dan-kinh-quan-9.jpg', caption: 'Thi công Decal trên vách kính' },
      { src: '/images/cong-trinh/Trang-tri-kinh-phong-kham-FDcare.png', caption: 'Trang trí kính kết hợp nhận diện thương hiệu' },
      { src: '/images/catalogue/decal-mo-ke-soc-ngang.jpg', caption: 'Họa tiết sọc cân bằng độ che phủ' },
    ],
  },
  'phim-cach-nhiet': {
    title: 'Đón ánh sáng. Giảm nắng gắt.',
    introduction: 'Chọn phim theo hướng nắng, loại kính và nhu cầu nhìn ra bên ngoài. Xem hình ảnh ứng dụng trước khi trao đổi về công trình.',
    category: 'phim-cach-nhiet',
    productSlugs: ['phim-cach-nhiet-rs20', 'phim-cach-nhiet-mau-khoi-trung-tinh', 'phim-cach-nhiet-xanh-duong-phan-guong', 'phim-cach-nhiet-mau-bac-phan-guong'],
    photos: [
      { src: '/images/phim-cach-nhiet/Thi-cong-dan-phim-cach-nhiet-van-phong-cong-ty.webp', caption: 'Thi công phim cho kính văn phòng' },
      { src: '/images/Banner/So sánh khi dán phim cách nhiệt.avif', caption: 'Minh họa hiệu ứng trước và sau khi dán phim' },
      { src: '/images/Banner/Decal dán kính văn Phòng.webp', caption: 'Ứng dụng trên hệ vách kính' },
    ],
  },
  'decal-mo-3d-van-song': {
    title: 'Thêm chiều sâu cho từng ô kính.',
    introduction: 'Khám phá bề mặt vân sóng trong suốt và màu trà. Phối mẫu theo ánh sáng, màu nội thất và mức độ riêng tư mong muốn.',
    category: 'decal-mo-dan-kinh',
    productSlugs: ['decal-mo-3d-van-song', 'decal-dan-kinh-mau-tra-hoa-tiet-song-3d', 'decal-trong-suot-song-3d-dan-kinh'],
    photos: [
      { src: '/images/decal-song-3d/Decal-dan-kinh-song-trong-suot-3D-song-to.webp', caption: 'Vân sóng trong suốt · bản lớn' },
      { src: '/images/decal-song-3d/Decal-van-song-3D-mau-tra-song-to.webp', caption: 'Vân sóng màu trà' },
      { src: '/images/decal-song-3d/Decal-dan-kinh-song-trong-suot-co-nho-3D.jpg', caption: 'Cận cảnh bề mặt sóng nhỏ' },
    ],
  },
  'cat-decal': {
    title: 'Từ nét chữ đến dấu ấn thương hiệu.',
    introduction: 'Logo, chữ và tem nhãn được gia công theo thiết kế. Chọn mẫu gợi ý rồi gửi kích thước, nội dung để trao đổi phương án phù hợp.',
    category: 'cat-va-in-logo',
    productSlugs: ['decal-mo-cat-logo-thuong-hieu', 'decal-logo-cong-ty', 'decal-welcome-dan-kinh-chao-mung-khach-hang', 'decal-thong-bao-gio-mo-cua'],
    photos: [
      { src: '/images/Banner/decal-cat-chu-trang-tri-quang-cao.jpg', caption: 'Gia công chữ và hình cắt theo thiết kế' },
      { src: '/images/decal-quang-cao/gioi-thieu-idecal.jpeg', caption: 'Chuẩn bị Decal cho nhận diện và trang trí' },
      { src: '/images/cong-trinh/Trang-tri-kinh-phong-kham-FDcare.png', caption: 'Ứng dụng nhận diện trên cửa kính' },
    ],
  },
  'film-noi-that': {
    title: 'Bề mặt mới. Cảm hứng mới.',
    introduction: 'Tham khảo vân gỗ, vân vải và bề mặt kim loại trong những không gian khác nhau trước khi chọn mẫu cho nội thất.',
    category: 'film-noi-that',
    productSlugs: ['film-dan-noi-that-van-go', 'film-dan-noi-that-van-vai', 'film-dan-noi-that-van-xi-mang', 'film-dan-noi-that-van-kim-loai'],
    photos: [
      { src: '/images/film-noi-that/dan-film-noi-that-mat-ban.jpg', caption: 'Làm mới bề mặt bàn và nội thất' },
      { src: '/images/film-noi-that/dan-film-noi-that-thang-may.jpg', caption: 'Hoàn thiện bề mặt thang máy' },
      { src: '/images/film-noi-that/dan-film-noi-that-van-vai-phong-ngu.jpeg', caption: 'Vân vải cho không gian ấm áp' },
    ],
  },
  'decal-quang-cao': {
    title: 'Biến bề mặt thành điểm chạm thương hiệu.',
    introduction: 'Kính cửa hàng, mặt tiền showroom hay standee đều có thể truyền tải thông điệp rõ ràng với thiết kế và vật liệu phù hợp.',
    category: 'decal-quang-cao-standee',
    photos: [
      { src: '/images/cong-trinh/Thi công Decal lưới dán kính showroom GEELY tại Bình Dương.jpg', caption: 'Decal lưới trên kính showroom GEELY' },
      { src: '/images/cong-trinh/thi-cong-dan-decal-luoi-mat-tien-toyota-tan-binh.jpg', caption: 'Quảng cáo mặt tiền Toyota Tân Bình' },
      { src: '/images/decal-quang-cao/Decal-quang-cao.webp', caption: 'Hình ảnh ứng dụng Decal quảng cáo' },
    ],
  },
};
