import Image from "next/image";

export default function PublicHeader({ nome }: { nome: string }) {
  return (
    <header className="sticky top-0 z-30 bg-tinta">
      <div className="tricolor-stripe" />
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-preto.png"
            alt=""
            aria-hidden
            width={40}
            height={40}
            className="logo-medallion"
          />
          <span className="font-display text-body-lg uppercase leading-none text-branco">
            {nome}
          </span>
        </div>
        <a href="#agendamento" className="btn btn-primary">
          Agendar horário
        </a>
      </div>
    </header>
  );
}
