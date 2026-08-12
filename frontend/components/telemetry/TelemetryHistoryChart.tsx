'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { metrics } from '@/config/metrics';
import { thresholds } from '@/lib/design/thresholds';
import { formatMetricValue } from '@/lib/utils/formatters';
import { formatTimestamp, formatTimestampWithSeconds } from '@/lib/utils/time';
import type { TelemetryMetricKey, TelemetryReading } from '@/types/telemetry';

interface TelemetryHistoryChartProps {
  data: TelemetryReading[];
  metricKey: TelemetryMetricKey;
  rangeLabel: string;
}

interface ChartPoint {
  timestamp: string;
  timeLabel: string;
  value: number;
}

interface TelemetryTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartPoint }>;
  metricKey: TelemetryMetricKey;
}

function getMetricConfig(metricKey: TelemetryMetricKey) {
  return metrics.find((metric) => metric.key === metricKey) ?? metrics[0];
}

function TelemetryTooltip({
  active,
  payload,
  metricKey,
}: TelemetryTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0].payload as ChartPoint;
  const metric = getMetricConfig(metricKey);

  return (
    <div className="rounded border border-slate-700 bg-slate-950 px-4 py-3 text-sm shadow-xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
        Time: {formatTimestampWithSeconds(point.timestamp)}
      </p>
      <p className="mt-2 text-slate-200">
        <span className="text-slate-400">{metric.label}: </span>
        <span className="font-mono text-slate-100">
          {formatMetricValue(point.value, metric.precision)} {metric.unit}
        </span>
      </p>
    </div>
  );
}

export default function TelemetryHistoryChart({ data, metricKey, rangeLabel }: TelemetryHistoryChartProps) {
  const metric = getMetricConfig(metricKey);
  const metricThresholds = thresholds[metricKey];
  const chartData = [...data]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((entry) => {
      const rawValue = entry[metricKey];
      const value = typeof rawValue === 'number' ? rawValue : Number(rawValue);

      return {
        timestamp: entry.timestamp,
        timeLabel: formatTimestamp(entry.timestamp),
        value: Number.isFinite(value) ? value : 0,
      };
    });

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.22em] text-slate-500">
        <span>
          {metric.label} ({metric.unit})
        </span>
        <span>{rangeLabel}</span>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 16, right: 18, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="timeLabel"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
              minTickGap={24}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
              tickFormatter={(value) => formatMetricValue(Number(value), metric.precision)}
              width={72}
            />
            <Tooltip content={<TelemetryTooltip metricKey={metricKey} />} cursor={{ stroke: '#475569', strokeWidth: 1 }} />
            <ReferenceLine
              y={metricThresholds.warning}
              ifOverflow="extendDomain"
              stroke="#f59e0b"
              strokeDasharray="6 6"
              strokeOpacity={0.55}
              label={{ value: 'Warning', fill: '#f59e0b', fontSize: 11, position: 'insideTopRight' }}
            />
            <ReferenceLine
              y={metricThresholds.critical}
              ifOverflow="extendDomain"
              stroke="#ef4444"
              strokeDasharray="6 6"
              strokeOpacity={0.6}
              label={{ value: 'Critical', fill: '#ef4444', fontSize: 11, position: 'insideTopRight' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#38bdf8"
              strokeWidth={2.4}
              dot={false}
              activeDot={{ r: 4, fill: '#e0f2fe', stroke: '#0284c7', strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
