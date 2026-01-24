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
  const { unidades } = curriculum as { unidades: Unidad[] };
  const tarjetas = unidades.map((unidad, index) => ({
    ...unidad,
    icono: ["🧭", "🏛️", "🌎", "📜"][index % 4],
    color: ["from-indigo-500 to-sky-500", "from-emerald-500 to-lime-500", "from-pink-500 to-orange-500", "from-violet-500 to-fuchsia-500"][index % 4],
  }));
  const primeraUnidad = unidades[0];
  const primeraUnidadHref = primeraUnidad ? `/unidad/${primeraUnidad.id}` : "#";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        <aside className="hidden w-64 flex-shrink-0 border-r border-slate-200/80 bg-white/80 px-6 py-8 shadow-sm lg:block">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg text-white">
              📘
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">HistoriaChile</p>
              <p className="text-xs text-slate-500">7° Básico</p>
            </div>
          </div>
          <nav className="mt-10 space-y-3 text-sm font-semibold text-slate-600">
            {[
              { label: "Inicio", active: true },
              { label: "Módulos" },
              { label: "Mis logros" },
              { label: "Asistente IA" },
              { label: "Mi perfil" },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
                  item.active ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-100"
                }`}
              >
                <span className="text-lg">•</span>
                <span>{item.label}</span>
              </div>
            ))}
          </nav>
          <div className="mt-12 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-xs text-amber-700">
            <p className="font-semibold">Racha activa</p>
            <p className="mt-1">Sigue aprendiendo para mantener tu racha.</p>
          </div>
        </aside>

        <div className="flex-1">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/70 bg-white/80 px-6 py-4">
            <div>
              <p className="text-sm text-slate-500">Bienvenido de vuelta</p>
              <h1 className="text-2xl font-semibold text-slate-900">Gustavo Fernandez</h1>
              <p className="text-xs text-slate-400">Aprendiz de Historia • Nivel 1</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="rounded-2xl bg-slate-100 px-4 py-2 text-slate-600">
                ⭐ 0 puntos
              </div>
              <div className="rounded-2xl bg-slate-100 px-4 py-2 text-slate-600">
                🔥 0 días de racha
              </div>
            </div>
          </header>

          <section className="px-6 pb-16 pt-10">
            <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-sky-600 p-8 text-white shadow-xl">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl">
                  <p className="text-sm font-semibold text-sky-100">Bienvenido a tu panel</p>
                  <h2 className="mt-2 text-3xl font-semibold">
                    Aprendiendo Historia y Ciencias Sociales
                  </h2>
                  <p className="mt-3 text-sm text-slate-100">
                    Introducción a las ciencias sociales, el tiempo histórico, las fuentes y el
                    trabajo del historiador.
                  </p>
                  <div className="mt-5 flex items-center gap-4 text-sm">
                    <Link
                      href="#continuar"
                      className="rounded-full bg-white px-5 py-2 font-semibold text-indigo-700 shadow-lg shadow-indigo-900/30"
                    >
                      Continuar
                    </Link>
                    <span className="text-sky-100">Progreso general del curso</span>
                  </div>
                </div>
                <div className="w-full max-w-xs">
                  <CourseProgress unidades={unidades} />
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Lecciones completadas", value: "0", icon: "📘" },
                { label: "Evaluaciones aprobadas", value: "0", icon: "✅" },
                { label: "Tiempo de estudio", value: "0h", icon: "⏱️" },
                { label: "Promedio evaluaciones", value: "0%", icon: "📊" },
              ].map((dato) => (
                <div
                  key={dato.label}
                  className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="text-lg">{dato.icon}</span>
                    <span>{dato.label}</span>
                  </div>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">{dato.value}</p>
                </div>
              ))}
            </div>

            <div id="continuar" className="mt-10 rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Continuar aprendiendo</h3>
                  <p className="text-sm text-slate-500">
                    Tu última misión está lista para continuar.
                  </p>
                </div>
                <Link className="text-sm font-semibold text-indigo-600" href={primeraUnidadHref}>
                  Ver todas →
                </Link>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-6 rounded-2xl border border-slate-200/60 bg-slate-50/80 p-4">
                <div className="h-20 w-28 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {primeraUnidad?.titulo ?? "Aprendiendo Historia y Ciencias Sociales"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {primeraUnidad?.descripcion ??
                      "Introducción a las ciencias sociales, el tiempo histórico y las fuentes."}
                  </p>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full w-1/5 rounded-full bg-indigo-500" />
                  </div>
                </div>
                <Link
                  href={primeraUnidadHref}
                  className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Continuar
                </Link>
              </div>
            </div>

            <section className="mt-10" id="unidades">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Módulos de aprendizaje</h3>
                  <p className="text-sm text-slate-500">
                    Explora los contenidos de Historia de Chile para 7° Básico.
                  </p>
                </div>
                <Link className="text-sm font-semibold text-indigo-600" href={primeraUnidadHref}>
                  Ver todos →
                </Link>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-3">
                {tarjetas.map((unidad) => (
                  <Link
                    key={unidad.id}
                    href={`/unidad/${unidad.id}`}
                    className="group rounded-2xl border border-slate-200/70 bg-white/95 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div
                      className={`relative mb-4 h-36 w-full overflow-hidden rounded-2xl bg-gradient-to-br ${unidad.color}`}
                    >
                      <span className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-800">
                        {unidad.titulo.split(":")[0]}
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-slate-900">{unidad.titulo}</h4>
                    <p className="mt-2 text-sm text-slate-500">{unidad.descripcion ?? ""}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>4 lecciones</span>
                      <span>•</span>
                      <span>3 semanas</span>
                    </div>
                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full w-1/12 rounded-full bg-indigo-500" />
                    </div>
                    <div className="mt-4 text-sm font-semibold text-indigo-600">Comenzar →</div>
                  </Link>
                ))}
              </div>
            </section>
          </section>
        </div>
      </div>
    </main>
  );
}
