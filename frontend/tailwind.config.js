/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This line is critical!
  ],
  theme: {
    extend: {
      colors: {
        cogniBlue: "#2D46B9",
      },
    },
  },
  plugins: [],
}