import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { gerarQrCodeDataUrl } from "@/lib/qrcode";
import ConfiguracoesForm from "./ConfiguracoesForm";
import LinkPublico from "./LinkPublico";

export default async function ConfiguracoesPage() {
  const session = await getSession();
  if (!session) return null;

  const barbearia = await prisma.barbearia.findUnique({
    where: { id: session.barbeariaId },
  });
  if (!barbearia) return null;

  const host = headers().get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const linkPublico = `${protocol}://${host}/agendar/${barbearia.slug}`;
  const qrCodeDataUrl = await gerarQrCodeDataUrl(linkPublico);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h1 className="text-xl font-bold uppercase tracking-tight text-tinta">
          Configurações
        </h1>
        <ConfiguracoesForm barbearia={barbearia} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-bold uppercase tracking-tight text-tinta">
          Link público e QR Code
        </h2>
        <LinkPublico link={linkPublico} qrCodeDataUrl={qrCodeDataUrl} />
      </section>
    </div>
  );
}
