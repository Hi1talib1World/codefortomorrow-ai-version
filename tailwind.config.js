/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./index.tsx",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F8FDFF',
          100: '#F0F9FF',
          200: '#E0F2FE',
          300: '#BAE6FD',
          400: '#7DD3FC',
          500: '#38BDF8', // Lighter, friendlier blue
          600: '#0EA5E9',
          700: '#0284C7',
          800: '#0369A1',
          900: '#075985',
          DEFAULT: '#38BDF8',
          light: '#7DD3FC',
          dark: '#0EA5E9',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
