/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "#FFFFFF",
        },
        background: "var(--color-background)",
        foreground: "var(--color-accent)",
        card: "#FFFFFF",
        "card-foreground": "var(--color-accent)",
        muted: {
          DEFAULT: "#F1ECE3",
          foreground: "#6B6B6B",
        },
        border: "#E8E1D3",
        ring: "var(--color-primary)",
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
        success: "#16A34A",
        warning: "#D97706",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Manrope", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "12px",
        md: "10px",
        sm: "6px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 250ms ease-out",
      },
    },
  },
  plugins: [],
};
