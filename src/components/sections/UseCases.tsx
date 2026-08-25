/*
 * FlashMCP
 * Creator: Iggy
 * Examples of who FlashMCP is for.
 */

import { GetStartedButton } from "@/components/get-started/GetStartedButton";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArrowRightIcon } from "@/components/ui/icons";

const useCases = [
  {
    label: "Internal APIs",
    title: "Let agents call the service you already run",
    description:
      "Skip writing an MCP server by hand. Connect Cursor or Claude to your internal REST API.",
  },
  {
    label: "Prototyping",
    title: "Try an agent idea the same day",
    description:
      "Spend your time on the idea, not on scaffolding and wiring.",
  },
  {
    label: "Existing docs",
    title: "Turn OpenAPI into usable tools",
    description:
      "If you already have the docs, FlashMCP turns them into tools your agents can call.",
  },
  {
    label: "Teams",
    title: "Share one server everyone can run",
    description:
      "The output is plain files you can commit, review, and run the same way on every machine.",
  },
];

export function UseCases() {
  const featured = useCases[0];
  const rest = useCases.slice(1);

  return (
    <section
      id="use-cases"
      className="py-14 sm:py-16 lg:py-20"
      aria-labelledby="use-cases-title"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <SectionHeader
          eyebrow="Use cases"
          title="You have the docs. You need the MCP server."
          titleId="use-cases-title"
          description="FlashMCP fills the gap when your OpenAPI file exists, but your agents still cannot use the API."
        />

        <Reveal delay={0} className="mt-10 sm:mt-12">
          <article className="panel-glow panel-interactive group relative flex flex-col overflow-hidden p-7 sm:flex-row sm:items-end sm:justify-between sm:p-8 lg:p-10">
            <div className="max-w-xl">
              <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">
                {featured.label}
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight sm:text-[28px] sm:leading-tight">
                {featured.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-[15px]">
                {featured.description}
              </p>
            </div>
            <div className="mt-8 sm:mt-0 sm:shrink-0 sm:pl-8">
              <GetStartedButton variant="secondary" size="sm">
                Upload OpenAPI
                <ArrowRightIcon className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </GetStartedButton>
            </div>
          </article>
        </Reveal>

        <ul className="mt-4 grid gap-4 sm:mt-5 sm:grid-cols-3 lg:gap-5">
          {rest.map((useCase, index) => (
            <Reveal as="li" key={useCase.title} delay={index * 80}>
              <article className="panel-glow panel-interactive group h-full p-6">
                <div className="mb-5 flex size-10 items-center justify-center rounded-xl border border-line bg-white/[0.04] text-accent transition-colors duration-200 group-hover:border-white/20 group-hover:bg-white/[0.06]">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4"
                    aria-hidden
                  >
                    <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" />
                    <rect x="9" y="2.5" width="4.5" height="4.5" rx="1" />
                    <rect x="2.5" y="9" width="4.5" height="4.5" rx="1" />
                    <rect x="9" y="9" width="4.5" height="4.5" rx="1" />
                  </svg>
                </div>
                <p className="text-[11px] font-medium tracking-[0.12em] text-ink-faint uppercase">
                  {useCase.label}
                </p>
                <h3 className="mt-3 text-base font-semibold tracking-tight">
                  {useCase.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                  {useCase.description}
                </p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
