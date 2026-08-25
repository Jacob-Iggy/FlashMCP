"use client";

/*
 * FlashMCP
 * Creator: Iggy
 * Dialog for uploading an OpenAPI file.
 */

import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { Button } from "@/components/ui/Button";
import { saveOpenApiUpload } from "@/lib/openapi-session";

const ACCEPTED_EXTENSIONS = [".json", ".yaml", ".yml"] as const;
const ACCEPT_ATTR = ".json,.yaml,.yml,application/json,text/yaml,application/x-yaml";
const MAX_FILE_BYTES = 2 * 1024 * 1024;

type GetStartedModalProps = {
  onClose: () => void;
};

function isOpenApiFile(file: File) {
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function GetStartedModal({ onClose }: GetStartedModalProps) {
  const router = useRouter();
  const titleId = useId();
  const descriptionId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !processing) {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, processing]);

  const selectFile = (next: File | null) => {
    if (!next) return;
    if (!isOpenApiFile(next)) {
      setFile(null);
      setError("Upload a JSON or YAML OpenAPI document (.json, .yaml, .yml).");
      return;
    }
    if (next.size > MAX_FILE_BYTES) {
      setFile(null);
      setError("File is too large. Keep OpenAPI documents under 2 MB.");
      return;
    }
    setFile(next);
    setError(null);
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0] ?? null;
    selectFile(next);
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    if (processing) return;
    const next = event.dataTransfer.files?.[0] ?? null;
    selectFile(next);
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const processDocument = async () => {
    if (!file || processing) return;
    setProcessing(true);
    setError(null);

    try {
      const content = await file.text();
      if (!content.trim()) {
        throw new Error("That file looks empty. Upload a valid OpenAPI document.");
      }

      saveOpenApiUpload({
        fileName: file.name,
        content,
        uploadedAt: Date.now(),
      });

      onClose();
      router.push("/review");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not read that file. Try another document.";
      setError(message);
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        disabled={processing}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity disabled:cursor-not-allowed"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="panel relative z-10 w-full max-w-lg animate-rise overflow-hidden shadow-float"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <h2
              id={titleId}
              className="text-lg font-semibold tracking-tight sm:text-xl"
            >
              Upload your OpenAPI spec
            </h2>
            <p
              id={descriptionId}
              className="mt-1.5 text-sm leading-relaxed text-ink-muted"
            >
              Drop a JSON or YAML file. Next you will review the tools and
              download a local MCP server.
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            disabled={processing}
            aria-label="Close"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line-strong text-ink-muted transition-colors duration-200 hover:bg-white/[0.05] hover:text-ink disabled:pointer-events-none disabled:opacity-40"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="size-4"
              aria-hidden
            >
              <path d="M3.5 3.5l9 9" />
              <path d="M12.5 3.5l-9 9" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">
          <input
            ref={inputRef}
            id="openapi-file"
            type="file"
            accept={ACCEPT_ATTR}
            className="sr-only"
            disabled={processing}
            onChange={onInputChange}
          />

          {file ? (
            <div className="flex items-center gap-3 rounded-2xl border border-line bg-white/[0.03] px-4 py-4">
              <span
                aria-hidden
                className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-accent/10 text-accent"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4"
                >
                  <path d="M4.5 2.5h5l2.5 2.5v8.5a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1Z" />
                  <path d="M9.5 2.5v2.5h2.5" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium tracking-tight">
                  {file.name}
                </p>
                <p className="mt-0.5 text-xs text-ink-faint">
                  {formatBytes(file.size)}
                </p>
              </div>
              {!processing ? (
                <button
                  type="button"
                  onClick={clearFile}
                  className="text-xs font-medium text-ink-muted transition-colors duration-150 hover:text-ink"
                >
                  Remove
                </button>
              ) : null}
            </div>
          ) : (
            <label
              htmlFor="openapi-file"
              onDragEnter={(event) => {
                event.preventDefault();
                if (!processing) setDragging(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                if (!processing) setDragging(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setDragging(false);
              }}
              onDrop={onDrop}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-10 text-center transition-[border-color,background-color] duration-200 ${
                dragging
                  ? "border-accent/60 bg-accent/10"
                  : "border-line-strong bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
              } ${processing ? "pointer-events-none opacity-50" : ""}`}
            >
              <span
                aria-hidden
                className="mb-4 flex size-11 items-center justify-center rounded-full border border-line bg-white/[0.04] text-ink-muted"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4"
                >
                  <path d="M8 10.5V3.5" />
                  <path d="M5.5 5.5 8 3l2.5 2.5" />
                  <path d="M3 10.5v1.5a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1.5" />
                </svg>
              </span>
              <p className="text-sm font-medium tracking-tight">
                Drop your OpenAPI file here
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                or click to browse · JSON, YAML
              </p>
            </label>
          )}

          {error ? (
            <p className="mt-3 text-sm text-accent" role="alert">
              {error}
            </p>
          ) : null}

          {processing ? (
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-line bg-white/[0.03] px-4 py-3.5">
              <span
                aria-hidden
                className="size-4 shrink-0 animate-spin rounded-full border-2 border-white/15 border-t-accent"
              />
              <div>
                <p className="text-sm font-medium tracking-tight">
                  Opening review…
                </p>
                <p className="mt-0.5 text-xs text-ink-faint">
                  Tool extraction starts on the next page
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-line px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={processing}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={processDocument}
            disabled={!file || processing}
          >
            {processing ? "Opening…" : "Continue to review"}
          </Button>
        </div>
      </div>
    </div>
  );
}
