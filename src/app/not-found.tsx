import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[55vh] flex-col items-start justify-center py-20">
      <h1 className="t-h1">Bu səhifə tapılmadı</h1>
      <p className="t-lead mt-4">Ünvan dəyişmiş və ya səhv yazılmış ola bilər. Ana səhifədən və ya kataloqdan davam edin.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Ana səhifə
        </Link>
        <Link href="/kataloq" className="btn btn-ghost">
          Kataloq
        </Link>
      </div>
    </div>
  );
}
