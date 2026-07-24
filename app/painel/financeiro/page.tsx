import { TrendingUp, TrendingDown, Wallet, Scissors } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import PageHeader from "../PageHeader";
import StatCard from "../StatCard";
import EmptyState from "../EmptyState";
import { StaggerList } from "../StaggerList";
import LancamentoForm from "./LancamentoForm";
import { LancamentoCard, LancamentoRow } from "./LancamentoItem";

function primeiroDiaDoMes() {
  const agora = new Date();
  return new Date(agora.getFullYear(), agora.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
}

function hoje() {
  return new Date().toISOString().slice(0, 10);
}

function parseData(raw: string | undefined, fallback: string) {
  return raw && /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : fallback;
}

function formatPreco(centavos: number) {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default async function FinanceiroPage({
  searchParams,
}: {
  searchParams: { inicio?: string; fim?: string };
}) {
  const session = await getSession();
  if (!session) return null;

  const dataInicio = parseData(searchParams.inicio, primeiroDiaDoMes());
  const dataFim = parseData(searchParams.fim, hoje());

  const [ai, am, ad] = dataInicio.split("-").map(Number);
  const [bi, bm, bd] = dataFim.split("-").map(Number);
  const inicio = new Date(ai, am - 1, ad, 0, 0, 0);
  const fim = new Date(bi, bm - 1, bd, 23, 59, 59);

  const lancamentos = await prisma.lancamento.findMany({
    where: {
      barbeariaId: session.barbeariaId,
      data: { gte: inicio, lte: fim },
    },
    orderBy: { data: "desc" },
  });

  const entradas = lancamentos
    .filter((l) => l.tipo === "ENTRADA")
    .reduce((acc, l) => acc + l.valorCentavos, 0);
  const saidas = lancamentos
    .filter((l) => l.tipo === "SAIDA")
    .reduce((acc, l) => acc + l.valorCentavos, 0);
  const saldo = entradas - saidas;
  const atendimentos = lancamentos.filter((l) => l.agendamentoId).length;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Painel"
        title="Financeiro"
        description="Acompanhe entradas, saídas e o saldo do período."
        action={
          <form method="get" className="flex flex-wrap items-center gap-2">
            <input type="date" name="inicio" defaultValue={dataInicio} />
            <span className="text-body-sm text-tinta-70">até</span>
            <input type="date" name="fim" defaultValue={dataFim} />
            <button type="submit" className="btn btn-primary h-[44px]">
              Filtrar
            </button>
          </form>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Entradas"
          value={formatPreco(entradas)}
          numero={entradas}
          formatador={(n) => formatPreco(Math.round(n))}
          icon={<TrendingUp size={20} strokeWidth={2} className="text-ouro-texto" />}
          accent="ouro"
        />
        <StatCard
          label="Saídas"
          value={formatPreco(saidas)}
          numero={saidas}
          formatador={(n) => formatPreco(Math.round(n))}
          icon={<TrendingDown size={20} strokeWidth={2} className="text-vermelho" />}
          accent="vermelho"
        />
        <StatCard
          label="Saldo"
          value={formatPreco(saldo)}
          numero={saldo}
          formatador={(n) => formatPreco(Math.round(n))}
          icon={<Wallet size={20} strokeWidth={2} className="text-tinta" />}
        />
        <StatCard
          label="Atendimentos"
          value={String(atendimentos)}
          numero={atendimentos}
          formatador={(n) => String(Math.round(n))}
          icon={<Scissors size={20} strokeWidth={2} className="text-tinta" />}
        />
      </div>

      <LancamentoForm />

      {lancamentos.length === 0 ? (
        <EmptyState title="Nenhum lançamento no período" />
      ) : (
        <>
          <StaggerList className="flex flex-col gap-3 lg:hidden">
            {lancamentos.map((lancamento) => (
              <LancamentoCard key={lancamento.id} lancamento={lancamento} />
            ))}
          </StaggerList>

          <table className="hidden w-full text-left lg:table">
            <thead>
              <tr className="border-b border-cromo text-body-sm text-tinta-70">
                <th className="pb-3 font-semibold">Data</th>
                <th className="pb-3 font-semibold">Descrição</th>
                <th className="pb-3 font-semibold">Categoria</th>
                <th className="pb-3 font-semibold">Valor</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <StaggerList as="tbody">
              {lancamentos.map((lancamento) => (
                <LancamentoRow key={lancamento.id} lancamento={lancamento} />
              ))}
            </StaggerList>
          </table>
        </>
      )}
    </div>
  );
}
