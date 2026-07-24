import QRCode from "qrcode";

export async function gerarQrCodeDataUrl(texto: string) {
  return QRCode.toDataURL(texto, { margin: 1, width: 240 });
}
