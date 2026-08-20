import { Navbar } from "@/components/layout/Navbar";
import { CtaFooter } from "@/components/sections/CtaFooter";
import { DemoVideo } from "@/components/sections/DemoVideo";
import { FAQ } from "@/components/sections/FAQ";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { UseCases } from "@/components/sections/UseCases";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <DemoVideo />
        <HowItWorks />
        <UseCases />
        <FAQ />
      </main>
      <CtaFooter />
    </>
  );
}
