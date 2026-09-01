import type { Metadata } from "next";

import { Reveal } from "@/components/motion";
import { Eyebrow, PageHeader } from "@/components/ui";
import { capabilities, experienceIntro, projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Experience",
  description: experienceIntro,
};

export default function ExperiencePage() {
  return (
    <main>
      <PageHeader
        eyebrow="Our Experience"
        title="Project experience."
        intro={experienceIntro}
        introWidth="max-w-[660px]"
      />

      <section className="pb-[clamp(56px,7vw,96px)]">
        <div className="container-page">
          {projects.map((project, i) => (
            <Reveal
              key={project.title}
              index={i}
              as="article"
              className={`grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-x-[clamp(32px,5vw,72px)] gap-y-4 border-t border-rule py-[clamp(26px,3vw,40px)] ${
                i === projects.length - 1 ? "border-b" : ""
              }`}
            >
              <div>
                <p className="mono-meta text-accent">{project.meta}</p>
                <h2 className="t-h3 mt-3">{project.title}</h2>
                <p className="mono-item mt-2.5 text-muted">{project.detail}</p>
              </div>
              <p className="t-copy max-w-[560px] text-body">{project.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-y-md border-t border-rule">
        <div className="container-page">
          <Eyebrow>Capability areas</Eyebrow>
          <div className="mt-[clamp(24px,3vw,40px)] grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-[clamp(24px,3vw,48px)]">
            {capabilities.map((capability) => (
              <div
                key={capability.title}
                className="border-t border-rule pt-5 pb-[30px]"
              >
                <h3 className="text-[17px] leading-[1.25] font-medium tracking-[-0.015em]">
                  {capability.title}
                </h3>
                <p className="mono-item mt-2.5 leading-[1.6] text-muted">
                  {capability.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
