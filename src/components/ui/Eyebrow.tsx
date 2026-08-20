type EyebrowProps = {
  children: string;
  className?: string;
};

export function Eyebrow({ children, className = "" }: EyebrowProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] py-1.5 pr-3.5 pl-3 text-[11px] font-medium tracking-[0.14em] text-ink-muted uppercase ${className}`}
    >
      <span
        aria-hidden
        className="size-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]"
      />
      {children}
    </span>
  );
}
