/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'deep-charcoal': '#2B2B2B',
        'champagne-gold': '#D4AF37',
        'warm-cream': '#F5F5DC',
        
        // Supporting Colors
        'soft-ivory': '#FFFEF7',
        'rich-espresso': '#3E2723',
        'muted-gold': '#C9A961',
        'pale-champagne': '#F0E6D2',
        
        // Semantic Colors
        'success-green': '#2E7D32',
        'alert-amber': '#F57C00',
        'error-burgundy': '#C62828',
        'info-navy': '#1565C0',
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'lato': ['Lato', 'sans-serif'],
        'cormorant': ['"Cormorant Garamond"', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'luxury': '12px',
      },
      boxShadow: {
        'luxury': '0 2px 16px rgba(43, 43, 43, 0.08)',
        'luxury-hover': '0 8px 24px rgba(43, 43, 43, 0.12)',
        'gold': '0 4px 12px rgba(212, 175, 55, 0.25)',
      },
    },
  },
  plugins: [],
}
