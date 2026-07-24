import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        creme: "var(--creme)",
        branco: "var(--branco)",
        tinta: "var(--tinta)",
        "tinta-70": "var(--tinta-70)",
        ouro: "var(--ouro)",
        "ouro-claro": "var(--ouro-claro)",
        "ouro-texto": "var(--ouro-texto)",
        "branco-70": "var(--branco-70)",
        "branco-60": "var(--branco-60)",
        "branco-05": "var(--branco-05)",
        cromo: "var(--cromo)",
        azul: "var(--azul)",
        vermelho: "var(--vermelho)",
        // Aliases legados — usados só até a migração de cada tela terminar.
        fundo: "var(--creme)",
        superficie: "var(--branco)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      // Escala tipográfica única. Nenhum font-size solto em componente.
      fontSize: {
        eyebrow: [
          "12px",
          { lineHeight: "1", letterSpacing: "0.12em", fontWeight: "600" },
        ],
        "body-sm": ["14px", { lineHeight: "1.4" }],
        body: ["16px", { lineHeight: "1.5" }],
        "body-lg": ["18px", { lineHeight: "1.5" }],
        h3: [
          "20px",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        h2: ["28px", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        h1: ["36px", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        display: ["56px", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        number: ["32px", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "nav-label": ["11px", { lineHeight: "1.2", fontWeight: "600" }],
      },
      borderRadius: {
        DEFAULT: "12px",
      },
      // Escala de espaçamento única (4/8/12/16/24/32/48/64): usar somente
      // as chaves 1,2,3,4,6,8,12,16 dos utilitários padrão do Tailwind.
    },
  },
  plugins: [],
};

export default config;
