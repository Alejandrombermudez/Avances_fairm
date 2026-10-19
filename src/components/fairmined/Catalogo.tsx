"use client";

/**
 * «Where to buy»: el catálogo de proveedores autorizados, con su buscador y
 * sus filtros, como en fairmined.org (medido a 1440 píxeles):
 *
 *   columna izquierda  278 px: el buscador («keyword...») con su botón, y
 *                      debajo cuatro filtros que se abren al tocar su título:
 *                      metales, productos, servicios y países de envío.
 *   rejilla            900 px, tres columnas. Cada tarjeta: el logo (217×153),
 *                      el nombre en Roboto 20 px seminegrita #333, el país y
 *                      la web en 16 px.
 *
 * En el original el filtro lo hace el servidor (JetSmartFilters) y tarda;
 * aquí son 43 proveedores y se filtra en el navegador, al instante. Dentro de
 * un mismo filtro basta con que cumpla una de las opciones; entre filtros,
 * tiene que cumplirlas todas, que es como funciona el de hoy.
 */

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export type TarjetaProveedor = {
  id: string;
  nombre: string;
  logo: string | null;
  web: string | null;
  sede: string | null;
  ruta: string;
  facetas: Record<string, string[]>;
};

export type Faceta = { campo: string; titulo: string; opciones: string[] };

export default function Catalogo({
  proveedores,
  facetas,
  textos,
}: {
  proveedores: TarjetaProveedor[];
  facetas: Faceta[];
  textos: { buscar: string; marcador: string; limpiar: string; ninguno: string };
}) {
  const [busqueda, setBusqueda] = useState("");
  const [escrito, setEscrito] = useState("");
  const [marcadas, setMarcadas] = useState<Record<string, string[]>>({});
  const [abiertas, setAbiertas] = useState<Record<string, boolean>>({});

  const lista = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return proveedores.filter((p) => {
      if (q) {
        const todo = [p.nombre, p.sede ?? "", ...Object.values(p.facetas).flat()].join(" ").toLowerCase();
        if (!q.split(/\s+/).every((palabra) => todo.includes(palabra))) return false;
      }
      return Object.entries(marcadas).every(
        ([campo, opciones]) => !opciones.length || opciones.some((o) => p.facetas[campo]?.includes(o)),
      );
    });
  }, [proveedores, busqueda, marcadas]);

  const alternar = (campo: string, opcion: string) =>
    setMarcadas((m) => {
      const ya = m[campo] ?? [];
      return { ...m, [campo]: ya.includes(opcion) ? ya.filter((x) => x !== opcion) : [...ya, opcion] };
    });

  const hayFiltro = busqueda || Object.values(marcadas).some((x) => x.length);

  return (
    <div className="mx-auto grid max-w-[1200px] gap-[22px] px-[15px] pb-[60px] lg:grid-cols-[278px_1fr]">
      <aside className="lg:pt-[10px]">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            setBusqueda(escrito);
          }}
          className="flex gap-2"
        >
          <input
            type="search"
            value={escrito}
            onChange={(e) => setEscrito(e.target.value)}
            placeholder={textos.marcador}
            aria-label={textos.buscar}
            className="min-w-0 flex-1 border border-[#ddd] px-3 py-[6px] text-[15px] outline-none focus:border-oro"
          />
          <button
            type="submit"
            className="bg-[#21c8a3] px-4 py-[6px] text-[16px] font-medium text-white hover:opacity-90"
          >
            {textos.buscar}
          </button>
        </form>

        {facetas.map((f) => (
          <div key={f.campo} className="mt-[20px]">
            <button
              type="button"
              onClick={() => setAbiertas((a) => ({ ...a, [f.campo]: !a[f.campo] }))}
              aria-expanded={!!abiertas[f.campo]}
              className="fm-titulos flex w-full items-center justify-between text-left text-[15px] text-tinta-fm uppercase hover:text-oro"
            >
              <span>
                {f.titulo}
                {marcadas[f.campo]?.length ? (
                  <span className="ml-1 text-oro">({marcadas[f.campo].length})</span>
                ) : null}
              </span>
              <span aria-hidden="true" className="ml-2 text-[18px] leading-none">
                {abiertas[f.campo] ? "−" : "+"}
              </span>
            </button>
            {abiertas[f.campo] && (
              <ul className="mt-2 space-y-1">
                {f.opciones.map((o) => (
                  <li key={o}>
                    <label className="flex cursor-pointer items-start gap-2 text-[14px] leading-[20px] font-light text-[#444]">
                      <input
                        type="checkbox"
                        checked={!!marcadas[f.campo]?.includes(o)}
                        onChange={() => alternar(f.campo, o)}
                        className="mt-[3px] accent-[#8e7e33]"
                      />
                      {o}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {hayFiltro && (
          <button
            type="button"
            onClick={() => {
              setBusqueda("");
              setEscrito("");
              setMarcadas({});
            }}
            className="mt-[24px] text-[15px] font-semibold text-[#333] underline-offset-2 hover:underline"
          >
            {textos.limpiar}
          </button>
        )}
      </aside>

      <div>
        {lista.length === 0 ? (
          <p className="py-10 text-[15px] text-[#666]">{textos.ninguno}</p>
        ) : (
          <ul className="grid gap-[20px] sm:grid-cols-2 lg:grid-cols-3">
            {lista.map((p) => (
              <li key={p.id} className="border border-[#eee] p-[25px] transition-shadow hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                <Link href={p.ruta} className="flex h-[153px] items-center justify-center">
                  {p.logo ? (
                    <Image
                      src={p.logo}
                      alt={p.nombre}
                      width={217}
                      height={153}
                      className="max-h-[153px] w-auto object-contain"
                    />
                  ) : (
                    <span className="fm-titulos text-[18px] text-oro">{p.nombre}</span>
                  )}
                </Link>
                <h3 className="mt-[25px] text-center text-[20px] leading-[24px] font-semibold text-[#333]">
                  <Link href={p.ruta} className="hover:text-oro">
                    {p.nombre}
                  </Link>
                </h3>
                {p.sede && <p className="mt-[12px] text-[16px] font-medium text-[#444]">{p.sede}</p>}
                {p.web && (
                  <a
                    href={p.web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-[10px] block text-[16px] font-medium break-all text-[#444] hover:text-oro"
                  >
                    {p.web}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
