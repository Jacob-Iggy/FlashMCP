/*
 * FlashMCP
 * Creator: Iggy
 * Background wash behind the top of the site.
 */

export function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[min(78vh,820px)] overflow-hidden"
    >
      <div className="hero-backdrop absolute inset-0" />
      <div className="hero-backdrop-wash absolute inset-0" />
    </div>
  );
}
