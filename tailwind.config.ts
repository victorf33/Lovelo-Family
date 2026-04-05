import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B0B0B',
          dark: '#000000',
        },
        surface: {
          DEFAULT: '#1A1A1A',
          elevated: '#2B2B2B',
          card: '#222222',
        },
        border: {
          DEFAULT: '#CFCFCF',
          subtle: '#333333',
          muted: '#2B2B2B',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#EAEAEA',
          muted: '#888888',
          disabled: '#555555',
        },
        accent: {
          DEFAULT: '#FFFFFF',
          hover: '#EAEAEA',
        },
        danger: '#EF4444',
        success: '#22C55E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'premium': '0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)',
        'panel': '2px 0 20px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
} satisfies Config
