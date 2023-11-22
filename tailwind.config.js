/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Enable dark mode using class strategy
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#aaa7ff",
          DEFAULT: "#433ddf", // Use DEFAULT for the base color
          dark: "#3a35bd",
        },
        secondary: {
          light: "#FFB74D",
          DEFAULT: "#f7f9fb", // Secondary color
          dark: "#F57C00",
        },
      },
      borderWidth: {
        1: "1px",
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          sm: "100%",
          md: "720px", // Custom width for medium screens
          lg: "960px",
          xl: "1250px",
        },
      },
      fontSize: {
        xxs: "8px", // You can name it whatever you prefer and set the size accordingly
      },
      fontFamily: {},
    },
  },
  plugins: [],
};
