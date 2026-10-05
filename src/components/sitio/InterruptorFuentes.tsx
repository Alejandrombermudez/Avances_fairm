/**
 * Enseña u oculta los rotulos que dicen de donde sale cada seccion.
 *
 * Estaban siempre visibles y hacian que la pagina pareciera una demostracion
 * en vez de un sitio. Sirven para explicar, no para publicar: ahora se
 * encienden cuando hacen falta.
 */

"use client";

import { useState } from "react";

export default function InterruptorFuentes() {
  const [ver, setVer] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        document.documentElement.classList.toggle("ver-fuentes");
        setVer((v) => !v);
      }}
      className="text-[12px] font-semibold text-suave underline underline-offset-4 transition-colors hover:text-cafe"
    >
      {ver ? "Ocultar de dónde sale cada sección" : "Ver de dónde sale cada sección"}
    </button>
  );
}
