const MAPA: { padrao: RegExp; arquivo: string }[] = [
  { padrao: /barba.*(corte|combo)|corte.*barba|combo/, arquivo: "combo" },
  { padrao: /degrad|fade/, arquivo: "degrade" },
  { padrao: /barba/, arquivo: "barba" },
  { padrao: /sobrancelha/, arquivo: "sobrancelha" },
  { padrao: /pigment/, arquivo: "pigmentacao" },
  { padrao: /corte|cabelo/, arquivo: "corte" },
];

const HOSTS_PERMITIDOS = ["res.cloudinary.com"];

function fotoUrlValida(fotoUrl: string) {
  try {
    return HOSTS_PERMITIDOS.includes(new URL(fotoUrl).hostname);
  } catch {
    return false;
  }
}

export function getImagemServico(nome: string, fotoUrl?: string | null) {
  if (fotoUrl && fotoUrlValida(fotoUrl)) return fotoUrl;

  const normalizado = nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

  const match = MAPA.find((item) => item.padrao.test(normalizado));
  return `/services/${match?.arquivo ?? "default"}.svg`;
}
