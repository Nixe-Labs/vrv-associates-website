/**
 * Shared motion primitives.
 *
 * Everything here is dependency-free: Web Animations API, IntersectionObserver
 * and a single shared scroll ticker. One rAF loop serves every scroll-driven
 * effect on the page rather than each component attaching its own listener.
 */

/* Easing ------------------------------------------------------------------ */

/** Long-tailed decel. The signature "expensive" curve — used for reveals. */
export const EASE_OUT_EXPO = "cubic-bezier(0.16, 1, 0.3, 1)";
/** Heavy, symmetrical. For large objects moving a long way. */
export const EASE_IN_OUT_QUINT = "cubic-bezier(0.83, 0, 0.17, 1)";
/** Gentler decel for small UI moves. */
export const EASE_OUT_QUART = "cubic-bezier(0.25, 1, 0.5, 1)";

/* Environment ------------------------------------------------------------- */

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/** Scroll-linked set pieces are desktop-only; below this they render static. */
export const WIDE_BREAKPOINT = 900;

export function isWide(): boolean {
  return typeof window !== "undefined" && window.innerWidth >= WIDE_BREAKPOINT;
}

/** True when scroll-driven choreography should run at all. */
export function motionEnabled(): boolean {
  return !prefersReducedMotion();
}

/* Shared scroll ticker ---------------------------------------------------- */

type Tick = () => void;

const subscribers = new Set<Tick>();
let frame: number | null = null;
let listening = false;

function flush() {
  frame = null;
  for (const run of subscribers) run();
}

function schedule() {
  if (frame === null) frame = requestAnimationFrame(flush);
}

/**
 * Registers a callback against the shared scroll/resize loop. Returns an
 * unsubscribe function. The callback fires once immediately so subscribers
 * settle into the correct state without waiting for the first scroll.
 */
export function subscribeScroll(run: Tick): () => void {
  subscribers.add(run);

  if (!listening) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    listening = true;
  }

  run();

  return () => {
    subscribers.delete(run);
  };
}

/* Maths ------------------------------------------------------------------- */

export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

/** Maps `value` from [inMin, inMax] onto [outMin, outMax], clamped. */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  if (inMax === inMin) return outMin;
  const t = clamp((value - inMin) / (inMax - inMin));
  return outMin + t * (outMax - outMin);
}

export const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
export const easeInOutQuint = (t: number) =>
  t < 0.5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2;

/**
 * Progress of a pinned section, 0 at the moment it locks to the viewport top
 * and 1 when its travel is exhausted.
 */
export function pinProgress(section: HTMLElement): number {
  const travel = section.offsetHeight - window.innerHeight;
  if (travel <= 0) return 0;
  return clamp(-section.getBoundingClientRect().top / travel);
}

/* Intro coordination ------------------------------------------------------ */

export const INTRO_DONE_EVENT = "vrv:intro-done";

/**
 * Runs `callback` once the intro sequence has handed off — immediately when
 * no intro is playing, so callers need no special case for repeat visits,
 * reduced motion or a failed intro.
 */
export function onIntroDone(callback: () => void): () => void {
  if (typeof document === "undefined") return () => {};

  if (document.documentElement.classList.contains("intro-done")) {
    callback();
    return () => {};
  }

  const handler = () => callback();
  window.addEventListener(INTRO_DONE_EVENT, handler, { once: true });
  return () => window.removeEventListener(INTRO_DONE_EVENT, handler);
}

/* SVG ---------------------------------------------------------------------- */

type Geometry = SVGGeometryElement;

export const GEOMETRY_SELECTOR =
  "path, circle, rect, line, polyline, polygon, ellipse";

/**
 * Animates an SVG as though it were being drafted: stroked geometry draws
 * along its own length, filled marks (nodes, dots) fade in behind it.
 */
export function drawSvg(
  root: Element,
  { duration = 1400, stagger = 55, delay = 0 } = {},
): void {
  const nodes = Array.from(
    root.querySelectorAll<Geometry>(GEOMETRY_SELECTOR),
  );

  nodes.forEach((node, index) => {
    const startAt = delay + index * stagger;
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

    if (length > 0) {
      node.style.strokeDasharray = `${length}`;
      node.animate(
        [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
        {
          duration,
          delay: startAt,
          easing: EASE_OUT_EXPO,
          fill: "both",
        },
      );
      return;
    }

    node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 600,
      delay: startAt + 220,
      easing: EASE_OUT_QUART,
      fill: "both",
    });
  });
}

/** Total path length of every stroked node, for scrub-driven drawing. */
export function measureStrokes(root: Element): Array<{
  node: Geometry;
  length: number;
}> {
  return Array.from(root.querySelectorAll<Geometry>(GEOMETRY_SELECTOR))
    .map((node) => {
      let length = 0;
      if (typeof node.getTotalLength === "function") {
        try {
          length = node.getTotalLength();
        } catch {
          length = 0;
        }
      }
      return { node, length };
    })
    .filter((entry) => entry.length > 0);
}
