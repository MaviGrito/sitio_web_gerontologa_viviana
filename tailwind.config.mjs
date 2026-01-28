/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#136038',
          main: '#03A63C', 
          light: '#99EBB9',
          DEFAULT: '#136038', // Default primary color
        },
        accent: '#03A63C', // Alias for primary.main
        light: '#99EBB9',  // Alias for primary.light
        white: '#FFFFFF',
        // Semantic color aliases for better developer experience
        'gerontologist': {
          'dark-green': '#136038',
          'accent-green': '#03A63C',
          'light-green': '#99EBB9',
          'white': '#FFFFFF',
        }
      },
      fontFamily: {
        'heading': ['Montserrat', 'sans-serif'],
        'body': ['More Sugar', 'sans-serif'],
        // Aliases for easier use
        'montserrat': ['Montserrat', 'sans-serif'],
        'more-sugar': ['More Sugar', 'sans-serif'],
      },
      fontWeight: {
        'heading': '900', // ExtraBold
        'extrabold': '900',
      },
      // Custom spacing for generous spacing requirement
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Responsive breakpoints
      screens: {
        'xs': '475px',
      },
      // Custom animations for subtle effects
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}