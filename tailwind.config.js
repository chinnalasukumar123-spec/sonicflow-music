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
        background: '#0B0F19',
        foreground: '#F8FAFC',
        card: {
          DEFAULT: '#111827',
          foreground: '#F8FAFC',
          hover: '#1F293D',
        },
        primary: {
          DEFAULT: '#1DB954',
          foreground: '#000000',
          hover: '#1ed760',
        },
        secondary: {
          DEFAULT: '#8B5CF6',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#EC4899',
          foreground: '#FFFFFF',
        },
        telugu: {
          gold: '#F59E0B',
          flame: '#EF4444',
          cyan: '#06B6D4',
          emerald: '#10B981',
          purple: '#A855F7',
        },
        muted: {
          DEFAULT: '#1E293B',
          foreground: '#94A3B8',
        },
        border: '#1E293B',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        telugu: ['Gautami', 'Mandali', 'Ramabhadra', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'sound-wave': 'soundwave 1.2s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        soundwave: {
          '0%, 100%': { height: '6px' },
          '50%': { height: '24px' },
        }
      }
    },
  },
  plugins: [],
}
