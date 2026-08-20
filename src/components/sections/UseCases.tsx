import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

const useCases = [
  {
    label: "Internal services",
    title: "Wrap an internal REST API",
    description:
      "Give Cursor or Claude direct access to the service you already maintain, without writing a protocol layer by hand.",
  },
  {
    label: "Prototyping",
    title: "Prototype MCP integrations",
    description:
      "Try an idea against a real API in an afternoon instead of spending it on setup and schema plumbing.",
  },
  {
    label: "Legacy docs",
    title: "Turn Swagger docs into tools",
    description:
      "Point FlashMCP at an existing OpenAPI document and get a hostable server with typed inputs for every endpoint.",
  },
  {
    label: "Teams",
    title: "Share a server with your team",
    description:
      "Generated projects are plain files you can commit, review, and run the same way on every machine.",
  },
];

export function UseCases() {
  return (
    <section
      id="use-cases"
      className="border-t border-line py-20 sm:py-24"
      aria-labelledby="use-cases-title"
    >
      <div className="mx-auto w-full max-w-[1120px] px-6">
        <SectionHeader
          eyebrow="Use cases"
          title="Built for the APIs you already have"
          titleId="use-cases-title"
          description="FlashMCP is most useful when the documentation exists but the integration does not."
        />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2">
          {useCases.map((useCase, index) => (
            <Reveal as="li" key={useCase.title} delay={(index % 2) * 90}>
              <article className="panel panel-interactive group h-full p-6 sm:p-7">
                <p className="font-mono text-[11px] tracking-[0.14em] text-ink-faint uppercase transition-colors duration-200 group-hover:text-accent">
                  {useCase.label}
                </p>
                <h3 className="mt-4 text-base font-medium tracking-tight">
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
