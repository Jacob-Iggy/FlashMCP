"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Use cases", href: "#use-cases" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center justify-between px-6">
        <a
          href="#top"
          className="group flex items-center gap-2 text-[15px] font-semibold tracking-tight"
        >
          {/* Placeholder wordmark until the logo asset lands. */}
          <span
            aria-hidden
            className="size-1.5 rounded-full bg-accent shadow-[0_0_12px_var(--accent)] transition-transform duration-300 group-hover:scale-125"
          />
          FlashMCP
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group/link relative text-sm text-ink-muted transition-colors duration-200 hover:text-ink"
            >
              {link.label}
              <span
                aria-hidden
                className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover/link:scale-x-100"
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button href="#demo" size="sm">
            Get started
            <ArrowRightIcon className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
          </Button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation menu"
            className="flex size-9 items-center justify-center rounded-lg border border-line-strong text-ink transition-colors duration-200 hover:bg-white/[0.05] md:hidden"
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
          className="animate-rise border-t border-line bg-canvas px-6 py-2 md:hidden"
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
        </nav>
      ) : null}
    </header>
  );
}
