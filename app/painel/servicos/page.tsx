import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import PageHeader from "../PageHeader";
import EmptyState from "../EmptyState";
import { StaggerList } from "../StaggerList";
import ServicoForm from "./ServicoForm";
import { ServicoCard, ServicoRow } from "./ServicoItem";

export default async function ServicosPage() {
  const session = await getSession();
  if (!session) return null;

  const servicos = await prisma.servico.findMany({
    where: { barbeariaId: session.barbeariaId },
    orderBy: { ordem: "asc" },
  }).catch(() => {
    throw new Error("Falha ao carregar serviços.");
  });

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Painel"
        title="Serviços"
        description="Cadastre o que a barbearia oferece e o preço de cada corte."
      />

      <ServicoForm />

      {servicos.length === 0 ? (
        <EmptyState
          title="Nenhum serviço cadastrado"
          description="Adicione o primeiro serviço acima para liberar o agendamento público."
        />
      ) : (
        <>
          <StaggerList className="flex flex-col gap-3 lg:hidden">
            {servicos.map((servico) => (
              <ServicoCard key={servico.id} servico={servico} />
            ))}
          </StaggerList>

          <table className="hidden w-full text-left lg:table">
            <thead>
              <tr className="border-b border-cromo text-body-sm text-tinta-70">
                <th className="pb-3 font-semibold">Serviço</th>
                <th className="pb-3 font-semibold">Duração</th>
                <th className="pb-3 font-semibold">Preço</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <StaggerList as="tbody">
              {servicos.map((servico) => (
                <ServicoRow key={servico.id} servico={servico} />
              ))}
            </StaggerList>
          </table>
        </>
      )}
    </div>
  );
}
