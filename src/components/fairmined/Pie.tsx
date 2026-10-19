/**
 * El pie de fairmined.org, medido en el original a 1440 píxeles.
 *
 *   franja     fondo #F2EFED, 20 px arriba; cuatro columnas iguales en 1170 px:
 *              «Follow us!» con los iconos de las redes, «Contact», «ARM» con
 *              la dirección, y «Actors Map» con su imagen enlazada.
 *   títulos    Century Gothic en mayúsculas, dorado #8E7E33, sin negrita, con
 *              una raya debajo.
 *   derechos   la misma franja, 12 px, 15 px arriba y abajo.
 *
 * Todo sale de la ficha de ajustes del idioma: cada columna, su título, su
 * texto y su imagen se cambian desde el gestor.
 */

import Image from "next/image";
import Texto from "@/components/sitio/Texto";
import { hayImagen, urlImagen } from "@/lib/sanity";
import { resolverFm, type AjustesFm } from "@/lib/fairmined";
import { IconoRed, NOMBRE_RED } from "./Iconos";

export default function Pie({ ajustes }: { ajustes: AjustesFm | null }) {
  const columnas = ajustes?.columnas ?? [];
  const redes = ajustes?.redes ?? [];
  return (
    <footer className="bg-[#f2efed] text-[#444]">
      {columnas.length > 0 && (
        <div className="mx-auto grid max-w-[1170px] gap-8 px-[15px] pt-[20px] pb-[30px] sm:grid-cols-2 lg:grid-cols-4 lg:gap-[30px]">
          {columnas.map((c) => {
            const destino = c.enlace ? resolverFm(c.enlace) : null;
            return (
              <section key={c._key} className="fm-pie">
                {c.titulo && (
                  <h6 className="fm-titulos text-[16px] leading-[1] font-normal text-oro uppercase">
                    {c.titulo}
                  </h6>
                )}
                <hr className="my-[15px] border-0 border-t border-[#dcd6cf]" />
                {c.texto && <Texto valor={c.texto} sitio="fairmined" />}
                {c.redes && redes.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {redes.map((r) => (
                      <li key={r._key}>
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={NOMBRE_RED[r.red] ?? r.red}
                          className="flex size-[38px] items-center justify-center rounded-full bg-white text-[#494949] transition-colors hover:bg-oro hover:text-white"
                        >
                          <IconoRed red={r.red} tamano={16} />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                {hayImagen(c.imagen) && (
                  <a
                    href={destino?.href ?? "#"}
                    {...(destino?.fuera ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="block"
                  >
                    <Image
                      src={urlImagen(c.imagen).width(600).auto("format").url()}
                      alt={c.titulo ?? ""}
                      width={600}
                      height={400}
                      className="h-auto w-full"
                    />
                  </a>
                )}
              </section>
            );
          })}
        </div>
      )}
      {ajustes?.derechos && (
        <div className="border-t border-[#e6e0da] py-[15px]">
          <p className="mx-auto max-w-[1170px] px-[15px] text-[12px]">{ajustes.derechos}</p>
        </div>
      )}
    </footer>
  );
}
