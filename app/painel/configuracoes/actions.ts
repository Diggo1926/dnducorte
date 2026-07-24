"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const configSchema = z.object({
  nome: z.string().min(1),
  telefone: z.string().min(8),
  endereco: z.string().min(1),
  logoUrl: z.string().url().optional().or(z.literal("")),
  corPrimaria: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  corSecundaria: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  corDestaque: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  intervaloMinutos: z.coerce.number().int().positive(),
  antecedenciaMinimaHoras: z.coerce.number().int().min(0),
});

async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("Não autenticado.");
  return session;
}

export type ConfiguracoesState = { error?: string; sucesso?: boolean };

export async function atualizarConfiguracoes(
  _prev: ConfiguracoesState,
  formData: FormData
): Promise<ConfiguracoesState> {
  const session = await requireSession();

  const parsed = configSchema.safeParse({
    nome: formData.get("nome"),
    telefone: formData.get("telefone"),
    endereco: formData.get("endereco"),
    logoUrl: formData.get("logoUrl"),
    corPrimaria: formData.get("corPrimaria"),
    corSecundaria: formData.get("corSecundaria"),
    corDestaque: formData.get("corDestaque"),
    intervaloMinutos: formData.get("intervaloMinutos"),
    antecedenciaMinimaHoras: formData.get("antecedenciaMinimaHoras"),
  });

  if (!parsed.success) {
    return { error: "Verifique os campos preenchidos." };
  }

  await prisma.barbearia.update({
    where: { id: session.barbeariaId },
    data: {
      nome: parsed.data.nome,
      telefone: parsed.data.telefone,
      endereco: parsed.data.endereco,
      logoUrl: parsed.data.logoUrl || null,
      corPrimaria: parsed.data.corPrimaria,
      corSecundaria: parsed.data.corSecundaria,
      corDestaque: parsed.data.corDestaque,
      intervaloMinutos: parsed.data.intervaloMinutos,
      antecedenciaMinimaHoras: parsed.data.antecedenciaMinimaHoras,
    },
  });

  revalidatePath("/painel/configuracoes");
  return { sucesso: true };
}
