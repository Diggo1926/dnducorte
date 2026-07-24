"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Plus } from "lucide-react";
import { criarBloqueio, type BloqueioState } from "./actions";

const initialState: BloqueioState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary">
      <Plus size={18} strokeWidth={2} aria-hidden />
      {pending ? "Salvando..." : "Adicionar bloqueio"}
    </button>
  );
}

export default function BloqueioForm() {
  const [state, formAction] = useFormState(criarBloqueio, initialState);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded border border-cromo bg-branco p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-tinta">
            Início
          </label>
          <input
            type="datetime-local"
            name="inicio"
            required
            className="w-full"
          />
        </div>
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-tinta">
            Fim
          </label>
          <input
            type="datetime-local"
            name="fim"
            required
            className="w-full"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-body-sm font-semibold text-tinta">
          Motivo
        </label>
        <input name="motivo" className="w-full" />
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
