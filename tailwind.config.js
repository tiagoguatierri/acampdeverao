/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        twine: {
          50: '#f9f5ed',
          100: '#f0e5d1',
          200: '#e2cba6',
          300: '#d1a873',
          400: '#c69156',
          500: '#b3773f',
          600: '#9a5d34',
          700: '#7c452c',
          800: '#683a2b',
          900: '#5a3329',
          950: '#341914',
        },
      },
    },
  },
  plugins: [],
};
