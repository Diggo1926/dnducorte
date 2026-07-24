import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-superficie px-4">
      <div className="w-full max-w-sm rounded-[12px] border border-cromo bg-fundo p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold uppercase tracking-tight text-tinta">
          Dndu Corte
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
