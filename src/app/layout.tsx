/*
 * FlashMCP
 * Creator: Iggy
 * Root layout for the whole site.
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Backdrop } from "@/components/layout/Backdrop";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlashMCP | Give agents access to your API",
  description:
    "Upload an OpenAPI file, pick the tools you want, and download a local MCP server that Cursor, Claude, and other agents can call.",
  openGraph: {
    title: "FlashMCP | Give agents access to your API",
    description:
      "Upload an OpenAPI file, pick the tools you want, and download a local MCP server that Cursor, Claude, and other agents can call.",
    siteName: "FlashMCP",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col bg-canvas text-ink">
        <Backdrop />
        {children}
      </body>
    </html>
  );
}
