import type { TelemetryHistoryRange } from '@/types/telemetry';

interface TimeRangeSelectorProps {
  options: ReadonlyArray<{ label: string; value: TelemetryHistoryRange }>;
  selectedValue: TelemetryHistoryRange;
  onSelect: (value: TelemetryHistoryRange) => void;
}

export default function TimeRangeSelector({ options, selectedValue, onSelect }: TimeRangeSelectorProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-400">
      <span className="uppercase tracking-[0.25em] text-slate-500">Range</span>
      <select
        value={selectedValue}
        onChange={(event) => onSelect(event.target.value as TelemetryHistoryRange)}
        className="rounded border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
