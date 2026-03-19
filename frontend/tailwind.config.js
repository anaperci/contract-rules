/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: '#1F4067',
          hover: '#2A5080',
          active: '#355F99',
        },
        accent: {
          DEFAULT: '#5B8DEF',
          light: '#7FA8F5',
          dark: '#3D6FD1',
        },
        surface: {
          bg: '#F4F6FB',
          card: '#FFFFFF',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Source Sans 3', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
