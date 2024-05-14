import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        blue: {
          light: "#3aa7fd",
          DEFAULT: "#1d4ed8",
          dark: "#0a369d",
        },
        primary: "#1d4ed8",
        background: "#3aa7fd",
        text: "#0a369d",
        border: "#2c5282",
        input: "#63b3ed",
        ring: "#3182ce",
        foreground: "#2b6cb0",
        secondary: {
          DEFAULT: "#2b6cb0",
          foreground: "#cbd5e0",
        },
        destructive: {
          DEFAULT: "#e53e3e",
          foreground: "#fefefe",
        },
        muted: {
          DEFAULT: "#718096",
          foreground: "#e2e8f0",
        },
        accent: {
          DEFAULT: "#00b3e6",
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "#cbd5e0",
          foreground: "#2d3748",
        },
        card: {
          DEFAULT: "#e2e8f0",
          foreground: "#2a4365",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
