import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0f2a4a",
        brand: "#2563eb",
        positive: "#15803d",
        negative: "#dc2626",
        caution: "#d97706"
      },
      boxShadow: {
        soft: "0 8px 30px rgba(15, 42, 74, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
