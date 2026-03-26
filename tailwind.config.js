/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5', // Indigo 600
        secondary: '#10B981', // Emerald 500
        accent: '#F59E0B', // Amber 500
        background: '#020617', // Slate 950 (Neural Dark)
        surface: '#FFFFFF',
        text: '#1F2937', // Gray 800
        textLight: '#6B7280', // Gray 500
      },
      fontFamily: {
        'inter': 'Inter-Regular',
        'inter-semibold': 'Inter-SemiBold',
        'inter-bold': 'Inter-Bold',
        'outfit': 'Outfit-Regular',
        'outfit-semibold': 'Outfit-SemiBold',
        'outfit-bold': 'Outfit-Bold',
        'grenze': 'GrenzeGotisch-Regular',
        'grenze-semibold': 'GrenzeGotisch-SemiBold',
        'grenze-bold': 'GrenzeGotisch-Bold',
        'grenze-black': 'GrenzeGotisch-Black',
        'cinzel': 'Cinzel-Regular',
        'cinzel-semibold': 'Cinzel-SemiBold',
        'cinzel-bold': 'Cinzel-Bold',
        'cinzel-black': 'Cinzel-Black',
      },
    },
  },
  plugins: [],
}
