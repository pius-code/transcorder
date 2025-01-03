// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Include the app directory
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Include the pages directory (if you're using it)
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Include components
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
