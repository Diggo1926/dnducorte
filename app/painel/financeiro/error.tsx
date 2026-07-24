"use client";

import ErrorState from "../ErrorState";

export default function ErrorFinanceiro({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <ErrorState message="Erro ao carregar o financeiro." reset={reset} />;
}
