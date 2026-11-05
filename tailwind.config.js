/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: { center: true, padding: '1.25rem', screens: { xl: '1200px', '2xl': '1400px' } },
    extend: {
      colors: {
        primary: 'rgb(var(--c-primary) / <alpha-value>)',
        'primary-dark': 'rgb(var(--c-primary-dark) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        page: 'rgb(var(--c-page) / <alpha-value>)',
        card: 'rgb(var(--c-card) / <alpha-value>)',
      },
      fontFamily: {
        body: ['IBM Plex Sans Arabic', 'system-ui', 'sans-serif'],
        display: ['Noto Kufi Arabic', 'IBM Plex Sans Arabic', 'sans-serif'],
      },
      boxShadow: { card: '0 8px 28px -18px rgb(0 0 0 / .18)', lift: '0 18px 40px -22px rgb(0 0 0 / .28)' },
    },
  },
  plugins: [],
};
