import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import PageHeader from "../PageHeader";
import EmptyState from "../EmptyState";
import { StaggerList } from "../StaggerList";
import { AgendamentoCard, AgendamentoRow } from "./AgendamentoItem";

function parseData(raw?: string) {
  if (raw && /^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  return new Date().toISOString().slice(0, 10);
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: { data?: string };
}) {
  const session = await getSession();
  if (!session) return null;

  const data = parseData(searchParams.data);
  const [ano, mes, dia] = data.split("-").map(Number);
  const inicioDia = new Date(ano, mes - 1, dia, 0, 0, 0);
  const fimDia = new Date(ano, mes - 1, dia, 23, 59, 59);

  const agendamentos = await prisma.agendamento.findMany({
    where: {
      barbeariaId: session.barbeariaId,
      inicio: { gte: inicioDia, lte: fimDia },
    },
    include: { servico: true },
    orderBy: { inicio: "asc" },
  });

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Painel"
        title="Agenda"
        description="Consulte e atualize os agendamentos de um dia."
        action={
          <form method="get" className="flex items-center gap-2">
            <input type="date" name="data" defaultValue={data} />
            <button type="submit" className="btn btn-primary h-[44px]">
              Ver
            </button>
          </form>
        }
      />

      {agendamentos.length === 0 ? (
        <EmptyState
          title="Nenhum agendamento neste dia"
          description="Escolha outra data acima ou aguarde os próximos clientes."
        />
      ) : (
        <>
          <StaggerList className="flex flex-col gap-3 lg:hidden">
            {agendamentos.map((agendamento) => (
              <AgendamentoCard key={agendamento.id} agendamento={agendamento} />
            ))}
          </StaggerList>

          <table className="hidden w-full text-left lg:table">
            <thead>
              <tr className="border-b border-cromo text-body-sm text-tinta-70">
                <th className="pb-3 font-semibold">Horário</th>
                <th className="pb-3 font-semibold">Serviço</th>
                <th className="pb-3 font-semibold">Cliente</th>
                <th className="pb-3 font-semibold">Preço</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <StaggerList as="tbody">
              {agendamentos.map((agendamento) => (
                <AgendamentoRow key={agendamento.id} agendamento={agendamento} />
              ))}
            </StaggerList>
          </table>
        </>
      )}
    </div>
  );
}
