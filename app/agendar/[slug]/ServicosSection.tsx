import Image from "next/image";
import { getImagemServico } from "@/lib/servico-imagem";

type Servico = {
  id: string;
  nome: string;
  descricao: string | null;
  precoCentavos: number;
  duracaoMinutos: number;
  fotoUrl: string | null;
};

function formatPreco(centavos: number) {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function ServicosSection({ servicos }: { servicos: Servico[] }) {
  if (servicos.length === 0) return null;

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-16 sm:px-6">
      <div className="text-center">
        <p className="eyebrow">Serviços</p>
        <h2 className="mt-1 font-display text-h1 uppercase text-tinta">
          O que fazemos
        </h2>
      </div>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {servicos.map((servico) => (
          <li
            key={servico.id}
            className="flex flex-col overflow-hidden rounded border border-cromo bg-branco transition-all duration-150 hover:-translate-y-1 hover:border-ouro hover:shadow-lg"
          >
            <div className="relative aspect-video w-full bg-creme">
              <Image
                src={getImagemServico(servico.nome, servico.fotoUrl)}
                alt={servico.nome}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-6">
              <p className="font-display text-h3 uppercase text-tinta">
                {servico.nome}
              </p>
              {servico.descricao && (
                <p className="line-clamp-2 text-body-sm text-tinta-70">
                  {servico.descricao}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between px-6 pb-6">
              <span className="text-body-sm text-tinta-70">
                {servico.duracaoMinutos} min
              </span>
              <span className="font-display text-h3 text-ouro-texto">
                {formatPreco(servico.precoCentavos)}
              </span>
            </div>
            <div className="tricolor-stripe" />
          </li>
        ))}
      </ul>
    </section>
  );
}
