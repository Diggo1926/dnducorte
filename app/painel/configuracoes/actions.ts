"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const DIACRITICOS = new RegExp(
  String.fromCharCode(0x5b) + String.fromCharCode(0x300) + "-" + String.fromCharCode(0x36f) + String.fromCharCode(0x5d),
  "g"
);

function normalizarSlug(valor: string) {
  return valor
    .normalize("NFD")
    .replace(DIACRITICOS, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const configSchema = z.object({
  nome: z.string().min(1),
  slug: z.string().min(1),
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
    slug: formData.get("slug"),
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

  const slug = normalizarSlug(parsed.data.slug);
  if (slug.length < 3) {
    return { error: "O link (slug) deve ter pelo menos 3 caracteres." };
  }

  const slugEmUso = await prisma.barbearia.findFirst({
    where: { slug, NOT: { id: session.barbeariaId } },
  });
  if (slugEmUso) {
    return { error: "Esse link já está em uso por outra barbearia. Escolha outro." };
  }

  await prisma.barbearia.update({
    where: { id: session.barbeariaId },
    data: {
      nome: parsed.data.nome,
      slug,
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
  revalidatePath(`/agendar/${slug}`);
  return { sucesso: true };
}
