import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-manrope)', 'sans-serif'], // ИЗМЕНЕНИЕ: используем переменную шрифта
      },
      // ИЗМЕНЕНИЕ: Добавляем новую палитру
      colors: {
        background: '#111111',
        foreground: '#F5F5F5',
        'foreground-dark': '#A3A3A3',
        accent: {
          DEFAULT: '#E0B84C',
          hover: '#C8A441',
        },
        border: '#262626',
        card: '#1A1A1A',
      }
    },
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [],
}

export default config
