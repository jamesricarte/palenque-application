/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fef0ec",
          100: "#fbd1c5",
          200: "#f9bba9",
          300: "#f69c82",
          500: "#f16b44",
          600: "#db613e",
          700: "#ab4c30",
          800: "#853b25",
          900: "#652d1d",
        },
        secondary: {
          50: "#e9f2ed",
          100: "#bad6c8",
          200: "#98c2ae",
          300: "#69a689",
          400: "#4c9572",
          500: "#1f7a4f",
          600: "#1c6f48",
          700: "#165738",
          800: "#11432b",
          900: "#0d3321",
        },
        white: {
          DEFAULT: "#ffffff",
          600: "#e8e8e8",
          700: "#b5b5b5",
          800: "#8c8c8c",
          900: "#6b6b6b",
        },
        brandBlack: {
          50: "#e9eaeb",
          100: "#e9eaeb",
          200: "#babdc0",
          300: "#697076",
          400: "#4c545c",
          500: "#1f2933",
          600: "#1c252e",
          700: "#161d24",
          800: "#11171c",
          900: "#0d1115",
        },
      },
    },
  },
  plugins: [],
};
