"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { criarSaida, type SaidaState } from "./actions";

const initialState: SaidaState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-[12px] bg-ouro px-4 py-2 font-bold uppercase tracking-wide text-tinta disabled:opacity-60"
    >
      {pending ? "Salvando..." : "Adicionar saída"}
    </button>
  );
}

export default function LancamentoForm() {
  const [state, formAction] = useFormState(criarSaida, initialState);
  const [valorReais, setValorReais] = useState("");
  const valorCentavos = valorReais ? Math.round(parseFloat(valorReais) * 100) : "";

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-[12px] border border-cromo bg-fundo p-4"
    >
      <input type="hidden" name="valorCentavos" value={valorCentavos} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-tinta">
            Descrição
          </label>
          <input
            name="descricao"
            required
            className="w-full rounded-[12px] border border-cromo px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-tinta">
            Valor (R$)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={valorReais}
            onChange={(e) => setValorReais(e.target.value)}
            className="w-full rounded-[12px] border border-cromo px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-tinta">
            Data
          </label>
          <input
            type="date"
            name="data"
            required
            className="w-full rounded-[12px] border border-cromo px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-tinta">
            Categoria
          </label>
          <input
            name="categoria"
            required
            className="w-full rounded-[12px] border border-cromo px-3 py-2"
          />
        </div>
      </div>
      {state.error && (
        <p className="text-sm text-vermelho" role="alert">
          {state.error}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
