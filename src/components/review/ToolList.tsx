"use client";

/*
 * FlashMCP
 * Creator: Iggy
 * Table of generated tools you can include or exclude.
 */

import type { ReviewTool } from "@/lib/types";

type ToolListProps = {
  tools: ReviewTool[];
  fileName: string;
  onToggle: (id: string) => void;
};

function kindLabel(type: ReviewTool["type"]) {
  return type === "resource" ? "Resource" : "Tool";
}

function countByType(tools: ReviewTool[], type: ReviewTool["type"]) {
  const total = tools.filter((tool) => tool.type === type).length;
  const included = tools.filter(
    (tool) => tool.type === type && tool.included,
  ).length;
  return { included, total };
}

export function ToolList({ tools, fileName, onToggle }: ToolListProps) {
  const includedCount = tools.filter((tool) => tool.included).length;
  const toolCounts = countByType(tools, "tool");
  const resourceCounts = countByType(tools, "resource");

  return (
    <div className="panel-glow overflow-hidden animate-rise">
      <div className="flex flex-col gap-4 border-b border-line px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p className="text-sm font-semibold tracking-tight">
            Generated tool list
          </p>
          <p className="mt-1 text-xs text-ink-faint">
            Toggle endpoints on or off before you generate
          </p>
          <p className="mt-2 font-mono text-[11px] text-ink-faint">{fileName}</p>
        </div>

        <dl className="flex flex-wrap gap-2 sm:justify-end">
          <StatChip
            label="Selected"
            included={includedCount}
            total={tools.length}
          />
          <StatChip
            label="Tools"
            included={toolCounts.included}
            total={toolCounts.total}
          />
          <StatChip
            label="Resources"
            included={resourceCounts.included}
            total={resourceCounts.total}
          />
        </dl>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
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
            {tools.map((row) => (
              <tr
                key={row.id}
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
                  {row.toolName}
                </td>
                <td className="px-5 py-3.5 text-[13px] text-ink-muted sm:px-6">
                  {kindLabel(row.type)}
                </td>
                <td className="px-5 py-3.5 sm:px-6">
                  <button
                    type="button"
                    onClick={() => onToggle(row.id)}
                    aria-pressed={row.included}
                    className={`inline-flex w-[7.25rem] cursor-pointer items-center justify-center gap-2 rounded-full border px-3 py-1.5 text-[13px] transition-[border-color,background-color,color] duration-150 ${
                      row.included
                        ? "border-accent/40 bg-accent-soft text-ink hover:border-accent/60"
                        : "border-line bg-white/[0.02] text-ink-faint hover:border-white/20 hover:text-ink-muted"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`size-1.5 shrink-0 rounded-full transition-colors duration-150 ${
                        row.included
                          ? "bg-accent shadow-[0_0_8px_var(--accent)]"
                          : "bg-white/20"
                      }`}
                    />
                    {row.included ? "Included" : "Excluded"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatChip({
  label,
  included,
  total,
}: {
  label: string;
  included: number;
  total: number;
}) {
  return (
    <div className="rounded-full border border-line bg-white/[0.03] px-3 py-1.5">
      <dt className="sr-only">{label}</dt>
      <dd className="flex items-baseline gap-1.5 font-mono text-[11px]">
        <span className="text-ink-faint">{label}</span>
        <span className="text-ink">
          {included}
          <span className="text-ink-faint">/{total}</span>
        </span>
      </dd>
    </div>
  );
}
