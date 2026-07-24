import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import AgendamentoItem from "./AgendamentoItem";

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
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold uppercase tracking-tight text-tinta">
        Agenda
      </h1>
      <form method="get" className="flex items-center gap-2">
        <input
          type="date"
          name="data"
          defaultValue={data}
          className="rounded-[12px] border border-cromo px-3 py-2"
        />
        <button
          type="submit"
          className="rounded-[12px] bg-ouro px-4 py-2 text-sm font-bold uppercase text-tinta"
        >
          Ver
        </button>
      </form>

      {agendamentos.length === 0 ? (
        <p className="text-sm text-tinta/60">Nenhum agendamento neste dia.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {agendamentos.map((agendamento) => (
            <AgendamentoItem key={agendamento.id} agendamento={agendamento} />
          ))}
        </ul>
      )}
    </div>
  );
}
