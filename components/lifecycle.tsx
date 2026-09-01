"use client";

import { useEffect, useRef, useState } from "react";

import { lifecycleStages } from "@/lib/content";
import {
  EASE_OUT_EXPO,
  EASE_OUT_QUART,
  measureStrokes,
  motionEnabled,
  onIntroDone,
} from "@/lib/motion";

/** How long the draw front takes to travel the full width of the rail. */
const SWEEP = 1700;
/** Per-stroke draw duration. */
const STROKE = 900;

/**
 * The project lifecycle.
 *
 * Plays once when it scrolls into view: the rail drafts itself left to right,
 * the milestone nodes light as the draw front reaches them, and the four stage
 * captions come up behind it. Then it is done and stays put.
 *
 * This deliberately does *not* pin or scrub. An earlier version held the
 * section to the viewport for three screens of scroll while the rail drew —
 * which reads as the page refusing to move rather than as polish.
 */
export function Lifecycle() {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<SVGGElement>(null);
  const nodesRef = useRef<SVGGElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const section = sectionRef.current;
    const rail = railRef.current;
    if (!section || !rail) return;

    const settle = () => setActive(lifecycleStages.length - 1);

    if (!motionEnabled()) {
      settle();
      return;
    }

    let played = false;
    let observer: IntersectionObserver | null = null;
    const timers: number[] = [];

    const play = () => {
      if (played) return;
      played = true;

      const strokes = measureStrokes(rail);

      // Normalise each stroke's horizontal position so the draw front sweeps
      // across the rail rather than firing in document order.
      const centres = strokes.map(({ node }) => {
        try {
          const box = node.getBBox();
          return box.x + box.width / 2;
        } catch {
          return 0;
        }
      });
      const min = Math.min(...centres, 0);
      const max = Math.max(...centres, 1);
      const spread = Math.max(1, max - min);

      strokes.forEach(({ node, length }, i) => {
        node.style.strokeDasharray = `${length}`;
        node.animate(
          [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
          {
            duration: STROKE,
            delay: ((centres[i] - min) / spread) * SWEEP,
            easing: EASE_OUT_EXPO,
            fill: "both",
          },
        );
      });

      // Milestone nodes light as the front passes them.
      nodesRef.current
        ?.querySelectorAll<SVGElement>("[data-node]")
        .forEach((node, i, list) => {
          node.animate(
            [
              { opacity: 0, transform: "scale(0.4)" },
              { opacity: 1, transform: "scale(1)" },
            ],
            {
              duration: 520,
              delay: (i / Math.max(1, list.length - 1)) * SWEEP,
              easing: EASE_OUT_EXPO,
              fill: "both",
            },
          );
        });

      // Captions follow just behind the front.
      lifecycleStages.forEach((_, i) => {
        const at = (i / Math.max(1, lifecycleStages.length - 1)) * SWEEP + 220;
        timers.push(window.setTimeout(() => setActive(i), at));
      });
    };

    const release = onIntroDone(() => {
      if (typeof IntersectionObserver === "undefined") {
        play();
        return;
      }

      if (section.getBoundingClientRect().top <= window.innerHeight * 0.9) {
        play();
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              play();
              observer?.disconnect();
              return;
            }
          }
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
      );
      observer.observe(section);
    });

    return () => {
      release();
      observer?.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const readout = active < 0 ? 1 : active + 1;

  return (
    <section
      ref={sectionRef}
      className="border-t border-rule py-[clamp(56px,8vw,110px)]"
    >
      <div className="container-page">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <p className="mono-eyebrow text-muted">Project lifecycle</p>
          <p className="mono-eyebrow text-accent tabular-nums">
            Stage {String(readout).padStart(2, "0")} / 04
          </p>
        </div>

        <div className="mt-[clamp(28px,4vw,52px)]">
          <svg
            viewBox="0 0 1200 190"
            preserveAspectRatio="xMidYMid meet"
            className="block h-auto w-full text-ink"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            aria-hidden="true"
          >
            <g ref={railRef}>
              <path d="M40 96h1120" />
              <g strokeWidth="0.7" opacity="0.55">
                <path d="M40 60v72M320 60v72M600 60v72M880 60v72M1160 60v72" />
              </g>
              <path
                d="M40 96q140-62 280 0M320 96q140 62 280 0M600 96q140-62 280 0M880 96q140 62 280 0"
                strokeWidth="0.8"
                opacity="0.55"
              />
              <g strokeWidth="1" opacity="0.9">
                <rect x="150" y="26" width="60" height="22" />
                <rect x="430" y="144" width="60" height="22" />
                <rect x="710" y="26" width="60" height="22" />
                <rect x="990" y="144" width="60" height="22" />
              </g>
            </g>

            <g ref={nodesRef} fill="currentColor" stroke="none">
              <circle data-node="" cx="40" cy="96" r="5" />
              <circle data-node="" cx="320" cy="96" r="5" />
              <circle data-node="" cx="600" cy="96" r="5" />
              <circle data-node="" cx="880" cy="96" r="5" />
              <circle data-node="" cx="1160" cy="96" r="5" />
            </g>
          </svg>
        </div>

        <div className="mt-[22px] grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-x-[clamp(20px,3vw,44px)] gap-y-4">
          {lifecycleStages.map((item, index) => (
            <div
              key={item.stage}
              data-stage-card=""
              data-active={index <= active ? "" : undefined}
              className="border-t border-rule pt-3"
            >
              <p className="mono-stage tracking-[0.12em] text-accent">
                {item.stage}
              </p>
              <p className="mono-item mt-2 text-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
