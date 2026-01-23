type BloqueBase = {
  tipo: string;
  recompensa?: string;
  xp?: number;
};

const defaultXpByType: Record<string, number> = {
  enganche: 40,
  habilidad: 50,
  exploracion: 70,
  mision: 120,
  presente: 60,
  evaluacion: 80,
  reflexion: 40,
};

export function getBlockDefaults(bloque: BloqueBase) {
  return {
    xp: bloque.xp ?? defaultXpByType[bloque.tipo] ?? 50,
    recompensa: bloque.recompensa ?? "Nuevo logro desbloqueado",
  };
}
