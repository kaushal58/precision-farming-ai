/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        accent: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        danger: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        warn: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        info: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        surface: {
          light: 'rgba(255,255,255,0.75)',
          dark:  'rgba(6,13,20,0.80)',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(ellipse at 20% 50%, rgba(34,197,94,0.18) 0%, transparent 60%),' +
          'radial-gradient(ellipse at 80% 20%, rgba(14,165,233,0.12) 0%, transparent 50%),' +
          'linear-gradient(160deg, #060d14 0%, #0a1628 50%, #0d1f12 100%)',
        'card-gradient':
          'linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(14,165,233,0.06) 100%)',
        'brand-gradient':
          'linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #34d399 100%)',
        'accent-gradient':
          'linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)',
        'danger-gradient':
          'linear-gradient(135deg, #e11d48 0%, #f43f5e 50%, #fb7185 100%)',
        'warn-gradient':
          'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)',
        'mesh-gradient':
          'radial-gradient(at 40% 20%, rgba(34,197,94,0.15) 0px, transparent 50%),' +
          'radial-gradient(at 80% 0%,  rgba(14,165,233,0.10) 0px, transparent 50%),' +
          'radial-gradient(at 0%  50%, rgba(139,92,246,0.08) 0px, transparent 50%),' +
          'radial-gradient(at 80% 50%, rgba(245,158,11,0.06) 0px, transparent 50%),' +
          'radial-gradient(at 0%  100%,rgba(34,197,94,0.10) 0px, transparent 50%)',
      },
      boxShadow: {
        'glow-brand':  '0 0 32px rgba(34, 197, 94, 0.35)',
        'glow-accent': '0 0 32px rgba(14, 165, 233, 0.35)',
        'glow-danger': '0 0 32px rgba(244, 63, 94, 0.35)',
        'glow-warn':   '0 0 32px rgba(245, 158, 11, 0.35)',
        'glow-info':   '0 0 32px rgba(139, 92, 246, 0.35)',
        'card':        '0 4px 24px rgba(0,0,0,0.08)',
        'card-hover':  '0 16px 48px rgba(0,0,0,0.14)',
        'inner-brand': 'inset 0 0 20px rgba(34,197,94,0.08)',
      },
      animation: {
        'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':       'float 6s ease-in-out infinite',
        'shimmer':     'shimmer 2s linear infinite',
        'glow-pulse':  'glowPulse 2.5s ease-in-out infinite',
        'slide-up':    'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in':     'fadeIn 0.4s ease forwards',
        'spin-slow':   'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(34,197,94,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(34,197,94,0.6)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
