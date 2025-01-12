/** @type {import('tailwindcss').Config} */
import { colors } from './src/properties/colors';

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: colors.navy,
        yellow: colors.yellow,
        gray: colors.gray,
        naverGreen: colors.naverGreen,
        navyDark: colors.navyDark,
      },
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
        inter: ['inter', 'sans-serif']
      },
      fontSize: {
        'size.title': '7.5rem',
        'size.mid': '5rem',
        'size.startButton': '1.8rem',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
}