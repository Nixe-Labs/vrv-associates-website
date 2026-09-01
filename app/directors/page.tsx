import type { Metadata } from "next";

import { Reveal } from "@/components/motion";
import { PageHeader } from "@/components/ui";
import { directorsIntro, kanna, valli } from "@/lib/content";

export const metadata: Metadata = {
  title: "Directors",
  description:
    "Every engagement at VRV Associates is led by a director. Profiles, career history and core areas.",
};

export default function DirectorsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Directors"
        title="Directors."
        intro={directorsIntro}
        introWidth="max-w-[600px]"
      />

      {/* Kanna Manickam --------------------------------------------------- */}
      <section className="pb-[clamp(48px,6vw,88px)]">
        <div className="container-page">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[clamp(32px,5vw,72px)] border-t border-ink pt-[clamp(32px,4vw,52px)]">
            <Reveal>
              <h2 className="t-director">{kanna.name}</h2>
              <p className="mono-label mt-2.5 tracking-[0.14em] text-accent">
                {kanna.role}
              </p>
              <div className="mt-[26px] flex max-w-[520px] flex-col gap-4">
                {kanna.bio.map((paragraph) => (
                  <p key={paragraph} className="t-copy text-body">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal
              index={1}
              className="flex flex-col gap-[clamp(28px,3.5vw,44px)]"
            >
              <div>
                <p className="mono-label text-muted">Career</p>
                <div className="mt-4">
                  {kanna.career.map((entry, i) => (
                    <div
                      key={entry.period + entry.role}
                      className={`grid grid-cols-[104px_minmax(0,1fr)] gap-4 border-t border-rule-soft py-3 ${
                        i === kanna.career.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <span className="mono-caption text-muted">
                        {entry.period}
                      </span>
                      <span className="text-[14px] leading-[1.5]">
                        {entry.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mono-label text-muted">Education</p>
                <div className="mt-4">
                  {kanna.education.map((entry, i) => (
                    <div
                      key={entry.qualification}
                      className={`border-t border-rule-soft py-3.5 ${
                        i === kanna.education.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <p className="text-[14px] leading-[1.4] font-medium">
                        {entry.qualification}
                      </p>
                      <p className="mono-caption mt-[5px] text-muted">
                        {entry.institution}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mono-label text-muted">Core areas</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {kanna.coreAreas.map((area) => (
                    <li
                      key={area}
                      className="border border-rule px-3 py-[7px] font-mono text-[12px] leading-none text-body"
                    >
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Valli Subramaniam ------------------------------------------------ */}
      <section className="pb-[clamp(64px,9vw,120px)]">
        <div className="container-page">
          <Reveal className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[clamp(32px,5vw,72px)] border-t border-ink pt-[clamp(32px,4vw,52px)]">
            <div>
              <h2 className="t-director">{valli.name}</h2>
              <p className="mono-label mt-2.5 tracking-[0.14em] text-accent">
                {valli.role}
              </p>
            </div>
            <div className="flex items-start">
              <p className="mono-note max-w-[520px] border-y border-rule-soft py-[22px] text-muted">
                {valli.bio}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
