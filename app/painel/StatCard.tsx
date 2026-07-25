"use client";

import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

const ACCENT_CLASS = {
  tinta: "text-tinta",
  ouro: "text-ouro-texto",
  vermelho: "text-vermelho",
} as const;

function formatarNumero(n: number, formato: "inteiro" | "moeda") {
  const arredondado = Math.round(n);
  if (formato === "moeda") {
    return (arredondado / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
  return String(arredondado);
}

function CountUp({
  to,
  formato,
}: {
  to: number;
  formato: "inteiro" | "moeda";
}) {
  const reduzirMovimento = useReducedMotion();
  const [exibido, setExibido] = useState(reduzirMovimento ? to : 0);

  useEffect(() => {
    if (reduzirMovimento) {
      setExibido(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: setExibido,
    });
    return () => controls.stop();
  }, [to, reduzirMovimento]);

  return <>{formatarNumero(exibido, formato)}</>;
}

export default function StatCard({
  label,
  value,
  icon,
  accent = "tinta",
  numero,
  formato,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  accent?: keyof typeof ACCENT_CLASS;
  numero?: number;
  formato?: "inteiro" | "moeda";
}) {
  return (
    <div className="rounded border border-cromo bg-branco p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-body-sm text-tinta-70">{label}</p>
        {icon}
      </div>
      <p className={`mt-1 font-display text-number ${ACCENT_CLASS[accent]}`}>
        {numero !== undefined && formato ? (
          <CountUp to={numero} formato={formato} />
        ) : (
          value
        )}
      </p>
    </div>
  );
}
