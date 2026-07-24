import type { Bloqueio } from "@prisma/client";
import { excluirBloqueio } from "./actions";

function formatData(data: Date) {
  return new Date(data).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function BloqueioItem({ bloqueio }: { bloqueio: Bloqueio }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-cromo bg-fundo p-3">
      <div>
        <p className="text-sm font-semibold text-tinta">
          {formatData(bloqueio.inicio)} — {formatData(bloqueio.fim)}
        </p>
        {bloqueio.motivo && (
          <p className="text-xs text-tinta/60">{bloqueio.motivo}</p>
        )}
      </div>
      <form action={excluirBloqueio}>
        <input type="hidden" name="id" value={bloqueio.id} />
        <button
          type="submit"
          className="rounded-[12px] border border-vermelho px-3 py-1 text-xs font-semibold uppercase text-vermelho"
        >
          Excluir
        </button>
      </form>
    </li>
  );
}
