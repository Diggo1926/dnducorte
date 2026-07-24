"use client";

import type { Lancamento } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { StaggerItem } from "../StaggerList";
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

function Valor({ lancamento }: { lancamento: Lancamento }) {
  const isEntrada = lancamento.tipo === "ENTRADA";
  return (
    <span
      className={`font-display text-h3 ${
        isEntrada ? "text-ouro-texto" : "text-vermelho"
      }`}
    >
      {isEntrada ? "+" : "−"} {formatPreco(lancamento.valorCentavos)}
    </span>
  );
}

export function LancamentoCard({ lancamento }: { lancamento: Lancamento }) {
  return (
    <StaggerItem className="flex flex-wrap items-center justify-between gap-3 rounded border border-cromo bg-branco p-4 transition-all duration-150 hover:border-ouro hover:shadow-md">
      <div>
        <p className="font-semibold text-tinta">{lancamento.descricao}</p>
        <p className="mt-1 text-body-sm text-tinta-70">
          {formatData(lancamento.data)} · {lancamento.categoria}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Valor lancamento={lancamento} />
        {!lancamento.agendamentoId && (
          <form action={excluirLancamento}>
            <input type="hidden" name="id" value={lancamento.id} />
            <button
              type="submit"
              aria-label="Excluir lançamento"
              className="btn btn-destructive h-9 px-3"
            >
              <Trash2 size={16} strokeWidth={2} aria-hidden />
            </button>
          </form>
        )}
      </div>
    </StaggerItem>
  );
}

export function LancamentoRow({ lancamento }: { lancamento: Lancamento }) {
  return (
    <StaggerItem as="tr" className="border-b border-cromo last:border-0 transition-colors duration-150 hover:bg-creme">
      <td className="py-3 pr-4 text-body-sm text-tinta-70">
        {formatData(lancamento.data)}
      </td>
      <td className="py-3 pr-4 font-semibold text-tinta">
        {lancamento.descricao}
      </td>
      <td className="py-3 pr-4 text-body-sm text-tinta-70">
        {lancamento.categoria}
      </td>
      <td className="py-3 pr-4">
        <Valor lancamento={lancamento} />
      </td>
      <td className="py-3 text-right">
        {!lancamento.agendamentoId && (
          <form action={excluirLancamento}>
            <input type="hidden" name="id" value={lancamento.id} />
            <button
              type="submit"
              aria-label="Excluir lançamento"
              className="btn btn-destructive h-9 px-3"
            >
              <Trash2 size={16} strokeWidth={2} aria-hidden />
            </button>
          </form>
        )}
      </td>
    </StaggerItem>
  );
}
