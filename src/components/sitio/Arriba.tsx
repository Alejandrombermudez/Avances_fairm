"use client";

/**
 * El botón para volver arriba. Aparece cuando se ha bajado más de una
 * pantalla y media: en Gobernanza, para volver al menú desde los integrantes
 * del comité, había que desandar 14.000 píxeles.
 */

import { useEffect, useState } from "react";

export default function Arriba() {
  const [ver, setVer] = useState(false);

  useEffect(() => {
    const medir = () => setVer(window.scrollY > window.innerHeight * 1.5);
    medir();
    window.addEventListener("scroll", medir, { passive: true });
    return () => window.removeEventListener("scroll", medir);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0 })}
      aria-label="Volver arriba"
      tabIndex={ver ? 0 : -1}
      aria-hidden={!ver}
      className={`fixed right-5 bottom-5 z-40 flex size-11 items-center justify-center rounded-full bg-cafe text-white shadow-[0_8px_20px_-6px_rgba(0,0,0,.35)] transition-all duration-300 hover:-translate-y-0.5 sm:right-8 sm:bottom-8 ${
        ver ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 13V3m0 0L3.5 7.5M8 3l4.5 4.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
