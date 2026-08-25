/*
 * FlashMCP
 * Creator: Iggy
 * Cleans model output into a TypeScript file.
 */

export function readModelText(
  content: string | Array<{ type?: string; text?: string }> | null | undefined,
): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  return content
    .map((part) => (typeof part.text === "string" ? part.text : ""))
    .join("")
    .trim();
}

export function parseGeneratedTypeScript(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("The model returned an empty response.");
  }

  const fenced = trimmed.match(/```(?:typescript|ts)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    const inner = fenced[1].trim();
    if (inner) return inner;
  }

  // Drop a leading prose line if the model ignored the "code only" rule.
  if (!trimmed.startsWith("import ") && !trimmed.startsWith("//")) {
    const importIndex = trimmed.indexOf("\nimport ");
    if (importIndex !== -1) {
      return trimmed.slice(importIndex + 1).trim();
    }
  }

  return trimmed;
}

export function slugifyFileName(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return slug ? `${slug}-mcp-server.ts` : "mcp-server.ts";
}
