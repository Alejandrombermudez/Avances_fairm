"use client";

/**
 * Una fila de tarjetas que se recorre con flechas, o deslizando el dedo.
 *
 * El desplazamiento es el del navegador —`scroll-snap`—, así que funciona sin
 * JavaScript y con el teclado. Las flechas solo aparecen si hay algo que
 * desplazar: los dos integrantes del grupo de mineros caben enteros y no
 * necesitan ninguna.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

function Flecha({ atras }: { atras?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d={atras ? "M8.5 3 4.5 7l4 4" : "M5.5 3l4 4-4 4"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Carrusel({
  etiqueta,
  children,
}: {
  etiqueta: string;
  children: ReactNode;
}) {
  const pista = useRef<HTMLUListElement>(null);
  const [limites, setLimites] = useState({ hay: false, inicio: true, fin: true });

  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    const medir = () =>
      setLimites({
        hay: el.scrollWidth > el.clientWidth + 2,
        inicio: el.scrollLeft <= 2,
        fin: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
      });
    medir();
    el.addEventListener("scroll", medir, { passive: true });
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", medir);
      ro.disconnect();
    };
  }, []);

  /* Una tarjeta por clic: lo que mide la primera más la separación. */
  function mover(sentido: 1 | -1) {
    const el = pista.current;
    const tarjeta = el?.firstElementChild as HTMLElement | null;
    if (!el || !tarjeta) return;
    const paso = tarjeta.getBoundingClientRect().width + 16;
    el.scrollBy({ left: sentido * paso, behavior: "smooth" });
  }

  const flecha =
    "flex size-9 shrink-0 items-center justify-center rounded-full bg-verde text-white transition-opacity disabled:opacity-25";

  return (
    <div className="my-8 flex items-center gap-3" role="region" aria-label={etiqueta}>
      {limites.hay && (
        <button
          type="button"
          className={`${flecha} hidden sm:flex`}
          onClick={() => mover(-1)}
          disabled={limites.inicio}
          aria-label="Anterior"
        >
          <Flecha atras />
        </button>
      )}
      <ul
        ref={pista}
        className={`flex min-w-0 flex-1 snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:thin] ${
          limites.hay ? "" : "justify-center"
        }`}
      >
        {children}
      </ul>
      {limites.hay && (
        <button
          type="button"
          className={`${flecha} hidden sm:flex`}
          onClick={() => mover(1)}
          disabled={limites.fin}
          aria-label="Siguiente"
        >
          <Flecha />
        </button>
      )}
    </div>
  );
}
