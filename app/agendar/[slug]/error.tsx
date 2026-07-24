"use client";

export default function ErrorAgendar({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-superficie px-4 text-center">
      <p className="text-sm text-vermelho">
        Não foi possível carregar a página de agendamento.
      </p>
      <button onClick={reset} className="text-sm text-tinta underline">
        Tentar novamente
      </button>
    </main>
  );
}
