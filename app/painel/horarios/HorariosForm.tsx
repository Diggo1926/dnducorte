"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { HorarioTrabalho } from "@prisma/client";
import { salvarHorarios, type HorariosState } from "./actions";

const DIA_LABEL = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

const initialState: HorariosState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-[12px] bg-ouro px-4 py-2 font-bold uppercase tracking-wide text-tinta disabled:opacity-60"
    >
      {pending ? "Salvando..." : "Salvar horários"}
    </button>
  );
}

export default function HorariosForm({
  horarios,
}: {
  horarios: HorarioTrabalho[];
}) {
  const [state, formAction] = useFormState(salvarHorarios, initialState);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-[12px] border border-cromo bg-fundo p-4"
    >
      {DIA_LABEL.map((label, dia) => {
        const horario = horarios.find((h) => h.diaSemana === dia);
        return (
          <div
            key={dia}
            className="flex flex-wrap items-center gap-3 border-b border-cromo/40 pb-2 last:border-0"
          >
            <label className="flex w-32 items-center gap-2 text-sm font-semibold text-tinta">
              <input
                type="checkbox"
                name={`dia-${dia}-ativo`}
                defaultChecked={horario?.ativo ?? false}
              />
              {label}
            </label>
            <input
              type="time"
              name={`dia-${dia}-inicio`}
              defaultValue={horario?.horaInicio ?? "09:00"}
              className="rounded-[12px] border border-cromo px-2 py-1"
            />
            <span className="text-tinta/60">até</span>
            <input
              type="time"
              name={`dia-${dia}-fim`}
              defaultValue={horario?.horaFim ?? "18:00"}
              className="rounded-[12px] border border-cromo px-2 py-1"
            />
          </div>
        );
      })}
      {state.error && (
        <p className="text-sm text-vermelho" role="alert">
          {state.error}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
