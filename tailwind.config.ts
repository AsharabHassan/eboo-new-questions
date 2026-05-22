import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#F5F1E8",
          dim: "#9C9586",
          faint: "#4A4636",
        },
        ground: {
          DEFAULT: "#0B0F1A",
          raised: "#11161F",
          deeper: "#070A11",
        },
        gold: {
          DEFAULT: "#C9A347",
          deep: "#8E6F2A",
          soft: "#E4C97A",
        },
        rouge: "#6B1D2E",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-outfit)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        marquee: "0.18em",
        chip: "0.32em",
      },
    },
  },
  plugins: [],
} satisfies Config;
