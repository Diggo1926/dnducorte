import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logout } from "./logout-action";

const NAV_ITEMS = [
  { href: "/painel/agenda", label: "Agenda" },
  { href: "/painel/servicos", label: "Serviços" },
  { href: "/painel/horarios", label: "Horários" },
  { href: "/painel/financeiro", label: "Financeiro" },
  { href: "/painel/configuracoes", label: "Configurações" },
];

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
    <div className="flex min-h-screen flex-col bg-superficie">
      <header className="flex flex-wrap items-center justify-between gap-3 bg-tinta px-4 py-3">
        <span className="text-lg font-bold uppercase tracking-tight text-ouro">
          {barbearia?.nome ?? "Painel"}
        </span>
        <nav className="flex flex-wrap gap-4 text-sm text-fundo">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-ouro">
              {item.label}
            </a>
          ))}
        </nav>
        <form action={logout}>
          <button type="submit" className="text-sm text-cromo hover:text-ouro">
            Sair
          </button>
        </form>
      </header>
      <main className="flex-1 p-4">{children}</main>
      <footer className="bg-tinta px-4 py-3 text-center text-xs text-cromo">
        {barbearia?.nome ?? "Painel"}
      </footer>
    </div>
  );
}
