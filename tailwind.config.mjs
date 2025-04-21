/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './public/index.html',
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
        'float1': 'float1 8s ease-in-out infinite',
        'float2': 'float2 10s ease-in-out infinite',
        'fadeIn': 'fadeIn 1s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards', // New fade-in
        'slide-down-sm': 'slide-down-sm 0.3s ease-out forwards', // New slide-down
        'slide-up-sm': 'slide-up-sm 0.3s ease-out forwards', // New slide-up
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        float1: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(30px, 20px) rotate(5deg)' }
        },
        float2: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(-20px, -30px) rotate(-5deg)' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in': { // New fade-in keyframes
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-down-sm': { // New slide-down keyframes
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-up-sm': { // New slide-up keyframes
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'opacity-transform': 'opacity, transform',
      }
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