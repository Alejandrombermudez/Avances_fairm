/**
 * La ficha de un documento.
 *
 * Minimalista pero completa: lo que se ve de lejos es un campo —la portada si
 * la hay, un color si no— y lo que se lee de cerca son los datos que hoy viven
 * dentro del nombre del archivo.
 *
 * Ninguno de los 74 documentos de CRAFT tiene portada. En vez de dejar un
 * hueco gris, la ficha se dibuja como el lomo de un libro: el volumen o el
 * tipo escrito grande sobre color. Y si nadie elige el color, lo pone el tipo
 * de documento, para que la biblioteca se lea como un sistema sin que haya
 * que decidir setenta y cuatro veces.
 */

import Image from "next/image";
import Link from "next/link";
import { urlImagen, type Documento } from "@/lib/sanity";

/** El color por defecto de cada tipo. */
const COLOR_POR_TIPO: Record<string, string> = {
  volumen: "var(--color-cafe)",
  acta: "var(--color-taupe)",
  tdr: "var(--color-terracota)",
  plantilla: "var(--color-verde)",
  herramienta: "var(--color-verde)",
  folleto: "var(--color-arena)",
  sintesis: "var(--color-terracota)",
  comunicado: "var(--color-taupe)",
  informe: "var(--color-cafe)",
  guia: "var(--color-verde)",
};

const COLOR_ELEGIDO: Record<string, string> = {
  cafe: "var(--color-cafe)",
  terracota: "var(--color-terracota)",
  verde: "var(--color-verde)",
  arena: "var(--color-arena)",
  taupe: "var(--color-taupe)",
};

export const NOMBRE_TIPO: Record<string, string> = {
  volumen: "Volumen",
  folleto: "Folleto",
  plantilla: "Plantilla",
  acta: "Acta",
  tdr: "Términos de referencia",
  sintesis: "Síntesis",
  comunicado: "Comunicado",
  informe: "Informe",
  herramienta: "Herramienta",
  guia: "Guía",
};

/** El arena es claro: encima, el texto va en café. */
const claro = (c: string) => c.includes("arena");

export function campoDe(d: Documento) {
  const color =
    (d.acento && COLOR_ELEGIDO[d.acento]) ?? COLOR_POR_TIPO[d.tipo ?? ""] ?? "var(--color-taupe)";
  return { color, sobreClaro: claro(color) };
}

export const nombre = (d: Documento) => d.titulo ?? d.tituloEn ?? "(sin título)";

/* ── El campo: portada o color ─────────────────────────────────── */
function Campo({ d, alto }: { d: Documento; alto: string }) {
  const { color, sobreClaro } = campoDe(d);
  const marca = (d.volumen ?? NOMBRE_TIPO[d.tipo ?? ""] ?? "Documento").replace("Vol. ", "Volumen ");

  if (d.portada) {
    return (
      <div className={`relative ${alto} overflow-hidden`}>
        <Image
          src={urlImagen(d.portada).width(900).auto("format").url()}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 380px"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative ${alto} overflow-hidden`}
      style={{ background: color }}
      aria-hidden="true"
    >
      {/* El lomo: la marca del documento, grande y recortada por el borde */}
      <span
        className="titular absolute bottom-4 left-5 text-[clamp(1.6rem,5vw,2.2rem)] leading-none"
        style={{ color: sobreClaro ? "var(--color-cafe)" : "#fff", opacity: sobreClaro ? 0.7 : 0.78 }}
      >
        {marca}
      </span>
      {d.anio && (
        <span
          className="rotulo absolute top-5 right-5"
          style={{ color: sobreClaro ? "var(--color-cafe)" : "#fff", opacity: 0.75 }}
        >
          {d.anio}
        </span>
      )}
    </div>
  );
}

/* ── Las pastillas de idioma, en versión compacta ──────────────── */
function Idiomas({ d }: { d: Documento }) {
  const ls = [...(d.idiomas ?? [])].sort();
  return (
    <span className="flex flex-wrap gap-1.5">
      {ls.map((l) => (
        <span
          key={l}
          className="rounded bg-gris px-1.5 py-0.5 text-[10.5px] font-extrabold tracking-wider text-cafe"
        >
          {l.toUpperCase()}
        </span>
      ))}
      {ls.length > 0 && !ls.includes("es") && (
        <span className="rounded border border-dashed border-terracota/60 px-1.5 py-0.5 text-[10.5px] font-bold text-terracota">
          falta ES
        </span>
      )}
    </span>
  );
}

/* ── La ficha ──────────────────────────────────────────────────── */
export default function FichaDocumento({ d }: { d: Documento }) {
  const cuerpo = (
    <>
      <Campo d={d} alto="h-[170px]" />
      <div className="flex flex-1 flex-col p-6">
        <span className="rotulo text-terracota">
          {NOMBRE_TIPO[d.tipo ?? ""] ?? d.tipo}
          {d.deVersion ? ` · CRAFT ${d.deVersion.version}` : ""}
        </span>
        <h3 className="mt-2.5 text-[16.5px] leading-snug font-normal">
          {nombre(d).replace(/^CRAFT [\d.]+ — /, "")}
        </h3>
        {d.resumen && (
          <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-suave">{d.resumen}</p>
        )}
        <div className="mt-4 flex flex-1 items-end justify-between gap-3">
          <Idiomas d={d} />
          <span className="text-[12.5px] font-bold text-suave">
            {(d.archivos ?? []).length} archivo{(d.archivos ?? []).length === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </>
  );

  if (!d.slug) {
    return <article className="tarjeta flex flex-col overflow-hidden">{cuerpo}</article>;
  }

  return (
    <Link
      href={`/sitio/propuesta/documentos/${d.slug}`}
      className="tarjeta flex flex-col overflow-hidden transition-shadow duration-200 hover:shadow-[var(--sombra-suave)]"
    >
      {cuerpo}
    </Link>
  );
}
