import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

const steps = [
  {
    number: "01",
    title: "Upload OpenAPI",
    description:
      "Drop in a JSON or YAML spec, or paste a URL. FlashMCP parses every path, parameter, and response schema.",
  },
  {
    number: "02",
    title: "Review tools",
    description:
      "AI proposes a tool for each endpoint. Rename them, drop the ones you do not need, and adjust parameters before generating.",
  },
  {
    number: "03",
    title: "Generate server",
    description:
      "Download a ready-to-run MCP server with your tools and resources wired up, then point any agent at it locally.",
  },
];

const generatedTools = [
  {
    method: "GET",
    path: "/v1/orders",
    tool: "list_orders",
    kind: "Tool",
    included: true,
  },
  {
    method: "POST",
    path: "/v1/orders",
    tool: "create_order",
    kind: "Tool",
    included: true,
  },
  {
    method: "GET",
    path: "/v1/customers/{id}",
    tool: "get_customer",
    kind: "Tool",
    included: true,
  },
  {
    method: "GET",
    path: "/v1/schema",
    tool: "order_schema",
    kind: "Resource",
    included: true,
  },
  {
    method: "DELETE",
    path: "/v1/orders/{id}",
    tool: "delete_order",
    kind: "Tool",
    included: false,
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-line py-20 sm:py-24"
      aria-labelledby="how-it-works-title"
    >
      <div className="mx-auto w-full max-w-[1120px] px-6">
        <SectionHeader
          eyebrow="How it works"
          title="Three steps from spec to server"
          titleId="how-it-works-title"
          description="No scaffolding, no protocol boilerplate. You stay in control of which endpoints become tools."
        />

        <ol className="mt-14 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal as="li" key={step.number} delay={index * 90}>
              <div className="panel panel-interactive group h-full p-6">
                <div className="flex items-center justify-between">
                  <span className="flex size-9 items-center justify-center rounded-lg border border-line bg-white/[0.03] font-mono text-[11px] text-ink-muted transition-colors duration-200 group-hover:border-accent/40 group-hover:text-accent">
                    {step.number}
                  </span>
                  <span
                    aria-hidden
                    className="h-px flex-1 origin-left scale-x-0 bg-[linear-gradient(90deg,var(--accent),transparent)] transition-transform duration-500 ease-out group-hover:scale-x-100"
                  />
                </div>
                <h3 className="mt-5 text-lg font-medium tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={120} className="mt-6">
          <div className="panel overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
              <p className="text-sm font-medium tracking-tight">
                Generated tool list
              </p>
              <p className="font-mono text-[11px] text-ink-faint">
                orders-api.yaml &middot; 5 endpoints scanned
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-[11px] tracking-[0.14em] text-ink-faint uppercase">
                    <th scope="col" className="px-5 py-3 font-medium">
                      Endpoint
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Tool name
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Type
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {generatedTools.map((row) => (
                    <tr
                      key={row.tool}
                      className="border-b border-line transition-colors duration-150 last:border-0 hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-2.5 font-mono text-[12px]">
                          <span className="text-ink-faint">{row.method}</span>
                          <span className="text-ink-muted">{row.path}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[12px] text-ink">
                        {row.tool}
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-ink-muted">
                        {row.kind}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-2 text-[13px] ${
                            row.included ? "text-ink" : "text-ink-faint"
                          }`}
                        >
                          <span
                            aria-hidden
                            className={`size-1.5 rounded-full ${
                              row.included
                                ? "bg-accent shadow-[0_0_8px_var(--accent)]"
                                : "bg-white/20"
                            }`}
                          />
                          {row.included ? "Included" : "Excluded"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
