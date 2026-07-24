import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PublicHeader from "./PublicHeader";
import Hero from "./Hero";
import ServicosSection from "./ServicosSection";
import AgendarWizard from "./AgendarWizard";

export default async function AgendarPage({
  params,
}: {
  params: { slug: string };
}) {
  const barbearia = await prisma.barbearia.findUnique({
    where: { slug: params.slug },
  });
  if (!barbearia) notFound();

  const servicos = await prisma.servico.findMany({
    where: { barbeariaId: barbearia.id, ativo: true },
    orderBy: { ordem: "asc" },
    select: {
      id: true,
      nome: true,
      descricao: true,
      precoCentavos: true,
      duracaoMinutos: true,
      fotoUrl: true,
    },
  });

  return (
    <main className="min-h-screen bg-creme">
      <PublicHeader nome={barbearia.nome} />
      <Hero nome={barbearia.nome} endereco={barbearia.endereco} />
      <ServicosSection servicos={servicos} />
      <section id="agendamento" className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="mb-8 text-center">
          <p className="eyebrow">Agendar</p>
          <h2 className="mt-1 font-display text-h1 uppercase text-tinta">
            Marque seu horário
          </h2>
        </div>
        <AgendarWizard
          slug={barbearia.slug}
          barbeariaNome={barbearia.nome}
          telefoneBarbearia={barbearia.telefone}
          servicos={servicos}
        />
      </section>
    </main>
  );
}
