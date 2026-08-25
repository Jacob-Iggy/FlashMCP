"use client";

/*
 * FlashMCP
 * Creator: Iggy
 * Top navigation for the landing page.
 */

import { useEffect, useState } from "react";
import { GetStartedButton } from "@/components/get-started/GetStartedButton";
import { BrandMark } from "@/components/ui/BrandMark";
import { ArrowRightIcon } from "@/components/ui/icons";

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Use cases", href: "#use-cases" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? "border-white/[0.06] bg-black/45 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[64px] w-full max-w-[1200px] items-center justify-between px-6">
        <a
          href="#top"
          className="group flex items-center gap-2.5 text-[15px] font-semibold tracking-tight"
        >
          <BrandMark priority />
          FlashMCP
        </a>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex"
          aria-label="Main"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group/link relative pb-1 text-sm text-ink-muted transition-colors duration-200 hover:text-ink"
            >
              {link.label}
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover/link:scale-x-100"
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <GetStartedButton
            variant="secondary"
            size="sm"
            className="hidden sm:inline-flex"
          >
            Upload OpenAPI
            <ArrowRightIcon className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
          </GetStartedButton>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation menu"
            className="flex size-9 items-center justify-center rounded-full border border-line-strong text-ink transition-colors duration-200 hover:bg-white/[0.05] md:hidden"
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
              {menuOpen ? (
                <>
                  <path d="M3.5 3.5l9 9" />
                  <path d="M12.5 3.5l-9 9" />
                </>
              ) : (
                <>
                  <path d="M2.5 5h11" />
                  <path d="M2.5 11h11" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="animate-rise border-t border-line bg-canvas/95 px-6 py-3 backdrop-blur-xl md:hidden"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex h-11 items-center text-sm text-ink-muted transition-colors duration-150 hover:text-ink"
            >
              {link.label}
            </a>
          ))}
          <GetStartedButton
            size="sm"
            className="mt-2 w-full sm:hidden"
            onClick={() => setMenuOpen(false)}
          >
            Upload OpenAPI
          </GetStartedButton>
        </nav>
      ) : null}
    </header>
  );
}
