/*
 * FlashMCP
 * Creator: Iggy
 * Top bar on the generated server page.
 */

import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";

export function ServerHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/45 backdrop-blur-xl">
      <div className="mx-auto flex h-[64px] w-full max-w-[1200px] items-center justify-between px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-[15px] font-semibold tracking-tight"
        >
          <BrandMark priority />
          FlashMCP
        </Link>

        <p className="font-mono text-[11px] tracking-[0.14em] text-ink-faint uppercase">
          Your MCP server
        </p>
      </div>
    </header>
  );
}
