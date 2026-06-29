import { ReactNode } from "react";

interface SectionProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function Section({ title, description, action, children, className = "" }: SectionProps) {
  return (
    <section className={`space-y-5 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_0_12px_rgba(16,185,129,0.45)]" />
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
          </div>
          {description && (
            <p className="max-w-2xl text-sm text-gray-600 mt-1 leading-relaxed">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </section>
  );
}
