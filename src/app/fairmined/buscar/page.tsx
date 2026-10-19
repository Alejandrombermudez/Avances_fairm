/**
 * La lupa de fairmined.org: busca en las páginas y las noticias del idioma en
 * que se está.
 *
 * Es una ruta propia y no una página del gestor: no tiene texto que editar.
 * Va antes que la ruta general, así que /fairmined/buscar nunca se confunde
 * con una página de fairmined.org.
 */

import Link from "next/link";
import Cabecera from "@/components/fairmined/Cabecera";
import Encabezado from "@/components/fairmined/Encabezado";
import { fechaLarga } from "@/components/fairmined/ListaNoticias";
import Pie from "@/components/fairmined/Pie";
import { IDIOMAS_FM, ajustesFm, buscarFm, rutaFm, type IdiomaFm } from "@/lib/fairmined";

export const dynamic = "force-dynamic";
export const metadata = { title: "Search" };

const TEXTOS: Record<IdiomaFm, { titulo: string; boton: string; nada: string; hay: string }> = {
  en: { titulo: "Search", boton: "Search", nada: "Nothing matched your search.", hay: "results" },
  es: { titulo: "Buscar", boton: "Buscar", nada: "No hay resultados para la búsqueda.", hay: "resultados" },
  de: { titulo: "Suche", boton: "Suchen", nada: "Keine Ergebnisse.", hay: "Ergebnisse" },
  fr: { titulo: "Recherche", boton: "Rechercher", nada: "Aucun résultat.", hay: "résultats" },
};
const INICIO: Record<IdiomaFm, string> = { en: "/", es: "/es", de: "/de", fr: "/fr" };

export default async function Buscar({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; l?: string }>;
}) {
  const { q = "", l } = await searchParams;
  const idioma: IdiomaFm = (IDIOMAS_FM as string[]).includes(l ?? "") ? (l as IdiomaFm) : "en";
  const t = TEXTOS[idioma];
  const [ajustes, resultados] = await Promise.all([
    ajustesFm(idioma),
    q.trim() ? buscarFm(q, idioma) : Promise.resolve([]),
  ]);

  return (
    <div className="min-h-screen bg-white">
      <Cabecera ajustes={ajustes} idioma={idioma} />
      <main>
        <Encabezado titulo={t.titulo} inicio={INICIO[idioma]} />
        <div className="mx-auto max-w-[810px] px-[15px] py-[40px]">
          <form action={rutaFm("/buscar")} className="flex gap-2">
            <input type="hidden" name="l" value={idioma} />
            <input
              type="search"
              name="q"
              defaultValue={q}
              aria-label={t.titulo}
              className="min-w-0 flex-1 border border-[#ddd] bg-[#f7f7f7] px-3 py-2 text-[15px] outline-none focus:border-oro"
            />
            <button
              type="submit"
              className="fm-titulos bg-oro px-5 text-[13px] text-white uppercase hover:opacity-90"
            >
              {t.boton}
            </button>
          </form>

          {q.trim() && (
            <p className="mt-6 text-[13px] text-[#8e8d89]">
              {resultados.length ? `${resultados.length} ${t.hay}` : t.nada}
            </p>
          )}
          <ul className="mt-4 divide-y divide-[#eee]">
            {resultados.map((r) => (
              <li key={r._id} className="py-5">
                {r.fecha && (
                  <p className="text-[12px] font-bold text-[#8e8d89] uppercase">
                    {fechaLarga(r.fecha, idioma)}
                  </p>
                )}
                <Link
                  href={rutaFm(r.ruta)}
                  className="fm-titulos mt-1 block text-[18px] leading-[26px] text-[#8b7e33] uppercase hover:opacity-80"
                >
                  {r.titulo}
                </Link>
                {r.extracto && (
                  <p className="mt-2 line-clamp-3 text-[15px] leading-[23px] font-light text-[#444]">
                    {r.extracto}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Pie ajustes={ajustes} />
    </div>
  );
}
