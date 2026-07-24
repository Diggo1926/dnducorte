import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import LancamentoForm from "./LancamentoForm";
import LancamentoItem from "./LancamentoItem";

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
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold uppercase tracking-tight text-tinta">
        Financeiro
      </h1>

      <form method="get" className="flex flex-wrap items-center gap-2">
        <input
          type="date"
          name="inicio"
          defaultValue={dataInicio}
          className="rounded-[12px] border border-cromo px-3 py-2"
        />
        <span className="text-tinta/60">até</span>
        <input
          type="date"
          name="fim"
          defaultValue={dataFim}
          className="rounded-[12px] border border-cromo px-3 py-2"
        />
        <button
          type="submit"
          className="rounded-[12px] bg-ouro px-4 py-2 text-sm font-bold uppercase text-tinta"
        >
          Filtrar
        </button>
      </form>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-[12px] border border-cromo bg-fundo p-3">
          <p className="text-xs uppercase text-tinta/60">Entradas</p>
          <p className="text-lg font-bold text-ouro">{formatPreco(entradas)}</p>
        </div>
        <div className="rounded-[12px] border border-cromo bg-fundo p-3">
          <p className="text-xs uppercase text-tinta/60">Saídas</p>
          <p className="text-lg font-bold text-vermelho">{formatPreco(saidas)}</p>
        </div>
        <div className="rounded-[12px] border border-cromo bg-fundo p-3">
          <p className="text-xs uppercase text-tinta/60">Saldo</p>
          <p className="text-lg font-bold text-tinta">{formatPreco(saldo)}</p>
        </div>
        <div className="rounded-[12px] border border-cromo bg-fundo p-3">
          <p className="text-xs uppercase text-tinta/60">Atendimentos</p>
          <p className="text-lg font-bold text-tinta">{atendimentos}</p>
        </div>
      </div>

      <LancamentoForm />

      {lancamentos.length === 0 ? (
        <p className="text-sm text-tinta/60">Nenhum lançamento no período.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {lancamentos.map((lancamento) => (
            <LancamentoItem key={lancamento.id} lancamento={lancamento} />
          ))}
        </ul>
      )}
    </div>
  );
}
