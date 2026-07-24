import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
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
      precoCentavos: true,
      duracaoMinutos: true,
      fotoUrl: true,
    },
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 bg-superficie px-4 py-6">
      <header className="text-center">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-tinta">
          {barbearia.nome}
        </h1>
        <p className="text-sm text-tinta/60">{barbearia.endereco}</p>
      </header>
      <AgendarWizard
        slug={barbearia.slug}
        barbeariaNome={barbearia.nome}
        telefoneBarbearia={barbearia.telefone}
        servicos={servicos}
      />
    </main>
  );
}
