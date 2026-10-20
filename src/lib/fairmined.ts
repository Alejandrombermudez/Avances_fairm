/**
 * Fairmined dentro de la página de avances: dónde vive, cómo se resuelven sus
 * enlaces y qué le pregunta al gestor.
 *
 * Igual que CRAFT, mientras sea una propuesta cuelga de un prefijo —/fairmined—
 * en el mismo despliegue: una sola dirección que enviar. Debajo del prefijo,
 * cada página y cada noticia vive en la dirección exacta que tiene hoy en
 * fairmined.org: /es/donde-comprar-fairmined es /fairmined/es/donde-comprar-
 * fairmined. Así cualquier enlace del texto migrado lleva a su réplica sin
 * tener que traducirlo uno por uno, y el día que se lleve su dominio basta con
 * cambiar RAIZ.
 */

import { CUERPO, MEDIDAS, cliente, traer } from "@/lib/sanity";

export const RAIZ = "/fairmined";

export type IdiomaFm = "en" | "es" | "de" | "fr";
export const IDIOMAS_FM: IdiomaFm[] = ["en", "es", "de", "fr"];

/**
 * Los idiomas que el selector ofrece. El sitio de hoy esconde el alemán y el
 * francés con una regla de estilo (`.lang-item-de, .lang-item-fr {display:
 * none}`): sus páginas siguen abiertas, pero no se llega a ellas desde el
 * menú. La réplica hace lo mismo; si ARM decide retirarlos o volver a
 * ofrecerlos, es esta lista.
 */
export const IDIOMAS_VISIBLES: IdiomaFm[] = ["en", "es"];

const DOMINIO = /^https?:\/\/(www\.)?fairmined\.org/i;
const ARCHIVO = /\/wp-content\//i;
const EXTERNA = /^(https?:)?\/\/|^(mailto|tel):/i;

/** El idioma de una dirección del sitio, por su primer tramo. */
export function idiomaDe(camino: string): IdiomaFm {
  const primero = camino.split("/").filter(Boolean)[0];
  return (IDIOMAS_FM as string[]).includes(primero) ? (primero as IdiomaFm) : "en";
}

/** La dirección de una ruta de fairmined.org dentro de la réplica. */
export function rutaFm(camino: string | null | undefined): string {
  const c = (camino ?? "/").replace(/\/+$/, "");
  return !c || c === "/" ? RAIZ : RAIZ + (c.startsWith("/") ? c : `/${c}`);
}

/**
 * A dónde lleva un enlace escrito en el texto migrado.
 *
 * Lo de fairmined.org se queda en la réplica, salvo los archivos —un PDF, una
 * foto—, que siguen bajándose del sitio de hoy hasta que se muden. Lo de
 * fuera sale en otra pestaña.
 */
export function resolverFm(destino: string | null | undefined): { href: string; fuera: boolean } {
  const d = (destino ?? "").trim();
  if (!d) return { href: "#", fuera: false };
  if (d.startsWith("#")) return { href: d, fuera: false };
  if (d === RAIZ || d.startsWith(`${RAIZ}/`)) return { href: d, fuera: false };
  if (DOMINIO.test(d)) {
    if (ARCHIVO.test(d)) return { href: d, fuera: true };
    const u = new URL(d.replace(/^http:/i, "https:"));
    return { href: rutaFm(u.pathname) + u.search + u.hash, fuera: false };
  }
  if (EXTERNA.test(d)) return { href: d, fuera: /^(https?:)?\/\//i.test(d) };
  if (d.startsWith("/")) return { href: rutaFm(d), fuera: false };
  return { href: d, fuera: false };
}

/* ── Consultas ─────────────────────────────────────────────────── */

export type Enlace = { _key: string; label: string; url: string | null; ruta: string | null };
export type SeccionMenu = Enlace & { destacado: boolean | null; hijos: Enlace[] | null };
export type ColumnaPie = {
  _key: string;
  titulo: string | null;
  texto: unknown[] | null;
  redes: boolean | null;
  imagen: unknown | null;
  enlace: string | null;
};
export type AjustesFm = {
  menu: SeccionMenu[] | null;
  menuSuperior: SeccionMenu[] | null;
  redes: { _key: string; red: string; url: string }[] | null;
  barraContacto: string | null;
  columnas: ColumnaPie[] | null;
  derechos: string | null;
};

const ENLACE = `_key, label, url, "ruta": page->legacyPaths[0]`;

export const ajustesFm = (idioma: IdiomaFm) =>
  traer<AjustesFm | null>(
    `*[_type == "siteSettings" && site == "fairmined" && language == $idioma][0]{
      "menu": mainNav[]{ ${ENLACE}, destacado, "hijos": hijos[]{ ${ENLACE} } },
      "menuSuperior": menuSuperior[]{ ${ENLACE}, destacado, "hijos": hijos[]{ ${ENLACE} } },
      redes, barraContacto, derechos,
      "columnas": footerColumnas[]{ _key, titulo, texto, redes, imagen, enlace }
    }`,
    { idioma },
  );

/** Una traducción de la página: a dónde lleva el selector de idioma. */
export type Traduccion = { idioma: IdiomaFm; ruta: string };

/** Un tramo de las migas: la página madre, la abuela… */
export type Miga = { titulo: string; ruta: string | null };

export type FichaFm = {
  _id: string;
  _type: "page" | "article";
  titulo: string;
  idioma: IdiomaFm;
  ruta: string;
  arma: string | null;
  body: unknown[] | null;
  fecha: string | null;
  portada: (Record<string, unknown> & { ancho?: number; alto?: number }) | null;
  entradilla: string | null;
  migas: Miga[] | null;
  traducciones: Traduccion[] | null;
};

/**
 * La página o la noticia que vive en esa dirección de fairmined.org.
 *
 * Las dos comparten espacio de direcciones —/what-is-fairmined es una página
 * y /pioneer-fairmined-paulette-a-bicyclette una noticia— y por eso se buscan
 * juntas, por su dirección de hoy.
 */
export const fichaPorRuta = (camino: string) =>
  traer<FichaFm | null>(
    `*[((_type == "page" && site == "fairmined") || (_type == "article" && "fairmined" in sites))
       && $camino in legacyPaths][0]{
      _id, _type, "titulo": title, "idioma": language, "ruta": legacyPaths[0],
      "arma": _arma,
      ${CUERPO},
      "fecha": publishedAt,
      "portada": heroImage{ ..., ${MEDIDAS} },
      "entradilla": excerpt,
      "migas": [
        parent->parent->{ "titulo": title, "ruta": legacyPaths[0] },
        parent->{ "titulo": title, "ruta": legacyPaths[0] }
      ][defined(titulo)],
      "traducciones": *[_type == "translation.metadata" && references(^._id)][0]
        .translations[]{ "idioma": _key, "ruta": value->legacyPaths[0] }
    }`,
    { camino },
  );

export type Tarjeta = {
  _id: string;
  titulo: string;
  ruta: string;
  fecha: string | null;
  entradilla: string | null;
  portada: unknown | null;
};

/** Las noticias de un idioma, de la más nueva a la más vieja, a tramos. */
export const noticiasFm = (idioma: IdiomaFm, desde: number, cuantas: number) =>
  traer<{ total: number; lista: Tarjeta[] }>(
    `{
      "total": count(*[_type == "article" && "fairmined" in sites && language == $idioma]),
      "lista": *[_type == "article" && "fairmined" in sites && language == $idioma]
        | order(publishedAt desc)[$desde...$hasta]{
          _id, "titulo": title, "ruta": legacyPaths[0], "fecha": publishedAt,
          "entradilla": excerpt, "portada": heroImage
        }
    }`,
    { idioma, desde, hasta: desde + cuantas },
  );

/** Todas las direcciones de la réplica, para el mapa del sitio y la comparación. */
export const rutasFm = () =>
  cliente.fetch<string[]>(
    `*[((_type == "page" && site == "fairmined") || (_type == "article" && "fairmined" in sites))
       && defined(legacyPaths[0])].legacyPaths[0]`,
  );

export type Resultado = {
  _id: string;
  _type: "page" | "article";
  titulo: string;
  ruta: string;
  fecha: string | null;
  extracto: string | null;
};

/**
 * Lo que busca la lupa: páginas y noticias del idioma cuyo título o texto
 * tienen todas las palabras. Cada palabra vale como comienzo —«miner»
 * encuentra «miners» y «mining»—, que es como se escribe en un buscador.
 */
export const buscarFm = (texto: string, idioma: IdiomaFm) => {
  const palabras = texto
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((p) => p.length > 1)
    .slice(0, 6)
    .map((p) => `${p}*`);
  if (!palabras.length) return Promise.resolve([] as Resultado[]);
  return traer<Resultado[]>(
    `*[((_type == "page" && site == "fairmined") || (_type == "article" && "fairmined" in sites))
       && language == $idioma && [title, pt::text(body)] match $palabras]
      | order(_type desc, publishedAt desc)[0...40]{
        _id, _type, "titulo": title, "ruta": legacyPaths[0], "fecha": publishedAt,
        "extracto": coalesce(excerpt, array::join(string::split(pt::text(body), "")[0...240], ""))
      }`,
    { idioma, palabras },
  );
};

/* ── El catálogo de proveedores ─────────────────────────────────── */

/** Una etiqueta en los idiomas que tenga: «Fairmined gold» / «Oro Fairmined». */
export type I18n = Partial<Record<IdiomaFm, string>> & { _key?: string };

/** En el idioma pedido; si no lo tiene, en inglés, y si no, en el que haya. */
export const enIdioma = (t: I18n | null | undefined, idioma: IdiomaFm) =>
  (t && (t[idioma] || t.en || t.es || t.fr || t.de)) || "";

export type ProveedorFm = {
  _id: string;
  nombre: string;
  logo: unknown | null;
  web: string | null;
  sede: string | null;
  rutas: string[] | null;
  materiales: I18n[] | null;
  productos: I18n[] | null;
  servicios: I18n[] | null;
  paises: I18n[] | null;
};

export type ProveedorDetalle = ProveedorFm & {
  fairminedId: string | null;
  enExistencia: I18n | null;
  porEncargo: I18n | null;
  pedidoMinimo: I18n | null;
  entrega: I18n | null;
  contacto: { nombre?: string; correo?: string; telefono?: string; direccion?: string } | null;
};

const CAMPOS_PROVEEDOR = `
  _id, "nombre": name, logo, "web": website, sede, "rutas": legacyPaths,
  materiales, productos, servicios, paises
`;

/** Todos los proveedores del catálogo, por nombre. Son 43: el filtro se hace
 *  en el navegador, al instante, como en el original. */
export const proveedoresFm = () =>
  traer<ProveedorFm[]>(
    /* Los del catálogo. Los que no tienen papel son los de antes del mapa
       de actores, que eran todos del catálogo. */
    `*[_type == "supplier" && "fairmined" in sites && (catalogo == true || !defined(roles))]
      | order(lower(name) asc){${CAMPOS_PROVEEDOR}}`,
  );

/** La ficha de un proveedor, por su dirección de hoy (/suppliers-portfolio/…). */
export const proveedorPorRuta = (camino: string) =>
  traer<ProveedorDetalle | null>(
    `*[_type == "supplier" && "fairmined" in sites && $camino in legacyPaths][0]{
      ${CAMPOS_PROVEEDOR}, fairminedId, enExistencia, porEncargo, pedidoMinimo, entrega, contacto
    }`,
    { camino },
  );

/** La dirección de un proveedor en el idioma en que se navega. */
export function rutaDeProveedor(rutas: string[] | null | undefined, idioma: IdiomaFm) {
  const lista = rutas ?? [];
  return (
    lista.find((r) => idiomaDe(r) === idioma) ??
    lista.find((r) => idiomaDe(r) === "en") ??
    lista[0] ??
    "/"
  );
}

/**
 * La dirección buena de algo que se pidió por otra.
 *
 * WordPress encuentra una página aunque se la pida por una ruta que no es la
 * suya: /community-profiles/macdesa lleva a /community-profiles-4/macdesa, y
 * /es/que-es-fairmined a /que-es-fairmined. Busca por el último tramo —el
 * nombre de la página— y redirige. El menú y el pie del sitio de hoy cuentan
 * con eso: «Contact us» apunta a /en/contact. Aquí se hace lo mismo, primero
 * en el idioma de la dirección y si no en cualquiera.
 */
export const rutaPorNombre = (nombre: string, idioma: IdiomaFm) =>
  cliente.fetch<string | null>(
    `*[((_type == "page" && site == "fairmined") || (_type == "article" && "fairmined" in sites)
        || (_type == "supplier" && "fairmined" in sites))
       && slug.current == $nombre]
      | order(select(language == $idioma => 0, 1) asc)[0].legacyPaths[0]`,
    { nombre, idioma },
  );

/* ── El mapa de actores ─────────────────────────────────────────── */

export type Actor = {
  _id: string;
  nombre: string;
  roles: string[] | null;
  pais: string | null;
  web: string | null;
  fairminedId: string | null;
  alta: string | null;
  ubicacion: { lat: number; lng: number } | null;
  /** Su ficha en el catálogo o el perfil de la mina, en la réplica. */
  rutas: string[] | null;
  perfil: { ruta: string | null; texto: string | null } | null;
  /* Lo que solo tienen los 40 del catálogo, para la ficha de la barra. */
  logo: unknown | null;
  materiales: I18n[] | null;
  productos: I18n[] | null;
  servicios: I18n[] | null;
  paises: I18n[] | null;
  pedidoMinimo: I18n | null;
  entrega: I18n | null;
  contacto: ProveedorDetalle["contacto"];
};

/** Toda la familia Fairmined: marcas, proveedores y minas, por nombre. */
export const actoresFm = () =>
  traer<Actor[]>(
    `*[_type == "supplier" && "fairmined" in sites && count(roles) > 0]
      | order(lower(name) asc){
        _id, "nombre": name, roles, "pais": sede, "web": website, fairminedId, alta,
        "ubicacion": location{lat, lng},
        "rutas": select(catalogo == true => legacyPaths, null),
        "perfil": perfil->{ "ruta": legacyPaths[0], "texto": pt::text(body) },
        logo, materiales, productos, servicios, paises, pedidoMinimo, entrega, contacto
      }`,
  );
