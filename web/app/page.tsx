import CourseProgress from "@/component/CourseProgress";
import Link from "next/link";
import curriculum from "../content/curriculum.json";

type Unidad = {
  id: string;
  titulo: string;
  descripcion?: string;
  lecciones: {
    id: string;
    bloques?: {
      id?: string;
      tipo: string;
      xp?: number;
    }[];
  }[];
};

export default function Home() {
  const unidades = (curriculum as any).unidades as Unidad[];
  const tarjetas = unidades.map((unidad, index) => ({
    ...unidad,
    icono: ["🧭", "🏛️", "🌎", "📜"][index % 4],
    color: ["from-indigo-500 to-sky-500", "from-emerald-500 to-lime-500", "from-pink-500 to-orange-500", "from-violet-500 to-fuchsia-500"][index % 4],
  }));

  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-semibold text-sky-200">
                ⚡ Aprende con misiones y desafíos
              </span>
              <h1 className="mt-5 text-4xl md:text-5xl font-bold leading-tight">
                HistoriAPP: explora el pasado como si fuera un videojuego.
              </h1>
              <p className="mt-4 text-lg text-slate-200">
                Plataforma educativa para Historia, Geografía y Ciencias Sociales con
                niveles, retos y logros que ayudan a desarrollar el pensamiento histórico.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="#unidades"
                  className="rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-sky-500/30 transition hover:bg-sky-300"
                >
                  Empezar misión
                </Link>
                <span className="text-sm text-slate-300">
                  +20 misiones • progreso personalizado • insignias desbloqueables
                </span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { titulo: "Nivel 1", texto: "Exploración guiada" },
                { titulo: "Nivel 2", texto: "Retos colaborativos" },
                { titulo: "Nivel 3", texto: "Insignias épicas" },
                { titulo: "Nivel 4", texto: "Ranking amistoso" },
              ].map((tarjeta) => (
                <div
                  key={tarjeta.titulo}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm"
                >
                  <p className="text-sky-200 font-semibold">{tarjeta.titulo}</p>
                  <p className="text-slate-200">{tarjeta.texto}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10">
            <CourseProgress unidades={unidades} />
          </div>
        </div>
      </section>

      <section id="unidades" className="mx-auto max-w-6xl px-6 pb-16 pt-12">
        <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-xl shadow-slate-200/60 backdrop-blur">
          <header className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Tus unidades de aventura</h2>
              <p className="text-slate-600">
                Elige una misión, desbloquea logros y gana puntos por cada desafío.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100/80 px-4 py-2 text-sm font-semibold text-indigo-700">
              ⭐ 4.8/5 diversión garantizada
            </span>
          </header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {tarjetas.map((unidad) => (
              <Link
                key={unidad.id}
                href={`/unidad/${unidad.id}`}
                className="group rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${unidad.color} text-xl shadow-lg shadow-slate-200`}
                  >
                    {unidad.icono}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900">{unidad.titulo}</h3>
                    <p className="mt-2 text-slate-600">{unidad.descripcion ?? ""}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                  <span className="rounded-full bg-slate-100/80 px-3 py-1">Misiones cortas</span>
                  <span className="rounded-full bg-slate-100/80 px-3 py-1">Puntos extra</span>
                  <span className="rounded-full bg-slate-100/80 px-3 py-1">Co-op</span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-indigo-600">
                  Ver desafíos
                  <span className="transition group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
