/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury + Fresh mix
        primary: {
          DEFAULT: "#D97706", // amber (Option B primary)
        },
        accent: {
          DEFAULT: "#16A34A", // green (Option C accent)
        },
        highlight: {
          DEFAULT: "#F43F5E", // rose
        },
        sunny: "#FACC15", // secondary yellow
        glass: "rgba(255,255,255,0.6)",
        bg: "#FFFDF7",
        neutralText: "#111827",
      },
      fontFamily: {
        primary: ['Inter', 'sans-serif'],
        georgia: ['"Playfair Display"', ...defaultTheme.fontFamily.serif],

        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in-out",
      },
    }

  },
  plugins: [],
};
