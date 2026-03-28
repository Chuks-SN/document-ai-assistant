import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        accent: {
          DEFAULT: "#3b82f6",
          muted: "#93c5fd",
          dark: "#2563eb",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f4f4f5",
          elevated: "#fafafa",
        },
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgb(0 0 0 / 0.08), 0 2px 8px -2px rgb(0 0 0 / 0.04)",
        "soft-sm": "0 2px 12px -2px rgb(0 0 0 / 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
