/**
 * Static content for the VRV Associates site.
 *
 * Everything the pages render lives here so copy can be revised without
 * touching layout. When a CMS or backend is introduced later, this module is
 * the seam to replace.
 */

export const site = {
  name: "VRV Associates",
  tagline: "Project management & engineering consultancy",
  email: "vrvassociatesinc@gmail.com",
  location: "Greater Toronto Area",
  region: "Ontario, Canada",
  description:
    "Project management and engineering consultancy — thermal and renewable power, power transmission, energy storage.",
} as const;

export type NavItem = { label: string; href: string };

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Our Experience", href: "/experience" },
  { label: "Directors", href: "/directors" },
  { label: "About Us", href: "/about" },
];

export const footerNav: NavItem[] = [
  ...nav,
  { label: "Contact Us", href: "/contact" },
];

/* -------------------------------------------------------------------------- */
/* Home                                                                       */
/* -------------------------------------------------------------------------- */

export const hero = {
  eyebrow: "VRV Associates — Project management & engineering consultancy",
  heading:
    "Engineering and project management for power and energy infrastructure.",
  body: "VRV Associates is a project management and engineering consultancy specializing in thermal and renewable power, power transmission, and energy storage. The firm advises utilities, project developers and industrial clients from feasibility through commissioning.",
  meta: [
    "Greater Toronto Area — Ontario, Canada",
    "Thermal · Renewable · Transmission · Storage",
    "Owner-side advisory",
  ],
} as const;

export type Stat = { value: number; suffix?: string; label: string };

export const stats: Stat[] = [
  {
    value: 15,
    suffix: "+",
    label: "Years of directors' project experience in the energy sector",
  },
  {
    value: 1000,
    label: "Megawatts — largest generating station project delivered",
  },
  {
    value: 4,
    label: "Sectors served — thermal, renewable, transmission and storage",
  },
];

export type SectorKey = "thermal" | "renewable" | "transmission" | "storage";

export type Sector = { key: SectorKey; title: string; body: string };

export const sectors: Sector[] = [
  {
    key: "thermal",
    title: "Thermal Power",
    body: "Combined-cycle and simple-cycle generation, from development studies through construction and commissioning.",
  },
  {
    key: "renewable",
    title: "Renewable Power",
    body: "Hydroelectric and utility-scale solar, from early assessment through grid connection and handover.",
  },
  {
    key: "transmission",
    title: "Power Transmission",
    body: "Lines, substations and generator interconnections, including the studies required to secure them.",
  },
  {
    key: "storage",
    title: "Energy Storage",
    body: "Battery and hydroelectric storage, sited, sized and integrated with the network.",
  },
];

export const approach = {
  heading:
    "VRV Associates operates as an extension of the owner's project team.",
  paragraphs: [
    "The decisions that determine the cost and schedule of an energy project are taken during feasibility, planning and interface management — the stages at which owner organisations are most often short of specialist capacity.",
    "The firm is engaged at that stage to define options, test them technically and commercially, record the associated risks, and remain in place through execution so that the plan is maintained through construction.",
  ],
} as const;

/** Numbered service index shown on the home page. */
export type ServiceRow = { number: string; title: string; body: string };

export const serviceRows: ServiceRow[] = [
  {
    number: "01",
    title: "Feasibility studies",
    body: "Technology and site screening supported by preliminary design, cost ranges and a documented recommendation.",
  },
  {
    number: "02",
    title: "Grid interconnection studies",
    body: "Connection strategy, study management and coordination with transmission and distribution operators.",
  },
  {
    number: "03",
    title: "Project planning & scheduling",
    body: "Scope definition, schedule development and the reporting structure required to measure progress.",
  },
  {
    number: "04",
    title: "Cost estimating & capital budgeting",
    body: "Capital estimates, economic evaluation and budget structures aligned to the approval process.",
  },
  {
    number: "05",
    title: "Risk management",
    body: "Risk registers developed with the parties who carry the exposure, quantified and reviewed on a fixed cycle.",
  },
  {
    number: "06",
    title: "Procurement & contract support",
    body: "Tender packages, bid evaluation and contract administration on the owner's behalf.",
  },
  {
    number: "07",
    title: "Construction management & commissioning",
    body: "Field engineering, construction oversight and commissioning through to turnover.",
  },
  {
    number: "08",
    title: "Technical advisory",
    body: "Independent engineering opinion for owners, lenders and boards, including technical due diligence.",
  },
];

export const lifecycleStages = [
  { stage: "Stage 01", label: "Feasibility & interconnection" },
  { stage: "Stage 02", label: "Planning, cost & risk" },
  { stage: "Stage 03", label: "Procurement & contracts" },
  { stage: "Stage 04", label: "Construction & commissioning" },
] as const;

/* -------------------------------------------------------------------------- */
/* Services                                                                   */
/* -------------------------------------------------------------------------- */

export type ServiceDetail = { title: string; body: string; points: string[] };

export type ServiceStage = { stage: string; services: ServiceDetail[] };

export const servicesIntro =
  "Engagements are scoped around the decision the owner is required to make. The eight service areas below are grouped by project stage and may be appointed individually or maintained continuously across a project.";

export const serviceStages: ServiceStage[] = [
  {
    stage: "Stage 01 — Development",
    services: [
      {
        title: "Feasibility studies",
        body: "Early-stage assessment of whether a project can be built, connected and financed. Technology and site options are screened against common criteria so that the resulting comparison is defensible at approval.",
        points: [
          "Technology and site screening",
          "Preliminary design and major equipment selection",
          "Capital cost ranges and economic evaluation",
          "Documented recommendation to proceed or stop",
        ],
      },
      {
        title: "Grid interconnection studies",
        body: "Connection is the most common cause of delay for generation and storage projects. VRV Associates manages the study sequence and the interface with transmission and distribution operators.",
        points: [
          "Connection strategy and point-of-interconnection options",
          "Study management and application support",
          "Substation and transmission interface scope",
          "SCADA, protection and control coordination",
        ],
      },
    ],
  },
  {
    stage: "Stage 02 — Planning & controls",
    services: [
      {
        title: "Project planning & scheduling",
        body: "Conversion of an approved concept into a plan that can be executed and measured, with a reporting structure that identifies drift early rather than at year end.",
        points: [
          "Scope development and scopes of work",
          "Schedule development and milestone structure",
          "Progress reporting and change control",
          "Interface and stakeholder management",
        ],
      },
      {
        title: "Cost estimating & capital budgeting",
        body: "Capital estimates prepared to a stated class and basis, structured to match the client's approval and funding process.",
        points: [
          "Capital cost estimates and basis of estimate",
          "Economic evaluation and sensitivity analysis",
          "Budget structure and cash flow profile",
          "Contingency basis and drawdown tracking",
        ],
      },
      {
        title: "Risk management",
        body: "Risk registers are developed with the parties who carry the exposure, quantified where material, and reviewed on a fixed cycle rather than at handover.",
        points: [
          "Risk identification workshops",
          "Register development and ownership assignment",
          "Cost and schedule contingency basis",
          "Mitigation tracking through execution",
        ],
      },
    ],
  },
  {
    stage: "Stage 03 — Execution",
    services: [
      {
        title: "Procurement & contract support",
        body: "Preparation and administration of the commercial package, undertaken on the owner's side of the table.",
        points: [
          "Tender packages and technical specifications",
          "Bid evaluation and recommendation",
          "Contract administration and change orders",
          "Vendor and long-lead equipment tracking",
        ],
      },
      {
        title: "Construction management & commissioning",
        body: "Site-based oversight from mobilisation through commissioning and turnover, holding contractors to the scope that was procured.",
        points: [
          "Construction oversight and field engineering",
          "Quality, inspection and site instruction records",
          "Commissioning planning and execution",
          "Turnover, documentation and close-out",
        ],
      },
    ],
  },
  {
    stage: "Across all stages",
    services: [
      {
        title: "Technical advisory",
        body: "Independent engineering opinion for owners, lenders and boards, whether at investment decision or on a project already in motion.",
        points: [
          "Design and drawing review",
          "Equipment selection and specification support",
          "Technical due diligence",
          "Independent review of cost and schedule",
        ],
      },
    ],
  },
];

export const appointmentNote =
  "Appointments are made either as a defined study with fixed deliverables, or as ongoing owner-side representation for the duration of a project.";

/* -------------------------------------------------------------------------- */
/* Experience                                                                 */
/* -------------------------------------------------------------------------- */

export type Project = {
  meta: string;
  title: string;
  detail: string;
  body: string;
};

export const experienceIntro =
  "The record below sets out the project experience the directors of VRV Associates bring to client engagements, accumulated in roles with owners, developers and engineering consultancies in Canada and abroad.";

export const projects: Project[] = [
  {
    meta: "Thermal power · 2017—2019",
    title: "Napanee Generating Station",
    detail: "1,000 MW combined-cycle plant — Napanee, Ontario",
    body: "Project Engineer (Implementation) for the owner and general contractor during construction of the combined-cycle power plant.",
  },
  {
    meta: "Renewable · storage · transmission — 2019—2021",
    title: "Hydroelectric storage, solar and interconnection portfolio",
    detail: "Ontario, Canada",
    body: "Project Manager leading development of hydroelectric storage facilities, generator transmission interconnections and solar projects, with supporting business development work.",
  },
  {
    meta: "Development portfolio · 2014—2017",
    title: "Thermal, renewable and interconnection development",
    detail: "Energy development team — Greater Toronto Area",
    body: "Preliminary design and selection of major equipment for power projects, together with capital estimates, proposals, project schedules, contracts, economic evaluation and risk management.",
  },
  {
    meta: "Construction & commissioning · 2013—2014",
    title: "Twin turbine gas compressor station",
    detail: "High-pressure gas compression facility",
    body: "Field Engineer responsible for construction and commissioning of two turbine-driven compressors, high-pressure gas piping and supporting auxiliary systems.",
  },
  {
    meta: "Control systems · 2010—2012",
    title: "SCADA systems",
    detail: "Pipeline and facility control — Calgary, Alberta",
    body: "SCADA engineering and specialist support across supervisory control and data acquisition systems.",
  },
  {
    meta: "Power systems · 2024—2025",
    title: "Transmission & distribution practice",
    detail: "Consultancy practice — Toronto, Ontario",
    body: "T&D Manager for a power systems consulting business, accountable for delivery and growth of the transmission and distribution practice.",
  },
];

export const capabilities = [
  {
    title: "Generation",
    body: "Combined-cycle thermal · hydroelectric · utility-scale solar",
  },
  {
    title: "Networks",
    body: "Transmission · distribution · generator interconnection · substations",
  },
  {
    title: "Storage",
    body: "Hydroelectric storage · battery energy storage",
  },
  {
    title: "Systems",
    body: "SCADA · protection & control · instrumentation · commissioning",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Directors                                                                  */
/* -------------------------------------------------------------------------- */

export type CareerEntry = { period: string; role: string };
export type EducationEntry = { qualification: string; institution: string };

export const directorsIntro =
  "Every engagement is led by a director. Photographs to be supplied.";

export const kanna = {
  name: "Kanna Manickam, P.Eng.",
  role: "Director",
  summary:
    "Over 15 years of progressive experience delivering projects in renewable, transmission, energy storage and thermal power. Currently Senior Project Manager at Bluelime Technical Services.",
  bio: [
    "Engineering and project management professional with over 15 years of progressive experience delivering projects in renewable (hydroelectric and solar), transmission, energy storage, and thermal power sectors.",
    "Currently Senior Project Manager at Bluelime Technical Services. Prior roles include T&D Manager, Power Systems Business at BBA Consultants; Project Manager at Burns & McDonnell; and nearly a decade at TC Energy, formerly TransCanada, progressing from Junior SCADA Specialist through SCADA Engineer, Field Engineer, and Project Engineer (Development and Implementation) to Project Manager — including work on the 1,000 MW Napanee Generating Station combined-cycle power plant. He began his career as a Project Coordinator at Siemens in Singapore.",
  ],
  career: [
    { period: "2025—", role: "Senior Project Manager · Bluelime Technical Services" },
    { period: "2024—2025", role: "T&D Manager, Power Systems Business · BBA Consultants" },
    { period: "2021—2024", role: "Project Manager · Burns & McDonnell" },
    { period: "2019—2021", role: "Project Manager · TC Energy" },
    { period: "2017—2019", role: "Project Engineer, Implementation · TC Energy" },
    { period: "2014—2017", role: "Project Engineer, Development · TC Energy" },
    { period: "2013—2014", role: "Field Engineer · TC Energy" },
    { period: "2012", role: "SCADA Engineer · TC Energy" },
    { period: "2010—2011", role: "Junior SCADA Specialist · TransCanada" },
    { period: "2007", role: "Project Coordinator · Siemens, Singapore" },
  ] satisfies CareerEntry[],
  education: [
    {
      qualification: "Certificate, Financial Analysis and Investment Management",
      institution: "University of Toronto",
    },
    {
      qualification: "BSc, Electrical Engineering",
      institution: "University of Calgary",
    },
  ] satisfies EducationEntry[],
  coreAreas: [
    "Power Distribution",
    "Transmission",
    "SCADA",
    "Project Engineering",
    "Renewable Energy",
    "Solar PV",
    "Energy Storage",
    "Project Management",
    "Business Development",
    "Engineering Design",
  ],
} as const;

export const valli = {
  name: "Valli Subramaniam",
  role: "Director",
  summary: "Profile to follow.",
  bio: "Biography to be added.",
} as const;

/* -------------------------------------------------------------------------- */
/* About                                                                      */
/* -------------------------------------------------------------------------- */

export const about = {
  paragraphs: [
    "VRV Associates is a project management and engineering consultancy specializing in thermal and renewable power, power transmission, and energy storage.",
    "The firm focuses on feasibility studies, project planning, risk management, and technical advisory across the energy sector — the stages at which an owner's decisions are least reversible and most consequential to cost and schedule.",
    "VRV Associates is based in the Greater Toronto Area and works with utilities, project developers and industrial clients.",
  ],
  principles: [
    {
      title: "Owner-side by default",
      body: "The firm does not supply equipment or construction services. Advice carries no third-party commercial interest.",
    },
    {
      title: "Studies that close decisions",
      body: "Each study is framed around the decision it exists to support, and concludes with a documented recommendation.",
    },
    {
      title: "Assumptions and risk recorded",
      body: "Assumptions, exclusions and exposures are documented and assigned, so that contingency has a defensible basis.",
    },
    {
      title: "Director-led engagements",
      body: "A director leads every appointment and remains the client's point of accountability throughout.",
    },
  ],
  clients: [
    {
      title: "Utilities",
      body: "Transmission and distribution owners planning network reinforcement and interconnection work.",
    },
    {
      title: "Project developers",
      body: "Renewable and storage developers requiring owner-side engineering and project management capacity.",
    },
    {
      title: "Industrial clients",
      body: "Large energy users assessing on-site generation, storage or connection options.",
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Contact                                                                    */
/* -------------------------------------------------------------------------- */

export const enquiryTypes = [
  "Feasibility or option study scoping",
  "Owner-side representation on a project in execution",
  "Interconnection strategy and study management",
  "Independent review of cost, schedule or design",
] as const;

export const projectStages = [
  "Concept or feasibility",
  "Development",
  "Procurement",
  "Construction or commissioning",
  "Not yet determined",
] as const;
