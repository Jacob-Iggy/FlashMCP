/*
 * FlashMCP
 * Creator: Iggy
 * Turns the auth form into the config the generator uses.
 */

import type { ApiAuthConfig, AuthConfig } from "@/lib/types";

export function isApiAuthConfig(value: unknown): value is ApiAuthConfig {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;

  switch (record.type) {
    case "bearer":
      return (
        typeof record.header === "string" && typeof record.prefix === "string"
      );
    case "apiKey":
      return (
        (record.in === "header" || record.in === "query") &&
        typeof record.param === "string" &&
        record.param.trim().length > 0
      );
    case "basic":
    case "none":
      return true;
    default:
      return false;
  }
}

export function toApiAuthConfig(config: AuthConfig): ApiAuthConfig {
  switch (config.kind) {
    case "bearer":
      return {
        type: "bearer",
        header: "Authorization",
        prefix: "Bearer ",
      };
    case "header":
      return {
        type: "apiKey",
        in: "header",
        param: config.headerName?.trim() || "X-API-Key",
      };
    case "query":
      return {
        type: "apiKey",
        in: "query",
        param: config.queryParam?.trim() || "api_key",
      };
    case "basic":
      return { type: "basic" };
    case "none":
      return { type: "none" };
  }
}
