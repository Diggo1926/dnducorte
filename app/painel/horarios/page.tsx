import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import HorariosForm from "./HorariosForm";
import BloqueioForm from "./BloqueioForm";
import BloqueioItem from "./BloqueioItem";

export default async function HorariosPage() {
  const session = await getSession();
  if (!session) return null;

  const [horarios, bloqueios] = await Promise.all([
    prisma.horarioTrabalho.findMany({
      where: { barbeariaId: session.barbeariaId },
    }),
    prisma.bloqueio.findMany({
      where: { barbeariaId: session.barbeariaId },
      orderBy: { inicio: "asc" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h1 className="text-xl font-bold uppercase tracking-tight text-tinta">
          Horário de trabalho
        </h1>
        <HorariosForm horarios={horarios} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-bold uppercase tracking-tight text-tinta">
          Bloqueios
        </h2>
        <BloqueioForm />
        {bloqueios.length === 0 ? (
          <p className="text-sm text-tinta/60">Nenhum bloqueio cadastrado.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {bloqueios.map((bloqueio) => (
              <BloqueioItem key={bloqueio.id} bloqueio={bloqueio} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
