"use client";

import { useEffect, useRef, useState } from "react";

import {
  clamp,
  isWide,
  mapRange,
  measureStrokes,
  motionEnabled,
  pinProgress,
  subscribeScroll,
} from "@/lib/motion";
import { lifecycleStages } from "@/lib/content";

/** Scroll position at which each stage takes over, as a fraction of the pin. */
const STAGE_MARKS = [0.04, 0.27, 0.5, 0.73];

/**
 * The project lifecycle, pinned and scrubbed.
 *
 * While the section is held to the viewport, scrolling drafts the rail from
 * left to right and walks the four stages in sequence. Pinning is done with
 * `position: sticky` inside a tall spacer rather than by intercepting scroll,
 * so the wheel, trackpad, keyboard and scrollbar all keep behaving normally.
 *
 * Below 900px, and under reduced motion, the CSS drops the extra height and
 * this renders as an ordinary static section.
 */
export function LifecycleScrub() {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<SVGGElement>(null);
  const progressRef = useRef<SVGGElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const rail = railRef.current;
    if (!section || !rail) return;

    if (!motionEnabled()) {
      section.setAttribute("data-static", "");
      setActive(lifecycleStages.length - 1);
      return;
    }

    let strokes = measureStrokes(rail);
    let scrubbing = isWide();

    const applyDrawn = () => {
      for (const { node, length } of strokes) {
        node.style.strokeDasharray = `${length}`;
        node.style.strokeDashoffset = "0";
      }
    };

    const measure = () => {
      strokes = measureStrokes(rail);
      scrubbing = isWide();
      if (!scrubbing) applyDrawn();
    };

    measure();

    const unsubscribe = subscribeScroll(() => {
      if (!scrubbing) return;

      const progress = pinProgress(section);

      // Rail drafts itself across the first 85% of the travel.
      const drawn = clamp(mapRange(progress, 0, 0.85, 0, 1));
      for (const { node, length } of strokes) {
        node.style.strokeDasharray = `${length}`;
        node.style.strokeDashoffset = `${length * (1 - drawn)}`;
      }

      // Nodes brighten just ahead of the stage they belong to.
      const marker = progressRef.current;
      if (marker) {
        marker
          .querySelectorAll<SVGElement>("[data-node]")
          .forEach((node, index) => {
            const threshold = index === 0 ? 0 : STAGE_MARKS[index - 1] ?? 1;
            node.style.opacity = progress >= threshold ? "1" : "0.18";
          });
      }

      let next = 0;
      for (let i = 0; i < STAGE_MARKS.length; i += 1) {
        if (progress >= STAGE_MARKS[i]) next = i;
      }
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }
    });

    let resizeTimer: number | null = null;
    const onResize = () => {
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(measure, 160);
    };
    window.addEventListener("resize", onResize);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", onResize);
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <section ref={sectionRef} className="scrub-section border-t border-rule">
      <div className="scrub-inner">
        <div className="container-page w-full">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <p className="mono-eyebrow text-muted">Project lifecycle</p>
            <p className="mono-eyebrow text-accent tabular-nums">
              Stage {String(active + 1).padStart(2, "0")} / 04
            </p>
          </div>

          <div className="scrub-rail mt-[clamp(28px,4vw,52px)]">
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

              <g ref={progressRef} fill="currentColor" stroke="none">
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
      </div>
    </section>
  );
}
