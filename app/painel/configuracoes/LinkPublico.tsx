"use client";

import { useState } from "react";

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
    <div className="flex flex-col items-start gap-4 rounded-[12px] border border-cromo bg-fundo p-4 sm:flex-row sm:items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={qrCodeDataUrl}
        alt="QR Code do link de agendamento"
        className="h-32 w-32 rounded-[12px]"
      />
      <div className="flex flex-1 flex-col gap-2">
        <p className="break-all text-sm text-tinta">{link}</p>
        <button
          onClick={copiar}
          className="self-start rounded-[12px] bg-ouro px-4 py-2 text-sm font-bold uppercase text-tinta"
        >
          {copiado ? "Copiado!" : "Copiar link"}
        </button>
      </div>
    </div>
  );
}
