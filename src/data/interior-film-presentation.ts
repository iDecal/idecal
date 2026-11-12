import source from './interior-film-original.json' with {type:'json'};

// Keep the imported copy intact and share the added guidance with FAQ schema.
const paragraph=(text:string)=>({text,html:`<p>${text}</p>`});
export const interiorFilmFaqs=[
  ...source.faq.items.map((item,index)=>({
    ...item,
    answer:index===4?[...item.answer,paragraph('Với nhu cầu dán film nội thất HCM, hãy gửi ảnh, kích thước và khu vực lắp đặt để đội ngũ của chúng tôi tư vấn trực tiếp. Để chọn báo giá cạnh tranh trên thị trường, hãy đối chiếu cùng mẫu film, hiện trạng bề mặt và phạm vi công việc.')]:item.answer,
  })),
  {
    question:'Phim dán nội thất và giấy dán tường khác nhau ở đâu?',
    answer:[paragraph('Phim dán nội thất thường được chọn để làm mới tủ, cửa, vách hoặc quầy; giấy dán tường chủ yếu dùng cho tường trang trí. Khả năng bám dính và độ bền phụ thuộc vật liệu nền, lớp hoàn thiện và từng sản phẩm. Cần kiểm tra mẫu trên bề mặt thực tế trước khi lựa chọn.')],
  },
  {
    question:'Sau khi thi công, cần vệ sinh và bảo quản film như thế nào?',
    answer:[paragraph('Sau khi bàn giao, sử dụng các loại khăn mềm và dung dịch vệ sinh phù hợp theo hướng dẫn của hãng để bảo vệ bề mặt film. Tránh vật sắc, miếng chà nhám, hóa chất mạnh và nguồn nhiệt trực tiếp; không cạy mép film khi vệ sinh. Thời gian chờ vệ sinh và điều kiện bảo quản cần theo hướng dẫn của đúng mẫu film.')],
  },
];
