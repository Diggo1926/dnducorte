"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const DIAS = [0, 1, 2, 3, 4, 5, 6] as const;
const horaSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/);

async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("Não autenticado.");
  return session;
}

export type HorariosState = { error?: string };

export async function salvarHorarios(
  _prev: HorariosState,
  formData: FormData
): Promise<HorariosState> {
  const session = await requireSession();

  for (const dia of DIAS) {
    const ativo = formData.get(`dia-${dia}-ativo`) === "on";
    const horaInicioRaw = formData.get(`dia-${dia}-inicio`);
    const horaFimRaw = formData.get(`dia-${dia}-fim`);

    if (ativo) {
      if (
        !horaSchema.safeParse(horaInicioRaw).success ||
        !horaSchema.safeParse(horaFimRaw).success
      ) {
        return { error: "Preencha início e fim para os dias ativos." };
      }
      if (typeof horaInicioRaw === "string" && typeof horaFimRaw === "string" && horaFimRaw <= horaInicioRaw) {
        return { error: "O horário de fim deve ser depois do início." };
      }
    }

    const horaInicio =
      typeof horaInicioRaw === "string" && horaInicioRaw ? horaInicioRaw : "09:00";
    const horaFim =
      typeof horaFimRaw === "string" && horaFimRaw ? horaFimRaw : "18:00";

    const existente = await prisma.horarioTrabalho.findFirst({
      where: { barbeariaId: session.barbeariaId, diaSemana: dia },
    });

    if (existente) {
      await prisma.horarioTrabalho.update({
        where: { id: existente.id },
        data: { horaInicio, horaFim, ativo },
      });
    } else {
      await prisma.horarioTrabalho.create({
        data: {
          barbeariaId: session.barbeariaId,
          diaSemana: dia,
          horaInicio,
          horaFim,
          ativo,
        },
      });
    }
  }

  revalidatePath("/painel/horarios");
  return {};
}

const bloqueioSchema = z.object({
  inicio: z.coerce.date(),
  fim: z.coerce.date(),
  motivo: z.string().optional(),
});

export type BloqueioState = { error?: string };

export async function criarBloqueio(
  _prev: BloqueioState,
  formData: FormData
): Promise<BloqueioState> {
  const session = await requireSession();

  const parsed = bloqueioSchema.safeParse({
    inicio: formData.get("inicio"),
    fim: formData.get("fim"),
    motivo: formData.get("motivo"),
  });

  if (!parsed.success || parsed.data.fim <= parsed.data.inicio) {
    return { error: "Informe um período válido (fim após o início)." };
  }

  await prisma.bloqueio.create({
    data: {
      barbeariaId: session.barbeariaId,
      inicio: parsed.data.inicio,
      fim: parsed.data.fim,
      motivo: parsed.data.motivo || null,
    },
  });

  revalidatePath("/painel/horarios");
  return {};
}

export async function excluirBloqueio(formData: FormData) {
  const session = await requireSession();
  const id = formData.get("id") as string;
  await prisma.bloqueio.deleteMany({
    where: { id, barbeariaId: session.barbeariaId },
  });
  revalidatePath("/painel/horarios");
}
