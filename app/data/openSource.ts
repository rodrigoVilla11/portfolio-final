// Repositorios públicos enlazados en el bloque "Código abierto"
// (home y /projects). Las descripciones están en translate/*.json.

export type OpenSourceRepo = {
  name: string;
  repo: string;
  descKey: string;
};

export const openSource: OpenSourceRepo[] = [
  {
    name: "mise",
    repo: "https://github.com/rodrigoVilla11/mise",
    descKey: "openSource.mise",
  },
  {
    name: "nova-sushi",
    repo: "https://github.com/rodrigoVilla11/nova-sushi",
    descKey: "openSource.novaSushi",
  },
];
