"use client";

import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

import {
  EASE_OUT_EXPO,
  EASE_OUT_QUART,
  clamp,
  drawSvg,
  isWide,
  motionEnabled,
  onIntroDone,
  prefersReducedMotion,
  subscribeScroll,
} from "@/lib/motion";

/* -------------------------------------------------------------------------- */
/* Shared helpers                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Waits for the intro hand-off, then fires when the element scrolls into view.
 * Anything already on screen fires straight away.
 */
function useInView(
  ref: React.RefObject<HTMLElement | null>,
  onEnter: () => void,
  deps: unknown[] = [],
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let observer: IntersectionObserver | null = null;
    let fired = false;

    const fire = () => {
      if (fired) return;
      fired = true;
      onEnter();
    };

    const release = onIntroDone(() => {
      if (!motionEnabled() || typeof IntersectionObserver === "undefined") {
        fire();
        return;
      }

      if (el.getBoundingClientRect().top <= window.innerHeight * 0.94) {
        fire();
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              fire();
              observer?.disconnect();
              return;
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
      );
      observer.observe(el);
    });

    return () => {
      release();
      observer?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/* -------------------------------------------------------------------------- */
/* Reveal                                                                     */
/* -------------------------------------------------------------------------- */

type RevealVariant = "rise" | "blur" | "rule";

type RevealProps = {
  children: ReactNode;
  index?: number;
  as?: ElementType;
  className?: string;
  variant?: RevealVariant;
};

const VARIANTS: Record<RevealVariant, Keyframe[]> = {
  rise: [
    { opacity: 0, transform: "translate3d(0,26px,0)" },
    { opacity: 1, transform: "translate3d(0,0,0)" },
  ],
  blur: [
    { opacity: 0, filter: "blur(10px)", transform: "translate3d(0,14px,0)" },
    { opacity: 1, filter: "blur(0px)", transform: "translate3d(0,0,0)" },
  ],
  rule: [
    { opacity: 1, transform: "scaleX(0)" },
    { opacity: 1, transform: "scaleX(1)" },
  ],
};

/** Fades and lifts content into place as it enters the viewport. */
export function Reveal({
  children,
  index = 0,
  as: Tag = "div",
  className,
  variant = "rise",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useInView(ref, () => {
    const el = ref.current;
    if (!el) return;

    if (!motionEnabled()) {
      el.setAttribute("data-revealed", "");
      return;
    }

    el.animate(VARIANTS[variant], {
      duration: variant === "rule" ? 900 : 1050,
      delay: Math.min(index * 90, 360),
      easing: EASE_OUT_EXPO,
      fill: "both",
    });
    el.setAttribute("data-revealed", "");
  });

  return (
    <Tag ref={ref} data-reveal="" className={className}>
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/* SplitLines                                                                 */
/* -------------------------------------------------------------------------- */

type SplitLinesProps = {
  children: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  blur?: boolean;
};

/**
 * Reveals a heading one typeset line at a time, each rising from behind its
 * own mask.
 *
 * Lines are not elements, so words are wrapped, grouped by their measured
 * `offsetTop`, and each group re-parented into a clipping wrapper. Splitting
 * waits on `document.fonts.ready` and re-runs on width change, because the
 * grouping is only valid for the line breaks that produced it.
 */
export function SplitLines({
  children,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 90,
  blur = true,
}: SplitLinesProps) {
  const ref = useRef<HTMLElement>(null);
  const text = children;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.setAttribute("aria-label", text);

    let width = 0;
    let resizeTimer: number | null = null;
    let revealed = false;
    let disposed = false;

    const paint = () => {
      el.querySelectorAll<HTMLElement>(".ln-i").forEach((line, i) => {
        line.animate(
          [
            {
              transform: "translate3d(0,110%,0)",
              opacity: 0,
              ...(blur ? { filter: "blur(7px)" } : {}),
            },
            {
              transform: "translate3d(0,0,0)",
              opacity: 1,
              ...(blur ? { filter: "blur(0px)" } : {}),
            },
          ],
          {
            duration: 1150,
            delay: delay + i * stagger,
            easing: EASE_OUT_EXPO,
            fill: "both",
          },
        );
      });
    };

    const build = () => {
      if (disposed) return;

      // Words first, whitespace preserved as real text nodes.
      el.textContent = text;
      const parts = text.split(/(\s+)/);
      const fragment = document.createDocumentFragment();
      const words: HTMLSpanElement[] = [];

      for (const part of parts) {
        if (part === "") continue;
        if (/^\s+$/.test(part)) {
          fragment.appendChild(document.createTextNode(part));
          continue;
        }
        const span = document.createElement("span");
        span.className = "sw";
        span.textContent = part;
        fragment.appendChild(span);
        words.push(span);
      }

      el.textContent = "";
      el.appendChild(fragment);

      // Group by vertical position — that is what a "line" actually is.
      const groups: HTMLSpanElement[][] = [];
      let lastTop: number | null = null;
      for (const word of words) {
        const top = word.offsetTop;
        if (lastTop === null || Math.abs(top - lastTop) > 2) {
          groups.push([]);
          lastTop = top;
        }
        groups[groups.length - 1].push(word);
      }

      for (const group of groups) {
        const line = document.createElement("span");
        line.className = "ln";
        const inner = document.createElement("span");
        inner.className = "ln-i";
        line.appendChild(inner);

        const first = group[0];
        const last = group[group.length - 1];
        el.insertBefore(line, first);

        let node: ChildNode | null = first;
        while (node) {
          const next: ChildNode | null = node.nextSibling;
          inner.appendChild(node);
          if (node === last) break;
          node = next;
        }
      }

      el.setAttribute("data-split-ready", "");
      width = el.offsetWidth;
      if (revealed) paint();
    };

    const onResize = () => {
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (Math.abs(el.offsetWidth - width) < 2) return;
        build();
      }, 180);
    };

    const setup = async () => {
      try {
        await document.fonts.ready;
      } catch {
        /* proceed with fallback metrics */
      }
      if (disposed) return;

      if (!motionEnabled()) {
        el.setAttribute("data-split-ready", "");
        revealed = true;
        return;
      }

      build();
      window.addEventListener("resize", onResize);
    };

    void setup();

    const releaseIntro = onIntroDone(() => {
      if (disposed) return;

      const trigger = () => {
        if (revealed) return;
        revealed = true;
        if (el.hasAttribute("data-split-ready")) paint();
      };

      if (!motionEnabled() || typeof IntersectionObserver === "undefined") {
        trigger();
        return;
      }

      if (el.getBoundingClientRect().top <= window.innerHeight * 0.94) {
        // Give the split a frame to land before animating it.
        requestAnimationFrame(() => requestAnimationFrame(trigger));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              trigger();
              observer.disconnect();
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
      );
      observer.observe(el);
    });

    return () => {
      disposed = true;
      releaseIntro();
      window.removeEventListener("resize", onResize);
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
    };
  }, [text, delay, stagger, blur]);

  return (
    <Tag ref={ref} data-split="" className={className}>
      {text}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/* DrawIn                                                                     */
/* -------------------------------------------------------------------------- */

type DrawInProps = {
  children: ReactNode;
  className?: string;
  duration?: number;
  stagger?: number;
  delay?: number;
};

/** Draws the SVG it wraps as though it were being drafted. */
export function DrawIn({
  children,
  className,
  duration = 1400,
  stagger = 55,
  delay = 0,
}: DrawInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useInView(ref, () => {
    const el = ref.current;
    if (!el) return;
    if (!motionEnabled()) {
      el.setAttribute("data-drawn", "");
      return;
    }
    drawSvg(el, { duration, stagger, delay });
    el.setAttribute("data-drawn", "");
  });

  return (
    <div ref={ref} data-draw="" className={className}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Parallax                                                                   */
/* -------------------------------------------------------------------------- */

type ParallaxProps = {
  children: ReactNode;
  rate: number;
  className?: string;
};

/**
 * Drifts a layer against the scroll. Ornament only — disabled below 900px and
 * under reduced motion.
 */
export function Parallax({ children, rate, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let top = 0;
    let height = 0;
    let active = false;

    const measure = () => {
      active = isWide() && motionEnabled();
      const scroll = window.scrollY || document.documentElement.scrollTop || 0;
      const rect = el.getBoundingClientRect();
      top = rect.top + scroll;
      height = rect.height;
    };

    measure();

    const unsubscribe = subscribeScroll(() => {
      if (!active) {
        el.style.transform = "translate3d(0,0,0)";
        return;
      }

      const scroll = window.scrollY || document.documentElement.scrollTop || 0;
      const viewport = window.innerHeight || 800;

      if (top > scroll + viewport + 300 || top + height < scroll - 300) return;

      const relative = scroll + viewport / 2 - (top + height / 2);
      el.style.transform = `translate3d(0,${(relative * rate).toFixed(1)}px,0)`;
    });

    let resizeTimer: number | null = null;
    const onResize = () => {
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(measure, 140);
    };
    window.addEventListener("resize", onResize);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", onResize);
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
    };
  }, [rate]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ transform: "translate3d(0,0,0)", willChange: "transform" }}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* CountUp                                                                    */
/* -------------------------------------------------------------------------- */

function format(value: number, suffix: string) {
  const n = Math.round(value);
  return (n >= 1000 ? n.toLocaleString("en-CA") : String(n)) + suffix;
}

/** Counts a statistic up when its band enters view. */
export function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(() => format(to, suffix));
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    // Held at zero until the band arrives; SSR already emitted the real value.
    setDisplay(format(0, suffix));
  }, [suffix]);

  useInView(
    ref,
    () => {
      if (!motionEnabled()) {
        setDisplay(format(to, suffix));
        return;
      }

      const start = performance.now();
      const duration = 1900;

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 4);
        setDisplay(format(to * eased, suffix));
        frameRef.current = t < 1 ? requestAnimationFrame(tick) : null;
      };

      frameRef.current = requestAnimationFrame(tick);
    },
    [to, suffix],
  );

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  return <span ref={ref}>{display}</span>;
}

/* -------------------------------------------------------------------------- */
/* Scroll progress                                                            */
/* -------------------------------------------------------------------------- */

/** Hairline at the top of the viewport tracking read position. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return subscribeScroll(() => {
      const doc = document.documentElement;
      const travel = doc.scrollHeight - window.innerHeight;
      const progress = travel > 0 ? clamp((window.scrollY || 0) / travel) : 0;
      el.style.transform = `scaleX(${progress.toFixed(4)})`;
    });
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={ref} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Route transition                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Settles new page content in after a navigation.
 *
 * React's `<ViewTransition>` is canary-only and this project is on stable
 * React 19.2, so rather than intercepting clicks to drive
 * `document.startViewTransition` — which is fragile against the App Router's
 * async rendering — the incoming container fades up quickly and hands off to
 * the per-element reveals. The header never unmounts, so the mark and nav
 * indicator carry across the navigation untouched.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    // The intro and hero own the first paint.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const el = ref.current;
    if (!el || !motionEnabled()) return;

    el.animate(
      [
        { opacity: 0, transform: "translate3d(0,14px,0)" },
        { opacity: 1, transform: "translate3d(0,0,0)" },
      ],
      { duration: 520, easing: EASE_OUT_EXPO, fill: "both" },
    );
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
}

/* -------------------------------------------------------------------------- */
/* Curtain                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Wipes a dark band open as it enters view, so the tone change between paper
 * and ink sections reads as a deliberate cut rather than a scroll boundary.
 */
export function Curtain({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useInView(ref, () => {
    const el = ref.current;
    if (!el) return;
    if (!motionEnabled()) {
      el.setAttribute("data-open", "");
      return;
    }
    // The vertical wipe only reads on a wide band; narrow screens just fade.
    const frames: Keyframe[] = isWide()
      ? [
          { opacity: 1, clipPath: "inset(45% 0 45% 0)" },
          { opacity: 1, clipPath: "inset(0% 0 0% 0)" },
        ]
      : [{ opacity: 0 }, { opacity: 1 }];

    el.animate(frames, {
      duration: isWide() ? 1250 : 800,
      easing: EASE_OUT_EXPO,
      fill: "both",
    });
    el.setAttribute("data-open", "");
  });

  return (
    <div ref={ref} data-curtain="" className={className}>
      {children}
    </div>
  );
}

export { EASE_OUT_EXPO, EASE_OUT_QUART };
