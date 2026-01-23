import Link from "next/link";
import curriculum from "../content/curriculum.json";

type Unidad = {
  id: string;
  titulo: string;
  descripcion?: string;
};

export default function Home() {
  const unidades = (curriculum as any).unidades as Unidad[];

  return (
    <main className="min-h-screen bg-slate-50 p-10">
      <header className="max-w-5xl mx-auto mb-10">
        <h1 className="text-5xl font-bold mb-3">HistoriAPP</h1>
        <p className="text-slate-600 text-lg">
          Plataforma educativa para aprender Historia, Geografía y Ciencias Sociales
          desarrollando habilidades del pensamiento histórico mediante misiones,
          desafíos y experiencias interactivas.
        </p>
      </header>

      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {unidades.map((unidad) => (
          <Link
            key={unidad.id}
            href={`/unidad/${unidad.id}`}
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition block"
          >
            <h2 className="text-xl font-semibold mb-2">{unidad.titulo}</h2>
            <p className="text-slate-600">{unidad.descripcion ?? ""}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
