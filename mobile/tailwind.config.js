/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#fbd1c5",
          300: "#f69c82",
          500: "#f16b44",
        },
        secondary: {
          100: "#bad6c8",
          300: "#69a689",
          500: "#1f7a4f",
        },
        white: {
          DEFAULT: "#ffffff",
          600: "#e8e8e8",
          700: "#b5b5b5",
        },
        brandBlack: {
          DEFUALT: "#1f2933",
          100: "#e9eaeb",
          200: "#babdc0",
        },
      },
    },
  },
  plugins: [],
};
