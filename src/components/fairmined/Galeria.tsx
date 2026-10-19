"use client";

/**
 * Un pase de fotos, como los carruseles de fairmined.org: una foto a la vez,
 * que avanza sola cada cinco segundos y vuelve a empezar.
 *
 * En el original son tres cosas distintas —Revolution Slider en la portada y
 * en la ficha de cada mina, y los carruseles de Elementor en las crónicas—
 * que hacen lo mismo. Aquí son uno.
 *
 * Se detiene al pasar el ratón o al tocar una flecha, y no avanza solo para
 * quien pidió al sistema menos movimiento.
 */

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export type Foto = { key: string; src: string; ancho: number; alto: number; alt: string; pie?: string };

/**
 * `cabecera` es el carrusel que abre la portada: de borde a borde, 450 px de
 * alto en escritorio, con el crédito de la foto encima, como el de
 * Revolution Slider en fairmined.org.
 */
export default function Galeria({ fotos, forma = "pase" }: { fotos: Foto[]; forma?: "pase" | "cabecera" }) {
  const [i, setI] = useState(0);
  const [quieto, setQuieto] = useState(false);
  const n = fotos.length;
  const ir = useCallback((d: number) => setI((x) => (x + d + n) % n), [n]);

  useEffect(() => {
    if (quieto || n < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => ir(1), 5000);
    return () => window.clearInterval(t);
  }, [quieto, n, ir]);

  if (!n) return null;
  const actual = fotos[i];
  const cabecera = forma === "cabecera";
  return (
    <figure
      className={cabecera ? "relative" : "my-8"}
      onMouseEnter={() => setQuieto(true)}
      onMouseLeave={() => setQuieto(false)}
      aria-roledescription="carrusel"
    >
      <div
        className={
          cabecera
            ? "relative h-[260px] overflow-hidden bg-[#222] sm:h-[360px] lg:h-[450px]"
            : "relative aspect-[3/2] overflow-hidden bg-[#f7f7f7]"
        }
      >
        {fotos.map((f, j) => (
          <Image
            key={f.key}
            src={f.src}
            alt={f.alt}
            fill
            sizes={cabecera ? "100vw" : "(max-width: 810px) 100vw, 780px"}
            className={`object-cover transition-opacity duration-700 ${j === i ? "opacity-100" : "opacity-0"}`}
            aria-hidden={j !== i}
            priority={j === 0}
          />
        ))}
        {n > 1 && (
          <>
            <button
              type="button"
              onClick={() => {
                setQuieto(true);
                ir(-1);
              }}
              aria-label="Anterior"
              className="absolute top-1/2 left-2 flex size-9 -translate-y-1/2 items-center justify-center bg-black/35 text-white transition-colors hover:bg-black/55"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => {
                setQuieto(true);
                ir(1);
              }}
              aria-label="Siguiente"
              className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center bg-black/35 text-white transition-colors hover:bg-black/55"
            >
              ›
            </button>
          </>
        )}
      </div>
      {(actual.pie || n > 1) && (
        <figcaption
          className={
            cabecera
              ? "absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 px-4 pb-3 text-[11px] text-white/85 [text-shadow:0_1px_2px_rgba(0,0,0,.6)]"
              : "mt-2 flex items-center justify-between gap-4 text-[12px] text-[#8e8d89]"
          }
        >
          <span>{actual.pie}</span>
          {n > 1 && (
            <span className="flex shrink-0 gap-1.5" role="tablist">
              {fotos.map((f, j) => (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  aria-selected={j === i}
                  aria-label={`Foto ${j + 1} de ${n}`}
                  onClick={() => {
                    setQuieto(true);
                    setI(j);
                  }}
                  className={`size-2 rounded-full ${j === i ? "bg-oro" : "bg-[#d6d2c4]"}`}
                />
              ))}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
