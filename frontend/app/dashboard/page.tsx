"use client";

import { useState } from 'react';
import { Activity, Gauge, ShieldCheck, Thermometer } from 'lucide-react';
import AppHeader from '@/components/layout/AppHeader';
import StatusBanner from '@/components/layout/StatusBanner';
import HealthStatusCard from '@/components/telemetry/HealthStatusCard';
import MetricSelector from '@/components/telemetry/MetricSelector';
import MetricGrid from '@/components/telemetry/MetricGrid';
import TelemetryHistoryChart from '@/components/telemetry/TelemetryHistoryChart';
import TimeRangeSelector from '@/components/telemetry/TimeRangeSelector';
import { metrics } from '@/config/metrics';
import { useCurrentTelemetry } from '@/hooks/useCurrentTelemetry';
import { useTelemetryHistory } from '@/hooks/useTelemetryHistory';
import { historyRangeOptions } from '@/lib/api/telemetry';
import type { TelemetryHistoryRange, TelemetryMetricKey } from '@/types/telemetry';

export default function DashboardPage() {
  const { data, isLoading, error } = useCurrentTelemetry();
  const [selectedMetric, setSelectedMetric] = useState<TelemetryMetricKey>('temperature');
  const [historyRange, setHistoryRange] = useState<TelemetryHistoryRange>('50');
  const {
    data: historyData,
    isLoading: isHistoryLoading,
    error: historyError,
    refetch: refetchHistory,
  } = useTelemetryHistory(selectedMetric, historyRange);
  const selectedMetricConfig = metrics.find((metric) => metric.key === selectedMetric) ?? metrics[0];
  const selectedRangeLabel = historyRangeOptions.find((range) => range.value === historyRange)?.label ?? 'Last 50';

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

        <section className="rounded border border-slate-800 bg-slate-950/70 p-5">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Telemetry history</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-100">{selectedMetricConfig.label} trend</h2>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <MetricSelector selectedMetric={selectedMetric} onSelect={setSelectedMetric} />
              <TimeRangeSelector options={historyRangeOptions} selectedValue={historyRange} onSelect={setHistoryRange} />
            </div>
          </div>

          {isHistoryLoading ? (
            <div className="flex h-80 flex-col justify-between rounded border border-slate-800 bg-slate-900/40 p-6">
              <div className="h-4 w-52 animate-pulse rounded bg-slate-800" />
              <div className="flex flex-1 items-center justify-center text-sm uppercase tracking-[0.25em] text-slate-500">
                Loading historical data...
              </div>
              <div className="h-3 w-full animate-pulse rounded bg-slate-900" />
            </div>
          ) : historyError ? (
            <div className="flex h-80 flex-col items-center justify-center rounded border border-red-500/30 bg-red-500/10 p-6 text-center">
              <p className="text-sm text-red-300">Unable to load telemetry history.</p>
              <button
                type="button"
                onClick={() => void refetchHistory()}
                className="mt-4 rounded border border-red-500/40 px-4 py-2 text-xs uppercase tracking-[0.25em] text-red-200 hover:bg-red-500/10"
              >
                Retry
              </button>
            </div>
          ) : !historyData?.length ? (
            <div className="flex h-80 items-center justify-center rounded border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-400">
              No historical telemetry available.
            </div>
          ) : (
            <TelemetryHistoryChart data={historyData} metricKey={selectedMetric} rangeLabel={selectedRangeLabel} />
          )}
        </section>

        <section className="rounded border border-slate-800 bg-slate-950/70 p-5">
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
        </section>
      </div>
    </main>
  );
}
