import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { PageHeader } from "@/components/ui";
import { enquiryTypes, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Enquiries regarding new and in-flight energy projects — feasibility scoping, owner-side representation, interconnection strategy and independent review.",
};

export default function ContactPage() {
  return (
    <main>
      <header className="pt-[clamp(64px,9vw,128px)] pb-[clamp(36px,5vw,56px)]">
        <div className="container-page">
          <p className="mono-eyebrow text-muted">Contact Us</p>
          <h1 className="t-page mt-[clamp(20px,2.5vw,34px)] max-w-[14em]">
            Contact VRV Associates.
          </h1>
        </div>
      </header>

      <section className="pb-[clamp(64px,9vw,120px)]">
        <div className="container-page grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] gap-[clamp(32px,5vw,80px)] border-t border-ink pt-[clamp(32px,4vw,52px)]">
          {/* Details */}
          <div className="flex flex-col gap-[clamp(26px,3vw,38px)]">
            <div>
              <p className="mono-label text-muted">Email</p>
              <a
                href={`mailto:${site.email}`}
                className="t-contact-link mt-2.5 inline-block border-b border-rule pb-1 [overflow-wrap:anywhere] transition-colors hover:text-accent"
              >
                {site.email}
              </a>
            </div>

            <div>
              <p className="mono-label text-muted">Office</p>
              <p className="t-copy mt-2.5 leading-[1.6]">
                {site.location}
                <br />
                {site.region}
              </p>
            </div>

            <div>
              <p className="mono-label text-muted">
                Enquiries most readily assisted
              </p>
              <ul className="mt-3.5">
                {enquiryTypes.map((type, i) => (
                  <li
                    key={type}
                    className={`mono-item border-t border-rule-soft py-[11px] text-muted ${
                      i === enquiryTypes.length - 1 ? "border-b" : ""
                    }`}
                  >
                    {type}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </main>
  );
}
