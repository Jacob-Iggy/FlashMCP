import { FaqList } from "@/components/sections/FaqList";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

const faqs = [
  {
    question: "What is an MCP server?",
    answer:
      "A Model Context Protocol server exposes tools and resources in a format AI agents understand. Once it is running, an agent can call your API through it without any custom integration code.",
  },
  {
    question: "What OpenAPI formats are supported?",
    answer:
      "OpenAPI documents in JSON or YAML. Older Swagger specs are on the roadmap and will be converted before parsing.",
  },
  {
    question: "Does FlashMCP host my server?",
    answer:
      "No. FlashMCP generates a project you run yourself, so requests to your API leave from your machine and your credentials never pass through a third party.",
  },
  {
    question: "Is my API spec stored?",
    answer:
      "Specs are used only to generate your server and are not kept after the session ends. Nothing is added to a shared dataset.",
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      className="border-t border-line py-20 sm:py-24"
      aria-labelledby="faq-title"
    >
      <div className="mx-auto grid w-full max-w-[1120px] gap-12 px-6 lg:grid-cols-[320px_1fr] lg:gap-20">
        <SectionHeader
          eyebrow="FAQ"
          title="Questions, answered"
          titleId="faq-title"
          description="What FlashMCP does, and what it deliberately leaves on your machine."
        />

        <Reveal delay={80}>
          <FaqList items={faqs} />
        </Reveal>
      </div>
    </section>
  );
}
