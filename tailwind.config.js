/** @type {import('tailwindcss').Config} */
import { colors } from './src/pages/colors';

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: colors.navy,
        yellow: colors.yellow,
        gray: colors.gray,
      },
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
        inter: ['inter', 'sans-serif']
      },
      fontSize: {
        'size.title': '7.5rem',
        'size.startButton': '2rem',
      },

    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
}