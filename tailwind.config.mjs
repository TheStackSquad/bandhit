/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        orange: "#FFA500", // Custom Orange
        orangered: "#FF4500", // Custom Orangered
        orchid: "#DA70D6", // Custom Orchid
        teal: "#008080", // Custom Teal
      },
      fontFamily: {
        'nova-flat': ['var(--font-nova-flat)'],
        'josefin': ['var(--font-josefin)'],
      },
      fontWeight: {
        400: "400",
        600: "600",
        800: "800",
      },
    },
  },
  plugins: [],
};
