"use client";

import { AlertTriangle } from "lucide-react";

export default function ErrorState({
  message,
  reset,
}: {
  message: string;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded border border-vermelho bg-branco p-8 text-center">
      <AlertTriangle size={24} strokeWidth={2} className="text-vermelho" aria-hidden />
      <p className="text-body-sm text-vermelho">{message}</p>
      <button onClick={reset} className="btn btn-secondary">
        Tentar novamente
      </button>
    </div>
  );
}
