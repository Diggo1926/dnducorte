import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logout } from "./logout-action";
import PainelShell from "./PainelShell";

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const barbearia = await prisma.barbearia.findUnique({
    where: { id: session.barbeariaId },
    select: { nome: true },
  });

  return (
    <PainelShell barbeariaNome={barbearia?.nome ?? "Painel"} logoutAction={logout}>
      {children}
    </PainelShell>
  );
}
