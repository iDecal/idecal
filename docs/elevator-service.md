# Dịch vụ dán decal thang máy

URL mới: /dan-decal-thang-may/.
Trang con về nội dung của Decal quảng cáo; hai trang cha /decal-quang-cao/
và /dich-vu/decal-quang-cao/ có thẻ dẫn vào. Giữ nguyên trang bảng hiệu và bài
Blog /blog/dan-decal-thang-may-giai-phap-refresh-khong-gian/.

Nội dung mới trong src/data/elevator-service.json theo yêu cầu chủ website:

- Film nội thất: phối vân/màu, khảo sát nền, xử lý mép và liên kết catalogue.
- Decal in quảng cáo: thiết kế, chọn cách in/cán, chia bản theo cánh cửa.
- Ba nhóm bề mặt, báo giá theo hiện trạng, quy trình năm bước và bốn FAQ.
- Liên kết tư vấn dùng dich-vu=thi-cong-decal để chọn đúng dịch vụ trong form.

Ảnh lấy từ nội dung website đang có, đã xem trực quan:

- dd5df887a7c23883100d.jpg: decal quảng cáo trên cụm cửa thang máy.
- a2f9f181cefe59b99fd7.jpg: quảng cáo LALAMOVE trên cửa thang máy.
- images/film-noi-that/dan-film-noi-that-thang-may.jpg: phối vân khu vực cửa thang.

Không dùng ảnh 4d5fe254a5aa077c53e1.jpg làm ảnh thang máy vì kiểm tra trực quan
cho thấy thao tác trên mặt bàn. Không tự thêm giá, thời gian hoàn thành,
thời hạn bảo hành hoặc thành tích thi công không có căn cứ. Thư viện là hình
ảnh tham khảo ứng dụng, không tự tạo hồ sơ dự án hoặc địa chỉ mới.

Nền trắng, chữ xanh, vàng cát dùng nhẹ; card giải pháp, quy trình có số,
FAQ đóng mặc định, ảnh bấm xem lớn. Schema BreadcrumbList/Service/FAQPage khớp
nội dung. Sitemap tự thêm URL mới qua quy trình build hiện có.

Kiểm tra: npm run check; npm test (gồm check-elevator.mjs);
với Astro dev ở cổng 4321, chạy python3 scripts/test-elevator.py.
