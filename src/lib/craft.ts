/**
 * Lee el contenido migrado de CRAFT.
 *
 * Es el mismo archivo que se importará a Sanity: `data/sanity/craft.ndjson`,
 * generado por `tools/migrar_craft.py` y comprobado por `tools/validar_ndjson.py`.
 * Las consultas de aquí son las mismas que harán las de Sanity, solo que contra
 * un array en vez de contra la API. Cuando exista la cuenta, cambia el origen
 * y no cambia nada más.
 *
 * Todo esto corre en el servidor, al generar la página. Al navegador solo le
 * llega el HTML: el archivo de 1,3 MB no se envía.
 */

import datos from "@/data/craft-contenido.json";

export type Span = { _type: "span"; _key: string; text: string; marks?: string[] };
export type MarkDef = { _key: string; _type: string; href?: string };
export type Bloque =
  | {
      _type: "block";
      _key: string;
      style?: string;
      listItem?: string;
      level?: number;
      children: Span[];
      markDefs?: MarkDef[];
    }
  | { _type: "imagen"; _key: string; alt?: string; _sanityAsset?: string };

export type Doc = {
  _id: string;
  _type: string;
  _arma?: string;
  title?: string;
  question?: string;
  slug?: { current: string };
  language?: string;
  site?: string;
  sites?: string[];
  body?: Bloque[];
  answer?: Bloque[];
  lead?: string;
  excerpt?: string;
  place?: string;
  date?: string;
  publishedAt?: string;
  year?: number | null;
  documentType?: string;
  volumeLabel?: string;
  files?: { _key: string; lang: string; externalUrl?: string }[];
  volumeOf?: { _ref: string };
  version?: string;
  status?: string;
  releaseDate?: string;
  volumes?: { _ref: string }[];
  currentVersion?: { _ref: string };
  topics?: { _ref: string }[];
  legacyPaths?: string[];
  order?: number;
};

const DOCS = datos as unknown as Doc[];
const PORID = new Map(DOCS.map((d) => [d._id, d]));

export const porId = (id?: string) => (id ? PORID.get(id) : undefined);

/** El equivalente de una consulta de Sanity: tipo, sitio e idioma. */
export function traer(tipo: string, idioma?: string): Doc[] {
  return DOCS.filter(
    (d) =>
      d._type === tipo &&
      (idioma ? d.language === idioma : true) &&
      (d.sites ? d.sites.includes("craft") : d.site ? d.site === "craft" : true),
  );
}

export const pagina = (slug: string, idioma = "es") =>
  DOCS.find((d) => d._type === "page" && d.slug?.current === slug && d.language === idioma);

/** La norma con su versión vigente y los volúmenes de cada versión. */
export function norma() {
  const std = DOCS.find((d) => d._type === "standard");
  const versiones = DOCS.filter((d) => d._type === "standardVersion").sort((a, b) =>
    (b.version ?? "").localeCompare(a.version ?? ""),
  );
  return {
    std,
    vigente: porId(std?.currentVersion?._ref),
    versiones: versiones.map((v) => ({
      ...v,
      vols: (v.volumes ?? [])
        .map((r) => porId(r._ref))
        .filter(Boolean)
        .sort((a, b) => (a!.volumeLabel ?? "").localeCompare(b!.volumeLabel ?? "")) as Doc[],
    })),
  };
}

export const titulo = (d?: Doc) => d?.title ?? d?.question ?? "";

/** Idiomas en que existe un documento descargable. */
export const idiomasDe = (d: Doc) =>
  Array.from(new Set((d.files ?? []).map((f) => f.lang))).sort();

export const temasDe = (d: Doc) =>
  (d.topics ?? []).map((t) => porId(t._ref)?.title).filter(Boolean) as string[];

export const cuenta = () => {
  const c: Record<string, number> = {};
  for (const d of DOCS) c[d._type] = (c[d._type] ?? 0) + 1;
  return c;
};
