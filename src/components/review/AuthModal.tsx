"use client";

/*
 * FlashMCP
 * Creator: Iggy
 * Dialog where you choose how the API authenticates.
 */

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { AuthConfig, AuthKind } from "@/lib/types";

type AuthModalProps = {
  onClose: () => void;
  onGenerate: (config: AuthConfig) => void;
};

const AUTH_OPTIONS: {
  kind: AuthKind;
  title: string;
  description: string;
}[] = [
  {
    kind: "bearer",
    title: "Bearer API key",
    description: "Authorization: Bearer <token> header",
  },
  {
    kind: "header",
    title: "Custom header API key",
    description: "API key sent in a named request header",
  },
  {
    kind: "query",
    title: "API key query parameter",
    description: "API key passed as a URL query parameter",
  },
  {
    kind: "basic",
    title: "Basic auth",
    description: "Username and password over HTTP Basic",
  },
  {
    kind: "none",
    title: "No auth",
    description: "Requests are made without credentials",
  },
];

export function AuthModal({ onClose, onGenerate }: AuthModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const [kind, setKind] = useState<AuthKind>("bearer");
  const [headerName, setHeaderName] = useState("");
  const [queryParam, setQueryParam] = useState("");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const needsHeaderName = kind === "header";
  const needsQueryParam = kind === "query";
  const headerValid = !needsHeaderName || headerName.trim().length > 0;
  const queryValid = !needsQueryParam || queryParam.trim().length > 0;
  const canSubmit = headerValid && queryValid;

  const submit = () => {
    if (!canSubmit) return;
    onGenerate({
      kind,
      ...(needsHeaderName ? { headerName: headerName.trim() } : {}),
      ...(needsQueryParam ? { queryParam: queryParam.trim() } : {}),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
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
              API authentication
            </h2>
            <p
              id={descriptionId}
              className="mt-1.5 text-sm leading-relaxed text-ink-muted"
            >
              Choose how FlashMCP should authenticate requests to your API.
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line-strong text-ink-muted transition-colors duration-200 hover:bg-white/[0.05] hover:text-ink"
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
          <fieldset>
            <legend className="sr-only">Authentication method</legend>
            <div className="space-y-2">
              {AUTH_OPTIONS.map((option) => {
                const selected = kind === option.kind;
                return (
                  <label
                    key={option.kind}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3.5 transition-[border-color,background-color] duration-150 ${
                      selected
                        ? "border-accent/45 bg-accent-soft"
                        : "border-line bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="auth-kind"
                      value={option.kind}
                      checked={selected}
                      onChange={() => setKind(option.kind)}
                      className="mt-1 size-3.5 shrink-0 accent-[var(--accent)]"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium tracking-tight">
                        {option.title}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-ink-faint">
                        {option.description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {needsHeaderName ? (
            <div className="mt-4">
              <label
                htmlFor="auth-header-name"
                className="block text-xs font-medium tracking-tight text-ink-muted"
              >
                Header name
              </label>
              <input
                id="auth-header-name"
                type="text"
                value={headerName}
                onChange={(event) => setHeaderName(event.target.value)}
                placeholder="e.g. X-API-Key"
                autoComplete="off"
                spellCheck={false}
                className="mt-2 h-11 w-full rounded-xl border border-line bg-white/[0.03] px-3.5 font-mono text-sm text-ink outline-none transition-[border-color,background-color] duration-150 placeholder:text-ink-faint hover:border-white/20 focus:border-accent/50 focus:bg-white/[0.04]"
              />
            </div>
          ) : null}

          {needsQueryParam ? (
            <div className="mt-4">
              <label
                htmlFor="auth-query-param"
                className="block text-xs font-medium tracking-tight text-ink-muted"
              >
                Query parameter name
              </label>
              <input
                id="auth-query-param"
                type="text"
                value={queryParam}
                onChange={(event) => setQueryParam(event.target.value)}
                placeholder="e.g. api_key"
                autoComplete="off"
                spellCheck={false}
                className="mt-2 h-11 w-full rounded-xl border border-line bg-white/[0.03] px-3.5 font-mono text-sm text-ink outline-none transition-[border-color,background-color] duration-150 placeholder:text-ink-faint hover:border-white/20 focus:border-accent/50 focus:bg-white/[0.04]"
              />
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-line px-6 py-4">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={submit}
            disabled={!canSubmit}
          >
            Generate
          </Button>
        </div>
      </div>
    </div>
  );
}
