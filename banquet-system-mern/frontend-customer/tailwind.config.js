/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'oberoi-navy': '#2B2457',
        'oberoi-gold': '#D87A31',
        'oberoi-cream': '#F8F5F0',
        'oberoi-white': '#FFFFFF',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
