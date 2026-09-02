/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          50:  '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#0E7490', // Cyan-700 from target site
          600: '#0891b2',
          700: '#06b6d4',
          800: '#155e75',
          900: '#164e63',
        },
        dark: {
          bg:      '#0A0D0F', // Very dark slate
          surface: '#11161A',
          card:    '#1A2026',
          border:  '#2C3640',
        },
        light: {
          bg:      '#F4FBFD', // Ice white
          surface: '#FFFFFF',
          card:    '#FFFFFF',
          border:  '#E2E8F0',
        },
        hud: '#06b6d4',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'swing': 'swing 3s ease-in-out infinite alternate',
      },
      keyframes: {
        swing: {
          '0%': { transform: 'rotate(3deg)' },
          '100%': { transform: 'rotate(-3deg)' },
        }
      }
    },
  },
  plugins: [],
}
