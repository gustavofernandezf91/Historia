export type UnitNarrativeConfig = {
  unitId: string;
  openingCopy: string;
  closingCopy: string;
  identityShiftCopy: string;
  metaphor: "camino" | "ciclo" | "huella";
};

export const unitNarratives: UnitNarrativeConfig[] = [
  {
    unitId: "u0",
    openingCopy: "En esta unidad vas a aprender a mirar lo cotidiano con otros ojos.",
    closingCopy: "Ahora miras distinto que antes. Eso también es historia.",
    identityShiftCopy: "Notas pistas históricas en lo que antes parecía solo rutina.",
    metaphor: "camino",
  },
  {
    unitId: "u1",
    openingCopy: "En esta unidad vas a aprender a mirar lo cotidiano con otros ojos.",
    closingCopy: "Ahora miras distinto que antes. Eso también es historia.",
    identityShiftCopy: "Tus preguntas empiezan a dejar huella en lo que observas.",
    metaphor: "huella",
  },
  {
    unitId: "u2",
    openingCopy: "En esta unidad vas a aprender a mirar lo cotidiano con otros ojos.",
    closingCopy: "Ahora miras distinto que antes. Eso también es historia.",
    identityShiftCopy: "Reconoces patrones que vuelven y ciclos que se repiten.",
    metaphor: "ciclo",
  },
  {
    unitId: "u3",
    openingCopy: "En esta unidad vas a aprender a mirar lo cotidiano con otros ojos.",
    closingCopy: "Ahora miras distinto que antes. Eso también es historia.",
    identityShiftCopy: "Vas trazando un camino propio al leer el pasado.",
    metaphor: "camino",
  },
  {
    unitId: "u4",
    openingCopy: "En esta unidad vas a aprender a mirar lo cotidiano con otros ojos.",
    closingCopy: "Ahora miras distinto que antes. Eso también es historia.",
    identityShiftCopy: "Las huellas del pasado se ven más claras en tu mirada.",
    metaphor: "huella",
  },
];

export const getUnitNarrative = (unitId: string): UnitNarrativeConfig | null =>
  unitNarratives.find((narrative) => narrative.unitId === unitId) ?? null;
