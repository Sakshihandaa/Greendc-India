/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#060913',
          900: '#0b1120',
          850: '#0f172a',
          800: '#162036',
          750: '#1e2945',
          700: '#283556',
        },
        cyber: {
          emerald: '#10b981',
          teal: '#14b8a6',
          cyan: '#06b6d4',
          neon: '#00f59b',
          glow: '#34d399',
        },
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#032512',
        },
        charcoal: {
          800: '#1e293b',
          850: '#172033',
          900: '#0f172a',
          950: '#090d16',
        },
        mint: {
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Space Grotesk', 'Outfit', 'sans-serif'],
        heading: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(16, 185, 129, 0.25)',
        'glow-md': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-lg': '0 0 40px -10px rgba(16, 185, 129, 0.45)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
