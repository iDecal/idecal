export default {
  content: ["./src/**/*.{astro,html,js,ts}"],
  theme: {
    extend: {
      colors: {
        // Base: Tông xám lạnh để tôn màu Vàng và Xanh
        base: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        // Primary: Màu xanh Blue đậm (Professional & Trust)
        primary: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc4fb",
          400: "#38a7f8",
          500: "#0e87e1", // Blue chính
          600: "#0269bc",
          700: "#035398", // Blue đậm cho Header/Hero
          800: "#07477d",
          900: "#0c3b68",
        },
        // Accent: Màu Vàng chuẩn (không bị cam) - High Contrast
        accent: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24", // Vàng sáng
          500: "#facc15", // Vàng thương hiệu chính (Yellow 500)
          600: "#ca8a04", // Vàng đậm để làm viền hoặc text
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
        }
      }
    }
  },
  plugins: []
};
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,ts}"],
  theme: {
    extend: {
      fontFamily: {
        // Ghi đè font mặc định của Tailwind bằng Be Vietnam Pro
        sans: ['"Be Vietnam Pro"', 'sans-serif'],
      },
      colors: {
        // Giữ nguyên bảng màu Blue & Yellow đã tạo ở bước trước
        primary: { ... },
        accent: { ... },
        base: { ... },
      }
    }
  },
  plugins: []
};
