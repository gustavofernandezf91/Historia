import type { LessonBlock } from "@/features/lesson-player/types";

const buildBlockId = (block: { id?: string; tipo?: string; titulo?: string }) =>
  block.id ?? `${block.tipo ?? "bloque"}-${block.titulo ?? "sin-titulo"}`;

export const adaptPedagogicalBlock = (block: any): LessonBlock => {
  const id = buildBlockId(block);

  if (block?.tipo === "enganche") {
    return {
      id,
      tipo: "intro_hero",
      title: block.titulo ?? "Desafío inicial",
      subtitle: block.contenido ?? "",
    };
  }

  if (block?.tipo === "habilidad") {
    return {
      id,
      tipo: "micro_text",
      title: block.titulo ?? "Habilidad a entrenar",
      body: block.contenido ?? "",
    };
  }

  if (block?.tipo === "exploracion") {
    return {
      id,
      tipo: "micro_text",
      title: block.titulo ?? "Explora",
      body: Array.isArray(block.items)
        ? block.items.map((i: string) => "• " + i).join("\n")
        : block.contenido ?? "",
    };
  }

  if (block?.tipo === "mision") {
    return {
      id,
      tipo: "reflection_short",
      prompt: block.contenido ?? "Desarrolla la misión",
    };
  }

  if (block?.tipo === "presente") {
    return {
      id,
      tipo: "micro_text",
      title: block.titulo ?? "Conexión con el presente",
      body: block.contenido ?? "",
    };
  }

  if (block?.tipo === "evaluacion") {
    return {
      id,
      tipo: "under_construction",
      titulo: block.titulo ?? "Evaluación",
      texto: "Esta actividad evaluativa se implementará próximamente.",
    };
  }

  if (block?.tipo === "reflexion") {
    return {
      id,
      tipo: "outro_identity",
      title: block.titulo ?? "Cierre",
      prompt: block.contenido ?? "Reflexiona sobre lo aprendido.",
    };
  }

  return {
    id,
    tipo: "under_construction",
  } as LessonBlock;
};
