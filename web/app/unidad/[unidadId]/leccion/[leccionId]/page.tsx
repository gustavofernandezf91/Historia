
import BlockCard from "@/component/BlockCard";
import curriculum from "@/content/curriculum.json";
import Link from "next/link";

type Bloque = {
  tipo: string;            // ej: "enganche", "mision", "fuente", "actividad", "cierre"
  titulo?: string;
  texto?: string;
  contenido?: string;
  items?: string[];
  tareas?: string[] | string;
  recompensa?: string;
  fuente?: {
    tipo?: string;         // "texto", "imagen", "video", etc.
    contenido?: string;    // url o texto
    preguntas?: string[];
  };
  quiz?: {
    pregunta: string;
    opciones: string[];
    correcta: number;
    feedbackCorrecto?: string;
    feedbackIncorrecto?: string;
  };
};

type Leccion = {
  id: string;
  titulo: string;
  habilidad?: string;
  habilidad_principal?: string;
  contenidos?: string;
  contenidos_breves?: string[];
  bloques?: Bloque[];
};

type Unidad = {
  id: string;
  titulo: string;
  descripcion?: string;
  lecciones: Leccion[];
};

export default async function LeccionPage({
  params,
}: {
  params: Promise<{ unidadId: string; leccionId: string }>;
}) {
  const { unidadId, leccionId } = await params;

  const unidades = (curriculum as any).unidades as Unidad[];
  const unidad = unidades.find((u) => u.id === unidadId);

  const leccion = unidad?.lecciones?.find((l) => l.id === leccionId);

  if (!unidad || !leccion) {
    return (
      <main className="min-h-screen bg-slate-50 p-10">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold mb-2">Lección no encontrada</h1>
          <p className="text-slate-600 mb-6">
            No existe la lección <b>{leccionId}</b> en la unidad <b>{unidadId}</b>.
          </p>
          <Link className="text-blue-600 underline" href={`/unidad/${unidadId}`}>
            Volver a la unidad
          </Link>
        </div>
      </main>
    );
  }

  const habilidad = leccion.habilidad_principal ?? leccion.habilidad;
  const contenidos = leccion.contenidos_breves ?? (leccion.contenidos ? [leccion.contenidos] : []);

  return (
    <main className="min-h-screen bg-slate-50 p-10">
      <div className="max-w-5xl mx-auto">
        <Link className="text-blue-600 underline" href={`/unidad/${unidadId}`}>
          ← Volver a {unidad.titulo}
        </Link>

        <header className="mt-6 mb-10">
          <h1 className="text-4xl font-bold mb-3">{leccion.titulo}</h1>

          <div className="bg-white rounded-xl shadow p-6">
            {habilidad && (
              <p className="text-slate-800 mb-2">
                <b>Habilidad:</b> {habilidad}
              </p>
            )}
            {contenidos.length > 0 && (
              <div className="text-slate-600">
                <b>Contenidos:</b>
                <ul className="list-disc pl-5 mt-1">
                  {contenidos.map((contenido) => (
                    <li key={contenido}>{contenido}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </header>

        <section className="space-y-6">
          {!leccion.bloques || leccion.bloques.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-slate-600">
                Esta lección todavía no tiene bloques. (Siguiente paso: los agregamos al JSON).
              </p>
            </div>
          ) : (
            leccion.bloques.map((b, i) => <BlockCard key={i} bloque={b} />)
          )}
        </section>
      </div>
    </main>
  );
}
