import Image from "next/image";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-tinta px-4 py-16">
      <Image
        src="/logo-branco.png"
        alt="Dndu Corte"
        width={120}
        height={120}
        priority
        className="logo-medallion h-[120px] w-[120px]"
      />
      <div className="w-full max-w-sm rounded border border-cromo bg-branco p-8">
        <div className="mb-6 text-center">
          <p className="eyebrow">Painel</p>
          <h1 className="mt-1 font-display text-h1 uppercase text-tinta">Entrar</h1>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
