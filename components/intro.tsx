"use client";

import { useEffect, useRef } from "react";

import {
  EASE_IN_OUT_QUINT,
  EASE_OUT_EXPO,
  EASE_OUT_QUART,
  INTRO_DONE_EVENT,
  easeOutQuart,
} from "@/lib/motion";

const WORDMARK = "VRV";
const SUFFIX = "ASSOCIATES";

/**
 * Opening sequence.
 *
 * The lockup is structurally identical to the header logo — same flex,
 * same baseline alignment, same proportions — just scaled up. That lets the
 * final beat be a true FLIP: the mark flies into the header's position and
 * hands off to the real logo, so it reads as one continuous object rather
 * than a loader that vanishes.
 *
 * Whether this runs at all is decided before first paint by the inline script
 * in `app/layout.tsx`, which sets `intro-active` (run) or `intro-done` (skip)
 * on <html>. That keeps no-JS and reduced-motion visitors from ever seeing an
 * overlay, and avoids a flash of hero content on the way in.
 */
export function Intro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lockupRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const auxRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("intro-active")) return;

    const root = rootRef.current;
    const lockup = lockupRef.current;
    if (!root || !lockup) return;

    let cancelled = false;
    const timers: number[] = [];
    let counterFrame: number | null = null;

    const after = (ms: number, run: () => void) => {
      timers.push(window.setTimeout(run, ms));
    };

    // Released while the curtain is still lifting, so the hero is already
    // animating in as the mark lands rather than appearing after a dead beat.
    let contentStarted = false;
    const startContent = () => {
      if (contentStarted) return;
      contentStarted = true;
      html.classList.add("intro-done");
      window.dispatchEvent(new Event(INTRO_DONE_EVENT));
    };

    const finish = () => {
      if (cancelled) return;
      cancelled = true;
      startContent();
      html.classList.remove("intro-active");
      root.style.display = "none";
    };

    const start = async () => {
      // Line breaks and glyph widths must be final before anything is measured.
      try {
        await document.fonts.ready;
      } catch {
        /* older browsers — proceed with whatever is loaded */
      }
      if (cancelled) return;

      /* Blueprint grid ------------------------------------------------- */
      const grid = gridRef.current;
      if (grid) {
        // Safe to show now that the dash offsets are about to be set.
        grid.style.opacity = "0.5";
        grid.querySelectorAll<SVGGeometryElement>("path, circle").forEach(
          (node, i) => {
            let length = 0;
            try {
              length = node.getTotalLength();
            } catch {
              length = 0;
            }
            if (length <= 0) return;
            node.style.strokeDasharray = `${length}`;
            node.animate(
              [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
              {
                duration: 1600,
                delay: 60 + i * 70,
                easing: EASE_OUT_EXPO,
                fill: "both",
              },
            );
          },
        );
      }

      /* Wordmark — letters lift out of blur ---------------------------- */
      lockup.querySelectorAll<HTMLElement>("[data-mark-letter]").forEach(
        (letter, i) => {
          letter.animate(
            [
              {
                opacity: 0,
                filter: "blur(18px)",
                transform: "translateY(24px)",
              },
              { opacity: 1, filter: "blur(0px)", transform: "translateY(0)" },
            ],
            {
              duration: 900,
              delay: 120 + i * 100,
              easing: EASE_OUT_EXPO,
              fill: "both",
            },
          );
        },
      );

      /* Suffix — faster, tighter stagger ------------------------------- */
      lockup.querySelectorAll<HTMLElement>("[data-suffix-letter]").forEach(
        (letter, i) => {
          letter.animate(
            [
              { opacity: 0, filter: "blur(8px)", transform: "translateY(10px)" },
              { opacity: 1, filter: "blur(0px)", transform: "translateY(0)" },
            ],
            {
              duration: 700,
              delay: 500 + i * 30,
              easing: EASE_OUT_EXPO,
              fill: "both",
            },
          );
        },
      );

      /* Hairline ------------------------------------------------------- */
      ruleRef.current?.animate(
        [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
        { duration: 900, delay: 600, easing: EASE_OUT_EXPO, fill: "both" },
      );

      /* Counter -------------------------------------------------------- */
      const counter = counterRef.current;
      if (counter) {
        const begin = performance.now() + 300;
        const span = 1200;
        const tick = (now: number) => {
          if (cancelled) return;
          const t = Math.max(0, Math.min(1, (now - begin) / span));
          const value = Math.round(easeOutQuart(t) * 100);
          counter.textContent = String(value).padStart(3, "0");
          counterFrame = t < 1 ? requestAnimationFrame(tick) : null;
        };
        counterFrame = requestAnimationFrame(tick);
      }

      /* Clear the supporting furniture --------------------------------- */
      after(1600, () => {
        auxRef.current?.animate(
          [{ opacity: 1 }, { opacity: 0 }],
          { duration: 380, easing: EASE_OUT_QUART, fill: "both" },
        );
        if (grid) {
          grid.animate([{ opacity: 0.5 }, { opacity: 0 }], {
            duration: 500,
            easing: EASE_OUT_QUART,
            fill: "both",
          });
        }
      });

      /* Hand off to the header ----------------------------------------- */
      after(1750, () => {
        if (cancelled) return;

        const target = document.querySelector<HTMLElement>("[data-brand-mark]");
        const from = lockup.getBoundingClientRect();

        if (target) {
          const to = target.getBoundingClientRect();
          const scale = from.width > 0 ? to.width / from.width : 1;

          lockup.animate(
            [
              { transform: "translate3d(0,0,0) scale(1)" },
              {
                transform: `translate3d(${to.left - from.left}px, ${
                  to.top - from.top
                }px, 0) scale(${scale})`,
              },
            ],
            { duration: 1000, easing: EASE_IN_OUT_QUINT, fill: "both" },
          );

          // The curtain drops out from under the mark mid-flight, so it has
          // to recolour for paper or it lands invisible.
          lockup
            .querySelector(".intro-mark")
            ?.animate([{ color: "#F5F4F1" }, { color: "#0F1417" }], {
              duration: 500,
              delay: 500,
              easing: EASE_OUT_QUART,
              fill: "both",
            });

          lockup
            .querySelector(".intro-suffix")
            ?.animate([{ color: "#8A9299" }, { color: "#6E747A" }], {
              duration: 500,
              delay: 500,
              easing: EASE_OUT_QUART,
              fill: "both",
            });
        } else {
          lockup.animate(
            [
              { opacity: 1, filter: "blur(0px)" },
              { opacity: 0, filter: "blur(10px)" },
            ],
            { duration: 700, easing: EASE_OUT_QUART, fill: "both" },
          );
        }

        // Curtain lifts underneath the travelling mark.
        // Same delay, duration and curve as the recolour above — the mark's
        // luminance tracks the background it is crossing.
        root.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 500,
          delay: 500,
          easing: EASE_OUT_QUART,
          fill: "both",
        });
      });

      // Hero starts under the lifting curtain, then the overlay is torn down
      // and the real (crisp, untransformed) header logo takes over.
      after(2230, startContent);
      after(2780, finish);
    };

    void start();

    // A stalled font load must never leave a visitor staring at the curtain.
    const failsafe = window.setTimeout(finish, 6000);
    timers.push(failsafe);

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
      if (counterFrame !== null) cancelAnimationFrame(counterFrame);
    };
  }, []);

  return (
    <div ref={rootRef} className="intro" aria-hidden="true">
      <svg
        ref={gridRef}
        className="intro-grid"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="#F5F4F1"
        strokeWidth="1"
      >
        <path d="M0 220h1440M0 680h1440" />
        <path d="M300 220v120M720 220v90M1140 220v120" />
        <path d="M300 560v120M720 590v90M1140 560v120" />
        <circle cx="300" cy="450" r="62" />
        <circle cx="1140" cy="450" r="42" />
        <path d="M0 120h1440M0 780h1440" strokeWidth="0.5" />
      </svg>

      <div className="intro-stage">
        <div ref={lockupRef} className="intro-lockup">
          <span className="intro-mark">
            {WORDMARK.split("").map((letter, i) => (
              <span key={`${letter}-${i}`} data-mark-letter="">
                {letter}
              </span>
            ))}
          </span>
          <span className="intro-suffix">
            {SUFFIX.split("").map((letter, i) => (
              <span key={`${letter}-${i}`} data-suffix-letter="">
                {letter}
              </span>
            ))}
          </span>
        </div>
      </div>

      <div ref={auxRef} className="intro-aux">
        <span className="intro-rule">
          <span ref={ruleRef} />
        </span>
        <div className="intro-meta">
          <span>Project management &amp; engineering consultancy</span>
          <span ref={counterRef} className="intro-counter">
            000
          </span>
        </div>
      </div>
    </div>
  );
}
