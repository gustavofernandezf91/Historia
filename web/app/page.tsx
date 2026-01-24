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
  const misionesDestacadas = [
    {
      titulo: "Reto relámpago",
      detalle: "Completa 2 actividades en menos de 15 min.",
      recompensa: "+40 XP",
    },
    {
      titulo: "Explorador diario",
      detalle: "Descubre una fuente histórica.",
      recompensa: "+1 insignia",
    },
    {
      titulo: "Modo cooperativo",
      detalle: "Comparte tu avance con un compañero.",
      recompensa: "+15 XP",
    },
  ];
  const panelStats = [
    {
      label: "Nivel actual",
      value: "Nivel 4",
      hint: "Rumbo a la insignia épica",
    },
    {
      label: "Energía",
      value: "80%",
      hint: "2 misiones antes de recargar",
    },
    {
      label: "Ranking",
      value: "Top 15%",
      hint: "Sube 3 puestos hoy",
    },
  ];

  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute right-10 top-24 h-52 w-52 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-indigo-400/10 blur-[120px]" />
        </div>
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-semibold text-sky-200">
                ⚡ Aprende con misiones y desafíos
              </span>
              <h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">
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
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wide text-sky-200">
                    Panel de jugador
                  </p>
                  <span className="rounded-full bg-emerald-400/20 px-2 py-1 text-[11px] font-semibold text-emerald-200">
                    En línea
                  </span>
                </div>
                <p className="mt-2 text-lg font-semibold text-white">Capitana del tiempo</p>
                <p className="text-slate-200">Clase: Explorador/a histórico</p>
                <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-center justify-between text-xs text-slate-200">
                    <span>XP semanal</span>
                    <span>120/200</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                    <div className="h-2 w-3/5 rounded-full bg-gradient-to-r from-sky-300 to-indigo-300" />
                  </div>
                  <p className="mt-2 text-[11px] text-slate-300">
                    Completa 2 misiones para subir al Nivel 5.
                  </p>
                </div>
              </div>
              {panelStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm"
                >
                  <p className="text-sky-200 font-semibold">{stat.label}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs text-slate-200">{stat.hint}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10">
            <CourseProgress unidades={unidades} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-xl shadow-slate-200/60 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-indigo-500">Mapa de aventura</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  Misiones disponibles hoy
                </h2>
                <p className="mt-2 text-slate-600">
                  Elige tu próxima misión y desbloquea recompensas instantáneas.
                </p>
              </div>
              <span className="rounded-full bg-indigo-100/80 px-4 py-2 text-xs font-semibold text-indigo-700">
                Bonus XP activo
              </span>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {misionesDestacadas.map((mision) => (
                <div
                  key={mision.titulo}
                  className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {mision.titulo}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{mision.detalle}</p>
                  <span className="mt-3 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {mision.recompensa}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
              <span className="rounded-full bg-slate-100/80 px-3 py-1">
                🔥 Racha activa
              </span>
              <span className="rounded-full bg-slate-100/80 px-3 py-1">
                🎯 Objetivos diarios
              </span>
              <span className="rounded-full bg-slate-100/80 px-3 py-1">
                🧩 Desafíos colaborativos
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200/70 bg-gradient-to-br from-indigo-600 via-sky-500 to-emerald-400 p-6 text-white shadow-xl shadow-slate-200/60">
              <p className="text-xs uppercase tracking-wide text-white/70">
                Centro de recompensas
              </p>
              <h3 className="mt-2 text-2xl font-semibold">
                Gana cofres al completar desafíos
              </h3>
              <p className="mt-2 text-sm text-white/80">
                Cada logro desbloquea cartas sorpresa, skins y misiones secretas.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-white/15 px-3 py-1">🎁 Cofre diario</span>
                <span className="rounded-full bg-white/15 px-3 py-1">🏆 Torneo semanal</span>
                <span className="rounded-full bg-white/15 px-3 py-1">✨ Colección premium</span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-xl shadow-slate-200/60">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                Próximos eventos
              </p>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3">
                  <div>
                    <p className="font-semibold">Liga de exploradores</p>
                    <p className="text-xs text-slate-500">Viernes • 18:00</p>
                  </div>
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                    +75 XP
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3">
                  <div>
                    <p className="font-semibold">Rally de mapas</p>
                    <p className="text-xs text-slate-500">Domingo • 11:00</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Insignia especial
                  </span>
                </div>
              </div>
            </div>
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
                className="group rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${unidad.color} text-xl shadow-lg shadow-slate-200`}
                  >
                    {unidad.icono}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900">{unidad.titulo}</h3>
                    {unidad.descripcion ? (
                      <p className="mt-2 text-slate-600">{unidad.descripcion}</p>
                    ) : (
                      <p className="mt-2 text-sm text-slate-400">
                        Descubre desafíos y recompensas especiales en esta unidad.
                      </p>
                    )}
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
