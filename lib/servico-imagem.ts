const MAPA: { padrao: RegExp; arquivo: string }[] = [
  { padrao: /barba.*(corte|combo)|corte.*barba|combo/, arquivo: "combo" },
  { padrao: /degrad|fade/, arquivo: "degrade" },
  { padrao: /barba/, arquivo: "barba" },
  { padrao: /sobrancelha/, arquivo: "sobrancelha" },
  { padrao: /pigment/, arquivo: "pigmentacao" },
  { padrao: /corte|cabelo/, arquivo: "corte" },
];

export function getImagemServico(nome: string, fotoUrl?: string | null) {
  if (fotoUrl) return fotoUrl;

  const normalizado = nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

  const match = MAPA.find((item) => item.padrao.test(normalizado));
  return `/services/${match?.arquivo ?? "default"}.svg`;
}
