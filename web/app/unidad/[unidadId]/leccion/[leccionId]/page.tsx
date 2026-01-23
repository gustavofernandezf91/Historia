
import curriculum from "@/content/curriculum.json";
import Link from "next/link";

type Bloque = {
  tipo: string;            // ej: "enganche", "mision", "fuente", "actividad", "cierre"
  titulo?: string;
  texto?: string;
  items?: string[];
  fuente?: {
    tipo?: string;         // "texto", "imagen", "video", etc.
    contenido?: string;    // url o texto
    preguntas?: string[];
  };
};

type Leccion = {
  id: string;
  titulo: string;
  habilidad?: string;
  contenidos?: string;
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

  return (
    <main className="min-h-screen bg-slate-50 p-10">
      <div className="max-w-5xl mx-auto">
        <Link className="text-blue-600 underline" href={`/unidad/${unidadId}`}>
          ← Volver a {unidad.titulo}
        </Link>

        <header className="mt-6 mb-10">
          <h1 className="text-4xl font-bold mb-3">{leccion.titulo}</h1>

          <div className="bg-white rounded-xl shadow p-6">
            {leccion.habilidad && (
              <p className="text-slate-800 mb-2">
                <b>Habilidad:</b> {leccion.habilidad}
              </p>
            )}
            {leccion.contenidos && (
              <p className="text-slate-600">
                <b>Contenidos:</b> {leccion.contenidos}
              </p>
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
            leccion.bloques.map((b, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-6">
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                  {b.tipo}
                </p>

                {b.titulo && <h2 className="text-2xl font-semibold mb-2">{b.titulo}</h2>}
                {b.texto && <p className="text-slate-700 leading-relaxed">{b.texto}</p>}

                {b.items && b.items.length > 0 && (
                  <ul className="list-disc pl-6 mt-4 text-slate-700">
                    {b.items.map((it, idx) => (
                      <li key={idx}>{it}</li>
                    ))}
                  </ul>
                )}

                {b.fuente && (
                  <div className="mt-4 p-4 rounded-lg bg-slate-50">
                    <p className="font-semibold mb-2">Fuente</p>
                    {b.fuente.tipo && (
                      <p className="text-slate-600 text-sm mb-2">Tipo: {b.fuente.tipo}</p>
                    )}
                    {b.fuente.contenido && (
                      <p className="text-slate-700 whitespace-pre-wrap">{b.fuente.contenido}</p>
                    )}

                    {b.fuente.preguntas && b.fuente.preguntas.length > 0 && (
                      <>
                        <p className="font-semibold mt-4 mb-2">Preguntas</p>
                        <ul className="list-disc pl-6 text-slate-700">
                          {b.fuente.preguntas.map((q, qi) => (
                            <li key={qi}>{q}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
