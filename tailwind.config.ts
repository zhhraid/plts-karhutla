import type { Config } from "tailwindcss";

/**
 * Design tokens. Colour is never the sole carrier of status — every status
 * token pairs with a text label and an icon in the UI layer.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#15803d", hover: "#166534", subtle: "#dcfce7", fg: "#052e16" },
        secondary: { DEFAULT: "#1d4ed8", hover: "#1e40af", subtle: "#dbeafe", fg: "#172554" },
        surface: { DEFAULT: "#ffffff", muted: "#f8fafc", sunken: "#f1f5f9" },
        border: { DEFAULT: "#e2e8f0", strong: "#cbd5e1" },
        success: { DEFAULT: "#15803d", subtle: "#dcfce7" },
        warning: { DEFAULT: "#b45309", subtle: "#fef3c7" },
        danger: { DEFAULT: "#b91c1c", subtle: "#fee2e2" },
        muted: { DEFAULT: "#64748b", fg: "#475569" },
        priority: { high: "#b45309", medium: "#1d4ed8", low: "#64748b", unverified: "#7c3aed" },
        confidence: { high: "#15803d", medium: "#b45309", unverified: "#7c3aed" },
      },
      fontFamily: { sans: ["var(--font-sans)", "system-ui", "sans-serif"] },
      screens: { xs: "480px" },
    },
  },
  plugins: [],
};
export default config;
