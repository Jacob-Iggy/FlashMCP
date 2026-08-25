/*
 * FlashMCP
 * Creator: Iggy
 * Fills in request fields from the OpenAPI spec.
 */

import { parseOpenApiDocument } from "@/lib/strip-openapi";
import type { GenerateEndpoint, GenerateEndpointSeed } from "@/lib/types";

type JsonSchema = Record<string, unknown>;

type ResolvedParameter = {
  name: string;
  in: string;
  required?: boolean;
  description?: string;
  schema?: JsonSchema;
  [key: string]: unknown;
};

type ResolvedEndpoint = GenerateEndpoint & {
  parameters: ResolvedParameter[];
  requestBody: Record<string, JsonSchema> | null;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseEndpoint(endpoint: string): { method: string; path: string } | null {
  const trimmed = endpoint.trim();
  const spaceIndex = trimmed.indexOf(" ");
  if (spaceIndex <= 0) return null;
  const method = trimmed.slice(0, spaceIndex).toUpperCase();
  const path = trimmed.slice(spaceIndex + 1).trim();
  if (!method || !path.startsWith("/")) return null;
  return { method, path };
}

function getByPointer(
  root: Record<string, unknown>,
  pointer: string,
): unknown {
  if (!pointer.startsWith("#/")) return undefined;
  const parts = pointer
    .slice(2)
    .split("/")
    .map((part) => part.replace(/~1/g, "/").replace(/~0/g, "~"));

  let current: unknown = root;
  for (const part of parts) {
    if (!isPlainObject(current) && !Array.isArray(current)) return undefined;
    if (Array.isArray(current)) {
      const index = Number(part);
      if (!Number.isInteger(index) || index < 0 || index >= current.length) {
        return undefined;
      }
      current = current[index];
      continue;
    }
    current = current[part];
  }
  return current;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * Recursively resolve local $ref pointers and merge sibling keywords.
 * Circular refs stop at the first repeat to avoid infinite loops.
 */
function resolveRefs(
  value: unknown,
  root: Record<string, unknown>,
  seen: Set<string> = new Set(),
): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => resolveRefs(item, root, seen));
  }

  if (!isPlainObject(value)) return value;

  if (typeof value.$ref === "string") {
    const ref = value.$ref;
    if (seen.has(ref)) {
      return { $ref: ref, $circular: true };
    }

    const target = getByPointer(root, ref);
    if (target === undefined) {
      return { $ref: ref, $unresolved: true };
    }

    const nextSeen = new Set(seen);
    nextSeen.add(ref);
    const resolvedTarget = resolveRefs(deepClone(target), root, nextSeen);

    const { $ref: _ref, ...siblings } = value;
    void _ref;

    if (isPlainObject(resolvedTarget)) {
      return resolveRefs({ ...resolvedTarget, ...siblings }, root, nextSeen);
    }
    return resolvedTarget;
  }

  const result: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    result[key] = resolveRefs(child, root, seen);
  }
  return result;
}

function pickJsonMediaSchema(
  content: Record<string, unknown>,
): unknown | undefined {
  const preferredKeys = [
    "application/json",
    "application/json; charset=utf-8",
    "application/*+json",
  ];

  for (const key of preferredKeys) {
    const media = content[key];
    if (isPlainObject(media) && "schema" in media) return media.schema;
  }

  for (const [key, media] of Object.entries(content)) {
    if (!key.toLowerCase().includes("json")) continue;
    if (isPlainObject(media) && "schema" in media) return media.schema;
  }

  for (const media of Object.values(content)) {
    if (isPlainObject(media) && "schema" in media) return media.schema;
  }

  return undefined;
}

function schemaToRequestBodyFields(
  schema: unknown,
): Record<string, JsonSchema> | null {
  if (!isPlainObject(schema)) return null;

  // Prefer object properties as the body field map (matches generation UX).
  if (isPlainObject(schema.properties)) {
    const required = new Set(
      Array.isArray(schema.required)
        ? schema.required.filter((item): item is string => typeof item === "string")
        : [],
    );

    const fields: Record<string, JsonSchema> = {};
    for (const [name, property] of Object.entries(schema.properties)) {
      if (!isPlainObject(property)) {
        fields[name] = { type: "object" };
        continue;
      }

      const field = deepClone(property);
      const nullable =
        field.nullable === true ||
        (Array.isArray(field.type) && field.type.includes("null"));
      const isRequired = required.has(name);

      field.required = isRequired;
      if (nullable && field.nullable === undefined) {
        field.nullable = true;
      }
      fields[name] = field;
    }
    return fields;
  }

  // allOf-only object bodies: merge property maps when present
  if (Array.isArray(schema.allOf)) {
    const merged: Record<string, JsonSchema> = {};
    for (const part of schema.allOf) {
      const partFields = schemaToRequestBodyFields(part);
      if (partFields) Object.assign(merged, partFields);
    }
    if (Object.keys(merged).length > 0) return merged;
  }

  // Non-object body (string/array/etc.): expose as a single "body" field
  return {
    body: deepClone(schema),
  };
}

function extractRequestBody(
  operation: Record<string, unknown>,
  root: Record<string, unknown>,
): Record<string, JsonSchema> | null {
  if (!isPlainObject(operation.requestBody)) return null;

  const requestBody = resolveRefs(
    deepClone(operation.requestBody),
    root,
  ) as Record<string, unknown>;

  if (!isPlainObject(requestBody.content)) return null;

  const schema = pickJsonMediaSchema(requestBody.content);
  if (schema === undefined) return null;

  const resolvedSchema = resolveRefs(schema, root);
  return schemaToRequestBodyFields(resolvedSchema);
}

function normalizeParameter(
  param: unknown,
  root: Record<string, unknown>,
): ResolvedParameter | null {
  const resolved = resolveRefs(deepClone(param), root);
  if (!isPlainObject(resolved)) return null;
  if (typeof resolved.name !== "string" || typeof resolved.in !== "string") {
    return null;
  }

  const result: ResolvedParameter = {
    name: resolved.name,
    in: resolved.in,
  };

  if (typeof resolved.required === "boolean") {
    result.required = resolved.required;
  } else if (resolved.in === "path") {
    result.required = true;
  }

  if (typeof resolved.description === "string") {
    result.description = resolved.description;
  }

  if (isPlainObject(resolved.schema)) {
    result.schema = resolved.schema as JsonSchema;
  } else if ("schema" in resolved) {
    result.schema = { value: resolved.schema as unknown as JsonSchema };
  }

  // Preserve other useful OpenAPI parameter fields without $ref leftovers.
  for (const [key, value] of Object.entries(resolved)) {
    if (
      key === "name" ||
      key === "in" ||
      key === "required" ||
      key === "description" ||
      key === "schema" ||
      key === "$ref"
    ) {
      continue;
    }
    result[key] = value;
  }

  return result;
}

function collectParameters(
  pathItem: Record<string, unknown>,
  operation: Record<string, unknown>,
  root: Record<string, unknown>,
): ResolvedParameter[] {
  const raw: unknown[] = [];
  if (Array.isArray(pathItem.parameters)) raw.push(...pathItem.parameters);
  if (Array.isArray(operation.parameters)) raw.push(...operation.parameters);

  const byKey = new Map<string, ResolvedParameter>();
  for (const param of raw) {
    const normalized = normalizeParameter(param, root);
    if (!normalized) continue;
    byKey.set(`${normalized.in}:${normalized.name}`, normalized);
  }

  return Array.from(byKey.values());
}

function findOperation(
  doc: Record<string, unknown>,
  method: string,
  path: string,
): { pathItem: Record<string, unknown>; operation: Record<string, unknown> } | null {
  if (!isPlainObject(doc.paths)) return null;
  const pathItem = doc.paths[path];
  if (!isPlainObject(pathItem)) return null;

  const lower = method.toLowerCase();
  const operation =
    pathItem[lower] ??
    pathItem[method] ??
    pathItem[method.toUpperCase()];

  if (!isPlainObject(operation)) return null;
  return { pathItem, operation };
}

/**
 * Enrich selected endpoints with fully resolved parameters + requestBody
 * fields from the original OpenAPI document (no leftover $ref pointers).
 */
export function resolveEndpointList(
  document: string,
  endpoints: GenerateEndpointSeed[],
): ResolvedEndpoint[] {
  const parsed = parseOpenApiDocument(document) as Record<string, unknown>;

  return endpoints.map((endpoint) => {
    const parsedEndpoint = parseEndpoint(endpoint.endpoint);
    if (!parsedEndpoint) {
      return {
        ...endpoint,
        parameters: [],
        requestBody: null,
      };
    }

    const found = findOperation(
      parsed,
      parsedEndpoint.method,
      parsedEndpoint.path,
    );

    if (!found) {
      return {
        ...endpoint,
        parameters: [],
        requestBody: null,
      };
    }

    return {
      ...endpoint,
      parameters: collectParameters(found.pathItem, found.operation, parsed),
      requestBody: extractRequestBody(found.operation, parsed),
    };
  });
}
