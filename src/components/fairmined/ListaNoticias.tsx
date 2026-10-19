/**
 * La lista de noticias, como /news en el original, medida a 1440 píxeles.
 *
 *   columna    760 px, centrada; cinco noticias por página y, al pie,
 *              «Next» y «Previous» (/news/page/2).
 *   fecha      etiqueta gris #E4E4E4, Roboto 12 px negrita, mayúsculas.
 *   foto       a todo el ancho de la columna.
 *   título     Century Gothic 32 px, dorado #8B7E33, mayúsculas.
 *   entradilla Roboto 16 px fina, #444, con 22 px de interlínea.
 *   botón      «READ MORE», 12 px negrita, dorado.
 */

import Image from "next/image";
import Link from "next/link";
import { hayImagen, urlImagen } from "@/lib/sanity";
import { rutaFm, type IdiomaFm, type Tarjeta } from "@/lib/fairmined";

export const POR_PAGINA = 5;

const LEER: Record<IdiomaFm, string> = {
  en: "Read more",
  es: "Leer más",
  de: "Weiterlesen",
  fr: "Lire la suite",
};
const SIGUIENTE: Record<IdiomaFm, [string, string]> = {
  en: ["Previous", "Next"],
  es: ["Anterior", "Siguiente"],
  de: ["Zurück", "Weiter"],
  fr: ["Précédent", "Suivant"],
};
const LOCALE: Record<IdiomaFm, string> = { en: "en-US", es: "es-ES", de: "de-DE", fr: "fr-FR" };

export function fechaLarga(iso: string | null, idioma: IdiomaFm) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(LOCALE[idioma], {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function ListaNoticias({
  lista,
  total,
  pagina,
  base,
  idioma,
}: {
  lista: Tarjeta[];
  total: number;
  pagina: number;
  base: string;
  idioma: IdiomaFm;
}) {
  const paginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  const enlace = (n: number) => rutaFm(n <= 1 ? base : `${base === "/" ? "" : base}/page/${n}`);
  return (
    <div className="mx-auto max-w-[790px] px-[15px] py-[40px]">
      <ul className="space-y-[60px]">
        {lista.map((n) => (
          <li key={n._id}>
            <article>
              <p className="inline-block bg-[#e4e4e4] px-[10px] py-[4px] text-[12px] leading-[25px] font-bold uppercase">
                {fechaLarga(n.fecha, idioma)}
              </p>
              {hayImagen(n.portada) && (
                <Link href={rutaFm(n.ruta)} className="mt-[15px] block">
                  <Image
                    src={urlImagen(n.portada).width(970).height(656).fit("crop").auto("format").url()}
                    alt=""
                    width={970}
                    height={656}
                    className="h-auto w-full"
                    sizes="(max-width: 790px) 100vw, 760px"
                  />
                </Link>
              )}
              <div className="px-0 pt-[30px] sm:px-[45px]">
                <h2 className="fm-titulos text-[24px] leading-[32px] font-medium text-[#8b7e33] uppercase sm:text-[32px] sm:leading-[40px]">
                  <Link href={rutaFm(n.ruta)} className="hover:opacity-80">
                    {n.titulo}
                  </Link>
                </h2>
                {n.entradilla && (
                  <p className="mt-[20px] text-[16px] leading-[22px] font-light text-[#444]">
                    {n.entradilla}
                  </p>
                )}
                <Link
                  href={rutaFm(n.ruta)}
                  className="mt-[10px] inline-block px-[16px] py-[14px] text-[12px] leading-[18px] font-bold text-[#8c7f33] uppercase hover:opacity-80 sm:-ml-[16px]"
                >
                  {LEER[idioma]}
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
      {paginas > 1 && (
        <nav aria-label="Páginas" className="mt-[50px] flex items-center justify-between text-[14px]">
          {pagina > 1 ? (
            <Link href={enlace(pagina - 1)} className="text-oro hover:opacity-80">
              ← {SIGUIENTE[idioma][0]}
            </Link>
          ) : (
            <span />
          )}
          <span className="text-[13px] text-[#8e8d89]">
            {pagina} / {paginas}
          </span>
          {pagina < paginas ? (
            <Link href={enlace(pagina + 1)} className="text-oro hover:opacity-80">
              {SIGUIENTE[idioma][1]} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}
