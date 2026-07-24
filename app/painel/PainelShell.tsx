"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Scissors,
  Clock,
  Wallet,
  Settings,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/painel/agenda", label: "Agenda", icon: Calendar },
  { href: "/painel/servicos", label: "Serviços", icon: Scissors },
  { href: "/painel/horarios", label: "Horários", icon: Clock },
  { href: "/painel/financeiro", label: "Financeiro", icon: Wallet },
  { href: "/painel/configuracoes", label: "Config.", icon: Settings },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function PainelShell({
  barbeariaNome,
  logoutAction,
  children,
}: {
  barbeariaNome: string;
  logoutAction: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-creme">
      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[240px] flex-col bg-tinta lg:flex">
        <div className="flex items-center gap-3 px-6 py-6">
          <Image
            src="/logo-preto.png"
            alt=""
            width={40}
            height={40}
            className="logo-medallion"
          />
          <span className="font-display text-body-lg leading-tight text-branco">
            {barbeariaNome}
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded py-3 pl-3 pr-4 text-body transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ouro ${
                  active
                    ? "border-l-[3px] border-ouro bg-branco-05 text-ouro"
                    : "border-l-[3px] border-transparent text-branco-70 hover:bg-branco-05 hover:text-branco"
                }`}
              >
                <Icon size={20} strokeWidth={2} aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <form action={logoutAction} className="px-3 py-6">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded py-3 pl-3 text-body text-branco-60 transition-colors hover:text-vermelho focus-visible:outline focus-visible:outline-2 focus-visible:outline-ouro"
          >
            <LogOut size={20} strokeWidth={2} aria-hidden />
            Sair
          </button>
        </form>
      </aside>

      {/* Conteúdo */}
      <div className="flex min-h-screen flex-col lg:pl-[240px]">
        <main className="flex-1 px-4 pb-32 pt-6 sm:px-6 sm:pt-8 lg:px-12 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Bottom nav — mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-stretch justify-around border-t border-tinta bg-tinta lg:hidden">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 text-nav-label focus-visible:outline focus-visible:outline-2 focus-visible:outline-ouro ${
                active ? "text-ouro" : "text-branco-60"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={22} strokeWidth={2} aria-hidden />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
