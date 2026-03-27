/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins-Regular'],
        'poppins-medium': ['Poppins-Medium'],
        'poppins-semibold': ['Poppins-SemiBold'],
        'poppins-bold': ['Poppins-Bold'],
        // Keep Inter aliases pointing to Poppins for backward compat
        'inter': ['Poppins-Regular'],
        'inter-medium': ['Poppins-Medium'],
        'inter-semibold': ['Poppins-SemiBold'],
        'inter-bold': ['Poppins-Bold'],
      },
      colors: {
        primary: '#2563eb',
        positive: '#10b981',
        negative: '#ef4444',
        surface: '#f8fafc',
        card: '#ffffff',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
