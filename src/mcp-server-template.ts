/*
 * FlashMCP
 * Creator: Iggy
 * Example MCP server the model copies from.
 */

export const MCP_SERVER_TEMPLATE = `
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "example-api",
  version: "1.0.0",
});

// ---------------------------------------------------------------------------
// SHARED API CLIENT — every tool/resource should call this instead of
// hitting fetch() directly, so auth + base URL + error handling live in
// exactly one place.
// ---------------------------------------------------------------------------
const API_BASE = "https://api.example.com";
const API_TOKEN = process.env.API_TOKEN;

async function apiRequest(path: string, options: RequestInit = {}) {
  const res = await fetch(\`\${API_BASE}\${path}\`, {
    ...options,
    headers: {
      Authorization: \`Bearer \${API_TOKEN}\`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(\`API error \${res.status}: \${body}\`);
  }

  // Some endpoints (e.g. DELETE) return no body
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ---------------------------------------------------------------------------
// TOOL — use for actions / side effects (POST, PUT, PATCH, DELETE, etc.)
// ---------------------------------------------------------------------------
server.registerTool(
  "create_task",
  {
    description: "Create a new task. Maps to: POST /tasks",
    inputSchema: {
      title: z.string().describe("Short title for the task"),
      completed: z.boolean().optional().describe("Whether the task is already done"),
    },
  },
  async ({ title, completed }) => {
    try {
      const data = await apiRequest("/tasks", {
        method: "POST",
        body: JSON.stringify({ title, completed: completed ?? false }),
      });

      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: \`Error: \${(err as Error).message}\` }],
        isError: true,
      };
    }
  },
);

// ---------------------------------------------------------------------------
// RESOURCE — use for read-only data (typically GET endpoints)
// ---------------------------------------------------------------------------
server.registerResource(
  "get_task",
  new ResourceTemplate("task://{task_id}", {
    list: undefined, // set a list() callback if clients should discover URIs
  }),
  {
    title: "Get Task",
    description: "Fetch a single task by id. Maps to: GET /tasks/{task_id}",
    mimeType: "application/json",
  },
  async (uri, { task_id }) => {
    try {
      const data = await apiRequest(\`/tasks/\${task_id}\`);

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (err) {
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify({ error: (err as Error).message }, null, 2),
          },
        ],
        isError: true,
      };
    }
  },
);

// Start the server over stdio (how most MCP hosts launch local servers)
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
`.trim();
