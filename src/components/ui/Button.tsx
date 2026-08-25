/*
 * FlashMCP
 * Creator: Iggy
 * Shared button used across the site.
 */

import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "link";
type ButtonSize = "sm" | "md" | "lg";

const base =
  "group/btn inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-200 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white shadow-[0_10px_28px_-10px_rgba(239,68,68,0.55)] hover:bg-accent-hover active:bg-accent-press",
  secondary:
    "bg-white text-black hover:bg-white/90 active:bg-white/80",
  ghost:
    "border border-line-strong bg-white/[0.02] text-ink hover:border-white/25 hover:bg-white/[0.05]",
  link: "text-ink-muted hover:text-ink",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

type ButtonProps = BaseProps & { href?: never } & ComponentPropsWithoutRef<"button">;
type AnchorProps = BaseProps & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    "href" | "className" | "children"
  >;

export function Button(props: ButtonProps | AnchorProps) {
  const {
    variant = "primary",
    size = "md",
    className = "",
    children,
    ...rest
  } = props;

  const classes = `${base} ${variants[variant]} ${
    variant === "link" ? "h-auto p-0 text-sm" : sizes[size]
  } ${className}`;

  if ("href" in rest && rest.href) {
    const { href, ...anchorProps } = rest as AnchorProps;
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ComponentPropsWithoutRef<"button">)}>
      {children}
    </button>
  );
}
