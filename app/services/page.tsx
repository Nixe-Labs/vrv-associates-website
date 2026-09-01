import type { Metadata } from "next";

import { Curtain, Reveal } from "@/components/motion";
import { CtaStrip, PageHeader } from "@/components/ui";
import { appointmentNote, serviceStages, servicesIntro } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description: servicesIntro,
};

export default function ServicesPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Services"
        title="Service areas."
        intro={servicesIntro}
      />

      <section className="pb-[clamp(64px,9vw,120px)]">
        <div className="container-page">
          {serviceStages.map((group, groupIndex) => {
            const isLast = groupIndex === serviceStages.length - 1;

            return (
              <Reveal
                key={group.stage}
                index={groupIndex}
                className={`border-t border-ink pt-[clamp(24px,3vw,40px)] ${
                  isLast ? "" : "mb-[clamp(36px,5vw,64px)]"
                }`}
              >
                <p className="mono-stage text-accent">{group.stage}</p>

                <div className="mt-[clamp(20px,2.5vw,32px)] grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[clamp(28px,4vw,64px)]">
                  {group.services.map((service) => (
                    <article key={service.title}>
                      <h2 className="t-h3">{service.title}</h2>
                      <p className="t-copy mt-3.5 max-w-[520px] text-body">
                        {service.body}
                      </p>
                      <ul className="mt-5">
                        {service.points.map((point, i) => (
                          <li
                            key={point}
                            className={`mono-item border-t border-rule-soft py-[11px] text-muted ${
                              i === service.points.length - 1 ? "border-b" : ""
                            }`}
                          >
                            {point}
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}

                  {/* Appointment note sits beside the final service */}
                  {isLast ? (
                    <div className="self-end">
                      <p className="mono-note max-w-[400px] border-y border-rule-soft py-[22px] text-muted">
                        {appointmentNote}
                      </p>
                    </div>
                  ) : null}
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <Curtain>
        <CtaStrip heading="For assistance identifying the appropriate scope, please describe the decision currently in front of you." />
      </Curtain>
    </main>
  );
}
