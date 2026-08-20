import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";

const footerLinks = [
  { label: "GitHub", href: "#" },
  { label: "Docs", href: "#" },
  { label: "Model Context Protocol", href: "#" },
];

export function CtaFooter() {
  return (
    <>
      <section className="border-t border-line py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1120px] px-6">
          <Reveal className="mx-auto max-w-xl text-center">
            <Eyebrow>Get started</Eyebrow>
            <h2 className="mt-5 text-2xl font-medium tracking-tight text-balance sm:text-3xl">
              Ready to flash-wrap your API?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-muted">
              Start with an OpenAPI document and finish with a server your agents
              can call.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button href="#demo">
                Get started
                <ArrowRightIcon className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </Button>
              <Button href="#faq" variant="ghost">
                Read the FAQ
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-line py-10">
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold tracking-tight">
              <span
                aria-hidden
                className="size-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]"
              />
              FlashMCP
            </p>
            <p className="mt-2 text-xs text-ink-faint">
              OpenAPI specs into local MCP servers.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
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
