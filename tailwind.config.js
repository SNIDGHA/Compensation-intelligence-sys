/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#090d16',
        foreground: '#f8fafc',
        card: '#111827',
        border: '#1f2937',
        primary: '#10b981',
        secondary: '#6366f1',
        muted: '#64748b',
        slate: {
          850: '#1e293b80', // Glass panels
          950: '#030712',
        },
        emerald: {
          450: '#34d399',
        },
        rose: {
          450: '#fb7185',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
        mono: ['var(--font-mono)', 'ui-mono-serif', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
