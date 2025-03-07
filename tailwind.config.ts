import type { Config } from "tailwindcss";

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
      },
      fontFamily: {
        inter: "var(--font-inter)",
        poppins: "var(--font-poppins)",
      },
      // screens: {
      //   sm: { min: "640px", max: "767px" },
      //   md: { min: "768px", max: "1023px" },
      //   lg: { min: "1024px", max: "1279px" },
      //   xl: { min: "1280px", max: "1535px" },
      //   "2xl": { min: "1536px", max: "1919px" },
      //   "3xl": { min: "1920px" },
      //   lgn: { min: "1281px", max: "1366px" }, // this overlaps with xl, so double-check if that's intentional
      // }
    },
  },
  plugins: [],
} satisfies Config;
