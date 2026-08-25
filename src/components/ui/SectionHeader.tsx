/*
 * FlashMCP
 * Creator: Iggy
 * Title block for landing page sections.
 */

import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  titleId: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  titleId,
  description,
  align = "center",
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <Reveal
      as="header"
      className={centered ? "mx-auto block max-w-2xl text-center" : "max-w-2xl"}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        id={titleId}
        className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:mt-5 sm:text-4xl lg:text-[40px] lg:leading-[1.15]"
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-3 text-base leading-relaxed text-ink-muted sm:mt-3.5 ${
            centered ? "mx-auto max-w-xl" : "max-w-xl"
          }`}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
