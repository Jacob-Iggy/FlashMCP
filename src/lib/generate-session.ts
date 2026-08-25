/*
 * FlashMCP
 * Creator: Iggy
 * Saves generate-server data in the browser for the next page.
 */

import { isApiAuthConfig } from "@/lib/auth-config";
import { isToolKind, type GenerateEndpointSeed, type GenerateServerPayload } from "@/lib/types";

export const GENERATE_SERVER_KEY = "flashmcp:generate-server";

type SessionCache = {
  raw: string | null | undefined;
  value: GenerateServerPayload | null;
};

const sessionCache: SessionCache = {
  raw: undefined,
  value: null,
};

function isGenerateEndpointSeed(value: unknown): value is GenerateEndpointSeed {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.endpoint === "string" &&
    typeof record.toolName === "string" &&
    isToolKind(record.type)
  );
}

function invalidateGenerateServerCache() {
  sessionCache.raw = undefined;
  sessionCache.value = null;
}

export function saveGenerateServerPayload(payload: GenerateServerPayload) {
  sessionStorage.setItem(GENERATE_SERVER_KEY, JSON.stringify(payload));
  invalidateGenerateServerCache();
}

export function readGenerateServerPayload(): GenerateServerPayload | null {
  const raw = sessionStorage.getItem(GENERATE_SERVER_KEY);
  if (raw === sessionCache.raw) return sessionCache.value;

  sessionCache.raw = raw;

  if (!raw) {
    sessionCache.value = null;
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<GenerateServerPayload>;
    if (
      !Array.isArray(parsed.endpoints) ||
      parsed.endpoints.length === 0 ||
      !parsed.endpoints.every(isGenerateEndpointSeed) ||
      !isApiAuthConfig(parsed.auth) ||
      typeof parsed.title !== "string" ||
      typeof parsed.description !== "string" ||
      typeof parsed.serverUrl !== "string" ||
      typeof parsed.fileName !== "string" ||
      typeof parsed.createdAt !== "number"
    ) {
      sessionCache.value = null;
      return null;
    }

    sessionCache.value = {
      endpoints: parsed.endpoints.map((endpoint) => ({
        endpoint: endpoint.endpoint,
        toolName: endpoint.toolName,
        type: endpoint.type,
      })),
      auth: parsed.auth,
      title: parsed.title,
      description: parsed.description,
      serverUrl: parsed.serverUrl,
      fileName: parsed.fileName,
      createdAt: parsed.createdAt,
    };
    return sessionCache.value;
  } catch {
    sessionCache.value = null;
    return null;
  }
}

export function clearGenerateServerPayload() {
  sessionStorage.removeItem(GENERATE_SERVER_KEY);
  invalidateGenerateServerCache();
}
