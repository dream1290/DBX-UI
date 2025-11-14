import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
        },
        colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Aviation-specific genomic colors
        multirotor: {
          DEFAULT: "hsl(var(--multirotor))",
          foreground: "hsl(var(--multirotor-foreground))",
        },
        "fixed-wing": {
          DEFAULT: "hsl(var(--fixed-wing))",
          dark: "hsl(var(--fixed-wing-dark))",
          foreground: "hsl(var(--fixed-wing-foreground))",
        },
        vtol: {
          DEFAULT: "hsl(var(--vtol))",
          foreground: "hsl(var(--vtol-foreground))",
        },
        risk: {
          low: "hsl(var(--risk-low))",
          medium: "hsl(var(--risk-medium))",
          high: "hsl(var(--risk-high))",
        },
        // Genomic data visualization colors
        genomic: {
          blue: "hsl(var(--genomic-blue))",
          green: "hsl(var(--genomic-green))",
          purple: "hsl(var(--genomic-purple))",
          orange: "hsl(var(--genomic-orange))",
          cyan: "hsl(var(--genomic-cyan))",
          pink: "hsl(var(--genomic-pink))",
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
        // Genomic-inspired animations
        "dna-helix": {
          "0%, 100%": { transform: "rotate(0deg) translateY(0px)" },
          "25%": { transform: "rotate(90deg) translateY(-2px)" },
          "50%": { transform: "rotate(180deg) translateY(0px)" },
          "75%": { transform: "rotate(270deg) translateY(2px)" },
        },
        "genomic-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        "conservation-score": {
          "0%": { width: "0%" },
          "100%": { width: "var(--score-width, 85%)" },
        },
        "flight-path": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "dna-helix": "dna-helix 3s ease-in-out infinite",
        "genomic-pulse": "genomic-pulse 2s ease-in-out infinite",
        "conservation-score": "conservation-score 1.5s ease-out forwards",
        "flight-path": "flight-path 2s ease-in-out",
        shimmer: "shimmer 2s ease-in-out infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
