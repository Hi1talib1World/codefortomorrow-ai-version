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
        sans: ['Inter', 'sans-serif'],
      },
      backdropSaturate: {
        150: '1.5',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '15%, 45%, 75%': { transform: 'rotate(-8deg)' },
          '30%, 60%, 90%': { transform: 'rotate(8deg)' },
        },
      },
      animation: {
        shake: 'shake 0.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
