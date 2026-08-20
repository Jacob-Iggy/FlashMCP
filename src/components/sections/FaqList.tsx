"use client";

import { useState } from "react";
import { PlusIcon } from "@/components/ui/icons";

type Faq = {
  question: string;
  answer: string;
};

export function FaqList({ items }: { items: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((faq, index) => {
        const open = openIndex === index;
        const panelId = `faq-panel-${index}`;

        return (
          <div key={faq.question}>
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left text-[15px] font-medium tracking-tight transition-colors duration-200 hover:text-accent"
              >
                {faq.question}
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-line text-ink-muted transition-colors duration-200 group-hover:border-line-strong">
                  <PlusIcon
                    className={`size-3.5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      open ? "rotate-45 text-accent" : ""
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
                <p className="max-w-2xl pb-6 text-sm leading-relaxed text-ink-muted">
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
