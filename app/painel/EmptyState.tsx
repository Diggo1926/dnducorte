import Image from "next/image";

export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="relative flex flex-col items-center justify-center gap-1 overflow-hidden rounded border border-cromo bg-branco px-6 py-16 text-center">
      <Image
        src="/logo-preto.png"
        alt=""
        aria-hidden
        width={280}
        height={280}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.06]"
      />
      <p className="relative font-display text-h3 text-tinta">{title}</p>
      {description && (
        <p className="relative max-w-xs text-body-sm text-tinta-70">
          {description}
        </p>
      )}
    </div>
  );
}
