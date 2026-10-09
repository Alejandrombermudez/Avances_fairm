/**
 * Las dos maneras de mirar la propuesta, y cómo pasar de una a otra sin
 * perder la página.
 *
 * La propuesta se puede ver sola, o al lado del sitio real para comparar.
 * Cada página se nombra una sola vez, como se llama hoy —«/recursos»,
 * «/que-es-craft»— y de ahí sale su dirección en la propuesta, en la pantalla
 * comparada y en craftmines.org.
 *
 * Hubo una tercera: una réplica del sitio de hoy hecha con el gestor nuevo.
 * Sirvió para comprobar que la migración era fiel; al lado del sitio real no
 * enseñaba nada que él no enseñe, y se quitó.
 *
 * No hay nada de React aquí dentro: son cuentas con direcciones, y así se
 * pueden probar solas.
 */

import { RAIZ } from "@/lib/rutas";

export type Vista = "propuesta" | "comparar";

const PROPUESTA = `${RAIZ}/propuesta`;
const COMPARAR = `${RAIZ}/comparar`;
const VIVO = "https://www.craftmines.org";

/** Lo que solo tiene página propia en la propuesta. */
const SOLO_PROPUESTA = /^\/(documentos|noticias|historias)(\/|$)/;

/** Una página del sitio, escrita de forma que se pueda poner en una dirección. */
export const esPagina = (p: string) => /^\/[a-z0-9_\-/]*$/i.test(p) && !p.includes("//");

/**
 * De la dirección que se está mirando, a la página del sitio.
 *
 * `null` si no es una página de la propuesta: la pantalla comparada, el
 * informe, un marco que todavía está en blanco.
 */
export function paginaDe(camino: string): string | null {
  const c = camino.replace(/\/+$/, "") || "/";

  let pagina: string;
  if (c === PROPUESTA) pagina = "/";
  else if (c.startsWith(`${PROPUESTA}/`)) pagina = c.slice(PROPUESTA.length);
  else return null;

  // En la propuesta las preguntas tienen página diseñada, con otro nombre.
  if (pagina === "/preguntas") pagina = "/preguntas-frecuentes";
  return esPagina(pagina) ? pagina : null;
}

/** La página, en la propuesta. */
export function enPropuesta(pagina: string): string {
  if (pagina === "/") return PROPUESTA;
  if (pagina === "/preguntas-frecuentes") return `${PROPUESTA}/preguntas`;
  return PROPUESTA + pagina;
}

/** La página, en la pantalla comparada. */
export function enComparar(pagina: string): string {
  return pagina === "/" ? COMPARAR : `${COMPARAR}?p=${pagina}`;
}

/**
 * La página, en craftmines.org.
 *
 * `viejas` trae la dirección que cada ficha tenía en WordPress, que no siempre
 * es su nombre: «Cronología» cuelga de /creation-process, y las noticias
 * llevan el año delante. Sin ese dato se prueba con el nombre, que es lo que
 * vale para las páginas principales.
 *
 * Un documento no tiene página en el sitio de hoy, ni una noticia sin
 * dirección vieja: se va a donde eso se encuentra —Recursos, la portada—.
 */
export function enVivo(pagina: string, viejas: Record<string, string> = {}): string {
  const vieja = viejas[pagina];
  if (vieja && vieja.startsWith("/") && !vieja.startsWith("//")) {
    return VIVO + vieja.replace(/\/+$/, "") + "/";
  }
  if (pagina === "/" || pagina === "/noticias" || pagina.startsWith("/noticias/")) return `${VIVO}/`;
  if (pagina.startsWith("/documentos/")) return `${VIVO}/recursos/`;
  if (pagina.startsWith("/historias/")) return `${VIVO}/historias-craft/`;
  return `${VIVO}${pagina}/`;
}

/** Si en craftmines.org hay una página para esto, o solo un sitio donde buscarlo. */
export const tieneVivo = (pagina: string, viejas: Record<string, string> = {}) =>
  !SOLO_PROPUESTA.test(pagina) || pagina in viejas;
