"use client";

import ErrorState from "../ErrorState";

export default function ErrorServicos({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <ErrorState message="Erro ao carregar serviços." reset={reset} />;
}
