interface SectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function Section({
  id,
  title,
  subtitle,
  children,
}: SectionProps) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 text-sm text-zinc-400">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}
