"use client";

/**
 * Pestañas: se ve una sección a la vez y se cambia con un clic.
 *
 * En Impacto son las historias por país y la prensa por año; con `forma`
 * «linea» son las doce fechas del desarrollo de CRAFT, en fila sobre una raya,
 * y debajo lo que pasó en la elegida.
 *
 * Los paneles llegan ya dibujados desde el servidor y están todos en la
 * página: los que no se ven llevan `hidden`. Así el buscador y quien lee sin
 * JavaScript tienen el texto entero, y cambiar de pestaña no pide nada.
 */

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export default function Pestanas({
  forma,
  titulos,
  paneles,
}: {
  forma: "pestanas" | "linea";
  titulos: string[];
  paneles: ReactNode[];
}) {
  const [activa, setActiva] = useState(0);
  const base = useId();
  const botones = useRef<(HTMLButtonElement | null)[]>([]);

  /* Las flechas del teclado mueven entre pestañas, como en cualquier
     control de pestañas: el tabulador entra en la fila y sale de ella. */
  function teclas(e: KeyboardEvent) {
    const paso = { ArrowRight: 1, ArrowLeft: -1, Home: -activa, End: titulos.length - 1 - activa }[
      e.key
    ];
    if (paso === undefined) return;
    e.preventDefault();
    const nueva = (activa + paso + titulos.length) % titulos.length;
    setActiva(nueva);
    botones.current[nueva]?.focus();
    botones.current[nueva]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  const linea = forma === "linea";

  return (
    <div className="my-8">
      <div
        role="tablist"
        onKeyDown={teclas}
        className={
          linea
            ? "relative flex gap-1 overflow-x-auto pb-1 [scrollbar-width:thin] before:absolute before:top-[15px] before:right-0 before:left-0 before:h-px before:bg-linea"
            : "flex overflow-x-auto rounded-t-xl [scrollbar-width:thin]"
        }
      >
        {titulos.map((t, i) => {
          const sel = i === activa;
          return (
            <button
              key={i}
              ref={(b) => {
                botones.current[i] = b;
              }}
              role="tab"
              type="button"
              id={`${base}-p${i}`}
              aria-selected={sel}
              aria-controls={`${base}-c${i}`}
              tabIndex={sel ? 0 : -1}
              onClick={() => setActiva(i)}
              className={
                linea
                  ? `relative flex min-w-[7.5rem] shrink-0 flex-col items-center px-2 pt-0 pb-2 text-center text-[12.5px] leading-snug transition-colors ${
                      sel ? "font-semibold text-cafe" : "font-normal text-suave hover:text-cafe"
                    }`
                  : `min-w-[8rem] flex-1 px-4 py-3 text-[15px] font-semibold transition-colors ${
                      sel ? "bg-verde text-white" : "bg-[#e9f2df] text-cafe hover:bg-[#d9e9c8]"
                    }`
              }
            >
              {linea && (
                <span
                  aria-hidden="true"
                  className={`relative z-10 mb-2.5 block rounded-full border-2 transition-all ${
                    sel ? "mt-[7px] size-[17px] border-cafe bg-cafe" : "mt-[10px] size-[11px] border-linea bg-white"
                  }`}
                />
              )}
              {t}
            </button>
          );
        })}
      </div>

      {paneles.map((p, i) => (
        <div
          key={i}
          role="tabpanel"
          id={`${base}-c${i}`}
          aria-labelledby={`${base}-p${i}`}
          hidden={i !== activa}
          tabIndex={0}
          className={
            linea
              ? "mt-4 rounded-xl bg-gris px-6 py-6 sm:px-8"
              : "rounded-b-xl border border-t-0 border-linea bg-white px-5 py-6 sm:px-7 sm:py-8"
          }
        >
          {linea && (
            <p className="text-[1.15rem] leading-snug font-semibold text-cafe">{titulos[i]}</p>
          )}
          {p}
        </div>
      ))}
    </div>
  );
}
