/*
 * FlashMCP
 * Creator: Iggy
 * Saves the uploaded OpenAPI file in the browser.
 */

import type { OpenApiMeta, OpenApiUpload } from "@/lib/types";

export const OPENAPI_UPLOAD_KEY = "flashmcp:openapi-upload";

type UploadCache = {
  raw: string | null | undefined;
  value: OpenApiUpload | null;
};

const uploadCache: UploadCache = {
  raw: undefined,
  value: null,
};

function isOpenApiMeta(value: unknown): value is OpenApiMeta {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  const nullableString = (field: unknown) =>
    field === null || typeof field === "string";
  return (
    nullableString(record.title) &&
    nullableString(record.description) &&
    nullableString(record.serverUrl)
  );
}

function invalidateOpenApiUploadCache() {
  uploadCache.raw = undefined;
  uploadCache.value = null;
}

export function saveOpenApiUpload(upload: OpenApiUpload) {
  sessionStorage.setItem(OPENAPI_UPLOAD_KEY, JSON.stringify(upload));
  invalidateOpenApiUploadCache();
}

export function saveOpenApiMeta(meta: OpenApiMeta) {
  const current = readOpenApiUpload();
  if (!current) return;
  saveOpenApiUpload({ ...current, meta });
}

export function readOpenApiUpload(): OpenApiUpload | null {
  const raw = sessionStorage.getItem(OPENAPI_UPLOAD_KEY);
  if (raw === uploadCache.raw) return uploadCache.value;

  uploadCache.raw = raw;

  if (!raw) {
    uploadCache.value = null;
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<OpenApiUpload>;
    if (
      typeof parsed.fileName !== "string" ||
      typeof parsed.content !== "string" ||
      typeof parsed.uploadedAt !== "number"
    ) {
      uploadCache.value = null;
      return null;
    }
    uploadCache.value = {
      fileName: parsed.fileName,
      content: parsed.content,
      uploadedAt: parsed.uploadedAt,
      meta: isOpenApiMeta(parsed.meta) ? parsed.meta : null,
    };
    return uploadCache.value;
  } catch {
    uploadCache.value = null;
    return null;
  }
}

export function clearOpenApiUpload() {
  sessionStorage.removeItem(OPENAPI_UPLOAD_KEY);
  invalidateOpenApiUploadCache();
}
