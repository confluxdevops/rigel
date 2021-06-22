module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  mode: 'jit',
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
        24.5: '6.125rem',
        26.5: '6.625rem',
        50: '12.5rem',
        63: '15.75rem',
        70: '17.5rem',
        77: '19rem',
        100: '25rem',
        104: '26rem',
        110: '27.5rem',
        112: '28rem',
        116: '29rem',
        120: '33rem',
        145: '36.25rem',
        160: '40rem',
        168: '42rem',
        236: '59rem',
        256: '64rem',
        360: '90rem',
      },
      borderRadius: {
        '2.5xl': '1.25rem',
      },
      boxShadow: {
        1: '0px 4px 6px rgba(0, 0, 0, 0.12)',
        2: '0px 6px 16px rgba(0, 0, 0, 0.08)',
        3: '0px 8px 36px rgba(0, 0, 0, 0.06)',
        common: 'var(--shadow-common)',
      },
      backgroundImage: () => ({
        light: "url('/src/assets/svg/background.svg')",
        home: "url('assets/img/bgHome.png')",
        metamask: "url('/src/assets/svg/metamask.svg')",
        portal: "url('/src/assets/svg/portal.svg')",
      }),
      colors: {
        dark: '#373739',
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
        'gray-10': 'var(--color-gray-10)',
        'gray-20': 'var(--color-gray-20)',
        'gray-40': 'var(--color-gray-40)',
        'gray-60': 'var(--color-gray-60)',
        'gray-80': 'var(--color-gray-80)',
        'gray-90': 'var(--color-gray-90)',
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
      inset: {
        0.4: '0.1rem',
        0.46: '0.115rem',
        0.48: '0.12rem',
        0.5: '0.125rem',
        28.4: '7.1rem',
        29: '7.25rem',
        29.2: '7.3rem',
        29.6: '7.4rem',
        30: '7.5rem',
        31: '7.75rem',
        34: '8.5rem',
        41: '10.25rem',
        62: '15.5rem',
        65: '16.25rem',
        100: '24rem',
        116: '29rem',
        120: '34rem',
        154: '38.5rem',
        158: '39.5rem',
        192: '48rem',
        232: '58rem',
        240: '60rem',
        244: '61rem',
        248: '62rem',
        250: '64rem',
        257: '64.25rem',
        258: '64.5rem',
        259: '64.75rem',
        260: '65rem',
        270: '67.5rem',
        278: '69.5rem',
        280: '70rem',
        290: '72.5rem',
        291: '72.75rem',
        292: '73rem',
        293: '73.25rem',
        294: '73.5rem',
        300: '75rem',
        302: '75.5rem',
      },
      minHeight: {
        15: '60rem',
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
