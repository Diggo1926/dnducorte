"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/session";

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

export type LoginState = { error?: string };

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    senha: formData.get("senha"),
  });

  if (!parsed.success) {
    return { error: "Dados inválidos." };
  }

  const usuario = await prisma.usuario.findUnique({
    where: { email: parsed.data.email },
  });

  const senhaOk = usuario
    ? await bcrypt.compare(parsed.data.senha, usuario.senhaHash)
    : false;

  if (!usuario || !senhaOk) {
    return { error: "E-mail ou senha inválidos." };
  }

  await setSessionCookie({
    usuarioId: usuario.id,
    barbeariaId: usuario.barbeariaId,
    papel: usuario.papel,
  });

  redirect("/painel");
}
