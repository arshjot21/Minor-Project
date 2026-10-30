/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        primary: "#111111",
        charcoal: "#333333",
        subtle: "#767676",
        lightgray: "#F5F5F5",
        accentBeige: "#FBF9F5",
        borderLight: "#E8E8E8"
      },
      fontFamily: {
        serif: ["'Playfair Display'", "'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        display: ["'Cormorant Garamond'", "Georgia", "serif"]
      },
      letterSpacing: {
        widest: ".25em",
        tightest: "-.04em"
      }
    },
  },
  plugins: [],
}
