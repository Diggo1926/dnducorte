import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { gerarQrCodeDataUrl } from "@/lib/qrcode";
import PageHeader from "../PageHeader";
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
      <PageHeader
        eyebrow="Painel"
        title="Configurações"
        description="Dados da barbearia, regras de agendamento e link público."
      />

      <section className="flex flex-col gap-4">
        <div>
          <p className="eyebrow">Barbearia</p>
          <h2 className="mt-1 font-display text-h2 text-tinta">
            Dados gerais
          </h2>
        </div>
        <ConfiguracoesForm barbearia={barbearia} />
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <p className="eyebrow">Divulgação</p>
          <h2 className="mt-1 font-display text-h2 text-tinta">
            Link público e QR Code
          </h2>
        </div>
        <LinkPublico link={linkPublico} qrCodeDataUrl={qrCodeDataUrl} />
      </section>
    </div>
  );
}
