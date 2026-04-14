import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#7c3aed',
        ink: '#111827',
        soft: '#f5f3ff',
        line: '#e5e7eb',
        muted: '#6b7280',
        success: '#047857',
        warn: '#b45309'
      },
      boxShadow: {
        card: '0 12px 30px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
};

export default config;
