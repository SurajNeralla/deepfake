/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background": "#05060B",
        "surface": "#121318",
        "surface-container": "#1e1f25",
        "surface-container-low": "#1a1b21",
        "surface-container-high": "#292a2f",
        "surface-container-highest": "#34343a",
        "surface-variant": "#34343a",
        "primary": "#00d1ff",
        "primary-container": "#00d1ff",
        "secondary": "#7000ff",
        "tertiary": "#00fc92",
        "tertiary-container": "#00dc7f",
        "on-surface": "#e3e1e9",
        "on-surface-variant": "#bbc9cf",
        "error": "#ffb4ab",
        "error-container": "#93000a",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      }
    },
  },
  plugins: [],
}
