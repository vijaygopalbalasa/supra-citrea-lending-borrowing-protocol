import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        supra: {
          primary: "#FF1E1E",
          secondary: "#7B2CBF",
          accent: "#FFA7A7",
          light: "#FFF1F1",
          dark: "#800000",
          gradient: {
            start: "#FF1E1E",
            middle: "#FF4D4D",
            end: "#7B2CBF"
          }
        },
        citrea: {
          primary: "#FF8A00",
          secondary: "#00897B",
          accent: "#FFB74D",
          light: "#FFF4E6",
          dark: "#E65100",
          gradient: {
            start: "#FF8A00",
            middle: "#FFA726",
            end: "#00897B"
          }
        }
      },
      backgroundImage: {
        'supra-main': 'linear-gradient(135deg, #FF1E1E 0%, #7B2CBF 100%)',
        'supra-soft': 'linear-gradient(135deg, rgba(255,30,30,0.1) 0%, rgba(123,44,191,0.1) 100%)',
        'citrea-main': 'linear-gradient(135deg, #FF8A00 0%, #00897B 100%)',
        'citrea-soft': 'linear-gradient(135deg, rgba(255,138,0,0.1) 0%, rgba(0,137,123,0.1) 100%)',
        'glass-light': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
        'glass-dark': 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'neon': '0 0 20px rgba(255, 30, 30, 0.5)',
        'neon-citrea': '0 0 20px rgba(255, 138, 0, 0.5)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 30, 30, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 30, 30, 0.8)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate')
  ],
}

export default config