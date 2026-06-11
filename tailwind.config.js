/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', lg: '2rem' },
      screens: { '2xl': '1200px' },
    },
    extend: {
      colors: {
        parchment: '#FAF5EC',
        sand: {
          50: '#FBF7EF',
          100: '#F4EAD7',
          200: '#E9D9BC',
          300: '#DCC399',
        },
        ink: {
          DEFAULT: '#221C14',
          soft: '#5C5446',
          faint: '#8A8273',
        },
        clay: {
          DEFAULT: '#A8472A',
          dark: '#8A3A22',
          light: '#C5673F',
        },
        teal: {
          DEFAULT: '#14564E',
          dark: '#0E423B',
          light: '#2C766C',
        },
        gold: {
          DEFAULT: '#C2A14D',
          dark: '#A2853A',
          light: '#D8BE74',
        },
      },
      fontFamily: {
        display: ['Amiri', 'Reem Kufi', 'Georgia', 'serif'],
        body: ['Tajawal', 'system-ui', 'sans-serif'],
        kufi: ['"Reem Kufi"', 'Tajawal', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(34,28,20,0.04), 0 8px 24px -12px rgba(34,28,20,0.18)',
        lift: '0 12px 40px -16px rgba(34,28,20,0.35)',
        inset: 'inset 0 0 0 1px rgba(34,28,20,0.06)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      backgroundImage: {
        'arabesque':
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23A8472A' stroke-opacity='0.06' stroke-width='1'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3Ccircle cx='30' cy='30' r='12'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fade-in 0.8s ease both',
      },
    },
  },
  plugins: [],
};
