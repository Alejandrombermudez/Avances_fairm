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
 *   - a la izquierda, la lista: cada actor con su papel, su país y desde
 *     cuándo es Fairmined. Tocar uno abre su ficha en esa misma barra: su
 *     web, su identificador, y lo que ofrece y cómo contactarlo si está en el
 *     catálogo, o el comienzo de su perfil si es una mina. «Volver» —o la
 *     tecla Esc— regresa a la lista donde se dejó;
 *   - a la derecha, el mapa: un círculo por país con cuántos hay. Tocarlo
 *     filtra la lista por ese país. Con un actor abierto, el mapa va a su
 *     país y lo marca.
 *
 * El mapa es Leaflet con la cartografía libre de OpenStreetMap: no pide
 * clave ni cookies. (CARTO, la primera que se probó, ya exige clave.) Carga solo en el navegador y solo cuando hace falta.
 *
 * Los datos salen de la lista de actores 2026 y de los perfiles de las
 * minas, en el gestor. La precisión es la del país —es lo que dice la
 * lista—, salvo los actores que tengan su ubicación exacta en el gestor.
 */

import "leaflet/dist/leaflet.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
  /** La fecha de alta completa, AAAA-MM-DD. */
  alta: string | null;
  ubicacion: { lat: number; lng: number } | null;
  ficha: string | null;
  logo: string | null;
  /** El comienzo del perfil, en las minas. */
  texto: string | null;
  /** Lo que ofrece, en los proveedores del catálogo. */
  catalogo: {
    materiales: string[];
    productos: string[];
    servicios: string[];
    envios: string[];
    minimo: string;
    entrega: string;
  } | null;
  contacto: { nombre?: string; correo?: string; telefono?: string; direccion?: string } | null;
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
    nota: "Each circle is a country, with how many actors it has. Tap one to see them. Tap an actor in the list to see their details.",
    volver: "Back to the list",
    rotulos: {
      pais: "Country",
      id: "Fairmined ID",
      materiales: "Certified metals",
      productos: "Products",
      servicios: "Services",
      envios: "Ships to",
      minimo: "Minimum order",
      entrega: "Delivers to",
      contacto: "Contact",
    },
    verPais: (p: string) => `See all in ${p}`,
    fichaCompleta: "See full profile",
    perfilMina: "See the mine’s profile",
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
    nota: "Cada círculo es un país, con cuántos actores tiene. Tócalo para verlos. Toca un actor de la lista para ver su información.",
    volver: "Volver a la lista",
    rotulos: {
      pais: "País",
      id: "ID Fairmined",
      materiales: "Metales certificados",
      productos: "Productos",
      servicios: "Servicios",
      envios: "Envía a",
      minimo: "Pedido mínimo",
      entrega: "Entrega en",
      contacto: "Contacto",
    },
    verPais: (p: string) => `Ver todos en ${p}`,
    fichaCompleta: "Ver la ficha completa",
    perfilMina: "Ver el perfil de la mina",
  },
};

type Textos = (typeof TEXTOS)["en"] | (typeof TEXTOS)["es"];

function Papeles({ roles, t }: { roles: string[]; t: Textos }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      {roles.map((r) => (
        <span
          key={r}
          className={`rounded-full px-2 py-[1px] text-[11.5px] ${r === "mina" ? "bg-oro text-white" : r === "miembroArm" ? "border border-[#ddd] text-[#666]" : "border border-oro/60 text-oro"}`}
        >
          {t.papel[r as keyof typeof t.papel] ?? r}
        </span>
      ))}
    </span>
  );
}

/** «https://www.adrianadiazh.com/» → «adrianadiazh.com». */
function dominio(web: string) {
  try {
    return new URL(web).hostname.replace(/^www\./, "");
  } catch {
    return web;
  }
}

function fechaDeAlta(alta: string, idioma: string) {
  const d = new Date(`${alta}T00:00:00`);
  if (Number.isNaN(d.getTime())) return alta;
  return d.toLocaleDateString(idioma === "es" ? "es" : "en", { day: "numeric", month: "long", year: "numeric" });
}

function Dato({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="py-3">
      <dt className="text-[11.5px] tracking-[0.04em] text-[#8e8d89] uppercase">{rotulo}</dt>
      <dd className="mt-1 text-[14.5px] leading-[22px] font-light text-[#333]">{children}</dd>
    </div>
  );
}

/** La ficha de un actor, en la barra de la izquierda. */
function FichaActor({
  a,
  t,
  idioma,
  alVolver,
  alPais,
}: {
  a: ActorMapa;
  t: Textos;
  idioma: string;
  alVolver: () => void;
  alPais: (p: string) => void;
}) {
  const caja = useRef<HTMLElement>(null);
  /* Al abrirla, el foco va a la ficha: quien navega con teclado o lector de
     pantalla sigue desde ahí, y en el teléfono la pantalla baja hasta ella. */
  useEffect(() => {
    caja.current?.focus();
  }, [a.id]);

  const r = t.rotulos;
  const c = a.catalogo;
  const lista = (v: string[]) => v.join(", ");
  const esMina = a.roles.includes("mina");
  return (
    <aside
      ref={caja}
      tabIndex={-1}
      aria-labelledby="fm-actor-nombre"
      className="border-y border-[#eee] pt-3 pb-5 outline-none lg:max-h-[668px] lg:overflow-y-auto lg:pr-2"
    >
      <button type="button" onClick={alVolver} className="text-[13px] text-oro hover:underline">
        ← {t.volver}
      </button>

      {a.logo && (
        <div className="mt-4 flex h-[110px] items-center justify-center border border-[#eee] p-3">
          <Image src={a.logo} alt="" width={217} height={110} className="max-h-[86px] w-auto object-contain" />
        </div>
      )}

      <h2 id="fm-actor-nombre" className="mt-4 text-[22px] leading-[28px] font-medium text-[#222]">
        {a.nombre}
      </h2>
      <p className="mt-2">
        <Papeles roles={a.roles} t={t} />
      </p>

      <dl className="mt-3 divide-y divide-[#eee] border-t border-[#eee]">
        {a.pais && (
          <Dato rotulo={r.pais}>
            {nombrePais(a.pais, idioma)}
            <button
              type="button"
              onClick={() => alPais(a.pais!)}
              className="ml-2 text-[13px] text-oro hover:underline"
            >
              {t.verPais(nombrePais(a.pais, idioma))}
            </button>
          </Dato>
        )}
        {a.alta && <Dato rotulo={t.desde}>{fechaDeAlta(a.alta, idioma)}</Dato>}
        {a.fairminedId && <Dato rotulo={r.id}>{a.fairminedId}</Dato>}
        {a.web && (
          <Dato rotulo={t.web}>
            <a href={a.web} target="_blank" rel="noopener noreferrer" className="break-all text-oro hover:underline">
              {dominio(a.web)} ↗
            </a>
          </Dato>
        )}
        {c && c.materiales.length > 0 && <Dato rotulo={r.materiales}>{lista(c.materiales)}</Dato>}
        {c && c.productos.length > 0 && <Dato rotulo={r.productos}>{lista(c.productos)}</Dato>}
        {c && c.servicios.length > 0 && <Dato rotulo={r.servicios}>{lista(c.servicios)}</Dato>}
        {c && c.envios.length > 0 && <Dato rotulo={r.envios}>{lista(c.envios)}</Dato>}
        {c?.minimo && <Dato rotulo={r.minimo}>{c.minimo}</Dato>}
        {c?.entrega && <Dato rotulo={r.entrega}>{c.entrega}</Dato>}
        {a.contacto && (
          <Dato rotulo={r.contacto}>
            {a.contacto.nombre && <span className="block">{a.contacto.nombre}</span>}
            {a.contacto.correo && (
              <a href={`mailto:${a.contacto.correo}`} className="block break-all text-oro hover:underline">
                {a.contacto.correo}
              </a>
            )}
            {a.contacto.telefono && (
              <a href={`tel:${a.contacto.telefono.replace(/[^\d+]/g, "")}`} className="block hover:text-oro">
                {a.contacto.telefono}
              </a>
            )}
            {a.contacto.direccion && <span className="block whitespace-pre-line">{a.contacto.direccion}</span>}
          </Dato>
        )}
      </dl>

      {a.texto && <p className="mt-4 text-[14.5px] leading-[23px] font-light text-[#444]">{a.texto}</p>}

      {a.ficha && (
        <Link
          href={a.ficha}
          className="mt-5 inline-block bg-oro px-5 py-2.5 text-[14px] text-white transition-colors hover:bg-[#252525]"
        >
          {esMina ? t.perfilMina : t.fichaCompleta} →
        </Link>
      )}
    </aside>
  );
}

export default function MapaActores({ actores, idioma }: { actores: ActorMapa[]; idioma: string }) {
  const t = TEXTOS[idioma === "es" ? "es" : "en"];
  const [papel, setPapel] = useState<Papel | null>(null);
  const [pais, setPais] = useState<string>("");
  const [busqueda, setBusqueda] = useState("");
  const [elegido, setElegido] = useState<string | null>(null);
  const caja = useRef<HTMLDivElement>(null);
  const mapa = useRef<MapaLeaflet | null>(null);
  const capa = useRef<LayerGroup | null>(null);
  const [listo, setListo] = useState(false);
  /* Dónde iba la lista al abrir una ficha, para volver ahí. */
  const listaCaja = useRef<HTMLUListElement>(null);
  const desplazado = useRef(0);
  const ultimo = useRef<string | null>(null);

  const actor = useMemo(() => actores.find((a) => a.id === elegido) ?? null, [actores, elegido]);

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

  const abrir = (id: string) => {
    if (!elegido) desplazado.current = listaCaja.current?.scrollTop ?? 0;
    ultimo.current = id;
    setElegido(id);
  };
  const cerrar = () => setElegido(null);

  /* De vuelta en la lista: donde se dejó, con el foco en el actor que se
     abrió. */
  useLayoutEffect(() => {
    if (elegido || !ultimo.current) return;
    if (listaCaja.current) listaCaja.current.scrollTop = desplazado.current;
    document.getElementById(`fm-actor-${ultimo.current}`)?.focus({ preventScroll: true });
  }, [elegido]);

  /* Esc cierra la ficha. */
  useEffect(() => {
    if (!elegido) return;
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && setElegido(null);
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [elegido]);

  /* El mapa, una sola vez. */
  useEffect(() => {
    let vivo = true;
    (async () => {
      const L = (await import("leaflet")).default;
      if (!vivo || !caja.current || mapa.current) return;
      const m = L.map(caja.current, { worldCopyJump: true, scrollWheelZoom: false, minZoom: 1 }).setView([20, 0], 2);
      /* OpenStreetMap: libre, sin clave. Se ve en grises (globals.css) para
         que lo que destaque sean los círculos dorados. */
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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

  /* Los círculos, cada vez que cambian los filtros o el actor abierto. */
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
        const marcado = p === pais || (actor && !actor.ubicacion && p === actor.pais);
        const icono = L.divIcon({
          className: "",
          html: `<span class="fm-burbuja${marcado ? " fm-burbuja-elegida" : ""}" style="width:${lado}px;height:${lado}px">${n}</span>`,
          iconSize: [lado, lado],
          iconAnchor: [lado / 2, lado / 2],
        });
        L.marker([PAISES[p].lat, PAISES[p].lng], { icon: icono, title: nombrePais(p, idioma), keyboard: true })
          .bindTooltip(`${nombrePais(p, idioma)} · ${t.resultados(n)}`, { direction: "top", offset: [0, -lado / 2] })
          .on("click", () => {
            setElegido(null);
            setPais((ya) => (ya === p ? "" : p));
          })
          .addTo(capa.current!);
      }
      /* Los que tienen su ubicación exacta, cada uno en su sitio; tocarlo abre
         su ficha. */
      for (const a of sinPais) {
        if (!a.ubicacion) continue;
        const este = a.id === actor?.id;
        L.circleMarker([a.ubicacion.lat, a.ubicacion.lng], {
          radius: este ? 9 : 7,
          color: "#fff",
          weight: 2,
          fillColor: este ? "#252525" : "#8e7e33",
          fillOpacity: 1,
        })
          .bindTooltip(a.nombre)
          .on("click", () => abrir(a.id))
          .addTo(capa.current!);
      }
    })();
    return () => {
      vivo = false;
    };
    /* `abrir` no va en la lista: cambia en cada dibujo y no hace falta
       repintar por él. */
  }, [listo, sinPais, pais, idioma, t, actor]);

  /* Al elegir un país, el mapa va hacia él. */
  useEffect(() => {
    if (!mapa.current) return;
    if (pais && PAISES[pais]) mapa.current.flyTo([PAISES[pais].lat, PAISES[pais].lng], 4, { duration: 0.8 });
  }, [pais]);

  /* Y al abrir un actor, hacia el suyo, o hacia su punto si lo tiene. */
  useEffect(() => {
    if (!mapa.current || !actor) return;
    if (actor.ubicacion) mapa.current.flyTo([actor.ubicacion.lat, actor.ubicacion.lng], 6, { duration: 0.8 });
    else if (actor.pais && PAISES[actor.pais])
      mapa.current.flyTo([PAISES[actor.pais].lat, PAISES[actor.pais].lng], 4, { duration: 0.8 });
  }, [actor]);

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
          onChange={(e) => {
            setBusqueda(e.target.value);
            setElegido(null);
          }}
          placeholder={t.buscar}
          aria-label={t.buscar}
          className="min-w-0 flex-1 border border-[#ddd] px-3 py-2 text-[15px] outline-none focus:border-oro"
        />
        <select
          value={pais}
          onChange={(e) => {
            setPais(e.target.value);
            setElegido(null);
          }}
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
          <div ref={caja} className="fm-mapa h-[340px] w-full border border-[#e4e4e4] bg-[#f2efed] lg:h-[640px]" />
          <p className="mt-2 text-[12.5px] font-light text-[#8e8d89]">{t.nota}</p>
        </div>

        <div className="lg:order-1">
          {actor && (
            <FichaActor
              a={actor}
              t={t}
              idioma={idioma}
              alVolver={cerrar}
              alPais={(p) => {
                setPais(p);
                setElegido(null);
              }}
            />
          )}

          {/* La lista sigue montada debajo de la ficha, para no perder dónde iba. */}
          <div hidden={!!actor}>
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
              <ul
                ref={listaCaja}
                className="mt-2 max-h-[600px] divide-y divide-[#eee] overflow-y-auto border-y border-[#eee] lg:max-h-[640px]"
              >
                {lista.map((a) => (
                  <li key={a.id}>
                    <button
                      id={`fm-actor-${a.id}`}
                      type="button"
                      onClick={() => abrir(a.id)}
                      className="group flex w-full items-start gap-2 py-3 pr-2 text-left outline-none hover:bg-[#faf8f2] focus-visible:bg-[#faf8f2]"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-[16px] leading-snug font-medium text-[#222] group-hover:text-oro">
                          {a.nombre}
                        </span>
                        <span className="mt-1 block">
                          <Papeles roles={a.roles} t={t} />
                        </span>
                        <span className="mt-1.5 block text-[13.5px] font-light text-[#666]">
                          {nombrePais(a.pais, idioma)}
                          {a.anio && ` · ${t.desde} ${a.anio}`}
                          {a.fairminedId && ` · ${a.fairminedId}`}
                        </span>
                      </span>
                      <span aria-hidden className="pt-0.5 text-[18px] text-[#bbb] group-hover:text-oro">
                        ›
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
