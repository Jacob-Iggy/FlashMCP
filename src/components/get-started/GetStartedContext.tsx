"use client";

/*
 * FlashMCP
 * Creator: Iggy
 * Lets landing page buttons open the upload dialog.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { GetStartedModal } from "./GetStartedModal";

type GetStartedContextValue = {
  open: () => void;
};

const GetStartedContext = createContext<GetStartedContextValue | null>(null);

export function GetStartedProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <GetStartedContext.Provider value={value}>
      {children}
      {isOpen ? <GetStartedModal onClose={() => setIsOpen(false)} /> : null}
    </GetStartedContext.Provider>
  );
}

export function useGetStarted() {
  const context = useContext(GetStartedContext);
  if (!context) {
    throw new Error("useGetStarted must be used within GetStartedProvider");
  }
  return context;
}
