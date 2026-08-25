/*
 * FlashMCP
 * Creator: Iggy
 * Landing page.
 */

import { GetStartedProvider } from "@/components/get-started/GetStartedContext";
import { Navbar } from "@/components/layout/Navbar";
import { CtaFooter } from "@/components/sections/CtaFooter";
import { FAQ } from "@/components/sections/FAQ";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { UseCases } from "@/components/sections/UseCases";
import { WhatYouGet } from "@/components/sections/WhatYouGet";

export default function Home() {
  return (
    <GetStartedProvider>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <UseCases />
        <WhatYouGet />
        <FAQ />
      </main>
      <CtaFooter />
    </GetStartedProvider>
  );
}
