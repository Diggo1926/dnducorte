"use client";

import type { Bloqueio } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { StaggerItem } from "../StaggerList";
import { excluirBloqueio } from "./actions";

function formatData(data: Date) {
  return new Date(data).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function BloqueioItem({ bloqueio }: { bloqueio: Bloqueio }) {
  return (
    <StaggerItem className="flex flex-wrap items-center justify-between gap-3 rounded border border-cromo bg-branco p-4 transition-all duration-150 hover:border-ouro hover:shadow-md">
      <div>
        <p className="text-body-sm font-semibold text-tinta">
          {formatData(bloqueio.inicio)} — {formatData(bloqueio.fim)}
        </p>
        {bloqueio.motivo && (
          <p className="mt-1 text-body-sm text-tinta-70">{bloqueio.motivo}</p>
        )}
      </div>
      <form action={excluirBloqueio}>
        <input type="hidden" name="id" value={bloqueio.id} />
        <button
          type="submit"
          aria-label="Excluir bloqueio"
          className="btn btn-destructive h-9 px-3"
        >
          <Trash2 size={16} strokeWidth={2} aria-hidden />
        </button>
      </form>
    </StaggerItem>
  );
}
