interface AppHeaderProps {
  title: string;
  subtitle: string;
}

export default function AppHeader({ title, subtitle }: AppHeaderProps) {
  return (
    <header className="border border-slate-800/80 bg-slate-900/80 px-6 py-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">TwinMind AI</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-100">{title}</h1>
        </div>
        <p className="max-w-2xl text-sm text-slate-400">{subtitle}</p>
      </div>
    </header>
  );
}
