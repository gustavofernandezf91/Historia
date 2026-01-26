import { Bloque, Lesson, Screen } from "@/types/lesson";

const truncateText = (text: string, maxLength = 120) => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
};

const firstSentence = (text?: string) => {
  if (!text) return "";
  const match = text.split(".")[0];
  return match.trim();
};

const buildId = (prefix: string, index: number) => `${prefix}-${index}`;

const mapEnganche = (bloque: Bloque, index: number): Screen[] => {
  const base = firstSentence(bloque.contenido ?? bloque.texto ?? bloque.titulo ?? "");
  const prompt = "¿Qué parte de tu día tiene historia detrás?";

  return [
    {
      id: buildId("hero", index),
      type: "hero",
      content: {
        title: base || "Nada de lo que haces hoy es casual.",
        subtitle: truncateText(bloque.contenido ?? "Piensa en lo cotidiano y mira con ojos de detective."),
      },
      xp: 4,
    },
    {
      id: buildId("choice", index),
      type: "choice",
      content: {
        prompt,
        options: ["Transporte", "Tecnología", "Escuela", "Ropa"],
        multi: true,
      },
      xp: 6,
    },
  ];
};

const mapHabilidad = (bloque: Bloque, index: number): Screen => ({
  id: buildId("micro", index),
  type: "microConcept",
  content: {
    title: bloque.titulo ?? "Habilidad a entrenar",
    body: truncateText(bloque.contenido ?? "Entrenamos una habilidad clave para mirar el pasado."),
  },
  xp: 5,
});

const mapExploracion = (bloque: Bloque, index: number): Screen[] => {
  const items = bloque.items ?? [];
  return items.slice(0, 3).map((item, idx) => ({
    id: buildId(`explora-${index}`, idx),
    type: "microConcept",
    content: {
      title: "Explora en cápsulas",
      body: truncateText(item, 140),
    },
    xp: 4,
  }));
};

const mapMision = (bloque: Bloque, index: number): Screen => {
  const tareas = Array.isArray(bloque.tareas) ? bloque.tareas.join(" ") : bloque.tareas;
  return {
    id: buildId("mision", index),
    type: "shortInput",
    content: {
      prompt: bloque.titulo ?? "Misión",
      helperText: truncateText(tareas ?? bloque.contenido ?? "Describe tu misión en pocas líneas."),
      placeholder: "Escribe tu respuesta aquí",
    },
    xp: 8,
  };
};

const mapEvaluacion = (bloque: Bloque, index: number): Screen => {
  const quiz = bloque.quiz;
  return {
    id: buildId("evaluacion", index),
    type: "choice",
    content: {
      prompt: quiz?.pregunta ?? bloque.titulo ?? "Chequeo rápido",
      options: quiz?.opciones ?? ["Opción A", "Opción B", "Opción C"],
      correctOptions:
        quiz?.opciones && typeof quiz?.correcta === "number"
          ? [quiz.opciones[quiz.correcta]]
          : undefined,
      multi: false,
    },
    feedback: quiz?.feedbackCorrecto ?? quiz?.feedbackIncorrecto,
    xp: 6,
  };
};

const mapReflexion = (bloque: Bloque, index: number): Screen => ({
  id: buildId("reflexion", index),
  type: "shortInput",
  content: {
    prompt: bloque.titulo ?? "Reflexiona",
    helperText: truncateText(bloque.contenido ?? "¿Qué te llevas de esta lección?"),
    placeholder: "Comparte tu idea...",
  },
  xp: 6,
});

const buildBridge = (lessonId: string): Screen => ({
  id: `bridge-${lessonId}`,
  type: "bridge",
  content: {
    message: "Sigue avanzando para desbloquear la siguiente lección.",
  },
});

const mapU0L1 = (): Screen[] => [
  {
    id: "u0l1-hero",
    type: "hero",
    content: {
      title: "Nada de lo que haces hoy es casual.",
      subtitle: "Tu día está lleno de pistas históricas. Vamos a descubrirlas.",
    },
    xp: 5,
  },
  {
    id: "u0l1-choice-1",
    type: "choice",
    content: {
      prompt: "¿Esto es historia?",
      options: ["Tu celular", "Una vasija antigua", "Un edificio del centro"],
      multi: true,
      correctOptions: ["Tu celular", "Una vasija antigua", "Un edificio del centro"],
    },
    xp: 8,
  },
  {
    id: "u0l1-feedback-1",
    type: "feedback",
    content: {
      message:
        "Sí. Todo lo que usamos, vemos o heredamos cuenta una historia. La historia está viva.",
      tone: "success",
    },
    xp: 4,
  },
  {
    id: "u0l1-micro-1",
    type: "microConcept",
    content: {
      title: "La historia es una huella en el tiempo",
      body:
        "Cada objeto, decisión o costumbre deja rastros. Aprender historia es leer esas huellas.",
      highlight: "Pasado y presente se conectan todo el tiempo.",
    },
    xp: 5,
  },
  {
    id: "u0l1-choice-2",
    type: "choice",
    content: {
      prompt: "¿Qué cosas también cuentan historia?",
      options: ["Una canción", "Una votación", "Una carta antigua"],
      multi: true,
      correctOptions: ["Una votación", "Una carta antigua"],
    },
    xp: 8,
  },
  {
    id: "u0l1-classify",
    type: "classify",
    content: {
      prompt: "Clasifica cada ejemplo",
      categories: ["Historia tradicional", "Historia viva"],
      items: [
        "Reyes y batallas",
        "Cambios en tu barrio",
        "Fechas oficiales",
        "Historias de familias",
      ],
    },
    xp: 8,
  },
  {
    id: "u0l1-input",
    type: "shortInput",
    content: {
      prompt: "¿Qué parte de tu vida actual podría ser historia?",
      placeholder: "Ej: mi colegio, mi barrio, mis decisiones...",
    },
    xp: 6,
  },
  {
    id: "u0l1-feedback-2",
    type: "feedback",
    content: {
      message:
        "Eso que elegiste también deja huella. La historia se escribe con pequeñas decisiones cada día.",
      tone: "info",
    },
    xp: 4,
  },
  {
    id: "u0l1-bridge",
    type: "bridge",
    content: {
      message:
        "Si tu vida es historia… ¿quién decide qué historias importan?",
      ctaLabel: "Desbloquear lección 0.2",
      nextLessonId: "u0l2",
    },
  },
];

export const mapBloquesToScreens = (leccion: Lesson): Screen[] => {
  if (leccion.id === "u0l1") {
    return mapU0L1();
  }

  const screens: Screen[] = [];
  leccion.bloques?.forEach((bloque, index) => {
    switch (bloque.tipo) {
      case "enganche":
        screens.push(...mapEnganche(bloque, index));
        break;
      case "habilidad":
        screens.push(mapHabilidad(bloque, index));
        break;
      case "exploracion":
        screens.push(...mapExploracion(bloque, index));
        break;
      case "mision":
        screens.push(mapMision(bloque, index));
        break;
      case "evaluacion":
        screens.push(mapEvaluacion(bloque, index));
        break;
      case "reflexion":
        screens.push(mapReflexion(bloque, index));
        break;
      default:
        break;
    }
  });

  screens.push(buildBridge(leccion.id));
  return screens;
};
