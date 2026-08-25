"use client";

/*
 * FlashMCP
 * Creator: Iggy
 * Expandable list of FAQ questions.
 */

import { useState } from "react";
import { PlusIcon } from "@/components/ui/icons";

type Faq = {
  question: string;
  answer: string;
};

export function FaqList({ items }: { items: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((faq, index) => {
        const open = openIndex === index;
        const panelId = `faq-panel-${index}`;

        return (
          <div
            key={faq.question}
            className={`rounded-2xl border transition-[border-color,background,box-shadow] duration-200 ${
              open
                ? "border-line-strong bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_40%,rgba(14,14,16,1)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                : "border-line bg-surface/80 hover:border-line-strong"
            }`}
          >
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                className="group flex w-full items-center justify-between gap-6 px-5 py-4 text-left text-[15px] font-medium tracking-tight sm:px-6 sm:py-5"
              >
                {faq.question}
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                    open
                      ? "border-white/20 bg-white text-black"
                      : "border-line text-ink-muted group-hover:border-line-strong"
                  }`}
                >
                  <PlusIcon
                    className={`size-3.5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      open ? "rotate-45" : ""
                    }`}
                  />
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              inert={!open}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl px-5 pb-5 text-sm leading-relaxed text-ink-muted sm:px-6 sm:pb-6">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
