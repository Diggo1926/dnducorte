"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const statusSchema = z.enum([
  "PENDENTE",
  "CONFIRMADO",
  "CONCLUIDO",
  "CANCELADO",
  "FALTOU",
]);

async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("Não autenticado.");
  return session;
}

export async function atualizarStatus(formData: FormData) {
  const session = await requireSession();
  const id = formData.get("id") as string;
  const parsedStatus = statusSchema.safeParse(formData.get("status"));
  if (!parsedStatus.success) return;

  const agendamento = await prisma.agendamento.findFirst({
    where: { id, barbeariaId: session.barbeariaId },
  });
  if (!agendamento) return;

  const novoStatus = parsedStatus.data;
  if (novoStatus === agendamento.status) return;

  await prisma.$transaction(async (tx) => {
    await tx.agendamento.update({ where: { id }, data: { status: novoStatus } });

    if (novoStatus === "CONCLUIDO" && agendamento.status !== "CONCLUIDO") {
      await tx.lancamento.upsert({
        where: { agendamentoId: id },
        update: {},
        create: {
          barbeariaId: session.barbeariaId,
          tipo: "ENTRADA",
          descricao: `Atendimento - ${agendamento.clienteNome}`,
          valorCentavos: agendamento.precoCentavos,
          data: agendamento.inicio,
          categoria: "Atendimento",
          agendamentoId: id,
        },
      });
    }

    if (agendamento.status === "CONCLUIDO" && novoStatus !== "CONCLUIDO") {
      await tx.lancamento.deleteMany({ where: { agendamentoId: id } });
    }
  });

  revalidatePath("/painel/agenda");
  revalidatePath("/painel/financeiro");
}
