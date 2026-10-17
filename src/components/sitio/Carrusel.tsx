"use client";

/**
 * Una fila de tarjetas que se recorre con flechas, deslizando el dedo, o sola.
 *
 * El desplazamiento es el del navegador —`scroll-snap`—, así que funciona sin
 * JavaScript y con el teclado. Las flechas solo aparecen si hay algo que
 * desplazar: los dos integrantes del grupo de mineros caben enteros y no
 * necesitan ninguna.
 *
 * Avanza solo cada cinco segundos y al llegar al final vuelve al principio,
 * como los carruseles de craftmines.org (medido: 5.000 ms, en bucle). Lo que
 * el suyo no hace y este sí: se para mientras el ratón está encima, mientras
 * algo de dentro tiene el foco y después de que alguien lo toque; no se mueve
 * fuera de la vista ni con la pestaña escondida; lleva un botón para
 * pararlo; y no arranca para quien pidió al sistema menos movimiento. Un
 * texto que se mueve solo y no se puede detener es una barrera para quien lee
 * despacio.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

const CADA = 5000;

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
  automatico = true,
}: {
  etiqueta: string;
  children: ReactNode;
  automatico?: boolean;
}) {
  const caja = useRef<HTMLDivElement>(null);
  const pista = useRef<HTMLUListElement>(null);
  const [limites, setLimites] = useState({ hay: false, inicio: true, fin: true });
  /* `parado` lo decide quien mira con el botón; `quieto`, el ratón, el foco
     o un toque; `aVista` y `permitido`, el navegador. */
  const [parado, setParado] = useState(false);
  const [quieto, setQuieto] = useState(false);
  const [aVista, setAVista] = useState(false);
  const [permitido, setPermitido] = useState(false);

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

  useEffect(() => {
    if (!automatico) return;
    const quieren = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decidir = () => setPermitido(!quieren.matches);
    decidir();
    quieren.addEventListener("change", decidir);
    const vigia = new IntersectionObserver(([e]) => setAVista(e.isIntersecting), { threshold: 0.3 });
    if (caja.current) vigia.observe(caja.current);
    return () => {
      quieren.removeEventListener("change", decidir);
      vigia.disconnect();
    };
  }, [automatico]);

  /* Una tarjeta por paso: lo que mide la primera más la separación. */
  function mover(sentido: 1 | -1) {
    const el = pista.current;
    const tarjeta = el?.firstElementChild as HTMLElement | null;
    if (!el || !tarjeta) return;
    const paso = tarjeta.getBoundingClientRect().width + 16;
    el.scrollBy({ left: sentido * paso, behavior: "smooth" });
  }

  const enMarcha = automatico && permitido && limites.hay && aVista && !parado && !quieto;

  useEffect(() => {
    if (!enMarcha) return;
    const reloj = window.setInterval(() => {
      if (document.hidden) return;
      const el = pista.current;
      if (!el) return;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        mover(1);
      }
    }, CADA);
    return () => window.clearInterval(reloj);
  }, [enMarcha]);

  const flecha =
    "flex size-9 shrink-0 items-center justify-center rounded-full bg-verde text-white transition-opacity disabled:opacity-25";
  const mueve = automatico && permitido && limites.hay;

  return (
    <div
      ref={caja}
      className="my-8"
      role="region"
      aria-roledescription="carrusel"
      aria-label={etiqueta}
      onMouseEnter={() => setQuieto(true)}
      onMouseLeave={() => setQuieto(false)}
      onFocusCapture={() => setQuieto(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setQuieto(false);
      }}
      /* Quien lo toca o lo arrastra ya está mirando a su ritmo: se para. */
      onPointerDown={(e) => {
        /* Menos en el propio botón, que si no el toque lo pararía y el clic
           lo volvería a poner en marcha. */
        if (e.pointerType !== "mouse" && !(e.target as Element).closest("[data-pausa]")) {
          setParado(true);
        }
      }}
    >
      <div className="flex items-center gap-3">
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
          aria-live={enMarcha ? "off" : "polite"}
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
      {mueve && (
        <p className="mt-2 text-center">
          <button
            type="button"
            data-pausa
            onClick={() => setParado((x) => !x)}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium text-suave transition-colors hover:bg-black/5 hover:text-cafe"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              {parado ? (
                <path d="M2 1.2v7.6L8.6 5z" fill="currentColor" />
              ) : (
                <path d="M2 1h2v8H2zM6 1h2v8H6z" fill="currentColor" />
              )}
            </svg>
            {parado ? "Moverse solo" : "Detener"}
          </button>
        </p>
      )}
    </div>
  );
}
