export default function LoadingAgendar() {
  return (
    <main className="min-h-screen bg-creme">
      <div className="h-[68px] bg-tinta" />
      <div className="flex min-h-[45vh] items-center justify-center bg-tinta lg:min-h-[60vh]">
        <div className="skeleton h-10 w-40" />
      </div>
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-16 sm:px-6">
        <div className="skeleton mx-auto h-8 w-48" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="skeleton h-64 w-full" />
          <div className="skeleton h-64 w-full" />
          <div className="skeleton h-64 w-full" />
        </div>
      </div>
    </main>
  );
}
