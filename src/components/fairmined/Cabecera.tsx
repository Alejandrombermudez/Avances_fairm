/**
 * La cabecera de fairmined.org, medida en el original a 1440 píxeles.
 *
 *   barra de arriba   31 px, blanca. A la izquierda las redes (36×36, icono de
 *                     16 px, #494949) y «Contact us: +57(4) 332 47 11» en
 *                     Roboto 13 px fina, #8E8D89. A la derecha, en español,
 *                     alemán y francés, un menú pequeño: Aliados, Medios…
 *   logo              95×70, centrado, con 25 px arriba y abajo.
 *   menú              51 px. Century Gothic 14 px fina, mayúsculas, #252525,
 *                     20 px entre secciones. «Fairmined Credits» sobre dorado
 *                     #8E7E33 con letra blanca. A la derecha, la bandera del
 *                     idioma y la lupa.
 *   desplegable       blanco, sombra 0 0 5px -1px rgba(0,0,0,.2); cada entrada
 *                     en 14 px normal, #666, 10×15 px de relleno.
 *
 * Por debajo de 992 píxeles el original cambia a un menú que se abre con un
 * botón; aquí igual, con <details>, que funciona sin código en el navegador.
 */

import Image from "next/image";
import Link from "next/link";
import {
  IDIOMAS_VISIBLES,
  rutaFm,
  resolverFm,
  type AjustesFm,
  type Enlace,
  type IdiomaFm,
  type SeccionMenu,
  type Traduccion,
} from "@/lib/fairmined";
import { IconoRed, Lupa, NOMBRE_RED } from "./Iconos";

const PORTADA: Record<IdiomaFm, string> = { en: "/", es: "/es", de: "/de", fr: "/fr" };
const NOMBRE_IDIOMA: Record<IdiomaFm, string> = {
  en: "English",
  es: "Español",
  de: "Deutsch",
  fr: "Français",
};

/** A dónde lleva una entrada: su página, si la tiene; si no, su dirección. */
export function destinoDe(e: Enlace): { href: string; fuera: boolean } | null {
  if (e.ruta) return { href: rutaFm(e.ruta), fuera: false };
  if (e.url) return resolverFm(e.url);
  return null;
}

function Entrada({ e, className }: { e: Enlace; className: string }) {
  const d = destinoDe(e);
  if (!d) return <span className={className}>{e.label}</span>;
  return d.fuera ? (
    <a href={d.href} target="_blank" rel="noopener noreferrer" className={className}>
      {e.label}
    </a>
  ) : (
    <Link href={d.href} className={className}>
      {e.label}
    </Link>
  );
}

/** Una sección del menú de escritorio, con su desplegable si lo tiene. */
function Seccion({ s, chica = false }: { s: SeccionMenu; chica?: boolean }) {
  const tieneHijos = !!s.hijos?.length;
  const letra = chica
    ? "text-[12px] tracking-[0.02em]"
    : "text-[14px] font-light";
  return (
    <li className="group relative">
      <Entrada
        e={s}
        className={
          s.destacado
            ? `fm-titulos inline-block rounded-[3px] bg-oro px-[5px] py-[2px] uppercase text-white ${letra}`
            : `fm-titulos inline-block py-[10px] pb-[12px] uppercase text-tinta-fm ${letra} ${tieneHijos ? "cursor-default" : "hover:text-oro"}`
        }
      />
      {tieneHijos && (
        <ul className="invisible absolute top-full left-[-15px] z-40 min-w-[200px] bg-white opacity-0 shadow-[0_0_5px_-1px_rgba(0,0,0,0.2)] transition-opacity duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
          {s.hijos!.map((h) => (
            <li key={h._key}>
              <Entrada
                e={h}
                className="fm-titulos block px-[15px] py-[10px] text-[14px] leading-[25px] whitespace-nowrap text-[#666] uppercase hover:bg-[#f7f7f7] hover:text-oro"
              />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function Idiomas({ idioma, traducciones }: { idioma: IdiomaFm; traducciones: Traduccion[] }) {
  const otros = IDIOMAS_VISIBLES.filter((i) => i !== idioma);
  if (!otros.length) return null;
  const ruta = (i: IdiomaFm) =>
    rutaFm(traducciones.find((t) => t.idioma === i && t.ruta)?.ruta ?? PORTADA[i]);
  return (
    <div className="group relative py-[12px]">
      <span className="flex items-center" title={NOMBRE_IDIOMA[idioma]}>
        <Image src={`/fairmined/bandera-${idioma === "en" ? "en" : "es"}.png`} alt={NOMBRE_IDIOMA[idioma]} width={16} height={11} />
      </span>
      <ul className="invisible absolute top-full right-[-10px] z-40 bg-white p-[10px] opacity-0 shadow-[0_0_5px_-1px_rgba(0,0,0,0.2)] group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        {otros.map((i) => (
          <li key={i}>
            <Link href={ruta(i)} hrefLang={i} title={NOMBRE_IDIOMA[i]} className="block py-1">
              <Image src={`/fairmined/bandera-${i === "en" ? "en" : "es"}.png`} alt={NOMBRE_IDIOMA[i]} width={16} height={11} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Cabecera({
  ajustes,
  idioma,
  traducciones = [],
}: {
  ajustes: AjustesFm | null;
  idioma: IdiomaFm;
  traducciones?: Traduccion[];
}) {
  const menu = ajustes?.menu ?? [];
  const arriba = ajustes?.menuSuperior ?? [];
  const redes = ajustes?.redes ?? [];
  const buscar = `${rutaFm("/buscar")}?l=${idioma}`;

  return (
    <header className="bg-white">
      {/* La barra de arriba */}
      <div className="hidden h-[31px] lg:block">
        <div className="mx-auto flex h-full max-w-[1170px] items-center justify-between px-[15px]">
          <div className="flex items-center">
            <ul className="flex">
              {redes.map((r) => (
                <li key={r._key}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={NOMBRE_RED[r.red] ?? r.red}
                    className="flex size-[31px] items-center justify-center text-[#494949] hover:text-oro"
                  >
                    <IconoRed red={r.red} tamano={14} />
                  </a>
                </li>
              ))}
            </ul>
            {ajustes?.barraContacto && (
              <span className="ml-[15px] text-[13px] font-light text-[#8e8d89]">
                {ajustes.barraContacto}
              </span>
            )}
          </div>
          {arriba.length > 0 && (
            <ul className="flex items-center gap-[18px]">
              {arriba.map((s) => (
                <Seccion key={s._key} s={s} chica />
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* El logo */}
      <div className="flex justify-center py-[18px] lg:py-[25px]">
        <Link href={rutaFm(PORTADA[idioma])} aria-label="Fairmined">
          <Image
            src="/fairmined/logo.png"
            alt="Fairmined"
            width={95}
            height={70}
            priority
            className="h-[56px] w-auto lg:h-[70px]"
          />
        </Link>
      </div>

      {/* El menú, en escritorio */}
      <nav aria-label="Menú principal" className="hidden border-t border-[#e4e4e4] lg:block">
        <div className="relative mx-auto flex max-w-[1180px] items-center justify-center px-[15px]">
          <ul className="flex items-center gap-x-[20px]">
            {menu.map((s) => (
              <Seccion key={s._key} s={s} />
            ))}
            <li>
              <Idiomas idioma={idioma} traducciones={traducciones} />
            </li>
          </ul>
          <Link
            href={buscar}
            aria-label="Search"
            className="absolute right-[15px] text-oro hover:opacity-80"
          >
            <Lupa />
          </Link>
        </div>
      </nav>

      {/* El menú, en teléfono y tableta */}
      <details className="group/movil border-t border-[#e4e4e4] lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 [&::-webkit-details-marker]:hidden">
          <span className="fm-titulos text-[14px] text-tinta-fm uppercase">Menu</span>
          <span aria-hidden="true" className="flex flex-col gap-[4px]">
            <span className="block h-[2px] w-[22px] bg-tinta-fm" />
            <span className="block h-[2px] w-[22px] bg-tinta-fm" />
            <span className="block h-[2px] w-[22px] bg-tinta-fm" />
          </span>
        </summary>
        <ul className="border-t border-[#e4e4e4] px-4 pb-4">
          {[...menu, ...arriba].map((s) =>
            s.hijos?.length ? (
              <li key={s._key} className="border-b border-[#efefef]">
                <details>
                  <summary className="fm-titulos flex cursor-pointer list-none justify-between py-3 text-[14px] text-tinta-fm uppercase [&::-webkit-details-marker]:hidden">
                    {s.label}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <ul className="pb-2 pl-3">
                    {s.hijos.map((h) => (
                      <li key={h._key}>
                        <Entrada
                          e={h}
                          className="fm-titulos block py-2 text-[13px] text-[#666] uppercase"
                        />
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ) : (
              <li key={s._key} className="border-b border-[#efefef]">
                <Entrada
                  e={s}
                  className={`fm-titulos block py-3 text-[14px] uppercase ${s.destacado ? "text-oro" : "text-tinta-fm"}`}
                />
              </li>
            ),
          )}
          <li className="flex items-center gap-4 pt-3">
            {IDIOMAS_VISIBLES.filter((i) => i !== idioma).map((i) => (
              <Link
                key={i}
                href={rutaFm(traducciones.find((t) => t.idioma === i)?.ruta ?? PORTADA[i])}
                hrefLang={i}
                className="flex items-center gap-2 text-[13px]"
              >
                <Image src={`/fairmined/bandera-${i === "en" ? "en" : "es"}.png`} alt="" width={16} height={11} />
                {NOMBRE_IDIOMA[i]}
              </Link>
            ))}
            <Link href={buscar} aria-label="Search" className="ml-auto text-oro">
              <Lupa />
            </Link>
          </li>
        </ul>
      </details>
    </header>
  );
}
