import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import ServicoForm from "./ServicoForm";
import ServicoItem from "./ServicoItem";

export default async function ServicosPage() {
  const session = await getSession();
  if (!session) return null;

  const servicos = await prisma.servico.findMany({
    where: { barbeariaId: session.barbeariaId },
    orderBy: { ordem: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold uppercase tracking-tight text-tinta">
        Serviços
      </h1>
      <ServicoForm />
      {servicos.length === 0 ? (
        <p className="text-sm text-tinta/60">
          Nenhum serviço cadastrado ainda.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {servicos.map((servico) => (
            <ServicoItem key={servico.id} servico={servico} />
          ))}
        </ul>
      )}
    </div>
  );
}
