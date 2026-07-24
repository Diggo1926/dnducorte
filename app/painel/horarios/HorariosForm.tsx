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
    <button type="submit" disabled={pending} className="btn btn-primary">
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
      className="flex flex-col gap-4 rounded border border-cromo bg-branco p-6"
    >
      <div className="flex flex-col divide-y divide-cromo">
        {DIA_LABEL.map((label, dia) => {
          const horario = horarios.find((h) => h.diaSemana === dia);
          return (
            <div
              key={dia}
              className="flex flex-wrap items-center gap-4 py-3 first:pt-0 last:pb-0"
            >
              <label className="flex w-32 shrink-0 items-center gap-2 text-body-sm font-semibold text-tinta">
                <input
                  type="checkbox"
                  name={`dia-${dia}-ativo`}
                  defaultChecked={horario?.ativo ?? false}
                  className="h-4 w-4 accent-ouro"
                />
                {label}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  name={`dia-${dia}-inicio`}
                  defaultValue={horario?.horaInicio ?? "09:00"}
                  className="w-[110px]"
                />
                <span className="text-body-sm text-tinta-70">até</span>
                <input
                  type="time"
                  name={`dia-${dia}-fim`}
                  defaultValue={horario?.horaFim ?? "18:00"}
                  className="w-[110px]"
                />
              </div>
            </div>
          );
        })}
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
