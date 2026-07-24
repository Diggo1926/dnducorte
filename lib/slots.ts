import { prisma } from "@/lib/prisma";

export type Slot = { inicio: Date; fim: Date };

export async function getSlotsDisponiveis({
  barbeariaId,
  servicoId,
  data,
}: {
  barbeariaId: string;
  servicoId: string;
  data: string;
}): Promise<Slot[]> {
  const barbearia = await prisma.barbearia.findUnique({ where: { id: barbeariaId } });
  const servico = await prisma.servico.findFirst({
    where: { id: servicoId, barbeariaId, ativo: true },
  });
  if (!barbearia || !servico) return [];

  const [ano, mes, dia] = data.split("-").map(Number);
  if (!ano || !mes || !dia) return [];

  const diaSemana = new Date(ano, mes - 1, dia).getDay();
  const horario = await prisma.horarioTrabalho.findFirst({
    where: { barbeariaId, diaSemana, ativo: true },
  });
  if (!horario) return [];

  const [hi, mi] = horario.horaInicio.split(":").map(Number);
  const [hf, mf] = horario.horaFim.split(":").map(Number);
  const inicioExpediente = new Date(ano, mes - 1, dia, hi, mi);
  const fimExpediente = new Date(ano, mes - 1, dia, hf, mf);

  const duracaoMs = servico.duracaoMinutos * 60000;
  const intervaloMs = barbearia.intervaloMinutos * 60000;
  const limiteMinimo = new Date(
    Date.now() + barbearia.antecedenciaMinimaHoras * 3600000
  );

  const inicioDia = new Date(ano, mes - 1, dia, 0, 0, 0);
  const fimDia = new Date(ano, mes - 1, dia, 23, 59, 59);

  const [bloqueios, agendamentos] = await Promise.all([
    prisma.bloqueio.findMany({
      where: { barbeariaId, inicio: { lt: fimDia }, fim: { gt: inicioDia } },
    }),
    prisma.agendamento.findMany({
      where: {
        barbeariaId,
        status: { not: "CANCELADO" },
        inicio: { lt: fimDia },
        fim: { gt: inicioDia },
      },
    }),
  ]);

  const ocupados = [...bloqueios, ...agendamentos];
  const slots: Slot[] = [];
  let cursor = new Date(inicioExpediente);

  while (cursor.getTime() + duracaoMs <= fimExpediente.getTime()) {
    const inicioSlot = new Date(cursor);
    const fimSlot = new Date(cursor.getTime() + duracaoMs);

    const conflita = ocupados.some((o) => inicioSlot < o.fim && fimSlot > o.inicio);
    const antesDoLimite = inicioSlot < limiteMinimo;

    if (!conflita && !antesDoLimite) {
      slots.push({ inicio: inicioSlot, fim: fimSlot });
    }

    cursor = new Date(cursor.getTime() + intervaloMs);
  }

  return slots;
}
