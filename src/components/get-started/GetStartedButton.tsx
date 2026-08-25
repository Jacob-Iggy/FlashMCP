"use client";

/*
 * FlashMCP
 * Creator: Iggy
 * Button that opens the OpenAPI upload dialog.
 */

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { useGetStarted } from "./GetStartedContext";

type GetStartedButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
};

export function GetStartedButton({
  variant = "primary",
  size = "md",
  className = "",
  children = "Upload OpenAPI",
  onClick,
}: GetStartedButtonProps) {
  const { open } = useGetStarted();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={() => {
        onClick?.();
        open();
      }}
    >
      {children}
    </Button>
  );
}
