"use client";

/**
 * El mapa de la familia Fairmined: marcas licenciatarias, proveedores
 * autorizados y minas certificadas.
 *
 * El de hoy (Google Maps con JetEngine) no dibuja nada si no se aceptan las
 * cookies, guarda 253 actores sin coordenadas y no deja ver quién es quién
 * sin abrir cada punto. Este se arma así:
 *
 *   - arriba, los papeles con su número, que filtran; un buscador por nombre
 *     o identificador, y el país;
 *   - a la izquierda, la lista: cada actor con su papel, su país, desde
 *     cuándo es Fairmined, su web y su ficha o su perfil;
 *   - a la derecha, el mapa: un círculo por país con cuántos hay. Tocarlo
 *     filtra la lista por ese país.
 *
 * El mapa es Leaflet con la cartografía libre de OpenStreetMap: no pide
 * clave ni cookies. Carga solo en el navegador y solo cuando hace falta.
 *
 * Los datos salen de la lista de actores 2026 y de los perfiles de las
 * minas, en el gestor. La precisión es la del país —es lo que dice la
 * lista—, salvo los actores que tengan su ubicación exacta en el gestor.
 */

import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MapaLeaflet, LayerGroup } from "leaflet";
import { PAISES, nombrePais } from "@/lib/paises";

export type ActorMapa = {
  id: string;
  nombre: string;
  roles: string[];
  pais: string | null;
  web: string | null;
  fairminedId: string | null;
  anio: string | null;
  ubicacion: { lat: number; lng: number } | null;
  ficha: string | null;
};

const PAPELES = ["marca", "proveedor", "mina"] as const;
type Papel = (typeof PAPELES)[number];

const TEXTOS = {
  en: {
    papeles: { marca: "Licensed brands", proveedor: "Authorized suppliers", mina: "Certified mines" },
    papel: { marca: "Licensed brand", proveedor: "Authorized supplier", mina: "Certified mine", miembroArm: "ARM member" },
    todos: "All",
    buscar: "Search by name or Fairmined ID",
    pais: "All countries",
    desde: "Fairmined since",
    ficha: "See profile",
    web: "Website",
    resultados: (n: number) => `${n} ${n === 1 ? "actor" : "actors"}`,
    nada: "No actors match these filters.",
    limpiar: "Clear filters",
    nota: "Each circle is a country, with how many actors it has. Tap one to see them.",
  },
  es: {
    papeles: { marca: "Marcas licenciatarias", proveedor: "Proveedores autorizados", mina: "Minas certificadas" },
    papel: { marca: "Marca licenciataria", proveedor: "Proveedor autorizado", mina: "Mina certificada", miembroArm: "Miembro de ARM" },
    todos: "Todos",
    buscar: "Buscar por nombre o ID Fairmined",
    pais: "Todos los países",
    desde: "Fairmined desde",
    ficha: "Ver perfil",
    web: "Sitio web",
    resultados: (n: number) => `${n} ${n === 1 ? "actor" : "actores"}`,
    nada: "Ningún actor coincide con estos filtros.",
    limpiar: "Quitar filtros",
    nota: "Cada círculo es un país, con cuántos actores tiene. Tócalo para verlos.",
  },
};

export default function MapaActores({ actores, idioma }: { actores: ActorMapa[]; idioma: string }) {
  const t = TEXTOS[idioma === "es" ? "es" : "en"];
  const [papel, setPapel] = useState<Papel | null>(null);
  const [pais, setPais] = useState<string>("");
  const [busqueda, setBusqueda] = useState("");
  const caja = useRef<HTMLDivElement>(null);
  const mapa = useRef<MapaLeaflet | null>(null);
  const capa = useRef<LayerGroup | null>(null);
  const [listo, setListo] = useState(false);

  /* Lo que cumple el papel y la búsqueda; el país se aplica aparte para que
     el mapa siga mostrando los demás países. */
  const sinPais = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return actores.filter(
      (a) =>
        (!papel || a.roles.includes(papel)) &&
        (!q || a.nombre.toLowerCase().includes(q) || (a.fairminedId ?? "").toLowerCase().includes(q)),
    );
  }, [actores, papel, busqueda]);
  const lista = useMemo(() => sinPais.filter((a) => !pais || a.pais === pais), [sinPais, pais]);

  const cuentaPapel = (p: Papel) => actores.filter((a) => a.roles.includes(p)).length;
  const paises = useMemo(
    () => [...new Set(actores.map((a) => a.pais).filter(Boolean) as string[])].sort((a, b) =>
      nombrePais(a, idioma).localeCompare(nombrePais(b, idioma), idioma),
    ),
    [actores, idioma],
  );

  /* El mapa, una sola vez. */
  useEffect(() => {
    let vivo = true;
    (async () => {
      const L = (await import("leaflet")).default;
      if (!vivo || !caja.current || mapa.current) return;
      const m = L.map(caja.current, { worldCopyJump: true, scrollWheelZoom: false, minZoom: 1 }).setView([20, 0], 2);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 12,
      }).addTo(m);
      mapa.current = m;
      capa.current = L.layerGroup().addTo(m);
      setListo(true);
    })();
    return () => {
      vivo = false;
      mapa.current?.remove();
      mapa.current = null;
    };
  }, []);

  /* Los círculos, cada vez que cambian los filtros. */
  useEffect(() => {
    if (!listo || !capa.current) return;
    let vivo = true;
    (async () => {
      const L = (await import("leaflet")).default;
      if (!vivo || !capa.current) return;
      capa.current.clearLayers();
      const porPais = new Map<string, ActorMapa[]>();
      for (const a of sinPais) {
        if (a.ubicacion) continue;
        if (!a.pais || !PAISES[a.pais]) continue;
        porPais.set(a.pais, [...(porPais.get(a.pais) ?? []), a]);
      }
      for (const [p, gente] of porPais) {
        const n = gente.length;
        const lado = Math.round(22 + Math.sqrt(n) * 7);
        const elegido = p === pais;
        const icono = L.divIcon({
          className: "",
          html: `<span class="fm-burbuja${elegido ? " fm-burbuja-elegida" : ""}" style="width:${lado}px;height:${lado}px">${n}</span>`,
          iconSize: [lado, lado],
          iconAnchor: [lado / 2, lado / 2],
        });
        L.marker([PAISES[p].lat, PAISES[p].lng], { icon: icono, title: nombrePais(p, idioma), keyboard: true })
          .bindTooltip(`${nombrePais(p, idioma)} · ${t.resultados(n)}`, { direction: "top", offset: [0, -lado / 2] })
          .on("click", () => setPais((ya) => (ya === p ? "" : p)))
          .addTo(capa.current!);
      }
      /* Los que tienen su ubicación exacta, cada uno en su sitio. */
      for (const a of sinPais) {
        if (!a.ubicacion) continue;
        L.circleMarker([a.ubicacion.lat, a.ubicacion.lng], {
          radius: 7,
          color: "#fff",
          weight: 2,
          fillColor: "#8e7e33",
          fillOpacity: 1,
        })
          .bindTooltip(a.nombre)
          .addTo(capa.current!);
      }
    })();
    return () => {
      vivo = false;
    };
  }, [listo, sinPais, pais, idioma, t]);

  /* Al elegir un país, el mapa va hacia él. */
  useEffect(() => {
    if (!mapa.current) return;
    if (pais && PAISES[pais]) mapa.current.flyTo([PAISES[pais].lat, PAISES[pais].lng], 4, { duration: 0.8 });
  }, [pais]);

  const hayFiltro = papel || pais || busqueda;

  return (
    <div className="mx-auto max-w-[1200px] px-[15px] pb-[60px]">
      {/* Los papeles, que filtran */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Papel">
        <button
          type="button"
          onClick={() => setPapel(null)}
          aria-pressed={!papel}
          className={`rounded-full border px-4 py-2 text-[14px] transition-colors ${!papel ? "border-oro bg-oro text-white" : "border-[#ddd] text-[#444] hover:border-oro"}`}
        >
          {t.todos} <span className="opacity-75">{actores.length}</span>
        </button>
        {PAPELES.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPapel((ya) => (ya === p ? null : p))}
            aria-pressed={papel === p}
            className={`rounded-full border px-4 py-2 text-[14px] transition-colors ${papel === p ? "border-oro bg-oro text-white" : "border-[#ddd] text-[#444] hover:border-oro"}`}
          >
            {t.papeles[p]} <span className="opacity-75">{cuentaPapel(p)}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder={t.buscar}
          aria-label={t.buscar}
          className="min-w-0 flex-1 border border-[#ddd] px-3 py-2 text-[15px] outline-none focus:border-oro"
        />
        <select
          value={pais}
          onChange={(e) => setPais(e.target.value)}
          aria-label={t.pais}
          className="border border-[#ddd] bg-white px-3 py-2 text-[15px] outline-none focus:border-oro sm:w-[260px]"
        >
          <option value="">{t.pais}</option>
          {paises.map((p) => (
            <option key={p} value={p}>
              {nombrePais(p, idioma)}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[380px_1fr]">
        {/* El mapa va primero en el teléfono */}
        <div className="lg:order-2">
          <div ref={caja} className="h-[340px] w-full border border-[#e4e4e4] bg-[#f2efed] lg:h-[640px]" />
          <p className="mt-2 text-[12.5px] font-light text-[#8e8d89]">{t.nota}</p>
        </div>

        <div className="lg:order-1">
          <div className="flex items-baseline justify-between">
            <p className="text-[13px] text-[#8e8d89]">
              {t.resultados(lista.length)}
              {pais ? ` · ${nombrePais(pais, idioma)}` : ""}
            </p>
            {hayFiltro && (
              <button
                type="button"
                onClick={() => {
                  setPapel(null);
                  setPais("");
                  setBusqueda("");
                  mapa.current?.flyTo([20, 0], 2, { duration: 0.8 });
                }}
                className="text-[13px] text-oro hover:underline"
              >
                {t.limpiar}
              </button>
            )}
          </div>
          {lista.length === 0 ? (
            <p className="py-10 text-[15px] text-[#666]">{t.nada}</p>
          ) : (
            <ul className="mt-2 max-h-[600px] divide-y divide-[#eee] overflow-y-auto border-y border-[#eee] lg:max-h-[640px]">
              {lista.map((a) => (
                <li key={a.id} className="py-3 pr-2">
                  <p className="text-[16px] leading-snug font-medium text-[#222]">{a.nombre}</p>
                  <p className="mt-1 flex flex-wrap gap-1.5">
                    {a.roles.map((r) => (
                      <span
                        key={r}
                        className={`rounded-full px-2 py-[1px] text-[11.5px] ${r === "mina" ? "bg-oro text-white" : r === "miembroArm" ? "border border-[#ddd] text-[#666]" : "border border-oro/60 text-oro"}`}
                      >
                        {t.papel[r as keyof typeof t.papel] ?? r}
                      </span>
                    ))}
                  </p>
                  <p className="mt-1.5 text-[13.5px] font-light text-[#666]">
                    <button
                      type="button"
                      onClick={() => a.pais && setPais(a.pais)}
                      className="hover:text-oro hover:underline"
                    >
                      {nombrePais(a.pais, idioma)}
                    </button>
                    {a.anio && ` · ${t.desde} ${a.anio}`}
                    {a.fairminedId && ` · ${a.fairminedId}`}
                  </p>
                  {(a.web || a.ficha) && (
                    <p className="mt-1 flex flex-wrap gap-x-4 text-[13.5px]">
                      {a.ficha && (
                        <Link href={a.ficha} className="text-oro hover:underline">
                          {t.ficha} →
                        </Link>
                      )}
                      {a.web && (
                        <a href={a.web} target="_blank" rel="noopener noreferrer" className="break-all text-oro hover:underline">
                          {t.web} ↗
                        </a>
                      )}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
