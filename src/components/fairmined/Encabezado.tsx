/**
 * La franja del título, medida en el original a 1440 píxeles: fondo #F7F7F7,
 * 35 px arriba y abajo, raya #E4E4E4 debajo. El título en Century Gothic 32 px,
 * mayúsculas, #222, a la izquierda; las migas debajo, a la derecha, en Roboto
 * 11 px #333: «Fairmined > Página madre > Página».
 */

import Link from "next/link";
import { rutaFm, type Miga } from "@/lib/fairmined";

export default function Encabezado({
  titulo,
  migas = [],
  inicio,
  dorado = false,
}: {
  titulo: string;
  migas?: Miga[];
  inicio: string;
  /** La de noticias lleva el título en dorado. */
  dorado?: boolean;
}) {
  return (
    <div className="border-b border-[#e4e4e4] bg-[#f7f7f7] py-[24px] lg:py-[35px]">
      <div className="mx-auto max-w-[1170px] px-[15px]">
        <h1
          className={`fm-titulos text-[24px] leading-[32px] font-medium uppercase [overflow-wrap:anywhere] lg:text-[32px] lg:leading-[40px] ${dorado ? "text-oro" : "text-[#222]"}`}
        >
          {titulo}
        </h1>
        <nav aria-label="Migas" className="mt-3 text-right text-[11px] leading-[22px] text-[#333]">
          <Link href={rutaFm(inicio)} className="hover:text-oro">
            Fairmined
          </Link>
          {migas.map((m) => (
            <span key={`${m.ruta}-${m.titulo}`}>
              {" > "}
              {m.ruta ? (
                <Link href={rutaFm(m.ruta)} className="hover:text-oro">
                  {m.titulo}
                </Link>
              ) : (
                m.titulo
              )}
            </span>
          ))}
          <span>
            {" > "}
            {titulo}
          </span>
        </nav>
      </div>
    </div>
  );
}
