export default {
  content: ["./src/**/*.{astro,html,js,ts}"],
  theme: {
    extend: {
      colors: {
        // Base: Chuyển từ tông xanh lá cũ sang tông xám trung tính/lạnh sạch sẽ hơn
        base: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
        // Primary: Màu xanh thương hiệu iDecal (Professional Blue)
        primary: {
          50: "#eff6ff",
          400: "#3b82f6",
          500: "#1d4ed8", // Màu chủ đạo chuẩn
          600: "#1e40af",
          700: "#1d3a8a",
        },
        // Accent: Màu cam/vàng nhấn mạnh (Decal Highlight)
        accent: {
          400: "#fbbf24",
          500: "#f59e0b", // Màu nhấn (Call to action)
          600: "#d97706",
        }
      }
    }
  },
  plugins: []
};
