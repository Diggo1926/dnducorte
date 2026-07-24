import Link from "next/link";
import { Scissors, Wallet, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import PageHeader from "./PageHeader";
import StatCard from "./StatCard";
import EmptyState from "./EmptyState";
import { StaggerList, StaggerItem } from "./StaggerList";

function formatHora(data: Date) {
  return new Date(data).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPreco(centavos: number) {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default async function PainelHome() {
  const session = await getSession();
  if (!session) return null;

  const agora = new Date();
  const inicioDia = new Date(
    agora.getFullYear(),
    agora.getMonth(),
    agora.getDate(),
    0,
    0,
    0
  );
  const fimDia = new Date(
    agora.getFullYear(),
    agora.getMonth(),
    agora.getDate(),
    23,
    59,
    59
  );

  const [agendamentosHoje, entradasHoje, proximoAgendamento] =
    await Promise.all([
      prisma.agendamento.findMany({
        where: {
          barbeariaId: session.barbeariaId,
          inicio: { gte: inicioDia, lte: fimDia },
        },
        include: { servico: true },
        orderBy: { inicio: "asc" },
      }),
      prisma.lancamento.aggregate({
        where: {
          barbeariaId: session.barbeariaId,
          tipo: "ENTRADA",
          data: { gte: inicioDia, lte: fimDia },
        },
        _sum: { valorCentavos: true },
      }),
      prisma.agendamento.findFirst({
        where: {
          barbeariaId: session.barbeariaId,
          inicio: { gte: agora },
          status: { notIn: ["CANCELADO", "FALTOU"] },
        },
        include: { servico: true },
        orderBy: { inicio: "asc" },
      }),
    ]);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Painel"
        title="Dashboard"
        description="Visão geral do dia na barbearia."
        action={
          <Link href="/painel/agenda" className="btn btn-secondary">
            Ver agenda completa
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Atendimentos hoje"
          value={String(agendamentosHoje.length)}
          numero={agendamentosHoje.length}
          formatador={(n) => String(Math.round(n))}
          icon={<Scissors size={20} strokeWidth={2} className="text-ouro-texto" />}
        />
        <StatCard
          label="Entradas do dia"
          value={formatPreco(entradasHoje._sum.valorCentavos ?? 0)}
          numero={entradasHoje._sum.valorCentavos ?? 0}
          formatador={(n) => formatPreco(Math.round(n))}
          icon={<Wallet size={20} strokeWidth={2} className="text-ouro-texto" />}
          accent="ouro"
        />
        <StatCard
          label="Próximo horário"
          value={
            proximoAgendamento ? formatHora(proximoAgendamento.inicio) : "—"
          }
          icon={<Clock size={20} strokeWidth={2} className="text-ouro-texto" />}
        />
      </div>

      <section className="flex flex-col gap-4">
        <div>
          <p className="eyebrow">Hoje</p>
          <h2 className="mt-1 font-display text-h2 text-tinta">
            Agenda do dia
          </h2>
        </div>

        {agendamentosHoje.length === 0 ? (
          <EmptyState
            title="Nenhum agendamento hoje"
            description="Quando um cliente marcar um horário, ele aparece aqui."
          />
        ) : (
          <StaggerList className="flex flex-col gap-3">
            {agendamentosHoje.map((agendamento) => (
              <StaggerItem
                key={agendamento.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded border border-cromo bg-branco p-4"
              >
                <div>
                  <p className="font-display text-h3 text-tinta">
                    {formatHora(agendamento.inicio)}
                  </p>
                  <p className="text-body-sm text-tinta-70">
                    {agendamento.servico.nome} · {agendamento.clienteNome}
                  </p>
                </div>
                <p className="font-display text-h3 text-ouro-texto">
                  {formatPreco(agendamento.precoCentavos)}
                </p>
              </StaggerItem>
            ))}
          </StaggerList>
        )}
      </section>
    </div>
  );
}
