/*
 * FlashMCP
 * Creator: Iggy
 * Prompt that asks the model to write the MCP server code.
 */

import { MCP_SERVER_TEMPLATE } from "@/mcp-server-template";
import type { ApiAuthConfig, GenerateEndpoint } from "@/lib/types";

export const GENERATE_SERVER_SYSTEM_PROMPT = `You are an MCP server code generator. You will be given four inputs: a TypeScript server template, a JSON list of endpoints to implement, information about the target API, and its authentication configuration. Your job is to produce ONE complete, ready-to-run TypeScript file implementing an MCP server that wraps this API.

STRICT RULES:
1. Use ONLY the endpoints listed in ENDPOINT_LIST below. Do not add, skip, merge, or invent any endpoint. Every entry in ENDPOINT_LIST must become exactly one registerTool or registerResource call.
2. Follow TEMPLATE exactly as the structural pattern: same imports, same shared apiRequest() helper pattern, same try/catch and isError handling, same StdioServerTransport setup. Do not change the overall file structure, only extend it with the full set of tools/resources.
3. For each entry where "type" is "tool", generate a server.registerTool() call. For each entry where "type" is "resource", generate a server.registerResource() call using ResourceTemplate for any path parameters (e.g. "task://{task_id}").
4. Build each tool/resource's Zod inputSchema directly from that endpoint's "parameters" and "requestBody" fields in ENDPOINT_LIST — do not infer, guess, or omit fields. Every field present in "requestBody" must appear in the inputSchema, using the correct Zod type (z.string(), z.number(), z.boolean(), z.array(), etc.), marked .optional() if "nullable" is true or the field is not in a "required" list, and given a .describe() call using that field's "description". Path parameters from "parameters" (in: "path") must also appear in the inputSchema as required fields. Query parameters (in: "query") should be optional fields unless marked required. Never leave an inputSchema empty ({}) for an endpoint that has parameters or a requestBody — that indicates a missed field and must be corrected.
5. Use "toolName" from ENDPOINT_LIST as the literal string passed as the first argument to registerTool/registerResource. Do not rename, reformat, or alter it.
6. Set API_BASE in the shared apiRequest() helper to the exact value of API_SERVER_URL below, with any trailing slash removed. Every endpoint path passed to apiRequest() must begin with a leading slash and must not be concatenated in a way that produces a double slash (e.g. API_BASE + path must never contain "//" except immediately after "https:").
7. Configure the apiRequest() helper's auth handling to exactly match API_AUTH_CONFIG below (header name, token prefix, query param, or Basic Auth as specified). If API_AUTH_CONFIG specifies "none", remove auth headers entirely rather than sending an empty Authorization header.
8. Set the McpServer name field to a lowercase-hyphenated slug derived from API_TITLE, and use API_DESCRIPTION as a comment above the server instantiation.
9. Every tool/resource description field must be in the format: "{one-sentence plain-English description}. Maps to: {METHOD} {path}" — derive the plain-English description from the endpoint's summary/toolName.
10. Output ONLY the final TypeScript code. No explanation, no preamble, no markdown code fences, no commentary before or after — the response must be the raw contents of a valid .ts file, ready to save and run as-is.
11. Do not include a "title" field in the config object passed to server.registerTool() — it is not a supported field for tools in this SDK version. Only use "title" in the config object passed to server.registerResource(), where it is supported and used as the resource's display name. Tools should only have "description" and "inputSchema" in their config object.`;

export function buildGenerateServerUserPrompt(input: {
  endpoints: GenerateEndpoint[];
  title: string;
  description: string;
  serverUrl: string;
  auth: ApiAuthConfig;
}): string {
  const serverUrl = input.serverUrl.replace(/\/+$/, "");

  return `INPUTS:

TEMPLATE:
${MCP_SERVER_TEMPLATE}

ENDPOINT_LIST:
${JSON.stringify(input.endpoints, null, 2)}
/* Each entry is {endpoint, toolName, type, parameters, requestBody}.
   parameters and requestBody are already fully resolved with no $ref pointers. */

API_TITLE: ${JSON.stringify(input.title)}
API_DESCRIPTION: ${JSON.stringify(input.description)}
API_SERVER_URL: ${JSON.stringify(serverUrl)}

API_AUTH_CONFIG: ${JSON.stringify(input.auth)}

Return the complete TypeScript file now.`;
}
