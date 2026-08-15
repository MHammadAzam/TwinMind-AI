import type { TelemetryHistoryOption, TelemetryHistoryRange } from '@/types/telemetry';

interface TimeRangeSelectorProps {
  options: ReadonlyArray<TelemetryHistoryOption>;
  selectedValue: TelemetryHistoryRange;
  onSelect: (value: TelemetryHistoryRange) => void;
}

export default function TimeRangeSelector({ options, selectedValue, onSelect }: TimeRangeSelectorProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-400">
      <span className="uppercase tracking-[0.25em] text-slate-500">Range</span>
      <select
        aria-label="History time range"
        value={selectedValue}
        onChange={(event) => onSelect(event.target.value as TelemetryHistoryRange)}
        className="rounded border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
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
