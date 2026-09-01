"use client";

import { useEffect, useRef, type ReactNode } from "react";

import {
  EASE_OUT_EXPO,
  EASE_OUT_QUART,
  GEOMETRY_SELECTOR,
  motionEnabled,
  onIntroDone,
} from "@/lib/motion";

type Item = {
  node: SVGGeometryElement;
  /** Path length, or 0 for filled marks that fade rather than draw. */
  length: number;
  cx: number;
  cy: number;
};

/** Deterministic 0..1 hash — varies the scatter order per cycle. */
function hash(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Ranks items by `key` and returns each one's normalised position (0..1) in
 * that order. That value becomes its share of the stagger window, so a
 * strategy only has to say *what* it sorts by.
 */
function rankBy(items: Item[], key: (item: Item, index: number) => number) {
  const order = items.map((_, i) => i);
  order.sort((a, b) => key(items[a], a) - key(items[b], b));

  const out = new Array<number>(items.length);
  const last = Math.max(1, items.length - 1);
  order.forEach((original, rank) => {
    out[original] = rank / last;
  });
  return out;
}

type Strategy = {
  name: string;
  order: (items: Item[], cycle: number, centre: [number, number]) => number[];
};

/**
 * The sequences the schematic cycles through. Each one re-inks the whole
 * drawing, but arrives in a different order, so the loop never reads as the
 * same animation repeating.
 */
const STRATEGIES: Strategy[] = [
  { name: "sweep-right", order: (i) => rankBy(i, (it) => it.cx) },
  { name: "sweep-left", order: (i) => rankBy(i, (it) => -it.cx) },
  { name: "sweep-down", order: (i) => rankBy(i, (it) => it.cy) },
  {
    name: "radiate-out",
    order: (i, _c, [cx, cy]) =>
      rankBy(i, (it) => Math.hypot(it.cx - cx, it.cy - cy)),
  },
  {
    name: "converge-in",
    order: (i, _c, [cx, cy]) =>
      rankBy(i, (it) => -Math.hypot(it.cx - cx, it.cy - cy)),
  },
  {
    name: "by-assembly",
    order: (i) => rankBy(i, (_it, index) => index),
  },
  {
    name: "scatter",
    order: (i, cycle) => rankBy(i, (_it, index) => hash(index + cycle * 31 + 1)),
  },
];

type SchematicLoopProps = {
  children: ReactNode;
  className?: string;
  /** Bounds of the gap between cycles, in ms. */
  cycleMin?: number;
  cycleMax?: number;
};

/**
 * Ambient schematic that keeps redrawing itself.
 *
 * Every 5–7s the drawing re-inks in a different order — sweeping across,
 * radiating from the centre, assembling component by component, scattering.
 * The stagger is wide enough that only part of the schematic is mid-stroke at
 * any moment, so it reads as a wave passing through rather than the whole
 * thing blinking.
 *
 * The loop is suspended whenever the schematic is off-screen or the tab is
 * hidden, and never starts at all under reduced motion — an infinite
 * background animation has no business burning cycles nobody is watching.
 */
export function SchematicLoop({
  children,
  className,
  cycleMin = 5000,
  cycleMax = 7000,
}: SchematicLoopProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const nodes = Array.from(
      el.querySelectorAll<SVGGeometryElement>(GEOMETRY_SELECTOR),
    );
    if (nodes.length === 0) return;

    const items: Item[] = nodes.map((node) => {
      const styles = getComputedStyle(node);
      const stroked = styles.stroke !== "none" && styles.stroke !== "";

      let length = 0;
      if (stroked && typeof node.getTotalLength === "function") {
        try {
          length = node.getTotalLength();
        } catch {
          length = 0;
        }
      }

      let cx = 0;
      let cy = 0;
      try {
        const box = node.getBBox();
        cx = box.x + box.width / 2;
        cy = box.y + box.height / 2;
      } catch {
        /* detached or non-rendered — leave at origin */
      }

      return { node, length, cx, cy };
    });

    const settle = () => {
      for (const item of items) {
        if (item.length > 0) {
          item.node.style.strokeDasharray = `${item.length}`;
          item.node.style.strokeDashoffset = "0";
        }
        item.node.style.opacity = "1";
      }
      el.setAttribute("data-drawn", "");
    };

    if (!motionEnabled()) {
      settle();
      return;
    }

    const xs = items.map((i) => i.cx);
    const ys = items.map((i) => i.cy);
    const centre: [number, number] = [
      (Math.min(...xs) + Math.max(...xs)) / 2,
      (Math.min(...ys) + Math.max(...ys)) / 2,
    ];

    const SPAN = 1750; // stagger window across the whole drawing
    const DRAW = 950; // per-element stroke duration

    let cycle = 0;
    let timer: number | null = null;
    let onScreen = true;
    let disposed = false;

    // Shuffled so the first pass through the strategies is not the source
    // order, and no two runs of the page open the same way.
    const rota = STRATEGIES.map((_, i) => i).sort(
      () => Math.random() - 0.5,
    );

    const clearTimer = () => {
      if (timer !== null) {
        window.clearTimeout(timer);
        timer = null;
      }
    };

    const schedule = (delay: number) => {
      clearTimer();
      timer = window.setTimeout(run, delay);
    };

    const run = () => {
      if (disposed) return;

      // Nothing to look at — stop burning cycles until it comes back.
      if (!onScreen || document.hidden) {
        clearTimer();
        return;
      }

      const strategy = STRATEGIES[rota[cycle % rota.length]];
      const delays = strategy.order(items, cycle, centre);

      items.forEach((item, i) => {
        const delay = delays[i] * SPAN;

        if (item.length > 0) {
          item.node.style.strokeDasharray = `${item.length}`;
          item.node.animate(
            [{ strokeDashoffset: item.length }, { strokeDashoffset: 0 }],
            { duration: DRAW, delay, easing: EASE_OUT_EXPO, fill: "both" },
          );
          return;
        }

        // Filled marks (the connection nodes) fade with the wave.
        item.node.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 620,
          delay: delay + 140,
          easing: EASE_OUT_QUART,
          fill: "both",
        });
      });

      el.setAttribute("data-drawn", "");
      el.setAttribute("data-sequence", strategy.name);

      cycle += 1;
      schedule(cycleMin + Math.random() * (cycleMax - cycleMin));
    };

    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              const wasOn = onScreen;
              onScreen = entries.some((entry) => entry.isIntersecting);
              if (onScreen && !wasOn) schedule(400);
              if (!onScreen) clearTimer();
            },
            { threshold: 0 },
          )
        : null;

    observer?.observe(el);

    const onVisibility = () => {
      if (document.hidden) clearTimer();
      else if (onScreen) schedule(600);
    };
    document.addEventListener("visibilitychange", onVisibility);

    // First pass rides the intro hand-off, then the loop takes over.
    const release = onIntroDone(() => {
      if (!disposed) schedule(150);
    });

    return () => {
      disposed = true;
      release();
      clearTimer();
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [cycleMin, cycleMax]);

  return (
    <div ref={ref} data-draw="" className={className}>
      {children}
    </div>
  );
}
