"use client";

import ErrorState from "../ErrorState";

export default function ErrorConfiguracoes({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <ErrorState message="Erro ao carregar as configurações." reset={reset} />;
}
