"use client";

import { Activity, Gauge, ShieldCheck, Thermometer } from 'lucide-react';
import AppHeader from '@/components/layout/AppHeader';
import StatusBanner from '@/components/layout/StatusBanner';
import HealthStatusCard from '@/components/telemetry/HealthStatusCard';
import MetricGrid from '@/components/telemetry/MetricGrid';
import TelemetryHistoryChart from '@/components/telemetry/TelemetryHistoryChart';
import { useCurrentTelemetry } from '@/hooks/useCurrentTelemetry';

export default function DashboardPage() {
  const { data, isLoading, error } = useCurrentTelemetry();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <AppHeader title="Turbine Monitor" subtitle="Streaming telemetry from the gas turbine digital twin." />
          <div className="rounded border border-slate-800 bg-slate-950/70 p-5">
            <div className="h-4 w-48 animate-pulse rounded bg-slate-800" />
            <div className="mt-4 h-7 w-full animate-pulse rounded bg-slate-900" />
          </div>
          <section className="rounded border border-slate-800 bg-slate-950/70 p-5">
            <div className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-slate-500">
              <Activity size={16} />
              Live metric envelope
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-36 animate-pulse rounded border border-slate-800 bg-slate-900/50" />
              ))}
            </div>
          </section>
          <div className="rounded border border-slate-800 bg-slate-950/70 p-6">
            <div className="h-5 w-36 animate-pulse rounded bg-slate-800" />
            <div className="mt-4 h-10 w-52 animate-pulse rounded bg-slate-900" />
            <div className="mt-4 h-4 w-full max-w-2xl animate-pulse rounded bg-slate-900" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <AppHeader title="Turbine Monitor" subtitle="Streaming telemetry from the gas turbine digital twin." />
          <div className="rounded border border-red-500/30 bg-red-500/10 p-10 text-center text-red-400">
            Unable to load telemetry from the backend. The dashboard will recover when telemetry becomes available.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <AppHeader title="Turbine Monitor" subtitle="Control room telemetry for the TwinMind AI predictive maintenance platform." />
        <StatusBanner telemetry={data} />

        <section className="rounded border border-slate-800 bg-slate-950/70 p-5">
          <div className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-slate-500">
            <Activity size={16} />
            Live metric envelope
          </div>
          <MetricGrid telemetry={data} />
        </section>

        <HealthStatusCard telemetry={data} />

        <section className="grid gap-6 lg:grid-cols-[1fr_0.35fr]">
          <TelemetryHistoryChart />
          <div className="rounded border border-slate-800 bg-slate-950/70 p-5">
            <div className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-slate-500">
              <ShieldCheck size={16} />
              Operating notes
            </div>
            <div className="space-y-4 text-sm text-slate-400">
              <div className="rounded border border-slate-800 bg-slate-900/70 p-4">
                <div className="flex items-center gap-2 text-slate-200">
                  <Gauge size={15} />
                  <span className="font-semibold">Envelope watch</span>
                </div>
                <p className="mt-2">The turbine is monitored continuously for threshold drift, vibration excursions, and thermal stress.</p>
              </div>
              <div className="rounded border border-slate-800 bg-slate-900/70 p-4">
                <div className="flex items-center gap-2 text-slate-200">
                  <Thermometer size={15} />
                  <span className="font-semibold">Thermal profile</span>
                </div>
                <p className="mt-2">Temperature and exhaust temperature are the leading indicators used by the monitoring model.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
