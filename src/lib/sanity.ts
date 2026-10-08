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

/**
 * Un archivo del documento, en un idioma.
 *
 * `url` sale de dos sitios. Los documentos migrados llevan `externalUrl`: la
 * direccion que el archivo ya tenia, que los TdR obligan a conservar porque
 * esta citada desde documentos oficiales. Los que se suban desde el gestor no
 * la tienen, y entonces vale la del archivo subido.
 *
 * Antes solo se pedia `externalUrl`, asi que un documento nuevo con su PDF
 * cargado mostraba un boton de descarga que apuntaba a «#» y no hacia nada.
 */
export type Archivo = {
  _key: string;
  lang: Idioma;
  url: string | null;
  formato: string | null;
  peso: number | null;
};

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
  "archivos": files[]{
    _key, lang,
    "url": coalesce(externalUrl, file.asset->url),
    "formato": coalesce(file.asset->extension, lower(string::split(externalUrl, ".")[-1])),
    "peso": file.asset->size
  },
  "portada": cover,
  "acento": accent,
  "publicos": audiences,
  "temas": topics[]->title,
  "deVersion": volumeOf->{version, "estado": status},
  "rutas": legacyPaths
`;

/**
 * El cuerpo, con las medidas reales de cada imagen.
 *
 * Sin esto el renderizador no sabe de que tamano es la imagen y la estira al
 * ancho de la columna. En «Que es CRAFT» eso dibujaba un icono de descarga de
 * 49x54 a 688 pixeles de ancho, y lo mismo con las texturas decorativas.
 */
const CUERPO = `
  body[]{
    ...,
    _type == "imagen" => {
      ...,
      "ancho": asset->metadata.dimensions.width,
      "alto": asset->metadata.dimensions.height
    },
    _type == "botones" => {
      ...,
      items[]{
        ...,
        "url": coalesce(enlace, archivo.asset->url),
        "formato": archivo.asset->extension,
        "peso": archivo.asset->size
      }
    }
  }
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
  cliente.fetch<
    {
      _id: string;
      title: string;
      place: string | null;
      slug: string | null;
      excerpt: string | null;
    }[]
  >(
    `*[_type == "story" && "craft" in sites && language == $idioma]{
      _id, title, place, excerpt, "slug": slug.current}`,
    { idioma },
  );

export const hitos = (idioma: Idioma = "es") =>
  cliente.fetch<{ _id: string; title: string; date: string }[]>(
    `*[_type == "timelineEvent" && "craft" in sites && language == $idioma] | order(date asc){
      _id, title, date}`,
    { idioma },
  );

export const articulos = (idioma: Idioma = "es", cuantos?: number) =>
  cliente.fetch<
    {
      _id: string;
      title: string;
      publishedAt: string;
      slug: string | null;
      excerpt: string | null;
      temas: string[] | null;
    }[]
  >(
    `*[_type == "article" && "craft" in sites && language == $idioma]
      | order(publishedAt desc)${typeof cuantos === "number" ? `[0...${cuantos}]` : ""}{
      _id, title, publishedAt, excerpt, "slug": slug.current, "temas": topics[]->title}`,
    { idioma },
  );

/* ── Las fichas de lo que se escribe ────────────────────────────── */
/**
 * El articulo y la historia completos.
 *
 * Hasta ahora los dos se quedaban en la tarjeta de la portada: el cuerpo
 * estaba en Sanity —entre 7 y 48 bloques por articulo— y no habia pagina
 * donde leerlo. Eran los dos unicos tipos con texto largo sin salida.
 */
export type Articulo = {
  _id: string;
  title: string;
  slug: string | null;
  excerpt: string | null;
  publishedAt: string;
  body: unknown[] | null;
  portada: unknown | null;
  temas: string[] | null;
  autores: string[] | null;
  paises: string[] | null;
  idioma: Idioma | null;
  rutas: string[] | null;
};

const CAMPOS_ARTICULO = `
  _id, title, excerpt, publishedAt,
  ${CUERPO},
  "slug": slug.current,
  "portada": heroImage,
  "temas": topics[]->title,
  "autores": authors[]->name,
  "paises": countries[]->title,
  "idioma": language,
  "rutas": legacyPaths
`;

export const articulo = (slug: string) =>
  cliente.fetch<Articulo | null>(
    `*[_type == "article" && "craft" in sites && slug.current == $slug][0]{${CAMPOS_ARTICULO}}`,
    { slug },
  );

export const slugsDeArticulo = () =>
  cliente.fetch<string[]>(
    `*[_type == "article" && "craft" in sites && defined(slug.current)].slug.current`,
  );

export type Historia = {
  _id: string;
  title: string;
  slug: string | null;
  place: string | null;
  excerpt: string | null;
  body: unknown[] | null;
  portada: unknown | null;
  pais: string | null;
  temas: string[] | null;
  idioma: Idioma | null;
  rutas: string[] | null;
};

const CAMPOS_HISTORIA = `
  _id, title, place, excerpt,
  ${CUERPO},
  "slug": slug.current,
  "portada": heroImage,
  "pais": country->title,
  "temas": topics[]->title,
  "idioma": language,
  "rutas": legacyPaths
`;

export const historia = (slug: string) =>
  cliente.fetch<Historia | null>(
    `*[_type == "story" && "craft" in sites && slug.current == $slug][0]{${CAMPOS_HISTORIA}}`,
    { slug },
  );

export const slugsDeHistoria = () =>
  cliente.fetch<string[]>(
    `*[_type == "story" && "craft" in sites && defined(slug.current)].slug.current`,
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
      _id, title, lead, legacyPaths,
      ${CUERPO},
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
