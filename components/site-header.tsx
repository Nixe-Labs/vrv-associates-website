"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { nav } from "@/lib/content";
import { motionEnabled, subscribeScroll } from "@/lib/motion";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/**
 * Sticky masthead.
 *
 * Three behaviours beyond plain navigation: a single indicator bar that slides
 * between items (and previews the one under the cursor), retraction on
 * scroll-down, and the landing target for the intro's FLIP hand-off.
 *
 * The design lays the nav out as one wrapping row, which holds above ~900px.
 * Below that the links wrap onto three lines and push the hero off screen, so
 * narrow viewports get a disclosure menu instead.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const activeIndex = nav.findIndex((item) => isActive(pathname, item.href));

  /** Moves the indicator under `index`, or hides it when nothing matches. */
  const moveIndicator = useCallback((index: number, animate = true) => {
    const indicator = indicatorRef.current;
    const list = listRef.current;
    const target = itemRefs.current[index];

    if (!indicator || !list) return;

    if (!target) {
      indicator.style.opacity = "0";
      return;
    }

    const listRect = list.getBoundingClientRect();
    const rect = target.getBoundingClientRect();

    indicator.style.opacity = "1";
    indicator.style.transitionDuration = animate ? "" : "0ms";
    indicator.style.width = `${rect.width}px`;
    indicator.style.transform = `translateX(${rect.left - listRect.left}px)`;

    if (!animate) {
      // Restore the transition once the jump has been committed.
      requestAnimationFrame(() => {
        indicator.style.transitionDuration = "";
      });
    }
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Position on mount, after fonts settle, and on resize.
  useEffect(() => {
    moveIndicator(activeIndex, false);

    let timer: number | null = null;
    const onResize = () => {
      if (timer !== null) window.clearTimeout(timer);
      timer = window.setTimeout(() => moveIndicator(activeIndex, false), 140);
    };

    document.fonts?.ready
      .then(() => moveIndicator(activeIndex, false))
      .catch(() => {});

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [activeIndex, moveIndicator]);

  // Retract on scroll-down, return on scroll-up.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let previous = window.scrollY || 0;

    return subscribeScroll(() => {
      const y = window.scrollY || 0;
      const scrolled = y > 24;
      header.toggleAttribute("data-scrolled", scrolled);

      if (!motionEnabled() || open) {
        header.removeAttribute("data-retracted");
        previous = y;
        return;
      }

      const goingDown = y > previous && y > 420;
      header.toggleAttribute("data-retracted", goingDown);
      previous = y;
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header ref={headerRef} className="site-header">
      <div className="container-page flex min-h-[68px] items-center justify-between gap-6">
        <Link
          href="/"
          className="brand-mark flex items-baseline gap-[9px] py-3.5"
          aria-label="VRV Associates — home"
        >
          <span
            data-brand-mark=""
            className="flex items-baseline gap-[9px]"
          >
            <span className="text-[18px] leading-none font-semibold tracking-[-0.015em]">
              VRV
            </span>
            <span className="mono-fine text-muted tracking-[0.2em]">
              Associates
            </span>
          </span>
        </Link>

        {/* Desktop navigation ------------------------------------------- */}
        <nav
          className="hidden items-center min-[900px]:flex"
          onMouseLeave={() => moveIndicator(activeIndex)}
        >
          <div
            ref={listRef}
            className="relative flex items-center gap-x-[clamp(14px,2.2vw,32px)]"
          >
            {nav.map((item, index) => {
              const current = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  onMouseEnter={() => moveIndicator(index)}
                  onFocus={() => moveIndicator(index)}
                  onBlur={() => moveIndicator(activeIndex)}
                  aria-current={current ? "page" : undefined}
                  className={`mono-nav py-[11px] transition-colors duration-300 ${
                    current ? "text-ink" : "text-ink/70 hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <span ref={indicatorRef} className="nav-indicator" aria-hidden="true" />
          </div>

          <Link
            href="/contact"
            className="cta-link ml-[clamp(14px,2.2vw,32px)] bg-ink px-[18px] py-[11px] text-paper"
          >
            <span>Contact</span>
          </Link>
        </nav>

        {/* Compact controls --------------------------------------------- */}
        <div className="flex items-center gap-3 min-[900px]:hidden">
          <Link
            href="/contact"
            className="cta-link bg-ink px-[18px] py-[11px] text-paper"
          >
            <span>Contact</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] border border-rule transition-colors hover:border-ink"
          >
            <span
              aria-hidden="true"
              className={`block h-px w-[18px] bg-ink transition-transform duration-300 ${
                open ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              aria-hidden="true"
              className={`block h-px w-[18px] bg-ink transition-transform duration-300 ${
                open ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Disclosure panel ----------------------------------------------- */}
      <nav
        id="mobile-nav"
        hidden={!open}
        className="border-t border-rule min-[900px]:hidden"
      >
        <div className="container-page flex flex-col py-2">
          {[...nav, { label: "Contact Us", href: "/contact" }].map(
            (item, index) => {
              const current = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ ["--d" as string]: `${index * 45}ms` }}
                  aria-current={current ? "page" : undefined}
                  className={`mobile-link mono-nav border-b border-rule-soft py-4 last:border-b-0 ${
                    current ? "text-accent" : "hover:text-accent"
                  }`}
                >
                  {item.label}
                </Link>
              );
            },
          )}
        </div>
      </nav>
    </header>
  );
}
