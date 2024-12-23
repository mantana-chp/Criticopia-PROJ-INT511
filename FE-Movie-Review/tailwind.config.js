/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0C0C1F',
        secondary: {
          100: '#242434',
          200: '#3C3C65'
        },
        stars: {
          100: '#FFE078',
          200: '#FFC935'
        },
        errorMsg: {
          100: '#FF6C6C',
          200: '#E00D0D'
        }
      },
      fontFamily: {
        logo: ['Bebas Neue', 'sans-serif']
      }
    }
  },
  plugins: [require('flowbite/plugin')]
}
