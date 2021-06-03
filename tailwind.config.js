module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontSize: {
      '2xs': ['10px', '14px'],
      xs: ['12px', '16px'],
      sm: ['14px', '18px'],
      base: ['16px', '22px'],
      lg: ['20px', '28px'],
      xl: ['28px', '36px'],
      '2xl': ['32px', '40px'],
    },
    extend: {
      spacing: {
        15: '3.75rem',
        50: '12.5rem',
        70: '17.5rem',
        100: '25rem',
        110: '27.5rem',
      },
      borderRadius: {
        '2.5xl': '1.25rem',
      },
      boxShadow: {
        1: '0px 4px 6px rgba(0, 0, 0, 0.12)',
        2: '0px 6px 16px rgba(0, 0, 0, 0.08)',
        3: '0px 8px 36px rgba(0, 0, 0, 0.06)',
        common: '2px 8px 44px #E3EDFF',
      },
      colors: {
        white: '#fff',
        black: '#000',
        primary: '#44d7B6',
        error: '#e15c56',
        success: '#7cd77b',
        warning: '#ffca4f',
        info: '#4c65e9',
        'primary-dark': '#16bd98',
        'error-dark': '#b83c36',
        'success-dark': '#52b067',
        'warning-dark': '#ec7910',
        'info-dark': '#2330c0',
        'primary-10': 'var(--color-primary-10)',
        'primary-90': 'var(--color-primary-90)',
        'error-10': 'var(--color-error-10)',
        'error-90': 'var(--color-error-90)',
        'success-10': 'var(--color-success-10)',
        'success-90': 'var(--color-success-90)',
        'warning-10': 'var(--color-warning-10)',
        'warning-90': 'var(--color-warning-90)',
        'info-10': 'var(--color-info-10)',
        'info-90': 'var(--color-info-90)',
        'gray-0': 'var(--color-gray-0)',
        'gray-4': 'var(--color-gray-4)',
        'gray-10': 'var(--color-gray-10)',
        'gray-20': 'var(--color-gray-20)',
        'gray-40': 'var(--color-gray-40)',
        'gray-60': 'var(--color-gray-60)',
        'gray-80': 'var(--color-gray-80)',
        'gray-90': 'var(--color-gray-90)',
        'gray-96': 'var(--color-gray-96)',
        'gray-100': 'var(--color-gray-100)',
      },
      fontFamily: {
        body: [
          'Circular Std',
          'PingFang SC',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      keyframes: {
        'move-left': {
          '0%': {
            transform: 'translateX(100%)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
        'move-down': {
          '0%': {
            transform: 'translateY(-100%)',
          },
          '100%': {
            transform: 'translateY(0)',
          },
        },
        'move-up': {
          '0%': {
            transform: 'translateY(0)',
          },
          '100%': {
            transform: 'translateY(100%)',
          },
        },
      },
      animation: {
        'move-left': 'move-left 0.2s ease-in-out 1',
        'move-down': 'move-down 0.2s ease-in-out 1',
        'move-up': 'move-up 0.2s ease-in-out 1',
      },
    },
  },
  variants: {
    extend: {
      borderWidth: ['hover'],
    },
  },
  plugins: [],
}
