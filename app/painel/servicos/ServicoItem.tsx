"use client";

import Image from "next/image";
import type { Servico } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { StaggerItem } from "../StaggerList";
import { toggleAtivo, deleteServico } from "./actions";

function formatPreco(centavos: number) {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function ServicoCard({ servico }: { servico: Servico }) {
  return (
    <StaggerItem className="overflow-hidden rounded border border-cromo bg-branco transition-all duration-150 hover:border-ouro hover:shadow-md">
      <div className="flex items-center gap-4 p-4">
        {servico.fotoUrl ? (
          <Image
            src={servico.fotoUrl}
            alt={servico.nome}
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded object-cover"
          />
        ) : (
          <div className="h-14 w-14 shrink-0 rounded bg-creme" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-h3 text-tinta">
            {servico.nome}
          </p>
          <p className="mt-1 text-body-sm text-tinta-70">
            {servico.duracaoMinutos} min
          </p>
        </div>
        <p className="shrink-0 font-display text-h3 text-ouro-texto">
          {formatPreco(servico.precoCentavos)}
        </p>
      </div>
      <div className="tricolor-stripe" />
      <div className="flex items-center justify-between gap-2 p-4 pt-3">
        <form action={toggleAtivo}>
          <input type="hidden" name="id" value={servico.id} />
          <button
            type="submit"
            className={`rounded px-3 py-1 text-body-sm font-semibold uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-azul ${
              servico.ativo
                ? "bg-ouro text-tinta"
                : "bg-creme text-tinta-70 hover:bg-cromo"
            }`}
          >
            {servico.ativo ? "Ativo" : "Inativo"}
          </button>
        </form>
        <form action={deleteServico}>
          <input type="hidden" name="id" value={servico.id} />
          <button
            type="submit"
            aria-label={`Excluir ${servico.nome}`}
            className="btn btn-destructive h-9 px-3"
          >
            <Trash2 size={16} strokeWidth={2} aria-hidden />
          </button>
        </form>
      </div>
    </StaggerItem>
  );
}

export function ServicoRow({ servico }: { servico: Servico }) {
  return (
    <StaggerItem as="tr" className="border-b border-cromo last:border-0 transition-colors duration-150 hover:bg-creme">
      <td className="py-3 pr-4">
        <div className="flex items-center gap-3">
          {servico.fotoUrl ? (
            <Image
              src={servico.fotoUrl}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded object-cover"
            />
          ) : (
            <div className="h-10 w-10 shrink-0 rounded bg-creme" />
          )}
          <span className="font-semibold text-tinta">{servico.nome}</span>
        </div>
      </td>
      <td className="py-3 pr-4 text-body-sm text-tinta-70">
        {servico.duracaoMinutos} min
      </td>
      <td className="py-3 pr-4 font-display text-h3 text-ouro-texto">
        {formatPreco(servico.precoCentavos)}
      </td>
      <td className="py-3 pr-4">
        <form action={toggleAtivo}>
          <input type="hidden" name="id" value={servico.id} />
          <button
            type="submit"
            className={`rounded px-3 py-1 text-body-sm font-semibold uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-azul ${
              servico.ativo
                ? "bg-ouro text-tinta"
                : "bg-creme text-tinta-70 hover:bg-cromo"
            }`}
          >
            {servico.ativo ? "Ativo" : "Inativo"}
          </button>
        </form>
      </td>
      <td className="py-3 text-right">
        <form action={deleteServico}>
          <input type="hidden" name="id" value={servico.id} />
          <button
            type="submit"
            aria-label={`Excluir ${servico.nome}`}
            className="btn btn-destructive h-9 px-3"
          >
            <Trash2 size={16} strokeWidth={2} aria-hidden />
          </button>
        </form>
      </td>
    </StaggerItem>
  );
}
