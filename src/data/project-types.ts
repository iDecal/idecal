// Shared categories for content validation and the portfolio filters.
export const projectTypes = [
  'Văn phòng',
  'Nhà ở dân dụng',
  'Bệnh viện',
  'Trung tâm thương mại',
  'Showroom',
  'Phòng khám',
  'Khách sạn & nhà hàng',
  'Trường học',
  'Sự kiện',
  'Khác',
] as const;

export const projectMenuCategories = [
  { slug: 'van-phong', name: 'Công trình Văn phòng', category: 'Văn phòng' },
  { slug: 'nha-o-chung-cu', name: 'Công trình Nhà ở & Chung cư', category: 'Nhà ở dân dụng' },
  { slug: 'showroom-cua-hang', name: 'Công trình Showroom & Cửa hàng', category: 'Showroom' },
] as const;
