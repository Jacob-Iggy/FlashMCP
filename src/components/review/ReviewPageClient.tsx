"use client";

/*
 * FlashMCP
 * Creator: Iggy
 * Review page logic and layout.
 */

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AuthModal } from "@/components/review/AuthModal";
import { ReviewHeader } from "@/components/review/ReviewHeader";
import { ToolList } from "@/components/review/ToolList";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { toApiAuthConfig } from "@/lib/auth-config";
import { saveGenerateServerPayload } from "@/lib/generate-session";
import { readOpenApiUpload, saveOpenApiMeta } from "@/lib/openapi-session";
import { toReviewTools } from "@/lib/proposed-tools";
import type {
  AuthConfig,
  OpenApiMeta,
  OpenApiUpload,
  ProposedTool,
  ReviewTool,
} from "@/lib/types";

type FetchStatus = "loading" | "ready" | "error";

function subscribeNoop() {
  return () => {};
}

function getOpenApiUploadSnapshot(): OpenApiUpload | null {
  return readOpenApiUpload();
}

function getServerUploadSnapshot(): OpenApiUpload | null {
  return null;
}

export function ReviewPageClient() {
  const router = useRouter();
  const upload = useSyncExternalStore(
    subscribeNoop,
    getOpenApiUploadSnapshot,
    getServerUploadSnapshot,
  );

  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("loading");
  const [fileName, setFileName] = useState(
    () => upload?.fileName ?? "openapi-document",
  );
  const [meta, setMeta] = useState<OpenApiMeta | null>(() => upload?.meta ?? null);
  const [tools, setTools] = useState<ReviewTool[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [requestKey, setRequestKey] = useState(0);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!upload) return;

    const requestId = ++requestIdRef.current;
    const controller = new AbortController();
    const activeUpload = upload;

    void (async () => {
      try {
        const response = await fetch("/api/extract-tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            document: activeUpload.content,
            fileName: activeUpload.fileName,
          }),
          signal: controller.signal,
        });

        const payload = (await response.json()) as {
          tools?: ProposedTool[];
          fileName?: string;
          meta?: OpenApiMeta;
          error?: string;
        };

        if (requestId !== requestIdRef.current) return;

        if (!response.ok) {
          throw new Error(payload.error ?? "Failed to extract tools.");
        }

        if (!payload.tools || !Array.isArray(payload.tools)) {
          throw new Error("Unexpected response from extract-tools.");
        }

        if (payload.meta) {
          saveOpenApiMeta(payload.meta);
          setMeta(payload.meta);
        }

        setFileName(payload.fileName ?? activeUpload.fileName);
        setTools(toReviewTools(payload.tools));
        setError(null);
        setFetchStatus("ready");
      } catch (err) {
        if (controller.signal.aborted) return;
        if (requestId !== requestIdRef.current) return;
        const message =
          err instanceof Error ? err.message : "Failed to extract tools.";
        setError(message);
        setFetchStatus("error");
      }
    })();

    return () => controller.abort();
  }, [upload, requestKey]);

  const status = !upload ? "empty" : fetchStatus;
  const includedCount = tools.filter((tool) => tool.included).length;
  const canGenerate = status === "ready" && includedCount > 0;

  const onToggle = (id: string) => {
    setTools((current) =>
      current.map((tool) =>
        tool.id === id ? { ...tool, included: !tool.included } : tool,
      ),
    );
  };

  const onGenerate = () => {
    if (!canGenerate) return;
    setAuthModalOpen(true);
  };

  const onAuthGenerate = (config: AuthConfig) => {
    const included = tools.filter((tool) => tool.included);
    if (included.length === 0) return;

    const title =
      meta?.title?.trim() ||
      fileName.replace(/\.(ya?ml|json)$/i, "") ||
      "Generated API";
    const description =
      meta?.description?.trim() ||
      `MCP server generated from ${fileName}`;
    const serverUrl =
      meta?.serverUrl?.trim() || "https://api.example.com";

    saveGenerateServerPayload({
      endpoints: included.map(({ endpoint, toolName, type }) => ({
        endpoint,
        toolName,
        type,
      })),
      auth: toApiAuthConfig(config),
      title,
      description,
      serverUrl,
      fileName,
      createdAt: Date.now(),
    });

    setAuthModalOpen(false);
    router.push("/server");
  };

  const onRetry = () => {
    setFetchStatus("loading");
    setError(null);
    setTools([]);
    setRequestKey((key) => key + 1);
  };

  return (
    <>
      <ReviewHeader onGenerate={onGenerate} generateDisabled={!canGenerate} />

      <main className="flex-1 py-10 sm:py-12 lg:py-14">
        <div className="mx-auto w-full max-w-[1200px] px-6">
          <div className="max-w-2xl">
            <p className="font-mono text-[12px] tracking-[0.14em] text-accent uppercase">
              Review
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Review generated tools
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-[15px]">
              FlashMCP mapped each OpenAPI operation to an MCP tool or resource.
              Exclude anything you do not want in the server, then generate.
            </p>
          </div>

          <div className="mt-8 sm:mt-10">
            {status === "loading" ? (
              <LoadingState fileName={upload?.fileName ?? fileName} />
            ) : null}

            {status === "empty" ? <EmptyState /> : null}

            {status === "error" ? (
              <ErrorState
                message={error ?? "Something went wrong."}
                onRetry={onRetry}
              />
            ) : null}

            {status === "ready" ? (
              <>
                <ToolList
                  tools={tools}
                  fileName={fileName}
                  onToggle={onToggle}
                />

                <div className="mt-8 flex flex-col items-stretch justify-between gap-4 border-t border-line pt-8 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm font-medium tracking-tight">
                      Ready to generate your MCP server?
                    </p>
                    <p className="mt-1 text-xs text-ink-faint">
                      {includedCount} of {tools.length} endpoints will be
                      included
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="md"
                    onClick={onGenerate}
                    disabled={!canGenerate}
                    className="sm:self-auto"
                  >
                    Generate MCP
                    <ArrowRightIcon className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </main>

      {authModalOpen ? (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onGenerate={onAuthGenerate}
        />
      ) : null}
    </>
  );
}

function LoadingState({ fileName }: { fileName: string }) {
  return (
    <div className="panel-glow animate-rise overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <div>
          <p className="text-sm font-semibold tracking-tight">
            Analyzing OpenAPI document
          </p>
          <p className="mt-1 text-xs text-ink-faint">
            Mapping every operation to an MCP tool or resource
          </p>
        </div>
        <p className="rounded-full border border-line bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-ink-faint">
          {fileName}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <span
          aria-hidden
          className="size-8 animate-spin rounded-full border-2 border-white/15 border-t-accent"
        />
        <div>
          <p className="text-sm font-medium tracking-tight">
            Processing document…
          </p>
          <p className="mt-1.5 text-xs text-ink-faint">
            This usually takes a few seconds for typical specs
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
        No OpenAPI document found
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">
        Upload a JSON or YAML spec from the landing page to generate your tool
        list.
      </p>
      <div className="mt-6">
        <Button href="/" variant="secondary" size="sm">
          Back to home
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
        Could not process this document
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
        {message}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button type="button" size="sm" onClick={onRetry}>
          Try again
        </Button>
        <Button href="/" variant="secondary" size="sm">
          Upload another file
        </Button>
      </div>
    </div>
  );
}
