import type { Metadata } from "next";
import { Archivo, Archivo_Black } from "next/font/google";
import "./theme.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-sans",
  display: "swap",
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dndu Corte",
  description: "Sistema de agendamento para barbearias",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${archivoBlack.variable}`}>
      <body>{children}</body>
    </html>
  );
}
