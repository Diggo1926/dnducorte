"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function LinkPublico({
  link,
  qrCodeDataUrl,
}: {
  link: string;
  qrCodeDataUrl: string;
}) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setCopiado(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-4 rounded border border-cromo bg-branco p-6 sm:flex-row sm:items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={qrCodeDataUrl}
        alt="QR Code do link de agendamento"
        className="h-32 w-32 shrink-0 rounded border border-cromo"
      />
      <div className="flex flex-1 flex-col gap-3">
        <p className="break-all text-body-sm text-tinta-70">{link}</p>
        <button onClick={copiar} className="btn btn-secondary self-start">
          {copiado ? (
            <>
              <Check size={18} strokeWidth={2} aria-hidden />
              Copiado!
            </>
          ) : (
            <>
              <Copy size={18} strokeWidth={2} aria-hidden />
              Copiar link
            </>
          )}
        </button>
      </div>
    </div>
  );
}
