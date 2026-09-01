import Link from "next/link";
import type { ReactNode } from "react";

import { Reveal, SplitLines } from "@/components/motion";

/** Small monospace section label. */
export function Eyebrow({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <Reveal
      as="p"
      variant="blur"
      className={`mono-eyebrow ${tone === "dark" ? "text-on-dark-muted" : "text-muted"}`}
    >
      {children}
    </Reveal>
  );
}

/** Standard interior-page masthead: label, title, optional standfirst. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  introWidth = "max-w-[640px]",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  introWidth?: string;
}) {
  return (
    <header className="page-header-y">
      <div className="container-page">
        <Eyebrow>{eyebrow}</Eyebrow>

        <SplitLines
          as="h1"
          delay={140}
          stagger={90}
          className="t-page mt-[clamp(20px,2.5vw,34px)] max-w-[14em]"
        >
          {title}
        </SplitLines>

        {intro ? (
          <Reveal
            as="p"
            index={2}
            className={`t-lead mt-[clamp(20px,2.5vw,32px)] ${introWidth} text-body`}
          >
            {intro}
          </Reveal>
        ) : null}
      </div>
    </header>
  );
}

/** Underlined monospace link with a trailing arrow. */
export function ArrowLink({
  href,
  children,
  variant = "underline",
}: {
  href: string;
  children: ReactNode;
  variant?: "underline" | "quiet";
}) {
  if (variant === "quiet") {
    return (
      <Link
        href={href}
        className="arrow-link mono-nav text-muted transition-colors duration-400 hover:text-accent"
      >
        {children} <span className="arrow-glyph">→</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="arrow-link mono-nav self-start border-b border-ink pb-1.5 transition-colors duration-400 hover:border-accent hover:text-accent"
    >
      {children} <span className="arrow-glyph">→</span>
    </Link>
  );
}

/** Solid button used on dark bands. */
export function InvertedButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`cta-link bg-paper px-[26px] py-4 tracking-[0.14em] text-ink ${className}`}
    >
      <span>{children}</span>
    </Link>
  );
}

/** Closing dark call-to-action, split heading and supporting column. */
export function CtaBand({
  heading,
  body,
  cta = "Contact us",
}: {
  heading: string;
  body: string;
  cta?: string;
}) {
  return (
    <section className="section-y bg-ink text-paper">
      <div className="container-page grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-end gap-[clamp(32px,5vw,72px)]">
        <SplitLines as="h2" stagger={80} className="t-h2-cta max-w-[16em]">
          {heading}
        </SplitLines>

        <Reveal index={1} className="flex max-w-[460px] flex-col gap-[22px]">
          <p className="t-lead text-on-dark">{body}</p>
          <InvertedButton href="/contact" className="self-start">
            {cta}
          </InvertedButton>
        </Reveal>
      </div>
    </section>
  );
}

/** Single-line dark band with the CTA pinned to the right. */
export function CtaStrip({
  heading,
  cta = "Contact us",
}: {
  heading: string;
  cta?: string;
}) {
  return (
    <section className="bg-ink py-[clamp(56px,7vw,96px)] text-paper">
      <div className="container-page flex flex-wrap items-center justify-between gap-7">
        <SplitLines as="h2" stagger={80} className="t-h2-band max-w-[20em]">
          {heading}
        </SplitLines>

        <Reveal index={1}>
          <InvertedButton href="/contact" className="whitespace-nowrap">
            {cta}
          </InvertedButton>
        </Reveal>
      </div>
    </section>
  );
}
