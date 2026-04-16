/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './App.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#005e53',
          container: '#00796b',
        },
        onPrimary: '#ffffff',
        onPrimaryContainer: '#ffffff',
        secondary: {
          DEFAULT: '#206393',
          container: '#90c9ff',
          fixed: '#cee5ff',
        },
        onSecondary: '#ffffff',
        onSecondaryContainer: '#035584',
        tertiary: {
          DEFAULT: '#854000',
          container: '#ffe0b2',
        },
        onTertiary: '#ffffff',
        onTertiaryContainer: '#854000',
        surface: {
          DEFAULT: '#f8f9fa',
          'container-low': '#f3f4f5',
          'container-lowest': '#ffffff',
          'container-high': '#e8e9ea',
          'container-highest': '#e0e2e1',
          bright: '#ffffff',
        },
        onSurface: '#191c1d',
        onSurfaceVariant: '#3e4946',
        outlineVariant: '#bdc9c5',
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
        onError: '#ffffff',
        urgency: {
          green: '#4CAF50',
          yellow: '#FFC107',
          red: '#F44336',
        },
      },
      fontFamily: {
        display: ['Manrope', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        'pet-soft': '0 8px 32px rgba(25, 28, 29, 0.06)',
        elevated: '0 12px 40px rgba(25, 28, 29, 0.08)',
        glass: '0 8px 32px rgba(25, 28, 29, 0.06)',
      },
      backdropBlur: {
        glass: '20px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
      },
    },
  },
  plugins: [],
};
