/*
 * FlashMCP
 * Creator: Iggy
 * Top section of the landing page.
 */

import { GetStartedButton } from "@/components/get-started/GetStartedButton";
import { Button } from "@/components/ui/Button";
import { ArrowDownIcon, ArrowRightIcon } from "@/components/ui/icons";

const trustItems = [
  "Runs on your machine",
  "You choose the tools",
  "Your keys stay with you",
  "JSON and YAML",
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="relative mx-auto w-full max-w-[1200px] px-6 pt-14 pb-14 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1
            className="animate-rise text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[60px] lg:leading-[1.06]"
            style={{ animationDelay: "0ms" }}
          >
            Give agents access to your API.
          </h1>

          <p
            className="animate-rise mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:mt-6 sm:text-lg"
            style={{ animationDelay: "80ms" }}
          >
            Upload an OpenAPI file, pick the tools you want, and download a
            local MCP server. Then Cursor, Claude, or any other agent can call
            the APIs you already have.
          </p>

          <div
            className="animate-rise mt-8 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "160ms" }}
          >
            <GetStartedButton size="lg">
              Upload OpenAPI
              <ArrowRightIcon className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </GetStartedButton>
            <Button href="#how-it-works" variant="ghost" size="lg">
              See how it works
              <ArrowDownIcon className="text-ink-muted transition-transform duration-200 group-hover/btn:translate-y-0.5" />
            </Button>
          </div>

          <p
            className="animate-rise mt-4 text-sm text-ink-faint"
            style={{ animationDelay: "200ms" }}
          >
            Free to try. We don&apos;t keep your file after the session.
          </p>
        </div>

        <div
          className="animate-rise mx-auto mt-10 max-w-3xl"
          style={{ animationDelay: "220ms" }}
        >
          <p className="text-center text-sm text-ink-faint">
            For developers connecting agents to real APIs
          </p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 sm:gap-x-8">
            {trustItems.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm font-medium text-ink-muted"
              >
                <span
                  aria-hidden
                  className="size-1.5 rounded-full bg-accent/80"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
