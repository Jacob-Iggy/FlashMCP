/*
 * FlashMCP
 * Creator: Iggy
 * Bottom call to action and footer links.
 */

import { GetStartedButton } from "@/components/get-started/GetStartedButton";
import { BrandMark } from "@/components/ui/BrandMark";

const footerLinks = [
  { label: "GitHub", href: "https://github.com/Jacob-Iggy/FlashMCP" },
  {
    label: "Docs",
    href: "https://github.com/Jacob-Iggy/FlashMCP#readme",
  },
  { label: "Model Context Protocol", href: "https://modelcontextprotocol.io" },
];

export function CtaFooter() {
  return (
    <>
      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-[24px] border border-white/[0.06] bg-black px-6 py-12 text-center sm:min-h-[300px] sm:rounded-[28px] sm:px-8 sm:py-14">
            <div
              aria-hidden
              className="cta-card-glow pointer-events-none absolute inset-x-0 bottom-0 h-[55%] sm:h-[60%]"
            />

            <div className="relative z-10 mx-auto flex max-w-lg flex-col items-center">
              <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl lg:text-[34px] lg:leading-[1.2]">
                Have an OpenAPI file? Get an MCP server.
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-muted">
                Upload your file, review the tools, and download a server your
                agents can call.
              </p>
              <div className="mt-6">
                <GetStartedButton variant="secondary" size="lg">
                  Upload OpenAPI
                </GetStartedButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-line py-8 sm:py-10">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 px-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2.5 text-sm font-semibold tracking-tight">
              <BrandMark size="sm" />
              FlashMCP
            </p>
            <p className="mt-2 text-xs text-ink-faint">
              Give agents access to your API.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-ink-muted transition-colors duration-150 hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <p className="text-xs text-ink-faint">
            &copy; {new Date().getFullYear()} Jacob Igielski
          </p>
        </div>
      </footer>
    </>
  );
}
