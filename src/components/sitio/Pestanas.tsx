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
     control de pestañas: el tabulador entra en la fila y sale de ella. Arriba
     y abajo también, porque la línea de tiempo es una columna en pantalla
     ancha. */
  function teclas(e: KeyboardEvent) {
    const paso = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
      Home: -activa,
      End: titulos.length - 1 - activa,
    }[e.key];
    if (paso === undefined) return;
    e.preventDefault();
    const nueva = (activa + paso + titulos.length) % titulos.length;
    setActiva(nueva);
    botones.current[nueva]?.focus();
    botones.current[nueva]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  const linea = forma === "linea";
  /* Hasta cuatro pestañas se reparten el ancho, y un nombre largo parte en
     dos líneas: en un teléfono «Burkina Faso» quedaba cortada fuera de la
     fila. Con más, cada una guarda su ancho y la fila se desliza. */
  const pocas = titulos.length <= 4;

  /* La línea de tiempo, en pantalla ancha, es una columna de fechas sobre
     una raya, con lo que pasó al lado: las doce fechas a la vez. En fila no
     cabían —medían 1.677 píxeles para 778— y la mitad quedaba escondida. En
     el teléfono sí va en fila, y se desliza. */
  return (
    <div className={linea ? "my-8 sm:grid sm:grid-cols-[13.5rem_minmax(0,1fr)] sm:gap-8" : "my-8"}>
      <div
        role="tablist"
        onKeyDown={teclas}
        className={
          linea
            ? "flex overflow-x-auto pb-1 [scrollbar-width:thin] sm:flex-col sm:overflow-visible sm:pb-0"
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
                  ? `relative flex min-w-[7.5rem] shrink-0 flex-col items-center gap-2 px-2 pb-2 text-center text-[12.5px] leading-snug transition-colors before:absolute before:inset-x-0 before:top-[8px] before:h-px before:bg-linea sm:min-w-0 sm:flex-row sm:items-start sm:gap-3 sm:px-0 sm:py-2 sm:text-left sm:before:inset-x-auto sm:before:top-0 sm:before:bottom-0 sm:before:left-[8px] sm:before:h-auto sm:before:w-px ${
                      sel ? "font-semibold text-cafe" : "font-normal text-suave hover:text-cafe"
                    }`
                  : `${pocas ? "min-w-0" : "min-w-[8rem]"} flex-1 px-2.5 py-3 text-[14px] leading-snug font-semibold transition-colors sm:px-4 sm:text-[15px] ${
                      sel ? "bg-verde text-white" : "bg-[#e9f2df] text-cafe hover:bg-[#d9e9c8]"
                    }`
              }
            >
              {linea && (
                <span
                  aria-hidden="true"
                  className="relative z-10 flex size-[17px] shrink-0 items-center justify-center"
                >
                  <span
                    className={`block rounded-full border-2 transition-all ${
                      sel ? "size-[17px] border-cafe bg-cafe" : "size-[11px] border-linea bg-white"
                    }`}
                  />
                </span>
              )}
              <span className={linea ? "sm:pt-px" : ""}>{t}</span>
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
              ? "mt-4 rounded-xl bg-gris px-6 py-6 sm:sticky sm:top-8 sm:mt-0 sm:self-start sm:px-8"
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
