import library from './installation-photo-library.json';
export const installationPhotos=library;
export const getInstallationPhotos=(numbers:number[])=>numbers.map(number=>library.find(photo=>photo.number===number)).filter((photo):photo is typeof library[number]=>Boolean(photo));
export const uploadedServicePhotos:Record<string,number[]>={
 'thiet-ke':[24,35,40], 'in-decal':[33,36,39], 'cat-decal':[10,18,35],
 'decal-dan-kinh-van-phong':[18,22,40], 'phim-cach-nhiet':[4,13,34],
 'decal-mo-3d-van-song':[25,27,30], 'decal-quang-cao':[36,39,41],
};
export const uploadedBlogPhotos:Record<string,number[]>={
 'loi-ich-cua-decal-mo-dan-kinh-van-phong':[5,18,22],
 'tieu-chuan-thiet-ke-decal-mo-dan-kinh-van-phong':[10,35,40],
 'bao-gia-thi-cong-dan-decal-kinh-mo-tron-goi':[2,7,23],
 'xu-huong-trang-tri-noi-that-voi-decal-moi-nhat':[25,28,38],
 '5-ly-do-ban-nen-chon-decal-dan-kinh-cho-khong-gian-song':[6,7,14],
 '50-mau-decal-mo-hoa-van-trang-tri-nha-dep':[5,7,26],
 'mau-decal-mo-dan-kinh-van-phong-hr':[16,18,22],
 'loi-ich-cua-decal-dan-kinh-chong-nang':[4,13,34],
 'thi-cong-trang-tri-vm-gian-hang-chuyen-nghiep':[32,33,37],
};
