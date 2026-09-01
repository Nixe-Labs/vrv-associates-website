import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";

import { Intro } from "@/components/intro";
import { RouteTransition, ScrollProgress } from "@/components/motion";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/content";

import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    locale: "en_CA",
    type: "website",
  },
};

/**
 * Runs before first paint, so the page never flashes the wrong state.
 *
 *   .js         → JavaScript is available; motion CSS may hide things
 *   intro-active → the opening sequence will play
 *   intro-done   → skip it (already seen this session, or reduced motion)
 *
 * Without JavaScript none of these classes exist, so nothing is ever hidden
 * and the overlay stays `display: none`.
 */
const GATE_SCRIPT = `(function(){try{
var d=document.documentElement;d.classList.add('js');
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var seen=false;try{seen=sessionStorage.getItem('vrv:intro')==='1'}catch(e){}
if(reduce||seen){d.classList.add('intro-done')}
else{d.classList.add('intro-active');try{sessionStorage.setItem('vrv:intro','1')}catch(e){}}
}catch(e){document.documentElement.classList.add('intro-done')}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-CA"
      // The gate script below stamps classes on <html> before hydration.
      suppressHydrationWarning
      className={`${instrumentSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: GATE_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="mono-nav sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
        >
          Skip to content
        </a>

        <Intro />
        <ScrollProgress />

        <SiteHeader />

        <div id="main" className="flex-1">
          <RouteTransition>{children}</RouteTransition>
        </div>

        <SiteFooter />
      </body>
    </html>
  );
}
