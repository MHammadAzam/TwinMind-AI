import Link from 'next/link';

export default function TurbineDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <div className="mx-auto max-w-5xl rounded-2xl border border-slate-800 bg-slate-900/70 p-8">
        <Link href="/" className="text-sm text-sky-400 hover:underline">
          ← Back to dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-semibold">Turbine {params.id}</h1>
        <p className="mt-2 text-slate-400">
          This route will host the deeper maintenance view for a single turbine in later phases.
        </p>
      </div>
    </main>
  );
}
