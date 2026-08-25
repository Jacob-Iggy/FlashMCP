/*
 * FlashMCP
 * Creator: Iggy
 * Reads an OpenAPI file and keeps only what we need to plan tools.
 */

import { load as loadYaml } from "js-yaml";
import type { OpenApiMeta } from "@/lib/types";

const HTTP_METHODS = new Set(["get", "post", "put", "patch", "delete"]);

type OpenApiOperation = {
  operationId?: unknown;
  summary?: unknown;
  tags?: unknown;
};

type OpenApiPaths = Record<string, Record<string, OpenApiOperation>>;

type OpenApiDocument = {
  info?: {
    title?: unknown;
    description?: unknown;
  };
  servers?: unknown;
  paths?: OpenApiPaths;
};

export type StrippedOpenApi = {
  paths: Record<
    string,
    Record<
      string,
      {
        operationId: string | null;
        summary: string | null;
        tags: string[];
      }
    >
  >;
};

export type PreparedOpenApi = {
  meta: OpenApiMeta;
  toolPlanningDocument: string;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function extractServerUrl(servers: unknown): string | null {
  if (!Array.isArray(servers) || servers.length === 0) return null;

  for (const server of servers) {
    if (!isPlainObject(server)) continue;
    const url = asNullableString(server.url);
    if (url) return url;
  }

  return null;
}

export function extractOpenApiMeta(openApiDoc: OpenApiDocument): OpenApiMeta {
  const info = isPlainObject(openApiDoc.info) ? openApiDoc.info : null;

  return {
    title: info ? asNullableString(info.title) : null,
    description: info ? asNullableString(info.description) : null,
    serverUrl: extractServerUrl(openApiDoc.servers),
  };
}

export function parseOpenApiDocument(raw: string): OpenApiDocument {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("OpenAPI document is empty.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed) as unknown;
  } catch {
    try {
      parsed = loadYaml(trimmed);
    } catch {
      throw new Error("Could not parse OpenAPI document as JSON or YAML.");
    }
  }

  if (!isPlainObject(parsed)) {
    throw new Error("OpenAPI document must be an object.");
  }

  return parsed as OpenApiDocument;
}

export function stripOpenApiForToolPlanning(
  openApiDoc: OpenApiDocument,
): StrippedOpenApi {
  const paths = openApiDoc.paths || {};
  const stripped: StrippedOpenApi["paths"] = {};

  for (const [path, methods] of Object.entries(paths)) {
    if (!isPlainObject(methods)) continue;

    for (const [method, op] of Object.entries(methods)) {
      if (!HTTP_METHODS.has(method.toLowerCase())) continue;
      if (!isPlainObject(op)) continue;

      if (!stripped[path]) stripped[path] = {};

      const tags = Array.isArray(op.tags)
        ? op.tags.filter((tag): tag is string => typeof tag === "string")
        : [];

      stripped[path][method.toLowerCase()] = {
        operationId: typeof op.operationId === "string" ? op.operationId : null,
        summary: typeof op.summary === "string" ? op.summary : null,
        tags,
      };
    }
  }

  return { paths: stripped };
}

export function prepareOpenApiForToolPlanning(raw: string): PreparedOpenApi {
  const openApiDoc = parseOpenApiDocument(raw);
  const meta = extractOpenApiMeta(openApiDoc);
  const stripped = stripOpenApiForToolPlanning(openApiDoc);

  if (Object.keys(stripped.paths).length === 0) {
    throw new Error("No HTTP operations found in this OpenAPI document.");
  }

  return {
    meta,
    toolPlanningDocument: JSON.stringify(stripped),
  };
}
