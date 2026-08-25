/*
 * FlashMCP
 * Creator: Iggy
 * Small label above section titles.
 */

type EyebrowProps = {
  children: string;
  className?: string;
};

export function Eyebrow({ children, className = "" }: EyebrowProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-[linear-gradient(135deg,#ef4444_0%,#b91c1c_55%,#7f1d1d_100%)] px-4 py-2 text-[13px] font-semibold tracking-tight text-white shadow-[0_8px_20px_-10px_rgba(239,68,68,0.7)] sm:text-sm ${className}`}
    >
      {children}
    </span>
  );
}
