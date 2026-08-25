"use client";

/*
 * FlashMCP
 * Creator: Iggy
 * Generated server page logic and layout.
 */

import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { ServerHeader } from "@/components/server/ServerHeader";
import { Button } from "@/components/ui/Button";
import {
  clearGenerateServerPayload,
  readGenerateServerPayload,
} from "@/lib/generate-session";
import { clearOpenApiUpload, readOpenApiUpload } from "@/lib/openapi-session";
import { slugifyFileName } from "@/lib/parse-generated-code";
import type { ApiAuthConfig, GenerateServerPayload } from "@/lib/types";

type FetchStatus = "loading" | "ready" | "error";

function subscribeNoop() {
  return () => {};
}

function getGenerateSnapshot(): GenerateServerPayload | null {
  return readGenerateServerPayload();
}

function getServerGenerateSnapshot(): GenerateServerPayload | null {
  return null;
}

export function ServerPageClient() {
  const router = useRouter();
  const payload = useSyncExternalStore(
    subscribeNoop,
    getGenerateSnapshot,
    getServerGenerateSnapshot,
  );

  const [status, setStatus] = useState<FetchStatus>("loading");
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requestKey, setRequestKey] = useState(0);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!payload) return;

    const requestId = ++requestIdRef.current;
    const controller = new AbortController();

    void (async () => {
      try {
        setStatus("loading");
        setError(null);

        const upload = readOpenApiUpload();
        if (!upload?.content) {
          throw new Error(
            "OpenAPI document is missing. Go back and upload your spec again.",
          );
        }

        const response = await fetch("/api/generate-server", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoints: payload.endpoints,
            document: upload.content,
            title: payload.title,
            description: payload.description,
            serverUrl: payload.serverUrl,
            auth: payload.auth,
          }),
          signal: controller.signal,
        });

        const body = (await response.json()) as {
          code?: string;
          error?: string;
        };

        if (requestId !== requestIdRef.current) return;

        if (!response.ok) {
          throw new Error(body.error ?? "Failed to generate MCP server.");
        }

        if (typeof body.code !== "string" || !body.code.trim()) {
          throw new Error("Unexpected response from generate-server.");
        }

        setCode(body.code);
        setStatus("ready");
      } catch (err) {
        if (controller.signal.aborted) return;
        if (requestId !== requestIdRef.current) return;
        const message =
          err instanceof Error ? err.message : "Failed to generate MCP server.";
        setError(message);
        setStatus("error");
      }
    })();

    return () => controller.abort();
  }, [payload, requestKey]);

  const onDownload = () => {
    if (!code || !payload) return;
    const blob = new Blob([code], { type: "text/typescript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = slugifyFileName(payload.title);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const onCreateAnother = () => {
    clearGenerateServerPayload();
    clearOpenApiUpload();
    router.push("/");
  };

  const onRetry = () => {
    setStatus("loading");
    setError(null);
    setCode(null);
    setRequestKey((key) => key + 1);
  };

  const pageStatus = !payload ? "empty" : status;
  const downloadName = payload ? slugifyFileName(payload.title) : "mcp-server.ts";

  return (
    <>
      <ServerHeader />

      <main className="flex-1 py-10 sm:py-12 lg:py-14">
        <div className="mx-auto w-full max-w-[1200px] px-6">
          <div className="max-w-2xl">
            <p className="font-mono text-[12px] tracking-[0.14em] text-accent uppercase">
              Server
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {pageStatus === "ready"
                ? "Your MCP server is ready"
                : pageStatus === "empty"
                  ? "No generation in progress"
                  : "Generating your MCP server"}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-[15px]">
              {pageStatus === "ready"
                ? "Download the TypeScript file, then follow the setup steps below to run it locally."
                : pageStatus === "empty"
                  ? "Start from an OpenAPI upload to generate a downloadable MCP server."
                  : "FlashMCP is writing a complete TypeScript MCP server from your selected endpoints and auth settings."}
            </p>
          </div>

          <div className="mt-8 sm:mt-10">
            {pageStatus === "empty" ? <EmptyState /> : null}

            {pageStatus === "loading" ? (
              <LoadingState
                title={payload?.title ?? "API"}
                endpointCount={payload?.endpoints.length ?? 0}
              />
            ) : null}

            {pageStatus === "error" ? (
              <ErrorState
                message={error ?? "Something went wrong."}
                onRetry={onRetry}
              />
            ) : null}

            {pageStatus === "ready" && code && payload ? (
              <div className="space-y-10 animate-rise">
                <CodePanel
                  code={code}
                  fileName={downloadName}
                  title={payload.title}
                  endpointCount={payload.endpoints.length}
                  onDownload={onDownload}
                />

                <NextSteps fileName={downloadName} auth={payload.auth} />

                <div className="border-t border-line pt-8 text-center">
                  <p className="text-sm text-ink-muted">
                    Need another API wrapped as MCP?
                  </p>
                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      onClick={onCreateAnother}
                    >
                      Create another server
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </>
  );
}

function LoadingState({
  title,
  endpointCount,
}: {
  title: string;
  endpointCount: number;
}) {
  return (
    <div className="panel-glow overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <div>
          <p className="text-sm font-semibold tracking-tight">
            Writing MCP server
          </p>
          <p className="mt-1 text-xs text-ink-faint">
            Implementing {endpointCount} endpoint
            {endpointCount === 1 ? "" : "s"} from your OpenAPI selection
          </p>
        </div>
        <p className="rounded-full border border-line bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-ink-faint">
          {title}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <span
          aria-hidden
          className="size-8 animate-spin rounded-full border-2 border-white/15 border-t-accent"
        />
        <div>
          <p className="text-sm font-medium tracking-tight">
            Generating TypeScript…
          </p>
          <p className="mt-1.5 text-xs text-ink-faint">
            Larger APIs can take a little longer
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="panel-glow animate-rise px-6 py-14 text-center">
      <p className="text-sm font-semibold tracking-tight">
        Nothing to generate yet
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">
        Upload an OpenAPI document, review tools, and choose auth to generate a
        server.
      </p>
      <div className="mt-6">
        <Button href="/" variant="secondary" size="sm">
          Start from home
        </Button>
      </div>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="panel-glow animate-rise px-6 py-14 text-center" role="alert">
      <p className="text-sm font-semibold tracking-tight text-accent">
        Could not generate this server
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
        {message}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button type="button" size="sm" onClick={onRetry}>
          Try again
        </Button>
        <Button href="/review" variant="secondary" size="sm">
          Back to review
        </Button>
      </div>
    </div>
  );
}

function CodePanel({
  code,
  fileName,
  title,
  endpointCount,
  onDownload,
}: {
  code: string;
  fileName: string;
  title: string;
  endpointCount: number;
  onDownload: () => void;
}) {
  return (
    <div className="panel-glow overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <div>
          <p className="text-sm font-semibold tracking-tight">{title}</p>
          <p className="mt-1 text-xs text-ink-faint">
            {endpointCount} tool{endpointCount === 1 ? "" : "s"} · {fileName}
          </p>
        </div>
        <Button type="button" size="sm" onClick={onDownload}>
          Download .ts
        </Button>
      </div>

      <div className="max-h-[min(70vh,720px)] overflow-auto bg-black/25">
        <pre className="px-5 py-5 font-mono text-[12px] leading-relaxed text-ink-muted sm:px-6 sm:text-[13px]">
          <code className="whitespace-pre text-ink">{code}</code>
        </pre>
      </div>
    </div>
  );
}

function authEnvBlock(auth: ApiAuthConfig): {
  title: string;
  shell: string;
  powershell: string;
  configEnv: Record<string, string>;
  note: string;
} | null {
  switch (auth.type) {
    case "none":
      return null;
    case "basic":
      return {
        title: "Add your API credentials",
        shell: `export API_USERNAME=your-username-here
export API_PASSWORD=your-password-here`,
        powershell: `$env:API_USERNAME="your-username-here"
$env:API_PASSWORD="your-password-here"`,
        configEnv: {
          API_USERNAME: "your-username-here",
          API_PASSWORD: "your-password-here",
        },
        note: "Find or create these credentials in the settings of the service your server connects to (often under API, Integrations, or Developer).",
      };
    default:
      return {
        title: "Add your API key",
        shell: "export API_TOKEN=your-api-key-here",
        powershell: '$env:API_TOKEN="your-api-key-here"',
        configEnv: { API_TOKEN: "your-api-key-here" },
        note: 'Find or create this key in the settings of the service your server connects to (often under "API," "Integrations," or "Developer").',
      };
  }
}

type SetupStep = {
  title: string;
  body: ReactNode;
};

function NextSteps({
  fileName,
  auth,
}: {
  fileName: string;
  auth: ApiAuthConfig;
}) {
  const authBlock = authEnvBlock(auth);
  const mcpConfig = {
    mcpServers: {
      "my-server": {
        command: "npx",
        args: ["tsx", fileName],
        cwd: "/full/path/to/my-mcp-server",
        ...(authBlock ? { env: authBlock.configEnv } : {}),
      },
    },
  };

  const authStep: SetupStep = authBlock
    ? {
        title: authBlock.title,
        body: (
          <>
            <p>
              Your server needs a private key to talk to the API on your behalf.
              Set it as an environment variable (a temporary value your terminal
              remembers for the session):
            </p>
            <CodeSnippet>{authBlock.shell}</CodeSnippet>
            <p>On Windows PowerShell, use this instead:</p>
            <CodeSnippet>{authBlock.powershell}</CodeSnippet>
            <p>{authBlock.note}</p>
          </>
        ),
      }
    : {
        title: "Skip API credentials",
        body: (
          <p>
            This server was generated with no auth, so you can skip setting
            credentials.
          </p>
        ),
      };

  const steps: SetupStep[] = [
    {
      title: "Create a folder for your server",
      body: (
        <p>
          On your computer, create a new folder and put the downloaded .ts file
          inside it. Give the folder a simple, memorable name (for example,{" "}
          <span className="font-mono text-[13px] text-ink">my-mcp-server</span>
          ).
        </p>
      ),
    },
    {
      title: "Open a terminal in that folder",
      body: (
        <>
          <p>
            On Mac, open the Terminal app. On Windows, open Command Prompt or
            PowerShell. Then navigate into your folder, for example:
          </p>
          <CodeSnippet>cd path/to/my-mcp-server</CodeSnippet>
          <p className="text-ink-faint">
            Tip: you can usually drag the folder into the terminal window to
            fill in its path.
          </p>
        </>
      ),
    },
    {
      title: "Set up the project",
      body: (
        <>
          <p>Copy and paste this command, then press enter:</p>
          <CodeSnippet>npm init -y</CodeSnippet>
          <p>This creates a package.json file for the project.</p>
        </>
      ),
    },
    {
      title: "Install the required pieces",
      body: (
        <>
          <p>Copy and paste this command:</p>
          <CodeSnippet>
            npm install @modelcontextprotocol/sdk zod tsx
          </CodeSnippet>
          <p>
            This downloads the packages your server needs to run. It may take a
            minute.
          </p>
        </>
      ),
    },
    authStep,
    {
      title: "Connect it to your MCP host",
      body: (
        <>
          <p>
            Open the settings for the app you are using (Claude Desktop, Cursor,
            etc.) and add a new MCP server entry pointing to your file. It will
            look something like this:
          </p>
          <CodeSnippet>{JSON.stringify(mcpConfig, null, 2)}</CodeSnippet>
          <p>
            Replace{" "}
            <span className="font-mono text-[13px] text-ink">
              /full/path/to/my-mcp-server
            </span>{" "}
            with your folder&apos;s actual location, and confirm the file name
            matches{" "}
            <span className="font-mono text-[13px] text-ink">{fileName}</span>.
          </p>
        </>
      ),
    },
    {
      title: "Restart and test it",
      body: (
        <p>
          Fully quit and reopen your MCP host app. Your new tools should show up
          in its tools or resources list. Try a simple request to confirm it is
          working.
        </p>
      ),
    },
  ];

  return (
    <section>
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Next steps
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Follow these steps to run the generated server on your machine.
        </p>
      </div>

      <ol className="mt-6 space-y-4">
        {steps.map((step, index) => (
          <li
            key={`${index}-${step.title}`}
            className="flex gap-4 rounded-2xl border border-line bg-white/[0.02] px-5 py-4"
          >
            <span
              aria-hidden
              className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-line bg-white/[0.03] font-mono text-[11px] text-ink-faint"
            >
              {index + 1}
            </span>
            <div className="min-w-0 space-y-2.5 text-sm leading-relaxed text-ink-muted [&_p]:text-sm [&_p]:leading-relaxed">
              <p className="font-medium tracking-tight text-ink">{step.title}</p>
              {step.body}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function CodeSnippet({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-line bg-black/30 px-3.5 py-3 font-mono text-[12px] leading-relaxed text-ink sm:text-[13px]">
      <code className="whitespace-pre">{children}</code>
    </pre>
  );
}
