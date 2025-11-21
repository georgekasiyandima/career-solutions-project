/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        brandDarkTeal: '#1a3c34', // Primary background color
        'brandDarkTeal-hover': '#16352B', // Adjusted to match HeroSection hover
        brandGreen: {
          default: '#2E7D32', // Updated to match gradient's green, replacing #34c759
          hover: '#276749', // Adjusted darker green for hover, replacing #28a745
        },
        brandWhite: '#ffffff', // Consistent text color
      },
      boxShadow: {
        soft: '0 4px 6px rgba(0, 0, 0, 0.1)',
        deep: '0 6px 12px rgba(0, 0, 0, 0.2)', // Added for shadow-deep usage in AboutUs
      },
      lineClamp: {
        3: '3',
      },
    },
  },
  plugins: [],
};