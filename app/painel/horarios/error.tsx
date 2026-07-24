"use client";

import ErrorState from "../ErrorState";

export default function ErrorHorarios({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <ErrorState message="Erro ao carregar horários." reset={reset} />;
}
