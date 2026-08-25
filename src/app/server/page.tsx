/*
 * FlashMCP
 * Creator: Iggy
 * Page that shows the generated MCP server.
 */

import type { Metadata } from "next";
import { ServerPageClient } from "@/components/server/ServerPageClient";

export const metadata: Metadata = {
  title: "Your MCP server | FlashMCP",
  description:
    "Download your generated TypeScript MCP server and follow the setup steps to run it locally.",
};

export default function ServerPage() {
  return <ServerPageClient />;
}
