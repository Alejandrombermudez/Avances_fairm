/**
 * La franja que deja pasar de una vista a otra.
 *
 * Tres posiciones en un solo mando: como está hoy, la propuesta, o las dos a
 * la vez. Está arriba del todo en las tres, en el mismo sitio y con el mismo
 * aspecto, y la que se está mirando queda marcada.
 *
 * Cambiar de vista no cambia de página: quien está en Recursos sigue en
 * Recursos. Antes eran un par de botones y un tercero aparte, cada cambio
 * devolvía a la portada, y desde la pantalla comparada no había cómo quedarse
 * solo con la propuesta.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { enActual, enComparar, enPropuesta, paginaDe, type Vista } from "@/lib/vistas";

const FONDO: Record<Vista, string> = {
  actual: "#2b1309",
  propuesta: "#3a1409",
  comparar: "#1a0d07",
};

const VISTAS: { clave: Vista; nombre: string; corto: string; a: (pagina: string) => string }[] = [
  { clave: "actual", nombre: "Como está hoy", corto: "Hoy", a: enActual },
  { clave: "propuesta", nombre: "Propuesta", corto: "Propuesta", a: enPropuesta },
  { clave: "comparar", nombre: "Las dos, lado a lado", corto: "Las dos", a: enComparar },
];

const FRASE: Record<Vista, [string, string]> = {
  actual: ["la página como está hoy", ", con su contenido ya en el gestor nuevo."],
  propuesta: ["la propuesta", ". El contenido es exactamente el mismo."],
  comparar: ["las dos a la vez", ". Navega en cualquiera y la otra la sigue."],
};

/** Dos mitades: lo que hace la tercera posición, dibujado. */
function DosMitades() {
  return (
    <svg viewBox="0 0 16 12" aria-hidden="true" className="h-3 w-4 shrink-0">
      <rect x="0.75" y="0.75" width="6" height="10.5" rx="1.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9.25" y="0.75" width="6" height="10.5" rx="1.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function Conmutador({
  activa,
  pagina,
}: {
  activa: Vista;
  /** La página que se está mirando. Si no se dice, se saca de la dirección. */
  pagina?: string;
}) {
  const camino = usePathname();
  const donde = pagina ?? paginaDe(camino) ?? "/";

  /* Dentro de un marco sobra: la pantalla comparada ya tiene su mando, y
     dos anidados confunden mas de lo que ayudan. */
  const [enMarco, setEnMarco] = useState(false);
  useEffect(() => setEnMarco(window.self !== window.top), []);
  if (enMarco) return null;

  const [negrita, resto] = FRASE[activa];

  return (
    <div className="shrink-0 px-4 py-2.5 sm:px-6" style={{ background: FONDO[activa], color: "#fff" }}>
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[12.5px] sm:justify-between">
        <span className="hidden text-white/70 md:inline">
          Estás viendo <strong className="font-semibold text-white">{negrita}</strong>
          {resto}
        </span>

        <nav aria-label="Cómo ver el sitio" className="flex items-center gap-1 rounded-full bg-white/10 p-1">
          {VISTAS.map((v) => {
            const esta = v.clave === activa;
            return (
              <Link
                key={v.clave}
                href={v.a(donde)}
                prefetch={v.clave === "comparar" ? false : undefined}
                aria-current={esta ? "page" : undefined}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 font-semibold whitespace-nowrap transition-colors ${
                  esta ? "bg-white" : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
                style={esta ? { color: FONDO[activa] } : undefined}
              >
                {v.clave === "comparar" && <DosMitades />}
                <span className="sm:hidden">{v.corto}</span>
                <span className="hidden sm:inline">{v.nombre}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
