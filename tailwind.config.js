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
          50: '#F4FAFA',
          100: '#E4F3F3',
          200: '#CBEBEB',
          300: '#A1DBDB',
          400: '#73C6C6',
          500: '#58C6C8', // User Requested Main Color
          600: '#40A0A3',
          700: '#348083',
          800: '#2D686B',
          900: '#295759',
          DEFAULT: '#58C6C8',
          light: '#A1DBDB',
          dark: '#348083',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
