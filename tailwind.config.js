/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // ✅ يغطي كل الملفات داخل app
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        brandPink: "#ff69b4",
        lightPink: "#fff0f5",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
