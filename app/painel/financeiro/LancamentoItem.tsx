import type { Lancamento } from "@prisma/client";
import { excluirLancamento } from "./actions";

function formatPreco(centavos: number) {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatData(data: Date) {
  return new Date(data).toLocaleDateString("pt-BR");
}

export default function LancamentoItem({
  lancamento,
}: {
  lancamento: Lancamento;
}) {
  const isEntrada = lancamento.tipo === "ENTRADA";
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-cromo bg-fundo p-3">
      <div>
        <p className="text-sm font-semibold text-tinta">{lancamento.descricao}</p>
        <p className="text-xs text-tinta/60">
          {formatData(lancamento.data)} · {lancamento.categoria}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`font-bold ${isEntrada ? "text-ouro" : "text-vermelho"}`}>
          {isEntrada ? "+" : "-"} {formatPreco(lancamento.valorCentavos)}
        </span>
        {!lancamento.agendamentoId && (
          <form action={excluirLancamento}>
            <input type="hidden" name="id" value={lancamento.id} />
            <button
              type="submit"
              className="rounded-[12px] border border-vermelho px-3 py-1 text-xs font-semibold uppercase text-vermelho"
            >
              Excluir
            </button>
          </form>
        )}
      </div>
    </li>
  );
}
