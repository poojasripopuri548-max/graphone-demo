interface StatsCardProps {
  label: string;
  value: string;
  hint?: string;
}

export default function StatsCard({ label, value, hint }: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}
