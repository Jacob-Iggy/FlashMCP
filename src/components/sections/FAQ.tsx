/*
 * FlashMCP
 * Creator: Iggy
 * FAQ section on the landing page.
 */

import { FaqList } from "@/components/sections/FaqList";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

const faqs = [
  {
    question: "What is an MCP server?",
    answer:
      "An MCP server lets AI agents call tools in a shared format. Once yours is running, an agent can use your API through it without custom integration code.",
  },
  {
    question: "What files can I upload?",
    answer:
      "OpenAPI files in JSON or YAML. Support for older Swagger specs is on the roadmap.",
  },
  {
    question: "Do you host my server or store my credentials?",
    answer:
      "No. FlashMCP gives you a project to run yourself. Requests to your API leave from your machine, and your credentials never pass through us.",
  },
  {
    question: "Is my OpenAPI file saved?",
    answer:
      "We only use it to generate your server, and we don't keep it after the session ends. Nothing goes into a shared dataset.",
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      className="py-14 sm:py-16 lg:py-20"
      aria-labelledby="faq-title"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <SectionHeader
          eyebrow="FAQ"
          title="Before you upload"
          titleId="faq-title"
          description="Quick answers on hosting, privacy, and what you get."
        />

        <Reveal delay={80} className="mx-auto mt-10 max-w-3xl sm:mt-12">
          <FaqList items={faqs} />
        </Reveal>
      </div>
    </section>
  );
}
