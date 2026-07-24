"use client";

export default function ErrorConfiguracoes({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="rounded-[12px] border border-vermelho bg-fundo p-4">
      <p className="text-sm text-vermelho">Erro ao carregar as configurações.</p>
      <button onClick={reset} className="mt-2 text-sm text-tinta underline">
        Tentar novamente
      </button>
    </div>
  );
}
