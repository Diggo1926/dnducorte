"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Plus } from "lucide-react";
import { criarSaida, type SaidaState } from "./actions";

const initialState: SaidaState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary">
      <Plus size={18} strokeWidth={2} aria-hidden />
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
      className="flex flex-col gap-4 rounded border border-cromo bg-branco p-6"
    >
      <input type="hidden" name="valorCentavos" value={valorCentavos} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-tinta">
            Descrição
          </label>
          <input name="descricao" required className="w-full" />
        </div>
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-tinta">
            Valor (R$)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={valorReais}
            onChange={(e) => setValorReais(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-tinta">
            Data
          </label>
          <input type="date" name="data" required className="w-full" />
        </div>
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-tinta">
            Categoria
          </label>
          <input name="categoria" required className="w-full" />
        </div>
      </div>
      {state.error && (
        <p className="text-body-sm text-vermelho" role="alert">
          {state.error}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
