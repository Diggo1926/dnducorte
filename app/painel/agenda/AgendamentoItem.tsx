"use client";

import type { Agendamento, Servico } from "@prisma/client";
import { StaggerItem } from "../StaggerList";
import { atualizarStatus } from "./actions";

const STATUS_OPTIONS = [
  "PENDENTE",
  "CONFIRMADO",
  "CONCLUIDO",
  "CANCELADO",
  "FALTOU",
] as const;

const STATUS_COR: Record<string, string> = {
  PENDENTE: "bg-creme text-tinta-70",
  CONFIRMADO: "bg-azul text-branco",
  CONCLUIDO: "bg-ouro text-tinta",
  CANCELADO: "bg-vermelho text-branco",
  FALTOU: "bg-tinta text-branco",
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

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded px-2 py-1 text-body-sm font-semibold uppercase tracking-wide ${STATUS_COR[status]}`}
    >
      {status}
    </span>
  );
}

function StatusForm({ agendamento }: { agendamento: Agendamento }) {
  return (
    <form
      action={atualizarStatus}
      className="flex flex-wrap items-center gap-2"
    >
      <input type="hidden" name="id" value={agendamento.id} />
      <select name="status" defaultValue={agendamento.status} className="text-body-sm">
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button type="submit" className="btn btn-secondary h-9 px-3 text-body-sm">
        Salvar
      </button>
    </form>
  );
}

export function AgendamentoCard({
  agendamento,
}: {
  agendamento: Agendamento & { servico: Servico };
}) {
  return (
    <StaggerItem className="flex flex-col gap-3 rounded border border-cromo bg-branco p-4 transition-all duration-150 hover:border-ouro hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-h3 text-tinta">
            {formatHora(agendamento.inicio)} — {agendamento.servico.nome}
          </p>
          <p className="mt-1 text-body-sm text-tinta-70">
            {agendamento.clienteNome} · {agendamento.clienteTelefone} ·{" "}
            {formatPreco(agendamento.precoCentavos)}
          </p>
        </div>
        <StatusBadge status={agendamento.status} />
      </div>
      <StatusForm agendamento={agendamento} />
    </StaggerItem>
  );
}

export function AgendamentoRow({
  agendamento,
}: {
  agendamento: Agendamento & { servico: Servico };
}) {
  return (
    <StaggerItem as="tr" className="border-b border-cromo last:border-0 transition-colors duration-150 hover:bg-creme">
      <td className="py-3 pr-4 font-display text-h3 text-tinta">
        {formatHora(agendamento.inicio)}
      </td>
      <td className="py-3 pr-4 text-tinta">{agendamento.servico.nome}</td>
      <td className="py-3 pr-4 text-body-sm text-tinta-70">
        {agendamento.clienteNome}
        <br />
        {agendamento.clienteTelefone}
      </td>
      <td className="py-3 pr-4 font-display text-h3 text-ouro-texto">
        {formatPreco(agendamento.precoCentavos)}
      </td>
      <td className="py-3 pr-4">
        <StatusBadge status={agendamento.status} />
      </td>
      <td className="py-3">
        <StatusForm agendamento={agendamento} />
      </td>
    </StaggerItem>
  );
}
