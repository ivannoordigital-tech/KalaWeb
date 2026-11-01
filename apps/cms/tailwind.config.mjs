/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/components/admin/builder/**/*.{js,ts,jsx,tsx}',
    './src/components/admin/**/*.{js,ts,jsx,tsx}',
  ],
  corePlugins: {
    preflight: false, // JANGAN reset elemen default Payload CMS agar dashboard native tetap utuh
  },
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
    },
  },
  plugins: [],
};
