/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './public/index.html', // You can include public if you have Tailwind classes there
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        orange: "#FFA500",
        orangered: "#FF4500",
        orchid: "#DA70D6",
        teal: "#008080",
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
      animation: {
        'fade-in-up': 'fadeInUp 0.6s forwards',
        'fade-in-left': 'fadeInLeft 0.5s forwards',
        'fade-in-right': 'fadeInRight 0.5s forwards',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'opacity-transform': 'opacity, transform',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['hover', 'focus', 'active'],
      textColor: ['hover', 'focus', 'active'],
      animation: ['responsive', 'hover', 'focus'],
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
};