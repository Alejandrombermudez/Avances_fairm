"use client";

/**
 * La barra de arriba, como la suya.
 *
 * Medido sobre craftmines.org el 8 de octubre de 2026, porque a ojo no se
 * acierta:
 *
 *            cabecera    logo      menu
 *   1440px     130       83x130    horizontal
 *    718px      80       64x100    plegado en un boton
 *
 * El corte esta en 980, que es donde lo pone su constructor. Debajo de ahi el
 * menu se pliega; el nuestro no lo hacia y se partia en dos lineas, que es lo
 * que se veia descuadrado al mirar las dos mitades de la comparacion una al
 * lado de la otra.
 *
 * El logo va alineado arriba a proposito: con la cabecera de 80 y el logo de
 * 100, cuelga 20 por debajo de la franja cafe. Asi es el suyo. Desde 980 los
 * dos miden 130 y encaja justo.
 *
 * Lo nuevo: al bajar, la barra se compacta —de 130 a 76 en pantalla ancha—
 * y lleva una sombra. Fija y a 130 se comia la séptima parte de la pantalla
 * en cada página. Para que el contenido no salte cuando encoge, gana abajo
 * el mismo margen que pierde de alto, y solo se compacta cuando su sitio de
 * siempre ya salió de la vista.
 */

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ruta, rutaPropuesta } from "@/lib/rutas";
import type { Entrada } from "@/lib/menu";


/**
 * Cual de las dos versiones del sitio es esta.
 *
 * El menu se escribe una sola vez —/que-es-craft— y cada lado lo resuelve a
 * lo suyo: la replica a /sitio/que-es-craft, la propuesta a
 * /sitio/propuesta/que-es-craft. Va como bandera y no como funcion porque
 * esto corre en el navegador y una funcion no cruza desde el servidor.
 */

export default function Navegacion({
  menu,
  inicio,
  idiomas = "ES | EN",
  enPropuesta = false,
}: {
  menu: Entrada[];
  inicio: string;
  idiomas?: string;
  enPropuesta?: boolean;
}) {
  const [abierto, setAbierto] = useState(false);
  const [compacta, setCompacta] = useState(false);
  const resolver = enPropuesta ? rutaPropuesta : ruta;
  /* La sección en la que se está va en arena, como en su sitio. Inicio solo
     cuenta en la portada; las demás, también en sus páginas de dentro. */
  const ahora = usePathname();
  const aqui = (h: string) => {
    const destino = resolver(h);
    return h === inicio || destino === resolver(inicio)
      ? ahora === destino
      : ahora === destino || ahora.startsWith(destino + "/");
  };

  useEffect(() => {
    /* Dos umbrales, para que no parpadee si alguien se queda justo en uno. */
    const medir = () => setCompacta((c) => (c ? window.scrollY > 100 : window.scrollY > 140));
    medir();
    window.addEventListener("scroll", medir, { passive: true });
    return () => window.removeEventListener("scroll", medir);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-cafe transition-[margin,box-shadow] duration-300 ${
        compacta ? "mb-4 shadow-[0_6px_20px_-8px_rgba(0,0,0,.4)] min-[980px]:mb-[54px]" : ""
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1180px] items-center gap-x-8 px-6 transition-[height] duration-300 ${
          compacta ? "h-16 min-[980px]:h-[76px]" : "h-20 min-[980px]:h-[130px]"
        }`}
      >
        <Link href={resolver(inicio)} className="shrink-0 self-start" onClick={() => setAbierto(false)}>
          <Image
            src="/logo-craft.png"
            alt="CRAFT"
            width={133}
            height={208}
            className={`w-auto transition-[height] duration-300 ${
              compacta ? "h-[80px] min-[980px]:h-[96px]" : "h-[100px] min-[980px]:h-[130px]"
            }`}
            priority
          />
        </Link>

        {/* Ancho: el menú entero, en una línea */}
        <nav className="ml-auto hidden flex-wrap items-center justify-end gap-x-6 gap-y-2 min-[980px]:flex">
          {menu.map((m) => (
            <Link
              key={m.t}
              href={resolver(m.h)}
              aria-current={aqui(m.h) ? "page" : undefined}
              className={`text-[14px] font-semibold transition-opacity hover:opacity-75 ${
                aqui(m.h) ? "text-arena" : "text-white"
              }`}
            >
              {m.t}
            </Link>
          ))}
          <span className="text-[13px] font-semibold text-white/60">{idiomas}</span>
        </nav>

        {/* Estrecho: el botón */}
        <button
          type="button"
          onClick={() => setAbierto((x) => !x)}
          aria-expanded={abierto}
          aria-controls="menu-plegable"
          aria-label={abierto ? "Cerrar el menú" : "Abrir el menú"}
          className="ml-auto flex size-10 shrink-0 items-center justify-center rounded text-white transition-colors hover:bg-white/10 min-[980px]:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            {abierto ? (
              <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {abierto && (
        <nav
          id="menu-plegable"
          className="border-t border-white/15 bg-cafe px-6 pb-5 min-[980px]:hidden"
        >
          <ul className="mx-auto max-w-[1180px]">
            {menu.map((m) => (
              <li key={m.t} className="border-b border-white/10 last:border-0">
                <Link
                  href={resolver(m.h)}
                  onClick={() => setAbierto(false)}
                  aria-current={aqui(m.h) ? "page" : undefined}
                  className={`block py-3 text-[15px] font-semibold transition-opacity hover:opacity-75 ${
                    aqui(m.h) ? "text-arena" : "text-white"
                  }`}
                >
                  {m.t}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-4 max-w-[1180px] text-[13px] font-semibold text-white/60">
            {idiomas}
          </p>
        </nav>
      )}
    </header>
  );
}
