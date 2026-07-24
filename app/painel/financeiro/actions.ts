"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const saidaSchema = z.object({
  descricao: z.string().min(1),
  valorCentavos: z.coerce.number().int().positive(),
  data: z.coerce.date(),
  categoria: z.string().min(1),
});

async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("Não autenticado.");
  return session;
}

export type SaidaState = { error?: string };

export async function criarSaida(
  _prev: SaidaState,
  formData: FormData
): Promise<SaidaState> {
  const session = await requireSession();

  const parsed = saidaSchema.safeParse({
    descricao: formData.get("descricao"),
    valorCentavos: formData.get("valorCentavos"),
    data: formData.get("data"),
    categoria: formData.get("categoria"),
  });

  if (!parsed.success) {
    return { error: "Preencha descrição, valor, data e categoria corretamente." };
  }

  await prisma.lancamento.create({
    data: {
      barbeariaId: session.barbeariaId,
      tipo: "SAIDA",
      descricao: parsed.data.descricao,
      valorCentavos: parsed.data.valorCentavos,
      data: parsed.data.data,
      categoria: parsed.data.categoria,
    },
  });

  revalidatePath("/painel/financeiro");
  return {};
}

export async function excluirLancamento(formData: FormData) {
  const session = await requireSession();
  const id = formData.get("id") as string;

  await prisma.lancamento.deleteMany({
    where: { id, barbeariaId: session.barbeariaId, agendamentoId: null },
  });

  revalidatePath("/painel/financeiro");
}
