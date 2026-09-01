import Link from "next/link";

import { footerNav, site } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="bg-ink pt-[clamp(48px,6vw,84px)] pb-7 text-paper">
      <div className="container-page">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-[clamp(28px,4vw,64px)]">
          <div>
            <div className="flex items-baseline gap-[9px]">
              <span className="text-[18px] leading-none font-semibold tracking-[-0.015em]">
                VRV
              </span>
              <span className="mono-fine text-on-dark-muted tracking-[0.2em]">
                Associates
              </span>
            </div>
            <p className="mt-4 max-w-[290px] text-[13px] leading-[1.6] text-on-dark">
              {site.description}
            </p>
          </div>

          <div>
            <p className="mono-fine text-on-dark-muted">Pages</p>
            <nav className="mt-4 flex flex-col gap-2.5 text-[13px] leading-[1.4]">
              {footerNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="mono-fine text-on-dark-muted">Contact</p>
            <div className="mt-4 flex flex-col gap-2.5 text-[13px] leading-[1.5]">
              <a
                href={`mailto:${site.email}`}
                className="[overflow-wrap:anywhere] transition-colors hover:text-accent"
              >
                {site.email}
              </a>
              <span className="text-on-dark">
                {site.location}, {site.region.replace(", Canada", "")}
              </span>
            </div>
          </div>
        </div>

        <div className="mono-legal mt-[clamp(36px,5vw,64px)] flex flex-wrap justify-between gap-5 border-t border-rule-dark pt-[18px] text-on-dark-muted">
          <span>© {new Date().getFullYear()} VRV Associates</span>
          <span>Ontario, Canada</span>
        </div>
      </div>
    </footer>
  );
}
