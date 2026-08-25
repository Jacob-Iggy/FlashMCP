/*
 * FlashMCP
 * Creator: Iggy
 * FlashMCP logo.
 */

import Image from "next/image";

const sizeMap = {
  sm: { box: "size-6", px: 24 },
  md: { box: "size-7", px: 28 },
  lg: { box: "size-10", px: 40 },
} as const;

type BrandMarkProps = {
  size?: keyof typeof sizeMap;
  className?: string;
  priority?: boolean;
};

export function BrandMark({
  size = "md",
  className = "",
  priority = false,
}: BrandMarkProps) {
  const s = sizeMap[size];

  return (
    <span
      aria-hidden
      className={`relative inline-flex shrink-0 ${s.box} ${className}`}
    >
      <Image
        src="/logo.png"
        alt=""
        width={s.px}
        height={s.px}
        className="size-full object-contain"
        priority={priority}
      />
    </span>
  );
}
