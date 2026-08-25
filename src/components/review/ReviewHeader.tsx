"use client";

/*
 * FlashMCP
 * Creator: Iggy
 * Top bar on the review page.
 */

import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";

type ReviewHeaderProps = {
  onGenerate: () => void;
  generateDisabled?: boolean;
};

export function ReviewHeader({
  onGenerate,
  generateDisabled = false,
}: ReviewHeaderProps) {
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

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onGenerate}
          disabled={generateDisabled}
        >
          Generate MCP
          <ArrowRightIcon className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
        </Button>
      </div>
    </header>
  );
}
