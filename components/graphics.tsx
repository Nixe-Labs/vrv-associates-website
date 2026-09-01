import type { SectorKey } from "@/lib/content";

/**
 * Blueprint line-work behind the home hero. Decorative — the parallax wrapper
 * marks it aria-hidden.
 */
export function HeroBlueprint() {
  return (
    <svg
      viewBox="0 0 1440 640"
      preserveAspectRatio="xMidYMid slice"
      className="block h-full w-full"
      fill="none"
      stroke="#F5F4F1"
      strokeWidth="1.2"
    >
      <path d="M0 168h1440M0 486h1440" />
      <path d="M212 168v96M556 168v72M900 168v96M1244 168v72" />
      <path d="M212 380v106M556 330v156M900 380v106M1244 330v156" />

      {/* Turbine */}
      <circle cx="212" cy="322" r="58" />
      <path d="M172 322c13-26 27-26 40 0s27 26 40 0" />

      {/* Interconnection */}
      <circle cx="556" cy="266" r="30" />
      <circle cx="556" cy="302" r="30" />

      {/* Solar array */}
      <g strokeWidth="1">
        <rect x="836" y="336" width="40" height="26" />
        <rect x="880" y="336" width="40" height="26" />
        <rect x="924" y="336" width="40" height="26" />
        <rect x="836" y="366" width="40" height="26" />
        <rect x="880" y="366" width="40" height="26" />
        <rect x="924" y="366" width="40" height="26" />
      </g>

      {/* Battery stack */}
      <g strokeWidth="1">
        <rect x="1206" y="332" width="76" height="20" />
        <rect x="1206" y="358" width="76" height="20" />
        <rect x="1206" y="384" width="76" height="20" />
      </g>

      {/* Nodes */}
      <g fill="#F5F4F1" stroke="none">
        <circle cx="212" cy="168" r="5" />
        <circle cx="556" cy="168" r="5" />
        <circle cx="900" cy="168" r="5" />
        <circle cx="1244" cy="168" r="5" />
        <circle cx="212" cy="486" r="5" />
        <circle cx="556" cy="486" r="5" />
        <circle cx="900" cy="486" r="5" />
        <circle cx="1244" cy="486" r="5" />
      </g>

      <path strokeWidth="0.6" d="M0 96h1440M0 560h1440" opacity="0.5" />
    </svg>
  );
}

const sectorPaths: Record<SectorKey, React.ReactNode> = {
  thermal: (
    <>
      <circle cx="26" cy="28" r="17" />
      <path d="M14 28c4-9 8-9 12 0s8 9 12 0" />
      <path d="M43 28h20v-12h26M63 28v12h26" />
      <circle cx="63" cy="28" r="2.4" fill="currentColor" stroke="none" />
    </>
  ),
  renewable: (
    <>
      <rect x="8" y="14" width="17" height="12" />
      <rect x="27" y="14" width="17" height="12" />
      <rect x="8" y="28" width="17" height="12" />
      <rect x="27" y="28" width="17" height="12" />
      <path d="M26 40v8M14 48h24" />
      <path d="M46 27h18v-9h24M64 27v9h24" />
    </>
  ),
  transmission: (
    <>
      <path d="M20 48V12l-9 8M20 12l9 8M12 30h16M76 48V12l-9 8M76 12l9 8M68 30h16" />
      <path d="M20 16c14 14 42 14 56 0" />
      <path d="M20 24c14 12 42 12 56 0" />
    </>
  ),
  storage: (
    <>
      <rect x="10" y="12" width="34" height="10" />
      <rect x="10" y="24" width="34" height="10" />
      <rect x="10" y="36" width="34" height="10" />
      <path d="M46 29h14v-10h26M60 29v10h26" />
      <path d="M17 6v6M37 6v6" />
    </>
  ),
};

/** Schematic mark for each sector card. */
export function SectorIcon({ sector }: { sector: SectorKey }) {
  return (
    <svg
      viewBox="0 0 96 56"
      className="block h-14 w-24 text-ink"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      aria-hidden="true"
    >
      {sectorPaths[sector]}
    </svg>
  );
}

/** Milestone rail illustrating the four project stages. */
export function LifecycleDiagram() {
  return (
    <svg
      viewBox="0 0 1200 190"
      preserveAspectRatio="xMidYMid meet"
      className="block h-auto w-full text-ink"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      aria-hidden="true"
    >
      <path d="M40 96h1120" />
      <g strokeWidth="0.7" opacity="0.55">
        <path d="M40 60v72M320 60v72M600 60v72M880 60v72M1160 60v72" />
      </g>
      <g fill="currentColor" stroke="none">
        <circle cx="40" cy="96" r="5" />
        <circle cx="320" cy="96" r="5" />
        <circle cx="600" cy="96" r="5" />
        <circle cx="880" cy="96" r="5" />
        <circle cx="1160" cy="96" r="5" />
      </g>
      <path
        d="M40 96q140-62 280 0M320 96q140 62 280 0M600 96q140-62 280 0M880 96q140 62 280 0"
        strokeWidth="0.8"
        opacity="0.55"
      />
      <g strokeWidth="1" opacity="0.9">
        <rect x="150" y="26" width="60" height="22" />
        <rect x="430" y="144" width="60" height="22" />
        <rect x="710" y="26" width="60" height="22" />
        <rect x="990" y="144" width="60" height="22" />
      </g>
    </svg>
  );
}
