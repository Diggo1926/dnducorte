import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-tinta px-4 py-16 text-center">
      <Image
        src="/logo-branco.png"
        alt="Dndu Corte"
        width={120}
        height={120}
        priority
        className="logo-medallion h-[120px] w-[120px]"
      />
      <div className="flex flex-col items-center gap-2">
        <h1 className="font-display text-h1 uppercase text-branco">Dndu Corte</h1>
        <p className="text-body text-branco-70">Sistema de agendamento para barbearias</p>
      </div>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Link href="/agendar/dndu-corte" className="btn btn-primary">
          Agendar horário
        </Link>
        <Link href="/login" className="btn btn-secondary-invert">
          Área administrativa
        </Link>
      </div>
    </main>
  );
}
