/*
 * FlashMCP
 * Creator: Iggy
 * Compact “what you get” deliverable preview.
 */

import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

const generatedFiles = [
  { name: "mcp.ts", active: true, kind: "ts" },
  { name: ".env.example", active: false, kind: "env" },
  { name: "package.json", active: false, kind: "json" },
  { name: "README.md", active: false, kind: "md" },
] as const;

const mcpPreview = `import { McpServer } from "@modelcontextprotocol/sdk";
import { z } from "zod";

const server = new McpServer({
  name: "posts-api",
  version: "1.0.0",
});

server.registerTool(
  "create_post",
  {
    description: "Create a post",
    inputSchema: {
      username: z.string(),
      content: z.string(),
    },
  },
  async ({ username, content }) => {
    // POST /posts
  },
);`;

const proofPoints = [
  {
    title: "1. Download your server",
    description:
      "Get an mcp.ts file with tools based on the endpoints you kept.",
  },
  {
    title: "2. Follow the setup steps",
    description:
      "Create a package.json, install the dependencies, and put the file in place.",
  },
  {
    title: "3. Connect your agent",
    description:
      "Add your API credentials on your machine, then point Cursor, Claude, or any MCP host at the server.",
  },
] as const;

function ServerPreview() {
  return (
    <div
      className="panel overflow-hidden shadow-float"
      role="img"
      aria-label="Preview of a local MCP project after following setup instructions"
    >
      <div className="flex items-center gap-2 border-b border-line px-3.5 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
        </span>
        <p className="min-w-0 truncate font-mono text-[11px] text-ink-faint">
          posts-api-mcp
        </p>
      </div>

      <div className="flex min-h-[200px] text-left sm:min-h-[220px]">
        <div className="w-[42%] shrink-0 border-r border-line bg-white/[0.02] py-2.5 sm:w-[38%]">
          <p className="px-3 pb-1.5 font-mono text-[9px] tracking-[0.14em] text-ink-faint uppercase">
            Files
          </p>
          <ul className="space-y-0.5 px-1.5">
            {generatedFiles.map((file) => (
              <li key={file.name}>
                <span
                  className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 font-mono text-[11px] sm:text-[12px] ${
                    file.active ? "bg-accent-soft text-ink" : "text-ink-muted"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`size-1.5 shrink-0 rounded-sm ${
                      file.kind === "ts"
                        ? "bg-sky-400/80"
                        : file.kind === "env"
                          ? "bg-amber-400/70"
                          : file.kind === "md"
                            ? "bg-violet-400/70"
                            : "bg-emerald-400/70"
                    }`}
                  />
                  {file.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <pre className="relative min-w-0 flex-1 overflow-hidden bg-[#0c0c0e] px-3 py-3 font-mono text-[10px] leading-[1.55] text-ink-muted sm:text-[11px]">
          <code>
            {mcpPreview.split("\n").map((line, i) => (
              <span key={i} className="block truncate">
                <span className="mr-2.5 inline-block w-4 select-none text-right text-ink-faint/40">
                  {i + 1}
                </span>
                {line || " "}
              </span>
            ))}
          </code>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0c0c0e] to-transparent"
          />
        </pre>
      </div>
    </div>
  );
}

export function WhatYouGet() {
  return (
    <section
      id="what-you-get"
      className="py-14 sm:py-16 lg:py-20"
      aria-labelledby="what-you-get-title"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal className="order-2 lg:order-1">
            <ServerPreview />
          </Reveal>

          <Reveal delay={80} className="order-1 lg:order-2">
            <Eyebrow>What you get</Eyebrow>
            <h2
              id="what-you-get-title"
              className="mt-4 text-2xl font-semibold tracking-tight text-balance sm:mt-5 sm:text-3xl lg:text-[32px] lg:leading-[1.2]"
            >
              A local MCP server you own
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              We generate the server file and the setup steps. You run it on
              your machine, and your credentials never leave your environment.
            </p>

            <ul className="mt-8 space-y-5">
              {proofPoints.map((point) => (
                <li key={point.title} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-accent/80"
                  />
                  <div>
                    <p className="text-sm font-semibold tracking-tight text-ink">
                      {point.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                      {point.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
