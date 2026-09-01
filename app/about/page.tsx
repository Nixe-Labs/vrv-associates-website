import type { Metadata } from "next";

import { Curtain, Reveal } from "@/components/motion";
import { Eyebrow, PageHeader } from "@/components/ui";
import { about } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us",
  description: about.paragraphs[0],
};

export default function AboutPage() {
  return (
    <main>
      <PageHeader eyebrow="About Us" title="About VRV Associates." />

      <section className="pb-[clamp(56px,8vw,112px)]">
        <div className="container-page grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[clamp(32px,5vw,80px)] border-t border-ink pt-[clamp(32px,4vw,52px)]">
          <Reveal className="flex max-w-[560px] flex-col gap-[18px]">
            <p className="t-lead-lg">{about.paragraphs[0]}</p>
            {about.paragraphs.slice(1).map((paragraph) => (
              <p key={paragraph} className="t-copy text-body">
                {paragraph}
              </p>
            ))}
          </Reveal>

          <Reveal index={1}>
            <p className="mono-label text-muted">How we work</p>
            <div className="mt-[18px]">
              {about.principles.map((principle, i) => (
                <div
                  key={principle.title}
                  className={`border-t border-rule-soft py-[18px] ${
                    i === about.principles.length - 1 ? "border-b" : ""
                  }`}
                >
                  <h3 className="text-[17px] leading-[1.3] font-medium tracking-[-0.015em]">
                    {principle.title}
                  </h3>
                  <p className="mt-2 max-w-[440px] text-[14px] leading-[1.65] text-muted">
                    {principle.body}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Curtain>
      <section className="section-y-md bg-ink text-paper">
        <div className="container-page">
          <Eyebrow tone="dark">Clients we work with</Eyebrow>
          <div className="mt-[clamp(24px,3vw,44px)] grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-x-[clamp(24px,3vw,48px)]">
            {about.clients.map((client) => (
              <div
                key={client.title}
                className="border-t border-rule-dark pt-5 pb-7"
              >
                <h3 className="t-card">{client.title}</h3>
                <p className="mt-2.5 text-[14px] leading-[1.6] text-on-dark">
                  {client.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </Curtain>
    </main>
  );
}
