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
  align = "left",
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
        className="mt-5 text-3xl font-medium tracking-tight text-balance sm:text-4xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-ink-muted">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
