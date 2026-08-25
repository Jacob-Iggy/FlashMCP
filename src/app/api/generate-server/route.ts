/*
 * FlashMCP
 * Creator: Iggy
 * API route that writes the MCP server file.
 */

import OpenAI from "openai";
import { isApiAuthConfig } from "@/lib/auth-config";
import {
  buildGenerateServerUserPrompt,
  GENERATE_SERVER_SYSTEM_PROMPT,
} from "@/lib/generate-server-prompt";
import {
  parseGeneratedTypeScript,
  readModelText,
} from "@/lib/parse-generated-code";
import { resolveEndpointList } from "@/lib/resolve-endpoint-schemas";
import { isToolKind, type GenerateEndpointSeed } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

const MODEL = "gpt-5.6-terra";
const MAX_ENDPOINTS = 200;
const MAX_DOCUMENT_CHARS = 1_500_000;

type GenerateServerRequest = {
  endpoints?: unknown;
  document?: unknown;
  title?: unknown;
  description?: unknown;
  serverUrl?: unknown;
  auth?: unknown;
};

function parseEndpointSeeds(value: unknown): GenerateEndpointSeed[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;

  const endpoints: GenerateEndpointSeed[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const record = item as Record<string, unknown>;
    if (
      typeof record.endpoint !== "string" ||
      !record.endpoint.trim() ||
      typeof record.toolName !== "string" ||
      !record.toolName.trim() ||
      !isToolKind(record.type)
    ) {
      return null;
    }
    endpoints.push({
      endpoint: record.endpoint.trim(),
      toolName: record.toolName.trim(),
      type: record.type,
    });
  }
  return endpoints;
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "OPENAI_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  let body: GenerateServerRequest;
  try {
    body = (await request.json()) as GenerateServerRequest;
  } catch {
    return Response.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  const seeds = parseEndpointSeeds(body.endpoints);
  if (!seeds) {
    return Response.json(
      {
        error:
          "endpoints must be a non-empty array of { endpoint, toolName, type }.",
      },
      { status: 400 },
    );
  }

  if (seeds.length > MAX_ENDPOINTS) {
    return Response.json(
      { error: `Too many endpoints (max ${MAX_ENDPOINTS}).` },
      { status: 413 },
    );
  }

  const document =
    typeof body.document === "string" ? body.document.trim() : "";
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

  if (!isApiAuthConfig(body.auth)) {
    return Response.json(
      { error: "auth must be a valid API_AUTH_CONFIG object." },
      { status: 400 },
    );
  }

  const title =
    typeof body.title === "string" && body.title.trim()
      ? body.title.trim()
      : "Generated API";
  const description =
    typeof body.description === "string" && body.description.trim()
      ? body.description.trim()
      : "Generated MCP server for an OpenAPI-backed API";
  const serverUrl =
    typeof body.serverUrl === "string" && body.serverUrl.trim()
      ? body.serverUrl.trim()
      : "https://api.example.com";

  let endpoints;
  try {
    endpoints = resolveEndpointList(document, seeds);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to resolve endpoint schemas.";
    return Response.json({ error: message }, { status: 400 });
  }

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: GENERATE_SERVER_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: buildGenerateServerUserPrompt({
            endpoints,
            title,
            description,
            serverUrl,
            auth: body.auth,
          }),
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

    const code = parseGeneratedTypeScript(content);
    return Response.json({ code, title, description, serverUrl });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate MCP server.";
    console.error("[generate-server]", error);
    return Response.json({ error: message }, { status: 502 });
  }
}
