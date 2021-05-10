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
      },
      colors: {
        white: '#fff',
        black: '#000',
        primary: '#44D7B6',
        error: '#E15C56',
        success: '#7CD77B',
        warning: '#FFCA4F',
        'primary-dark': '#16BD98',
        'error-dark': '#B83C36',
        'success-dark': '#52B067',
        'warning-dark': '#EC7910',
        'primary-10': 'var(--color-primary-10)',
        'primary-90': 'var(--color-primary-90)',
        'error-10': 'var(--color-error-10)',
        'error-90': 'var(--color-error-90)',
        'success-10': 'var(--color-success-10)',
        'success-90': 'var(--color-success-90)',
        'warning-10': 'var(--color-warning-10)',
        'warning-90': 'var(--color-warning-90)',
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
    },
  },
  variants: {
    extend: {
      borderWidth: ['hover'],
    },
  },
  plugins: [],
}
