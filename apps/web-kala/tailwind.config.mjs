/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        kala: {
          peach: '#FFBE9C',
          'peach-2': '#FFD9C4',
          'peach-3': '#FFEFE5',
          cream: '#FFF9F4',
          ink: '#4B2E22',
          muted: '#86675A',
          accent: '#B3471E',
          line: '#F6DCCD',
          wa: '#0E733D',
          'wa-dark': '#0B582F',
        },
      },
      fontFamily: {
        brand: ['Fredoka', 'Nunito', 'system-ui', 'sans-serif'],
        sans: ['Nunito', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        kala: '0 8px 30px rgba(194, 85, 43, 0.08)',
        'kala-hover': '0 12px 36px rgba(194, 85, 43, 0.14)',
      },
    },
  },
  plugins: [],
};
