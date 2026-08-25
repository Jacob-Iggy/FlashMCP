/*
 * FlashMCP
 * Creator: Iggy
 * Page where you review tools before generating.
 */

import type { Metadata } from "next";
import { ReviewPageClient } from "@/components/review/ReviewPageClient";

export const metadata: Metadata = {
  title: "Review tools | FlashMCP",
  description:
    "Review AI-generated MCP tools and resources from your OpenAPI document before generating a server.",
};

export default function ReviewPage() {
  return <ReviewPageClient />;
}
