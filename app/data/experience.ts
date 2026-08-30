// Estructura de la sección "Experiencia y formación" de la home.
// Los textos (rol, período, bullets, formación, idiomas) viven en
// app/translate/{es,en}.json bajo la clave "experience"; acá solo van los
// ids (en orden de aparición) y los enlaces externos.

export type ExperienceItem = {
  id: "gourmetify" | "dma" | "nova" | "calm";
  link?: { href: string; label: string };
};

export const experience: ExperienceItem[] = [
  {
    id: "gourmetify",
    link: { href: "https://www.gourmetify.pro", label: "gourmetify.pro" },
  },
  {
    id: "dma",
    link: { href: "https://www.disdma.com.ar/", label: "disdma.com.ar" },
  },
  {
    id: "nova",
    link: { href: "https://nova-sushi.com/", label: "nova-sushi.com" },
  },
  { id: "calm" },
];

export const education = ["uned", "henryBootcamp", "henryBackend"] as const;
