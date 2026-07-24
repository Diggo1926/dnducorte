import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        fundo: "var(--fundo)",
        superficie: "var(--superficie)",
        tinta: "var(--tinta)",
        ouro: "var(--ouro)",
        "ouro-claro": "var(--ouro-claro)",
        cromo: "var(--cromo)",
        azul: "var(--azul)",
        vermelho: "var(--vermelho)",
      },
      borderRadius: {
        DEFAULT: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
