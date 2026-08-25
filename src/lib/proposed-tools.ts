/*
 * FlashMCP
 * Creator: Iggy
 * Parses the model tool list into the review table.
 */

import { isToolKind, type ProposedTool, type ReviewTool } from "@/lib/types";

const HTTP_METHODS = new Set([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
  "TRACE",
]);

function parseEndpoint(endpoint: string): { method: string; path: string } | null {
  const trimmed = endpoint.trim();
  const spaceIndex = trimmed.indexOf(" ");
  if (spaceIndex <= 0) return null;

  const method = trimmed.slice(0, spaceIndex).toUpperCase();
  const path = trimmed.slice(spaceIndex + 1).trim();
  if (!HTTP_METHODS.has(method) || !path.startsWith("/")) return null;

  return { method, path };
}

function extractJsonArrayText(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("[")) return trimmed;

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    const inner = fenced[1].trim();
    if (inner.startsWith("[")) return inner;
  }

  const start = trimmed.indexOf("[");
  const end = trimmed.lastIndexOf("]");
  if (start !== -1 && end > start) {
    return trimmed.slice(start, end + 1);
  }

  throw new Error("Model response did not contain a JSON array.");
}

export function parseProposedTools(raw: string): ProposedTool[] {
  const jsonText = extractJsonArrayText(raw);
  const parsed = JSON.parse(jsonText) as unknown;

  if (!Array.isArray(parsed)) {
    throw new Error("Model response must be a JSON array.");
  }

  const tools: ProposedTool[] = [];

  for (const item of parsed) {
    if (!item || typeof item !== "object") {
      throw new Error("Each tool entry must be an object.");
    }

    const record = item as Record<string, unknown>;
    const endpoint = record.endpoint;
    const toolName = record.toolName;
    const type = record.type;

    if (typeof endpoint !== "string" || !endpoint.trim()) {
      throw new Error('Each tool entry needs a non-empty "endpoint" string.');
    }
    if (typeof toolName !== "string" || !toolName.trim()) {
      throw new Error('Each tool entry needs a non-empty "toolName" string.');
    }
    if (!isToolKind(type)) {
      throw new Error('Each tool entry "type" must be "resource" or "tool".');
    }
    if (!parseEndpoint(endpoint)) {
      throw new Error(`Invalid endpoint format: "${endpoint}". Expected "METHOD /path".`);
    }

    tools.push({
      endpoint: endpoint.trim(),
      toolName: toolName.trim(),
      type,
    });
  }

  return tools;
}

export function toReviewTools(tools: ProposedTool[]): ReviewTool[] {
  return tools.map((tool, index) => {
    const parsed = parseEndpoint(tool.endpoint);
    if (!parsed) {
      throw new Error(`Invalid endpoint format: "${tool.endpoint}".`);
    }

    return {
      ...tool,
      id: `${tool.toolName}-${index}`,
      method: parsed.method,
      path: parsed.path,
      included: true,
    };
  });
}
