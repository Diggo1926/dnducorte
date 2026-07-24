"use client";

import ErrorState from "../ErrorState";

export default function ErrorAgenda({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <ErrorState message="Erro ao carregar a agenda." reset={reset} />;
}
