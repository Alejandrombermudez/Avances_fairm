/**
 * La franja que deja pasar de una versión a la otra.
 *
 * Está en las dos, siempre arriba del todo. El contenido es el mismo en
 * ambas: lo que cambia es cómo se presenta. Poder volver a lo conocido en un
 * clic es, en buena parte, el objetivo de que existan las dos.
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Conmutador({ activa }: { activa: "actual" | "propuesta" }) {
  const esActual = activa === "actual";

  /* Dentro de un marco sobra: la pantalla comparada ya tiene sus rotulos, y
     dos conmutadores anidados confunden mas de lo que ayudan. */
  const [enMarco, setEnMarco] = useState(false);
  useEffect(() => setEnMarco(window.self !== window.top), []);
  if (enMarco) return null;
  return (
    <div
      className="px-6 py-2.5"
      style={{ background: esActual ? "#2b1309" : "#3a1409", color: "#fff" }}
    >
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-4 gap-y-2 text-[12.5px]">
        <span className="opacity-70">
          {esActual
            ? "Esta es la página como está hoy, con su contenido ya en el gestor nuevo."
            : "Esta es la propuesta de organización. El contenido es exactamente el mismo."}
        </span>
        <div className="ml-auto flex items-center gap-1 rounded-full bg-white/10 p-1">
          <Link
            href="/sitio"
            className={`rounded-full px-3.5 py-1 font-semibold transition-colors ${
              esActual ? "bg-white text-[#2b1309]" : "text-white/75 hover:text-white"
            }`}
          >
            Como está hoy
          </Link>
          <Link
            href="/sitio/propuesta"
            className={`rounded-full px-3.5 py-1 font-semibold transition-colors ${
              !esActual ? "bg-white text-[#3a1409]" : "text-white/75 hover:text-white"
            }`}
          >
            Propuesta
          </Link>
        </div>
        <Link
          href="/sitio/comparar"
          className="rounded-full border border-white/30 px-3.5 py-1 font-semibold text-white/80 transition-colors hover:border-white hover:text-white"
        >
          Ver las dos a la vez
        </Link>
      </div>
    </div>
  );
}
