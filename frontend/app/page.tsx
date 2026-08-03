import { Activity, AlertTriangle, Gauge, Workflow } from 'lucide-react';
import { SummaryCard } from '@/components/dashboard/SummaryCard';

const cards = [
  { title: 'Fleet Health', value: '92%', detail: 'Across 2 active turbines', icon: Gauge },
  { title: 'Live Alerts', value: '3', detail: '1 critical anomaly detected', icon: AlertTriangle },
  { title: 'Agent Insights', value: '6', detail: 'Recent maintenance recommendations', icon: Workflow },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_40%)] p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">TwinMind AI</p>
            <h1 className="mt-2 text-3xl font-semibold">Gas turbine predictive maintenance dashboard</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            <Activity className="h-4 w-4" />
            Streaming telemetry connected
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <SummaryCard key={card.title} {...card} />
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-xl font-semibold">Operational overview</h2>
            <p className="mt-2 text-sm text-slate-400">
              This layout will host the turbine grid, live charts, anomaly feed, and agent outputs in later phases.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-xl font-semibold">Next actions</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>• Connect live telemetry from the backend</li>
              <li>• Add turbine detail routes and charts</li>
              <li>• Wire the AI agent explain experience</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
