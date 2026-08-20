import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowDownIcon, ArrowRightIcon } from "@/components/ui/icons";

const files = [
  { name: "flashmcp-server/", depth: 0, active: false },
  { name: "server.ts", depth: 1, active: false },
  { name: "tools/", depth: 1, active: false },
  { name: "orders.ts", depth: 2, active: true },
  { name: "customers.ts", depth: 2, active: false },
  { name: "resources/", depth: 1, active: false },
  { name: "schema.ts", depth: 2, active: false },
];

const stats = [
  { label: "Local-first", value: "Runs on your machine" },
  { label: "OpenAPI", value: "JSON or YAML" },
  { label: "MCP native", value: "Tools & resources" },
];

export function Hero() {
  return (
    <section id="top" className="relative">
      <div className="relative mx-auto grid w-full max-w-[1120px] items-center gap-16 px-6 pt-20 pb-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 lg:pt-28 lg:pb-32">
        <div>
          <div className="animate-rise" style={{ animationDelay: "0ms" }}>
            <Eyebrow>OpenAPI &rarr; MCP in minutes</Eyebrow>
          </div>

          <h1
            className="animate-rise mt-7 text-4xl font-medium tracking-tight text-balance sm:text-5xl lg:text-[56px] lg:leading-[1.05]"
            style={{ animationDelay: "80ms" }}
          >
            Turn any API into an{" "}
            <span className="relative whitespace-nowrap">
              AI-ready
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-1 h-px bg-[linear-gradient(90deg,transparent,var(--accent),transparent)]"
              />
            </span>{" "}
            MCP server
          </h1>

          <p
            className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-ink-muted"
            style={{ animationDelay: "160ms" }}
          >
            Upload an OpenAPI document, review the tools and resources FlashMCP
            finds, then download a Model Context Protocol server you can run on
            your own machine.
          </p>

          <div
            className="animate-rise mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <Button href="#demo">
              Get started
              <ArrowRightIcon className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </Button>
            <Button href="#how-it-works" variant="ghost">
              See how it works
              <ArrowDownIcon className="text-ink-muted transition-transform duration-200 group-hover/btn:translate-y-0.5" />
            </Button>
          </div>

          <dl
            className="animate-rise mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3"
            style={{ animationDelay: "320ms" }}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="bg-surface/60 px-4 py-3.5">
                <dt className="text-[13px] font-medium tracking-tight text-ink">
                  {stat.label}
                </dt>
                <dd className="mt-0.5 text-xs text-ink-faint">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          className="animate-rise relative w-full"
          style={{ animationDelay: "200ms" }}
        >
          {/* Single soft accent glow anchored behind the code panel. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-8 -z-10 rounded-[32px] bg-[radial-gradient(60%_60%_at_70%_20%,var(--accent-glow),transparent_70%)] blur-2xl"
          />

          <div className="panel overflow-hidden shadow-float">
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <div aria-hidden className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-white/10" />
                <span className="size-2.5 rounded-full bg-white/10" />
                <span className="size-2.5 rounded-full bg-white/10" />
              </div>
              <span className="truncate font-mono text-[11px] text-ink-faint">
                flashmcp-server/tools/orders.ts
              </span>
            </div>

            <div className="flex">
              <ul className="hidden w-36 shrink-0 border-r border-line bg-black/20 py-3 font-mono text-[11px] sm:block">
                {files.map((file) => (
                  <li
                    key={file.name}
                    className={`px-3 py-1 ${
                      file.active ? "text-ink" : "text-ink-faint"
                    }`}
                    style={{ paddingLeft: `${12 + file.depth * 12}px` }}
                  >
                    {file.active ? (
                      <span className="text-accent">&#9656; </span>
                    ) : null}
                    {file.name}
                  </li>
                ))}
              </ul>

              <pre className="flex-1 overflow-x-auto p-4 font-mono text-[11px] leading-[1.7] text-ink-muted">
                <code>
                  <span className="text-ink">server</span>.registerTool(
                  {"\n  "}
                  <span className="text-accent">&quot;list_orders&quot;</span>,
                  {"\n  {"}
                  {"\n    "}title:{" "}
                  <span className="text-ink">&quot;List orders&quot;</span>,
                  {"\n    "}description:{" "}
                  <span className="text-ink">&quot;GET /v1/orders&quot;</span>,
                  {"\n    "}inputSchema: {"{"}
                  {"\n      "}status: z.enum([
                  <span className="text-ink">&quot;open&quot;</span>,{" "}
                  <span className="text-ink">&quot;shipped&quot;</span>]),
                  {"\n      "}limit: z.number().max(
                  <span className="text-ink">100</span>),
                  {"\n    },"}
                  {"\n  },"}
                  {"\n  "}async ({"{"} status, limit {"}"}) =&gt; {"{"}
                  {"\n    "}const res = await api.get(
                  {"\n      "}
                  <span className="text-ink">&quot;/v1/orders&quot;</span>,
                  {"\n      "}
                  {"{ status, limit },"}
                  {"\n    "});
                  {"\n    "}return toolResult(res);
                  {"\n  },"}
                  {"\n);"}
                </code>
              </pre>
            </div>

            <div className="border-t border-line bg-black/25 px-4 py-3 font-mono text-[11px]">
              <p className="text-ink-muted">
                <span className="text-accent">$</span> npx flashmcp-server
              </p>
              <p className="mt-1 text-ink-faint">
                Listening on stdio &middot; 12 tools &middot; 3 resources
                <span className="animate-blink ml-1 inline-block h-3 w-1.5 translate-y-0.5 bg-accent" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
