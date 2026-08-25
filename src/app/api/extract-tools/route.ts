/*
 * FlashMCP
 * Creator: Iggy
 * API route that turns an OpenAPI spec into a tool list.
 */

import OpenAI from "openai";
import { EXTRACT_TOOLS_PROMPT } from "@/lib/extract-tools-prompt";
import { readModelText } from "@/lib/parse-generated-code";
import { parseProposedTools } from "@/lib/proposed-tools";
import { prepareOpenApiForToolPlanning } from "@/lib/strip-openapi";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "gpt-5.6-luna";
const MAX_DOCUMENT_CHARS = 1_500_000;

type ExtractToolsRequest = {
  document?: unknown;
  fileName?: unknown;
};

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "OPENAI_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  let body: ExtractToolsRequest;
  try {
    body = (await request.json()) as ExtractToolsRequest;
  } catch {
    return Response.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  const document = typeof body.document === "string" ? body.document.trim() : "";
  if (!document) {
    return Response.json(
      { error: "Missing OpenAPI document contents." },
      { status: 400 },
    );
  }

  if (document.length > MAX_DOCUMENT_CHARS) {
    return Response.json(
      { error: "OpenAPI document is too large to process." },
      { status: 413 },
    );
  }

  const fileName =
    typeof body.fileName === "string" && body.fileName.trim()
      ? body.fileName.trim()
      : "openapi-document";

  let meta;
  let toolPlanningDocument: string;
  try {
    const prepared = prepareOpenApiForToolPlanning(document);
    meta = prepared.meta;
    toolPlanningDocument = prepared.toolPlanningDocument;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not prepare OpenAPI document.";
    return Response.json({ error: message }, { status: 400 });
  }

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: EXTRACT_TOOLS_PROMPT,
        },
        {
          role: "user",
          content: `File name: ${fileName}\n\n${toolPlanningDocument}`,
        },
      ],
    });

    const message = completion.choices[0]?.message;
    const content = readModelText(message?.content);
    if (!content) {
      return Response.json(
        { error: "The model returned an empty response." },
        { status: 502 },
      );
    }

    const tools = parseProposedTools(content);
    return Response.json({ tools, fileName, meta });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to extract tools.";
    console.error("[extract-tools]", error);
    return Response.json({ error: message }, { status: 502 });
  }
}
