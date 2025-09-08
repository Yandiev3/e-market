/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ugg-primary': '#D2B48C', // бежевый
        'ugg-secondary': '#8B4513', // коричневый
        'ugg-accent': '#A52A2A', // терракотовый
        'ugg-gray': '#F5F5F5', // светлый серый
        'ugg-dark': '#2C1810', // темно-коричневый
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};