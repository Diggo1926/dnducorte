import type { Agendamento, Servico } from "@prisma/client";
import { atualizarStatus } from "./actions";

const STATUS_OPTIONS = [
  "PENDENTE",
  "CONFIRMADO",
  "CONCLUIDO",
  "CANCELADO",
  "FALTOU",
] as const;

const STATUS_COR: Record<string, string> = {
  PENDENTE: "bg-cromo text-tinta",
  CONFIRMADO: "bg-azul text-fundo",
  CONCLUIDO: "bg-ouro text-tinta",
  CANCELADO: "bg-vermelho text-fundo",
  FALTOU: "bg-tinta text-fundo",
};

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

export default function AgendamentoItem({
  agendamento,
}: {
  agendamento: Agendamento & { servico: Servico };
}) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-cromo bg-fundo p-4">
      <div>
        <p className="font-semibold text-tinta">
          {formatHora(agendamento.inicio)} — {agendamento.servico.nome}
        </p>
        <p className="text-sm text-tinta/60">
          {agendamento.clienteNome} · {agendamento.clienteTelefone} ·{" "}
          {formatPreco(agendamento.precoCentavos)}
        </p>
      </div>
      <form action={atualizarStatus} className="flex items-center gap-2">
        <input type="hidden" name="id" value={agendamento.id} />
        <span
          className={`rounded-[12px] px-2 py-1 text-xs font-semibold uppercase ${
            STATUS_COR[agendamento.status]
          }`}
        >
          {agendamento.status}
        </span>
        <select
          name="status"
          defaultValue={agendamento.status}
          className="rounded-[12px] border border-cromo px-2 py-1 text-sm"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-[12px] bg-ouro px-3 py-1 text-xs font-semibold uppercase text-tinta"
        >
          Salvar
        </button>
      </form>
    </li>
  );
}
