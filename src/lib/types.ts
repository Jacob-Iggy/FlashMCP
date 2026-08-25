/*
 * FlashMCP
 * Creator: Iggy
 * Shared TypeScript types used across the app.
 */

export type ToolKind = "resource" | "tool";

export function isToolKind(value: unknown): value is ToolKind {
  return value === "resource" || value === "tool";
}

export type ProposedTool = {
  endpoint: string;
  toolName: string;
  type: ToolKind;
};

export type ReviewTool = ProposedTool & {
  id: string;
  method: string;
  path: string;
  included: boolean;
};

export type OpenApiMeta = {
  title: string | null;
  description: string | null;
  serverUrl: string | null;
};

export type OpenApiUpload = {
  fileName: string;
  content: string;
  uploadedAt: number;
  meta?: OpenApiMeta | null;
};

export type AuthKind = "bearer" | "header" | "query" | "basic" | "none";

export type AuthConfig = {
  kind: AuthKind;
  headerName?: string;
  queryParam?: string;
};

/** Shape passed into the generate-server prompt as API_AUTH_CONFIG. */
export type ApiAuthConfig =
  | { type: "bearer"; header: string; prefix: string }
  | { type: "apiKey"; in: "header" | "query"; param: string }
  | { type: "basic" }
  | { type: "none" };

export type GenerateEndpointSeed = {
  endpoint: string;
  toolName: string;
  type: ToolKind;
};

export type GenerateEndpoint = GenerateEndpointSeed & {
  parameters: Array<{
    name: string;
    in: string;
    required?: boolean;
    description?: string;
    schema?: Record<string, unknown>;
    [key: string]: unknown;
  }>;
  requestBody: Record<string, Record<string, unknown>> | null;
};

export type GenerateServerPayload = {
  endpoints: GenerateEndpointSeed[];
  auth: ApiAuthConfig;
  title: string;
  description: string;
  serverUrl: string;
  fileName: string;
  createdAt: number;
};
