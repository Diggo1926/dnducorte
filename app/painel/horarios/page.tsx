import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import PageHeader from "../PageHeader";
import EmptyState from "../EmptyState";
import { StaggerList } from "../StaggerList";
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
      <PageHeader
        eyebrow="Painel"
        title="Horários"
        description="Defina quando a barbearia atende e bloqueie períodos indisponíveis."
      />

      <section className="flex flex-col gap-4">
        <div>
          <p className="eyebrow">Semana</p>
          <h2 className="mt-1 font-display text-h2 text-tinta">
            Horário de trabalho
          </h2>
        </div>
        <HorariosForm horarios={horarios} />
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <p className="eyebrow">Exceções</p>
          <h2 className="mt-1 font-display text-h2 text-tinta">Bloqueios</h2>
        </div>
        <BloqueioForm />
        {bloqueios.length === 0 ? (
          <EmptyState title="Nenhum bloqueio cadastrado" />
        ) : (
          <StaggerList className="flex flex-col gap-3">
            {bloqueios.map((bloqueio) => (
              <BloqueioItem key={bloqueio.id} bloqueio={bloqueio} />
            ))}
          </StaggerList>
        )}
      </section>
    </div>
  );
}
