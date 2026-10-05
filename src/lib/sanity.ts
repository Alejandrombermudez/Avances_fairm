/**
 * El cliente de Sanity y las consultas del sitio.
 *
 * Todo se lee en el servidor, al generar las páginas. Al navegador le llega
 * HTML: ni el token ni las consultas salen de aquí.
 *
 * Sobre el token: el proyecto todavía no concede lectura anónima, así que las
 * consultas van autenticadas. Cuando se conceda —es un ajuste en el panel de
 * Sanity— se puede quitar `token` y las lecturas pasan por el CDN, que es más
 * rápido y más barato. Mientras tanto, en producción debe ser un token de rol
 * Viewer: este sitio solo lee.
 */

import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

/**
 * Sin token si el proyecto concede lectura publica, que es como deberia
 * quedar: asi las peticiones pasan por el CDN, que es mas rapido y mas
 * barato, y el sitio no lleva dentro ninguna credencial.
 *
 * Mientras no se conceda, `SANITY_READ_TOKEN` cubre el hueco. Debe ser de rol
 * Viewer: este sitio solo lee.
 */
const token = process.env.SANITY_READ_TOKEN || undefined;

export const cliente = createClient({
  projectId,
  dataset,
  apiVersion: "2025-02-19",
  token,
  useCdn: !token,
  perspective: "published",
});

const constructor = imageUrlBuilder({ projectId, dataset });
export const urlImagen = (fuente: unknown) => constructor.image(fuente as never);

/* ── Tipos ─────────────────────────────────────────────────────── */
export type Idioma = "es" | "en" | "fr" | "de" | "pt";

export type Archivo = { _key: string; lang: Idioma; externalUrl?: string };

export type Documento = {
  _id: string;
  titulo: string | null;
  tituloEn: string | null;
  resumen: string | null;
  slug: string | null;
  tipo: string | null;
  anio: number | null;
  volumen: string | null;
  idiomas: Idioma[] | null;
  archivos: Archivo[] | null;
  portada: unknown | null;
  acento: string | null;
  publicos: string[] | null;
  temas: string[] | null;
  deVersion: { version: string; estado: string } | null;
  rutas: string[] | null;
};

export type Version = {
  _id: string;
  version: string;
  estado: string;
  fecha: string | null;
  volumenes: Documento[] | null;
};

const CAMPOS_DOC = `
  _id,
  "titulo": title.es,
  "tituloEn": title.en,
  "resumen": abstract.es,
  "slug": slug.current,
  "tipo": documentType,
  "anio": year,
  "volumen": volumeLabel,
  "idiomas": array::unique(files[].lang),
  "archivos": files[]{_key, lang, externalUrl},
  "portada": cover,
  "acento": accent,
  "publicos": audiences,
  "temas": topics[]->title,
  "deVersion": volumeOf->{version, "estado": status},
  "rutas": legacyPaths
`;

/* ── Consultas ─────────────────────────────────────────────────── */
export type Boton = { _key: string; etiqueta: string; url: string };
export type Tarjeta = {
  _key: string;
  titulo: string | null;
  texto: string;
  icono: string | null;
};
export type Banda = {
  _key: string;
  tipo: "hero" | "texto" | "tarjetas" | "listado";
  titulo: string | null;
  texto: string | null;
  fondo: "blanco" | "gris" | "cafe" | "foto" | null;
  imagen: unknown | null;
  tarjetas: Tarjeta[] | null;
  botones: Boton[] | null;
  listado: string | null;
  cuantos: number | null;
};

export type Ajustes = {
  title: string;
  tagline: string;
  languages: Idioma[];
  bandas: Banda[] | null;
  footerContacto: string[] | null;
  footerNota: string | null;
  footerEnlaces: { _key: string; label: string; url: string }[] | null;
};

export const ajustes = () =>
  cliente.fetch<Ajustes | null>(
    `*[_type == "siteSettings" && site == "craft"][0]{
      title, tagline, languages,
      "bandas": homeSections[]{
        _key, tipo, titulo, texto, fondo, imagen, tarjetas, botones, listado, cuantos
      },
      footerContacto, footerNota, footerEnlaces
    }`,
  );

export const norma = () =>
  cliente.fetch<{
    titulo: string;
    descripcion: string | null;
    vigente: Version | null;
    versiones: Version[];
  } | null>(
    `*[_type == "standard" && "craft" in sites][0]{
      "titulo": title,
      "descripcion": description,
      "vigente": currentVersion->{
        _id, version, "estado": status, "fecha": releaseDate,
        "volumenes": volumes[]->{${CAMPOS_DOC}}
      },
      "versiones": *[_type == "standardVersion"] | order(version desc){
        _id, version, "estado": status, "fecha": releaseDate,
        "volumenes": volumes[]->{${CAMPOS_DOC}}
      }
    }`,
  );

export const documentosSueltos = () =>
  cliente.fetch<Documento[]>(
    `*[_type == "publication" && "craft" in sites && !defined(volumeOf)]
      | order(documentType asc, year desc){${CAMPOS_DOC}}`,
  );

export const historias = (idioma: Idioma = "es") =>
  cliente.fetch<{ _id: string; title: string; place: string | null; slug: string | null }[]>(
    `*[_type == "story" && "craft" in sites && language == $idioma]{
      _id, title, place, "slug": slug.current}`,
    { idioma },
  );

export const hitos = (idioma: Idioma = "es") =>
  cliente.fetch<{ _id: string; title: string; date: string }[]>(
    `*[_type == "timelineEvent" && "craft" in sites && language == $idioma] | order(date asc){
      _id, title, date}`,
    { idioma },
  );

export const articulos = (idioma: Idioma = "es") =>
  cliente.fetch<{ _id: string; title: string; publishedAt: string; slug: string | null }[]>(
    `*[_type == "article" && "craft" in sites && language == $idioma] | order(publishedAt desc){
      _id, title, publishedAt, "slug": slug.current}`,
    { idioma },
  );

export const preguntas = (idioma: Idioma = "es") =>
  cliente.fetch<{ _id: string; question: string; answer: unknown[] }[]>(
    `*[_type == "faq" && "craft" in sites && language == $idioma] | order(order asc){
      _id, question, answer}`,
    { idioma },
  );

export const paginaPorSlug = (slug: string, idioma: Idioma = "es") =>
  cliente.fetch<{
    _id: string;
    title: string;
    lead: string | null;
    body: unknown[] | null;
    legacyPaths: string[] | null;
    temas: string[] | null;
    arma: string | null;
  } | null>(
    `*[_type == "page" && site == "craft" && slug.current == $slug && language == $idioma][0]{
      _id, title, lead, body, legacyPaths,
      "temas": topics[]->title,
      "arma": _arma
    }`,
    { slug, idioma },
  );

/** Para generar las rutas estáticas de todas las páginas migradas. */
export const slugsDePagina = (idioma: Idioma = "es") =>
  cliente.fetch<string[]>(
    `*[_type == "page" && site == "craft" && language == $idioma && defined(slug.current)].slug.current`,
    { idioma },
  );

/** Cuántas fichas hay de cada cosa: alimenta la franja de la portada. */
export const recuento = () =>
  cliente.fetch<Record<string, number>>(
    `{
      "documentos": count(*[_type == "publication" && "craft" in sites]),
      "preguntas": count(*[_type == "faq" && "craft" in sites && language == "es"]),
      "hitos": count(*[_type == "timelineEvent" && "craft" in sites && language == "es"]),
      "historias": count(*[_type == "story" && "craft" in sites && language == "es"]),
      "paginas": count(*[_type == "page" && site == "craft" && language == "es"])
    }`,
  );

/** Un documento por su slug, para su ficha completa. */
export const documento = (slug: string) =>
  cliente.fetch<Documento | null>(
    `*[_type == "publication" && "craft" in sites && slug.current == $slug][0]{${CAMPOS_DOC}}`,
    { slug },
  );

export const slugsDeDocumento = () =>
  cliente.fetch<string[]>(
    `*[_type == "publication" && "craft" in sites && defined(slug.current)].slug.current`,
  );

/**
 * Los volúmenes que pertenecen a una versión pero no son los definitivos:
 * borradores, candidatas y textos en consulta.
 *
 * Existen y forman parte de la historia de la norma —la consulta pública es
 * lo que la legitima—, pero no estaban en ninguna lista: solo se llegaba a
 * ellos escribiendo la dirección.
 */
export const borradores = () =>
  cliente.fetch<Documento[]>(
    `*[_type == "publication" && "craft" in sites && defined(volumeOf)
       && !(_id in *[_type == "standardVersion"].volumes[]._ref)]
      | order(volumeOf->version desc, volumeLabel asc){${CAMPOS_DOC}}`,
  );
