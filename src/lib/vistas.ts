/**
 * Las tres maneras de mirar el sitio, y cómo pasar de una a otra sin perder
 * la página.
 *
 * El sitio se puede ver como está hoy, como se propone, o las dos a la vez.
 * Cambiar de una a otra llevaba siempre a la portada: quien estaba mirando
 * Recursos tenía que volver a buscarlo. Aquí cada página se nombra una sola
 * vez, como se llama hoy —«/recursos», «/que-es-craft»— y cada vista sabe
 * cuál es su dirección para ella.
 *
 * No hay nada de React aquí dentro: son cuentas con direcciones, y así se
 * pueden probar solas.
 */

import { RAIZ } from "@/lib/rutas";

export type Vista = "actual" | "propuesta" | "comparar";

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
 * `null` si no es una página del sitio: la pantalla comparada, el informe, un
 * marco que todavía está en blanco.
 */
export function paginaDe(camino: string): string | null {
  const c = camino.replace(/\/+$/, "") || "/";
  if (c === COMPARAR || c.startsWith(`${COMPARAR}/`)) return null;

  let pagina: string;
  if (c === PROPUESTA || c === RAIZ) pagina = "/";
  else if (c.startsWith(`${PROPUESTA}/`)) pagina = c.slice(PROPUESTA.length);
  else if (c.startsWith(`${RAIZ}/`)) pagina = c.slice(RAIZ.length);
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

/** Si la página existe tal cual en el sitio de hoy, o es nueva en la propuesta. */
export const tieneReplica = (pagina: string) => !SOLO_PROPUESTA.test(pagina);

/**
 * La página, como está hoy.
 *
 * Un documento, una noticia o una historia no tienen página propia en la
 * réplica. En vez de un «no encontrada» se va a donde eso se encuentra hoy:
 * el documento, en Recursos; la historia, en Historias; la noticia, en la
 * portada.
 */
export function enActual(pagina: string): string {
  if (pagina === "/") return RAIZ;
  if (pagina.startsWith("/documentos/")) return `${RAIZ}/recursos`;
  if (pagina.startsWith("/historias/")) return `${RAIZ}/historias-craft`;
  if (pagina === "/noticias" || pagina.startsWith("/noticias/")) return RAIZ;
  return RAIZ + pagina;
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
  tieneReplica(pagina) || pagina in viejas;
