"use client";

import { useFormState, useFormStatus } from "react-dom";
import { criarBloqueio, type BloqueioState } from "./actions";

const initialState: BloqueioState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-[12px] bg-ouro px-4 py-2 font-bold uppercase tracking-wide text-tinta disabled:opacity-60"
    >
      {pending ? "Salvando..." : "Adicionar bloqueio"}
    </button>
  );
}

export default function BloqueioForm() {
  const [state, formAction] = useFormState(criarBloqueio, initialState);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-[12px] border border-cromo bg-fundo p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-tinta">
            Início
          </label>
          <input
            type="datetime-local"
            name="inicio"
            required
            className="w-full rounded-[12px] border border-cromo px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-tinta">
            Fim
          </label>
          <input
            type="datetime-local"
            name="fim"
            required
            className="w-full rounded-[12px] border border-cromo px-3 py-2"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-tinta">
          Motivo
        </label>
        <input
          name="motivo"
          className="w-full rounded-[12px] border border-cromo px-3 py-2"
        />
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
