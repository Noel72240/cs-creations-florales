/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mauve: {
          DEFAULT: '#C07A97',
          light: '#F0D2DD',
          dark: '#8B4B6A',
          pale: '#FFF8FB',
          rose: '#F7E9EF',
        },
      },
      fontFamily: {
        script: ['"Great Vibes"', 'cursive'],
        body: ['"Great Vibes"', 'cursive'],
        heading: ['"Great Vibes"', 'cursive'],
        /** Même manuscrite élégante que le reste du site (Great Vibes) */
        refined: ['"Great Vibes"', 'cursive'],
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
