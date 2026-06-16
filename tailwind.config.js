/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFF9E6',
          100: '#FFF0B3',
          200: '#FFE680',
          300: '#FFDB4D',
          400: '#FFD11A',
          500: '#D4A017',
          600: '#B8860B',
          700: '#8B6914',
          800: '#5E4C0E',
          900: '#312A08',
        },
        dark: {
          50: '#2A2A35',
          100: '#252530',
          200: '#1F1F2A',
          300: '#1A1A24',
          400: '#15151E',
          500: '#101018',
          600: '#0C0C14',
          700: '#08080E',
          800: '#05050A',
          900: '#020205',
        },
      },
    },
  },
  plugins: [],
};
