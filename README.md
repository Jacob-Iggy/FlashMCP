# FlashMCP

FlashMCP turns an OpenAPI document into a Model Context Protocol (MCP) server you can run
on your own machine. Upload a spec, review the tools and resources that get generated, then
download a server any AI agent can call.

This repository currently contains the marketing landing page. The upload, review, and
generation flow will be added on top of it.

## Getting started

```bash
npm install
npm run dev
```

The site runs at http://localhost:3000.

## Scripts

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start the development server       |
| `npm run build` | Create a production build          |
| `npm start`     | Serve the production build         |
| `npm run lint`  | Run ESLint                         |

## Project structure

```
src/
  app/
    layout.tsx      Root layout, fonts, metadata
    page.tsx        Landing page composition
    globals.css     Design tokens and base styles
    icon.svg        Favicon
  components/
    layout/         Navbar
    sections/       Hero, DemoVideo, HowItWorks, UseCases, FAQ, CtaFooter
    ui/             Button, SectionHeader
```

## Design system

The interface is dark-only with a single red accent. All colors, the shadow, and the two
animations live as custom properties in `src/app/globals.css` and are exposed to Tailwind
through `@theme inline`, so components use utilities such as `bg-surface`, `text-ink-muted`,
`border-line`, and `bg-accent` rather than hard-coded values.

Motion is intentionally restrained: one staggered entrance in the hero, a blinking terminal
caret, and short hover transitions. Everything is disabled under
`prefers-reduced-motion: reduce`.

## Replacing the placeholder brand

The wordmark is currently text with a small red dot, defined in
`src/components/layout/Navbar.tsx` and `src/components/sections/CtaFooter.tsx`. To use a real
logo, drop the asset in `public/` and swap the dot span for an `Image`. The favicon lives at
`src/app/icon.svg`.

## Demo video

The demo section in `src/components/sections/DemoVideo.tsx` renders an empty 16:9 placeholder.
Replace the placeholder block with a `<video>` element or an embed once the recording exists.

## Tech stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Geist Sans and Geist Mono
