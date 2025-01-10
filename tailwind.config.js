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
      }
    },
  },
  plugins: [],
}

