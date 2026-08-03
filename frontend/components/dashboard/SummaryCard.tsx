import { type LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}

export function SummaryCard({ title, value, detail, icon: Icon }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-300">{title}</h2>
        <Icon className="h-5 w-5 text-sky-400" />
      </div>
      <p className="mt-4 text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{detail}</p>
    </div>
  );
}
