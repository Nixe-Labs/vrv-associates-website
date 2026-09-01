import Link from "next/link";

import { HeroBlueprint, SectorIcon } from "@/components/graphics";
import { Lifecycle } from "@/components/lifecycle";
import { SchematicLoop } from "@/components/schematic-loop";
import {
  CountUp,
  Curtain,
  DrawIn,
  Parallax,
  Reveal,
  SplitLines,
} from "@/components/motion";
import { ArrowLink, CtaBand, Eyebrow } from "@/components/ui";
import {
  approach,
  hero,
  kanna,
  sectors,
  serviceRows,
  stats,
  valli,
} from "@/lib/content";

export default function HomePage() {
  return (
    <main>
      {/* Hero ------------------------------------------------------------- */}
      <section className="relative flex min-h-[min(86vh,800px)] flex-col justify-end overflow-hidden bg-ink pt-[clamp(80px,12vh,150px)] pb-[clamp(28px,3.5vw,48px)] text-paper">
        <Parallax
          rate={0.22}
          className="pointer-events-none absolute inset-x-[-2%] top-[-10%] bottom-[-16%] opacity-[0.22]"
        >
          <SchematicLoop>
            <HeroBlueprint />
          </SchematicLoop>
        </Parallax>

        <div className="container-page relative">
          <p
            data-hero-item=""
            style={{ ["--d" as string]: "80ms" }}
            className="mono-eyebrow text-on-dark-muted"
          >
            {hero.eyebrow}
          </p>

          <SplitLines
            as="h1"
            delay={260}
            stagger={95}
            className="t-hero mt-[clamp(24px,3vw,40px)] max-w-[17em]"
          >
            {hero.heading}
          </SplitLines>

          <p
            data-hero-item=""
            style={{ ["--d" as string]: "720ms" }}
            className="t-lead mt-[clamp(24px,3vw,38px)] max-w-[620px] text-on-dark"
          >
            {hero.body}
          </p>

          <div
            data-hero-item=""
            style={{ ["--d" as string]: "880ms" }}
            className="mono-hero-meta mt-[clamp(44px,7vw,92px)] flex flex-wrap gap-x-[clamp(32px,6vw,88px)] gap-y-5 border-t border-rule-dark pt-5 text-on-dark-muted"
          >
            {hero.meta.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats ------------------------------------------------------------ */}
      <section className="section-y-sm border-b border-rule">
        <div className="container-page grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[clamp(28px,4vw,64px)]">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} index={i} variant="blur">
              <p className="t-stat">
                <CountUp to={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mono-stat-note mt-3.5 border-t border-rule pt-3 text-muted">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Sectors ---------------------------------------------------------- */}
      <section className="py-[clamp(64px,8vw,112px)]">
        <div className="container-page">
          <Eyebrow>Sectors</Eyebrow>
          <div className="mt-[clamp(28px,4vw,48px)] grid grid-cols-[repeat(auto-fit,minmax(224px,1fr))] gap-x-[clamp(24px,3vw,48px)]">
            {sectors.map((sector, i) => (
              <Reveal
                key={sector.key}
                index={i}
                className="border-t border-rule pt-[22px] pb-[34px]"
              >
                <DrawIn duration={1100} stagger={70} delay={i * 90}>
                  <SectorIcon sector={sector.key} />
                </DrawIn>
                <h3 className="t-card mt-5">{sector.title}</h3>
                <p className="mt-3 text-[14px] leading-[1.6] text-muted">
                  {sector.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Approach --------------------------------------------------------- */}
      <section className="section-y border-t border-rule">
        <div className="container-page grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-[clamp(32px,5vw,80px)]">
          <SplitLines as="h2" stagger={80} className="t-h2 max-w-[17em]">
            {approach.heading}
          </SplitLines>

          <Reveal index={1} className="flex max-w-[520px] flex-col gap-5">
            {approach.paragraphs.map((paragraph) => (
              <p key={paragraph} className="t-lead text-body">
                {paragraph}
              </p>
            ))}
            <div className="mt-2 flex">
              <ArrowLink href="/about">About the firm</ArrowLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Service index ---------------------------------------------------- */}
      <section className="section-y border-t border-rule">
        <div className="container-page">
          <div className="flex flex-wrap items-baseline justify-between gap-6">
            <Eyebrow>Service areas</Eyebrow>
            <ArrowLink href="/services" variant="quiet">
              All services
            </ArrowLink>
          </div>

          <div className="mt-[clamp(24px,3vw,44px)]">
            {serviceRows.map((row, i) => (
              <Reveal key={row.number} index={i % 4}>
                <Link
                  href="/services"
                  className={`service-row grid grid-cols-[52px_minmax(0,1fr)] items-baseline gap-x-5 gap-y-2 border-t border-rule px-2 py-[22px] ${
                    i === serviceRows.length - 1 ? "border-b" : ""
                  }`}
                >
                  <span className="row-number mono-item font-medium tracking-[0.1em] text-accent">
                    {row.number}
                  </span>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] items-baseline gap-x-[clamp(24px,4vw,64px)] gap-y-2">
                    <h3 className="row-title t-service-row">{row.title}</h3>
                    <p className="text-[14px] leading-[1.6] text-muted">
                      {row.body}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lifecycle — plays once on entry ---------------------------------- */}
      <Lifecycle />

      {/* Directors -------------------------------------------------------- */}
      <section className="section-y border-t border-rule">
        <div className="container-page">
          <div className="flex flex-wrap items-baseline justify-between gap-6">
            <Eyebrow>Directors</Eyebrow>
            <ArrowLink href="/directors" variant="quiet">
              Full profiles
            </ArrowLink>
          </div>

          <div className="mt-[clamp(28px,4vw,48px)] grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[clamp(28px,4vw,64px)]">
            {[
              { name: kanna.name, role: kanna.role, summary: kanna.summary },
              { name: valli.name, role: valli.role, summary: valli.summary },
            ].map((director, i) => (
              <Reveal key={director.name} index={i}>
                <Link
                  href="/directors"
                  className="block border-t border-rule pt-[26px]"
                >
                  <h3 className="t-director-sm">{director.name}</h3>
                  <p className="mono-nav mt-2 tracking-[0.13em] text-accent">
                    {director.role}
                  </p>
                  <p className="mt-4 max-w-[440px] text-[14px] leading-[1.65] text-muted">
                    {director.summary}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Curtain>
        <CtaBand
          heading="Enquiries regarding new and in-flight projects."
          body="Please outline the stage of your project and the decision to be taken. We will respond with an assessment of fit and a proposed scope."
        />
      </Curtain>
    </main>
  );
}
