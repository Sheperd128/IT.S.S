/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        itss: {
          black: '#050505',
          dark: '#121212',
          gray: '#2a2a2a',
          white: '#f5f5f5',
          // THE FIX: Tailwind will now read these directly from the browser's memory!
          primary: 'rgb(var(--color-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
          success: 'rgb(var(--color-success) / <alpha-value>)',
          warning: 'rgb(var(--color-warning) / <alpha-value>)',
          danger: 'rgb(var(--color-danger) / <alpha-value>)',
          orange: 'rgb(var(--color-orange) / <alpha-value>)',
        }
      },
      fontFamily: {
        stencil: ['Stencil', 'sans-serif'], 
        consolas: ['Consolas', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'magazine': '4px 4px 0px 0px rgb(var(--color-primary))', 
        'magazine-dark': '4px 4px 0px 0px rgba(0, 0, 0, 1)', 
        'neon': '0 0 10px rgb(var(--color-primary) / 0.3), 0 0 20px rgb(var(--color-primary) / 0.15)',
      }
    },
  },
  plugins: [],
}