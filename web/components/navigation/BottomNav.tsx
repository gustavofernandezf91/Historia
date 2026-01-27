"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Inicio", icon: "🏠" },
  { href: "/camino", label: "Camino", icon: "🗺️" },
  { href: "/ranking", label: "Ranking", icon: "🏆" },
  { href: "/perfil", label: "Perfil", icon: "👤" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const isCaminoRoute =
    pathname.startsWith("/camino") ||
    pathname.startsWith("/leccion") ||
    pathname.startsWith("/player") ||
    pathname.startsWith("/resultados") ||
    pathname.startsWith("/unidad");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/70 bg-white/90 px-4 py-2 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : tab.href === "/camino"
                ? isCaminoRoute
                : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-1 text-xs font-semibold ${
                isActive ? "text-emerald-600" : "text-slate-500"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
