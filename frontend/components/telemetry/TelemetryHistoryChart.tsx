'use client';

import { useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import MetricSelector from './MetricSelector';
import TimeRangeSelector from './TimeRangeSelector';
import { useTelemetryHistory } from '@/hooks/useTelemetryHistory';
import { metrics } from '@/config/metrics';
import { getMetricStatus, getStatusStyles } from '@/lib/design/status';
import { formatTimestamp } from '@/lib/utils/time';
import type { TelemetryMetricKey } from '@/types/telemetry';

const timeRangeOptions = [
  { label: '1H', value: '1h' },
  { label: '6H', value: '6h' },
  { label: '24H', value: '24h' },
] as const;

export default function TelemetryHistoryChart() {
  const [selectedMetric, setSelectedMetric] = useState<TelemetryMetricKey>('temperature');
  const [timeRange, setTimeRange] = useState<(typeof timeRangeOptions)[number]['value']>('6h');
  const { data, isLoading, error } = useTelemetryHistory();

  const visibleData = useMemo(() => {
    if (!data?.length) {
      return [];
    }

    const ordered = [...data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const limit = timeRange === '1h' ? 12 : timeRange === '6h' ? 24 : 48;

    return ordered.slice(-limit).map((entry) => ({
      ...entry,
      label: formatTimestamp(entry.timestamp),
      value: entry[selectedMetric],
    }));
  }, [data, selectedMetric, timeRange]);

  const latestValue = visibleData.at(-1)?.value ?? 0;
  const status = getMetricStatus(selectedMetric, latestValue);
  const styles = getStatusStyles(status);

  if (isLoading) {
    return <div className="rounded border border-slate-800 bg-slate-950/70 p-6 text-sm text-slate-400">Loading history…</div>;
  }

  if (error || !data?.length) {
    return <div className="rounded border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-400">History data is unavailable.</div>;
  }

  return (
    <section className="rounded border border-slate-800 bg-slate-950/70 p-5">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Trends</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-100">Telemetry history</h2>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <MetricSelector selectedMetric={selectedMetric} onSelect={setSelectedMetric} />
          <TimeRangeSelector
            options={timeRangeOptions}
            selectedValue={timeRange}
            onSelect={(value) => setTimeRange(value)}
          />
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between rounded border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-400">
        <span>Selected metric: {metrics.find((metric) => metric.key === selectedMetric)?.label}</span>
        <span className={`font-mono uppercase ${styles.text}`}>{status}</span>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={visibleData}>
            <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '0.5rem' }}
              labelStyle={{ color: '#f8fafc' }}
            />
            <Line type="monotone" dataKey="value" stroke={styles.chart} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
