"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const servicoSchema = z.object({
  nome: z.string().min(1),
  descricao: z.string().optional(),
  precoCentavos: z.coerce.number().int().positive(),
  duracaoMinutos: z.coerce.number().int().positive(),
  fotoUrl: z.string().url().optional().or(z.literal("")),
});

async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("Não autenticado.");
  return session;
}

export type ServicoState = { error?: string; ok?: boolean };

export async function createServico(
  _prev: ServicoState,
  formData: FormData
): Promise<ServicoState> {
  const session = await requireSession();

  const parsed = servicoSchema.safeParse({
    nome: formData.get("nome"),
    descricao: formData.get("descricao"),
    precoCentavos: formData.get("precoCentavos"),
    duracaoMinutos: formData.get("duracaoMinutos"),
    fotoUrl: formData.get("fotoUrl"),
  });

  if (!parsed.success) {
    return { error: "Preencha nome, preço e duração corretamente." };
  }

  const count = await prisma.servico.count({
    where: { barbeariaId: session.barbeariaId },
  });

  await prisma.servico.create({
    data: {
      barbeariaId: session.barbeariaId,
      nome: parsed.data.nome,
      descricao: parsed.data.descricao || null,
      precoCentavos: parsed.data.precoCentavos,
      duracaoMinutos: parsed.data.duracaoMinutos,
      fotoUrl: parsed.data.fotoUrl || null,
      ordem: count,
    },
  });

  revalidatePath("/painel/servicos");
  return { ok: true };
}

export async function updateServico(
  _prev: ServicoState,
  formData: FormData
): Promise<ServicoState> {
  const session = await requireSession();
  const id = formData.get("id") as string;

  const parsed = servicoSchema.safeParse({
    nome: formData.get("nome"),
    descricao: formData.get("descricao"),
    precoCentavos: formData.get("precoCentavos"),
    duracaoMinutos: formData.get("duracaoMinutos"),
    fotoUrl: formData.get("fotoUrl"),
  });

  if (!parsed.success) {
    return { error: "Preencha nome, preço e duração corretamente." };
  }

  const { count } = await prisma.servico.updateMany({
    where: { id, barbeariaId: session.barbeariaId },
    data: {
      nome: parsed.data.nome,
      descricao: parsed.data.descricao || null,
      precoCentavos: parsed.data.precoCentavos,
      duracaoMinutos: parsed.data.duracaoMinutos,
      fotoUrl: parsed.data.fotoUrl || null,
    },
  });

  if (count === 0) {
    return { error: "Serviço não encontrado." };
  }

  revalidatePath("/painel/servicos");
  return { ok: true };
}

export async function toggleAtivo(formData: FormData) {
  const session = await requireSession();
  const id = formData.get("id") as string;

  const servico = await prisma.servico.findFirst({
    where: { id, barbeariaId: session.barbeariaId },
  });
  if (!servico) return;

  await prisma.servico.update({
    where: { id },
    data: { ativo: !servico.ativo },
  });
  revalidatePath("/painel/servicos");
}

export async function deleteServico(formData: FormData) {
  const session = await requireSession();
  const id = formData.get("id") as string;

  await prisma.servico.deleteMany({
    where: { id, barbeariaId: session.barbeariaId },
  });
  revalidatePath("/painel/servicos");
}
