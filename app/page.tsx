import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-tinta px-4">
      <Image src="/logo-branco.png" alt="Dndu Corte" width={160} height={64} priority />
      <h1 className="font-display text-h1 uppercase text-branco">Dndu Corte</h1>
    </main>
  );
}
