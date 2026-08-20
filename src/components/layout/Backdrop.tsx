export function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px] overflow-hidden"
    >
      <div className="page-wash absolute inset-0" />
      <div className="page-grid absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--accent-glow)_35%,rgba(255,255,255,0.28)_50%,var(--accent-glow)_65%,transparent)]" />
    </div>
  );
}
