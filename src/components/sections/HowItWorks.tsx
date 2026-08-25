/*
 * FlashMCP
 * Creator: Iggy
 * Explains the three steps to generate a server.
 */

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

const steps = [
  {
    number: "01",
    title: "Upload your OpenAPI",
    description:
      "Drop in a JSON or YAML file. We read the paths, parameters, and response schemas.",
    visual: "upload",
  },
  {
    number: "02",
    title: "Keep only what you need",
    description:
      "We suggest a tool for each endpoint. Turn off anything you don't want before you generate.",
    visual: "review",
  },
  {
    number: "03",
    title: "Download and connect",
    description:
      "Download a ready-to-run MCP server. Point Cursor, Claude, or any MCP host at it.",
    visual: "generate",
  },
] as const;

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

function StepVisual({ kind }: { kind: (typeof steps)[number]["visual"] }) {
  if (kind === "upload") {
    return (
      <div className="relative flex h-[140px] items-center justify-center overflow-hidden rounded-2xl border border-line bg-black/30">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_40%,rgba(239,68,68,0.16),transparent_70%)]"
        />
        <div className="relative w-[70%] rounded-xl border border-dashed border-accent/40 bg-accent-soft px-4 py-5 text-center">
          <p className="font-mono text-[11px] text-accent">orders-api.yaml</p>
          <p className="mt-1 text-[11px] text-ink-faint">Drop OpenAPI here</p>
        </div>
      </div>
    );
  }

  if (kind === "review") {
    return (
      <div className="relative flex h-[140px] flex-col justify-center gap-2 overflow-hidden rounded-2xl border border-line bg-black/30 px-4">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(50%_60%_at_80%_20%,rgba(239,68,68,0.12),transparent_70%)]"
        />
        {["list_orders", "create_order", "get_customer"].map((name, i) => (
          <div
            key={name}
            className="relative flex items-center justify-between rounded-lg border border-line bg-surface-elevated/80 px-3 py-2"
          >
            <span className="font-mono text-[11px] text-ink-muted">{name}</span>
            <span
              className={`size-1.5 rounded-full ${
                i < 2 ? "bg-accent shadow-[0_0_8px_var(--accent)]" : "bg-white/25"
              }`}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative flex h-[140px] items-center justify-center overflow-hidden rounded-2xl border border-line bg-black/30">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_50%,rgba(239,68,68,0.14),transparent_70%)]"
      />
      <div className="relative rounded-xl border border-line bg-surface-elevated px-4 py-3 font-mono text-[11px]">
        <p className="text-ink-muted">
          <span className="text-accent">$</span> npx flashmcp-server
        </p>
        <p className="mt-1 text-ink-faint">stdio · 12 tools ready</p>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-14 sm:py-16 lg:py-20"
      aria-labelledby="how-it-works-title"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <SectionHeader
          eyebrow="How it works"
          title="From OpenAPI to a running server"
          titleId="how-it-works-title"
          description="Three steps. No setup from scratch. You decide which endpoints become tools."
        />

        <ol className="mt-10 grid gap-4 sm:mt-12 lg:grid-cols-3 lg:gap-5">
          {steps.map((step, index) => (
            <Reveal as="li" key={step.number} delay={index * 90}>
              <div className="panel-glow panel-interactive group flex h-full flex-col p-5 sm:p-6">
                <StepVisual kind={step.visual} />
                <div className="mt-5 flex items-center gap-3">
                  <span className="font-mono text-[12px] text-accent">
                    {step.number}
                  </span>
                  <span
                    aria-hidden
                    className="h-px flex-1 bg-gradient-to-r from-white/25 to-transparent"
                  />
                </div>
                <h3 className="mt-3 text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={120} className="mt-4 sm:mt-5">
          <div className="panel-glow overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
              <div>
                <p className="text-sm font-semibold tracking-tight">
                  Review your tools first
                </p>
                <p className="mt-1 text-xs text-ink-faint">
                  Include or skip any endpoint
                </p>
              </div>
              <p className="rounded-full border border-line bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-ink-faint">
                orders-api.yaml · 5 endpoints scanned
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-[11px] tracking-[0.12em] text-ink-faint uppercase">
                    <th scope="col" className="px-5 py-3.5 font-medium sm:px-6">
                      Endpoint
                    </th>
                    <th scope="col" className="px-5 py-3.5 font-medium sm:px-6">
                      Tool name
                    </th>
                    <th scope="col" className="px-5 py-3.5 font-medium sm:px-6">
                      Type
                    </th>
                    <th scope="col" className="px-5 py-3.5 font-medium sm:px-6">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {generatedTools.map((row) => (
                    <tr
                      key={row.tool}
                      className="border-b border-line transition-colors duration-150 last:border-0 hover:bg-white/[0.025]"
                    >
                      <td className="px-5 py-3.5 sm:px-6">
                        <span className="flex items-center gap-2.5 font-mono text-[12px]">
                          <span className="rounded-md border border-line bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-ink-faint">
                            {row.method}
                          </span>
                          <span className="text-ink-muted">{row.path}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[12px] text-ink sm:px-6">
                        {row.tool}
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-ink-muted sm:px-6">
                        {row.kind}
                      </td>
                      <td className="px-5 py-3.5 sm:px-6">
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
