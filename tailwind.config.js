// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", // For the app directory
    "./pages/**/*.{js,jsx,ts,tsx}", // For the pages directory (if you have one)
    "./components/**/*.{js,jsx,ts,tsx}", // For the components directory
    "./styles/**/*.{css}", // For your global styles (if applicable)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
