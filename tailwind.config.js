/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0F',
        surface: '#13131A',
        border: '#1E1E2E',
        primary: '#E63946',
        blue: '#4CC9F0',
        gold: '#FFD166',
        text: '#F8F9FA',
        muted: '#6C757D',
        // Pillar colors
        health: '#06D6A0',
        money: '#FFD166',
        relationships: '#F72585',
        mental: '#7209B7',
        skills: '#4CC9F0',
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
};
