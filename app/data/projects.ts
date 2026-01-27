export type Project = {
  slug: string;
  categoryKey?: string;
  titleKey: string;
  shortKey: string;

  cover?: {
    src: string;
    altKey: string;
  };

  gallery?: Array<{
    src: string;
    altKey: string;
  }>;

  links?: {
    demo?: string;
    repo?: string;
    docs?: string;
  };

  facts?: Array<{ labelKey: string; valueKey: string }>;

  tags: string[];
  stack: string[];
  highlightsKeys: string[];

  sections: Array<{
    titleKey: string;
    paragraphsKeys?: string[];
    bulletsKeys?: string[];
    noteKey?: string;

    image?: { src: string; altKey: string };
    calloutKey?: string;
  }>;
};

export const projects: Project[] = [
  /* ======================= DMA ======================= */
  {
    slug: "dma",
    categoryKey: "projects.categories.b2b",
    titleKey: "projects.dma.title",
    shortKey: "projects.dma.short",

    cover: {
      src: "/projects/dma/cover.png",
      altKey: "projects.dma.media.coverAlt",
    },

    gallery: [
      {
        src: "/projects/dma/dashboard.png",
        altKey: "projects.dma.media.gallery.0",
      },
      {
        src: "/projects/dma/payments.png",
        altKey: "projects.dma.media.gallery.1",
      },
      {
        src: "/projects/dma/reports.png",
        altKey: "projects.dma.media.gallery.2",
      },
    ],

    links: {
      demo: "https://dma-demo.example.com",
      repo: "https://github.com/rodrigoVilla11/dma",
    },

    facts: [
      {
        labelKey: "projectDetail.facts.role",
        valueKey: "projects.dma.facts.role",
      },
      {
        labelKey: "projectDetail.facts.period",
        valueKey: "projects.dma.facts.period",
      },
      {
        labelKey: "projectDetail.facts.status",
        valueKey: "projects.dma.facts.status",
      },
    ],

    tags: ["ERP", "B2B", "Payments", "Dashboards"],
    stack: ["Next.js", "NestJS", "MongoDB", "RTK Query", "TypeScript"],

    highlightsKeys: [
      "projects.dma.highlights.0",
      "projects.dma.highlights.1",
      "projects.dma.highlights.2",
    ],

    sections: [
      {
        titleKey: "projects.dma.sections.context.title",
        calloutKey: "projects.dma.sections.context.callout",
        paragraphsKeys: [
          "projects.dma.sections.context.p.0",
          "projects.dma.sections.context.p.1",
        ],
        image: {
          src: "/projects/dma/context.png",
          altKey: "projects.dma.media.contextAlt",
        },
      },
      {
        titleKey: "projects.dma.sections.built.title",
        bulletsKeys: [
          "projects.dma.sections.built.b.0",
          "projects.dma.sections.built.b.1",
          "projects.dma.sections.built.b.2",
        ],
        noteKey: "projects.dma.sections.built.note",
        image: {
          src: "/projects/dma/architecture.png",
          altKey: "projects.dma.media.architectureAlt",
        },
      },
    ],
  },

  /* ======================= NOVA ======================= */
  {
    slug: "nova-sushi",
    categoryKey: "projects.categories.gastro",
    titleKey: "projects.nova.title",
    shortKey: "projects.nova.short",

    cover: {
      src: "/projects/nova/cover.png",
      altKey: "projects.nova.media.coverAlt",
    },

    gallery: [
      {
        src: "/projects/nova/menu.png",
        altKey: "projects.nova.media.gallery.0",
      },
      {
        src: "/projects/nova/costs.png",
        altKey: "projects.nova.media.gallery.1",
      },
      {
        src: "/projects/nova/operations.png",
        altKey: "projects.nova.media.gallery.2",
      },
    ],

    links: {
      demo: "https://nova-sushi.example.com",
    },

    facts: [
      {
        labelKey: "projectDetail.facts.role",
        valueKey: "projects.nova.facts.role",
      },
      {
        labelKey: "projectDetail.facts.period",
        valueKey: "projects.nova.facts.period",
      },
      {
        labelKey: "projectDetail.facts.status",
        valueKey: "projects.nova.facts.status",
      },
    ],

    tags: ["Gastronomía", "Inventario", "Costos", "Operaciones"],
    stack: ["Next.js", "Node.js", "MongoDB", "TypeScript"],

    highlightsKeys: [
      "projects.nova.highlights.0",
      "projects.nova.highlights.1",
      "projects.nova.highlights.2",
    ],

    sections: [
      {
        titleKey: "projects.nova.sections.problem.title",
        calloutKey: "projects.nova.sections.problem.callout",
        paragraphsKeys: [
          "projects.nova.sections.problem.p.0",
          "projects.nova.sections.problem.p.1",
        ],
        image: {
          src: "/projects/nova/problem.png",
          altKey: "projects.nova.media.problemAlt",
        },
      },
      {
        titleKey: "projects.nova.sections.solution.title",
        bulletsKeys: [
          "projects.nova.sections.solution.b.0",
          "projects.nova.sections.solution.b.1",
          "projects.nova.sections.solution.b.2",
        ],
        image: {
          src: "/projects/nova/solution.png",
          altKey: "projects.nova.media.solutionAlt",
        },
      },
    ],
  },
];
