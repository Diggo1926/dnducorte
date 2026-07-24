import Image from "next/image";
import { MapPin } from "lucide-react";

export default function Hero({
  nome,
  endereco,
}: {
  nome: string;
  endereco: string;
}) {
  return (
    <section className="relative isolate flex min-h-[45vh] flex-col items-center justify-center overflow-hidden bg-tinta px-4 py-16 text-center sm:px-6 lg:min-h-[60vh]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--ouro) 16%, transparent), transparent 60%)",
        }}
      />
      <div className="relative flex flex-col items-center gap-6">
        <Image src="/logo-branco.png" alt={nome} width={160} height={64} priority />
        <div className="flex flex-col items-center gap-3">
          <p className="eyebrow eyebrow-invert">Barbearia</p>
          <h1 className="max-w-2xl font-display text-display uppercase leading-none text-branco">
            {nome}
          </h1>
          <p className="flex items-center gap-2 text-body text-branco-70">
            <MapPin size={16} strokeWidth={2} aria-hidden />
            {endereco}
          </p>
        </div>
        <a href="#agendamento" className="btn btn-primary">
          Agendar horário
        </a>
      </div>
    </section>
  );
}
