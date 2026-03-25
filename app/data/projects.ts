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
      src: "https://res.cloudinary.com/db7kbwl5n/image/upload/v1774466166/Group_120_llzivh.png",
      altKey: "projects.dma.media.coverAlt",
    },

    gallery: [
      {
        src: "https://res.cloudinary.com/db7kbwl5n/image/upload/v1774468131/image_3_wk4fgr.png",
        altKey: "projects.dma.media.gallery.0",
      },
      {
        src: "https://res.cloudinary.com/db7kbwl5n/image/upload/v1774468226/image_4_f0ysho.png",
        altKey: "projects.dma.media.gallery.1",
      },
      {
        src: "https://res.cloudinary.com/db7kbwl5n/image/upload/v1774468387/Group_121_l7rrti.png",
        altKey: "projects.dma.media.gallery.2",
      },
    ],

    links: {
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

    tags: ["B2B", "Payment Engine", "Multi-tenant", "RTK Query"],
    stack: ["Next.js 15", "NestJS", "MongoDB", "RTK Query", "TypeScript"],

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
          src: "https://res.cloudinary.com/db7kbwl5n/image/upload/v1774468585/Group_122_evd0ql.png",
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
          src: "https://res.cloudinary.com/db7kbwl5n/image/upload/v1774468635/image_7_whdd7k.png",
          altKey: "projects.dma.media.architectureAlt",
        },
      },
    ],
  },

  /* ======================= GOURMETIFY ======================= */
  {
    slug: "gourmetify",
    categoryKey: "projects.categories.saas",
    titleKey: "projects.gourmetify.title",
    shortKey: "projects.gourmetify.short",

    cover: {
      src: "https://res.cloudinary.com/db7kbwl5n/image/upload/v1774469544/image_8_j9rfhf.png",
      altKey: "projects.gourmetify.media.coverAlt",
    },

    gallery: [
      {
        src: "https://res.cloudinary.com/db7kbwl5n/image/upload/v1774469721/image_9_yevnoo.png",
        altKey: "projects.gourmetify.media.gallery.0",
      },
      {
        src: "https://res.cloudinary.com/db7kbwl5n/image/upload/v1774469817/image_10_yzrzox.png",
        altKey: "projects.gourmetify.media.gallery.1",
      },
      {
        src: "https://res.cloudinary.com/db7kbwl5n/image/upload/v1774469916/image_11_cq7v89.png",
        altKey: "projects.gourmetify.media.gallery.2",
      },
      {
        src: "https://res.cloudinary.com/db7kbwl5n/image/upload/v1774471721/image_12_ld7jhe.png",
        altKey: "projects.gourmetify.media.gallery.3",
      },
      {
        src: "https://res.cloudinary.com/db7kbwl5n/image/upload/v1774471796/image_13_vjtl7j.png",
        altKey: "projects.gourmetify.media.gallery.4",
      },
    ],

    links: {},

    facts: [
      {
        labelKey: "projectDetail.facts.role",
        valueKey: "projects.gourmetify.facts.role",
      },
      {
        labelKey: "projectDetail.facts.period",
        valueKey: "projects.gourmetify.facts.period",
      },
      {
        labelKey: "projectDetail.facts.status",
        valueKey: "projects.gourmetify.facts.status",
      },
    ],

    tags: ["SaaS", "Offline-First", "MercadoPago", "Multi-tenant"],
    stack: ["Next.js 16", "TypeScript", "Prisma", "PostgreSQL", "MercadoPago"],

    highlightsKeys: [
      "projects.gourmetify.highlights.0",
      "projects.gourmetify.highlights.1",
      "projects.gourmetify.highlights.2",
    ],

    sections: [
      {
        titleKey: "projects.gourmetify.sections.problem.title",
        calloutKey: "projects.gourmetify.sections.problem.callout",
        paragraphsKeys: [
          "projects.gourmetify.sections.problem.p.0",
          "projects.gourmetify.sections.problem.p.1",
        ],
        image: {
          src: "https://res.cloudinary.com/db7kbwl5n/image/upload/v1774471915/image_14_yvrnjr.png",
          altKey: "projects.gourmetify.media.problemAlt",
        },
      },
      {
        titleKey: "projects.gourmetify.sections.built.title",
        bulletsKeys: [
          "projects.gourmetify.sections.built.b.0",
          "projects.gourmetify.sections.built.b.1",
          "projects.gourmetify.sections.built.b.2",
        ],
        noteKey: "projects.gourmetify.sections.built.note",
        image: {
          src: "https://res.cloudinary.com/db7kbwl5n/image/upload/v1774471721/image_12_ld7jhe.png",
          altKey: "projects.gourmetify.media.solutionAlt",
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
      src: "https://res.cloudinary.com/db7kbwl5n/image/upload/v1774472032/image_15_tw8dwj.png",
      altKey: "projects.nova.media.coverAlt",
    },

    gallery: [
      {
        src: "https://res.cloudinary.com/db7kbwl5n/image/upload/v1774472114/image_16_ezdjx2.png",
        altKey: "projects.nova.media.gallery.0",
      },
      {
        src: "https://res.cloudinary.com/db7kbwl5n/image/upload/v1774472167/image_17_pndfqt.png",
        altKey: "projects.nova.media.gallery.1",
      },
      {
        src: "https://res.cloudinary.com/db7kbwl5n/image/upload/v1774472247/image_18_kccctc.png",
        altKey: "projects.nova.media.gallery.2",
      },
    ],

    links: {},

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

    tags: ["Marketing", "Framer Motion", "SEO", "Franchise"],
    stack: ["Next.js 15", "React 19", "TypeScript", "Framer Motion", "Tailwind CSS 4"],

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
          src: "https://res.cloudinary.com/db7kbwl5n/image/upload/v1774472420/image_21_j8xzip.png",
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
          src: "https://res.cloudinary.com/db7kbwl5n/image/upload/v1774472464/image_20_fjo49a.png",
          altKey: "projects.nova.media.solutionAlt",
        },
      },
    ],
  },
];
