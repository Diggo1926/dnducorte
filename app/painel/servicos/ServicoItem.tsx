import Image from "next/image";
import type { Servico } from "@prisma/client";
import { toggleAtivo, deleteServico } from "./actions";

function formatPreco(centavos: number) {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function ServicoItem({ servico }: { servico: Servico }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-4 rounded-[12px] border border-cromo bg-fundo p-4 shadow-sm">
      <div className="flex items-center gap-3">
        {servico.fotoUrl ? (
          <Image
            src={servico.fotoUrl}
            alt={servico.nome}
            width={48}
            height={48}
            className="h-12 w-12 rounded-[12px] object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded-[12px] bg-superficie" />
        )}
        <div>
          <p className="font-semibold text-tinta">{servico.nome}</p>
          <p className="text-sm text-tinta/60">
            {formatPreco(servico.precoCentavos)} · {servico.duracaoMinutos} min
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <form action={toggleAtivo}>
          <input type="hidden" name="id" value={servico.id} />
          <button
            type="submit"
            className={`rounded-[12px] px-3 py-1 text-xs font-semibold uppercase ${
              servico.ativo ? "bg-ouro text-tinta" : "bg-cromo text-tinta"
            }`}
          >
            {servico.ativo ? "Ativo" : "Inativo"}
          </button>
        </form>
        <form action={deleteServico}>
          <input type="hidden" name="id" value={servico.id} />
          <button
            type="submit"
            className="rounded-[12px] border border-vermelho px-3 py-1 text-xs font-semibold uppercase text-vermelho"
          >
            Excluir
          </button>
        </form>
      </div>
    </li>
  );
}
