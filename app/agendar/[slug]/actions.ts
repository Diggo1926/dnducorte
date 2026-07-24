"use server";

import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSlotsDisponiveis } from "@/lib/slots";

const buscarSlotsSchema = z.object({
  slug: z.string(),
  servicoId: z.string(),
  data: z.string(),
});

export async function buscarSlots(input: {
  slug: string;
  servicoId: string;
  data: string;
}) {
  const parsed = buscarSlotsSchema.safeParse(input);
  if (!parsed.success) return [];

  const barbearia = await prisma.barbearia.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (!barbearia) return [];

  const slots = await getSlotsDisponiveis({
    barbeariaId: barbearia.id,
    servicoId: parsed.data.servicoId,
    data: parsed.data.data,
  });

  return slots.map((s) => ({
    inicio: s.inicio.toISOString(),
    fim: s.fim.toISOString(),
  }));
}

const criarAgendamentoSchema = z.object({
  slug: z.string(),
  servicoId: z.string(),
  inicio: z.string(),
  clienteNome: z.string().min(1),
  clienteTelefone: z.string().min(8),
});

export type AgendamentoState = {
  error?: string;
  sucesso?: boolean;
};

export async function criarAgendamentoPublico(
  _prev: AgendamentoState,
  formData: FormData
): Promise<AgendamentoState> {
  const parsed = criarAgendamentoSchema.safeParse({
    slug: formData.get("slug"),
    servicoId: formData.get("servicoId"),
    inicio: formData.get("inicio"),
    clienteNome: formData.get("clienteNome"),
    clienteTelefone: formData.get("clienteTelefone"),
  });

  if (!parsed.success) {
    return { error: "Preencha nome e telefone corretamente." };
  }

  const barbearia = await prisma.barbearia.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (!barbearia) return { error: "Barbearia não encontrada." };

  const servico = await prisma.servico.findFirst({
    where: { id: parsed.data.servicoId, barbeariaId: barbearia.id, ativo: true },
  });
  if (!servico) return { error: "Serviço inválido." };

  const inicio = new Date(parsed.data.inicio);
  if (Number.isNaN(inicio.getTime())) return { error: "Horário inválido." };
  const fim = new Date(inicio.getTime() + servico.duracaoMinutos * 60000);

  const antecedenciaMs = barbearia.antecedenciaMinimaHoras * 3600000;
  if (inicio.getTime() < Date.now() + antecedenciaMs) {
    return { error: "Esse horário não respeita a antecedência mínima." };
  }

  const admin = await prisma.usuario.findFirst({
    where: { barbeariaId: barbearia.id, papel: "ADMIN" },
  });
  if (!admin) return { error: "Barbearia sem administrador configurado." };

  try {
    await prisma.$transaction(
      async (tx) => {
      const diaSemana = inicio.getDay();
      const horario = await tx.horarioTrabalho.findFirst({
        where: { barbeariaId: barbearia.id, diaSemana, ativo: true },
      });
      if (!horario) throw new Error("Fora do horário de trabalho.");

      const [hi, mi] = horario.horaInicio.split(":").map(Number);
      const [hf, mf] = horario.horaFim.split(":").map(Number);
      const inicioExpediente = new Date(inicio);
      inicioExpediente.setHours(hi, mi, 0, 0);
      const fimExpediente = new Date(inicio);
      fimExpediente.setHours(hf, mf, 0, 0);

      if (inicio < inicioExpediente || fim > fimExpediente) {
        throw new Error("Fora do horário de trabalho.");
      }

      const conflito = await tx.agendamento.findFirst({
        where: {
          barbeariaId: barbearia.id,
          status: { not: "CANCELADO" },
          inicio: { lt: fim },
          fim: { gt: inicio },
        },
      });
      if (conflito) throw new Error("Horário indisponível.");

      const bloqueio = await tx.bloqueio.findFirst({
        where: { barbeariaId: barbearia.id, inicio: { lt: fim }, fim: { gt: inicio } },
      });
      if (bloqueio) throw new Error("Horário indisponível.");

      await tx.agendamento.create({
        data: {
          barbeariaId: barbearia.id,
          usuarioId: admin.id,
          servicoId: servico.id,
          clienteNome: parsed.data.clienteNome,
          clienteTelefone: parsed.data.clienteTelefone,
          inicio,
          fim,
          precoCentavos: servico.precoCentavos,
          status: "PENDENTE",
        },
      });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );

    return { sucesso: true };
  } catch (e) {
    if (e && typeof e === "object" && "code" in e) {
      if (e.code === "P2002" || e.code === "P2034") {
        return { error: "Horário indisponível. Escolha outro horário." };
      }
    }
    if (e instanceof Error) return { error: e.message };
    return { error: "Não foi possível concluir o agendamento." };
  }
}
