import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function DemoVideo() {
  return (
    <section
      id="demo"
      className="border-t border-line py-20 sm:py-24"
      aria-labelledby="demo-title"
    >
      <div className="mx-auto w-full max-w-[1120px] px-6">
        <SectionHeader
          eyebrow="Walkthrough"
          title="See FlashMCP in action"
          titleId="demo-title"
          description="A short recording of the full path from an OpenAPI document to a running local MCP server."
          align="center"
        />

        <Reveal delay={80} className="relative mx-auto mt-12 max-w-[960px]">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-10 -top-6 bottom-10 -z-10 rounded-[40px] bg-[radial-gradient(50%_60%_at_50%_0%,var(--accent-glow),transparent_70%)] blur-2xl"
          />

          <div className="panel group overflow-hidden shadow-float transition-colors duration-300 hover:border-accent/35">
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <div aria-hidden className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-white/10" />
                <span className="size-2.5 rounded-full bg-white/10" />
                <span className="size-2.5 rounded-full bg-white/10" />
              </div>
              <span className="truncate font-mono text-[11px] text-ink-faint">
                flashmcp &mdash; upload &rarr; review &rarr; generate
              </span>
            </div>

            <div
              role="img"
              aria-label="Demo video placeholder"
              className="flex aspect-video w-full items-center justify-center bg-black/25"
            >
              <div className="flex flex-col items-center gap-5">
                <span className="flex size-16 items-center justify-center rounded-full border border-line-strong bg-white/[0.03] text-ink-muted transition-[transform,color,border-color,box-shadow] duration-300 group-hover:scale-105 group-hover:border-accent/60 group-hover:text-accent group-hover:shadow-[0_0_40px_-8px_var(--accent)]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="ml-0.5 size-5"
                    aria-hidden
                  >
                    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                  </svg>
                </span>
                <p className="font-mono text-[11px] tracking-[0.14em] text-ink-faint uppercase">
                  Demo video coming soon
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <p className="mx-auto mt-6 max-w-xl text-center text-sm leading-relaxed text-ink-muted">
            The walkthrough will cover uploading a spec, reviewing the generated
            tool list, and running the downloaded server against a live API.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
