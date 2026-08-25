# FlashMCP

FlashMCP is a web application that turns an OpenAPI specification into a downloadable [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server. It makes it easier to connect existing APIs to AI agents without manually translating every endpoint into agent-ready tools.

**Live site:** [flashmcp.jacobiggy.com](https://flashmcp.jacobiggy.com)

## What it does

1. Upload an OpenAPI document.
2. Use AI to identify the API endpoints that make useful MCP tools and resources.
3. Review and refine the proposed tools.
4. Generate a TypeScript MCP server configured for the selected API and download it to run locally.

The generated server supports common authentication approaches, resolves endpoint schemas from the source specification, and uses the MCP SDK's standard I/O transport so it can be connected to compatible AI clients.

## Why I built it

I am getting deeper into AI and learning how MCP can make AI agents more useful with real-world tools and data. My background is in building websites and APIs, so FlashMCP is where those interests meet: a practical way to help developers test and connect an API to an AI agent with less setup and friction.

## Technology

- **Next.js 16** with the App Router and Route Handlers
- **React 19** and **TypeScript**
- **Tailwind CSS v4** for the interface and responsive styling
- **OpenAI API** for OpenAPI analysis and MCP server generation
- **Model Context Protocol SDK** as the foundation for generated servers
- **Vercel** for deployment and hosting
- **Cloudflare** for DNS and edge network services

## Local development

```bash
npm install
```

Create a `.env.local` file and add an OpenAI API key:

```bash
OPENAI_API_KEY=your_api_key
```

Then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the local development server. |
| `npm run build` | Creates an optimized production build. |
| `npm run start` | Serves a production build locally. |
| `npm run lint` | Runs ESLint. |

## Project structure

```text
src/
├── app/                   # Pages and API routes
├── components/            # Landing, review, and generator UI
├── lib/                   # OpenAPI parsing and generation utilities
└── mcp-server-template.ts # Reference template for generated servers
```
