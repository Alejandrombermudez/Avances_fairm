"use client";

/**
 * Los puntos del costado de la portada: uno por franja.
 *
 * Dicen en qué sección se está —el punto lleno— y llevan a cualquiera con un
 * clic; al pasar por encima, el nombre de la sección. Acompañan el paso de
 * franja en franja con la rueda: sin ellos, que la página encaje sola no se
 * entiende, se siente como si la rueda fallara.
 *
 * Solo en pantalla ancha. En el teléfono taparían el texto.
 */

import { useEffect, useState } from "react";

export type Seccion = { id: string; titulo: string };

export default function Puntos({ secciones }: { secciones: Seccion[] }) {
  const [actual, setActual] = useState(secciones[0]?.id ?? "");

  useEffect(() => {
    /* La que cruza la mitad de la pantalla es la actual. */
    const vigia = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) setActual(e.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const s of secciones) {
      const el = document.getElementById(s.id);
      if (el) vigia.observe(el);
    }
    return () => vigia.disconnect();
  }, [secciones]);

  function ir(id: string, i: number) {
    if (i === 0) window.scrollTo({ top: 0 });
    else document.getElementById(id)?.scrollIntoView({ block: "start" });
  }

  if (secciones.length < 2) return null;

  return (
    <nav
      aria-label="Secciones de la portada"
      className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 min-[980px]:block"
    >
      <ul className="flex flex-col gap-3.5">
        {secciones.map((s, i) => {
          const esta = s.id === actual;
          return (
            <li key={s.id} className="group relative flex justify-end">
              <button
                type="button"
                onClick={() => ir(s.id, i)}
                aria-label={s.titulo}
                aria-current={esta ? "true" : undefined}
                className="flex size-5 items-center justify-center rounded-full"
              >
                <span
                  className={`block rounded-full border-2 border-cafe shadow-[0_0_0_2px_rgba(255,255,255,.85)] transition-all duration-300 ${
                    esta ? "size-3 bg-cafe" : "size-2 bg-white group-hover:bg-arena"
                  }`}
                />
              </button>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-7 -translate-y-1/2 translate-x-1 rounded-md bg-cafe px-2.5 py-1 text-[12px] font-medium whitespace-nowrap text-white opacity-0 transition-all duration-200 group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:translate-x-0 group-hover:opacity-100"
              >
                {s.titulo}
              </span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
