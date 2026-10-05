/**
 * Donde vive el sitio de CRAFT.
 *
 * Mientras es una propuesta cuelga de /sitio, dentro de la pagina de avances:
 * un solo despliegue y una sola direccion que enviar. El dia que se lleve
 * craftmines.org, RAIZ pasa a "" y no hay que tocar ningun enlace.
 *
 * Por eso los destinos se escriben siempre como los del sitio de hoy
 * —/recursos, /que-es-craft— y pasan por `ruta()`. Antes estaban escritos a
 * mano con el prefijo puesto a medias: los siete del menu daban 404.
 */

export const RAIZ = "/sitio";

const EXTERNA = /^(https?:)?\/\/|^(mailto|tel):/i;

/**
 * La direccion de algo dentro del sitio de CRAFT.
 *
 * Deja pasar intactas las externas, los correos y los telefonos, porque los
 * botones y el pie se llenan desde Sanity y ahi se mezclan las dos cosas.
 */
export function ruta(destino: string | null | undefined): string {
  const d = (destino ?? "").trim();
  if (!d) return RAIZ;
  if (EXTERNA.test(d)) return d;

  const limpio = d.replace(/\/+$/, "");
  if (!limpio || limpio === "/") return RAIZ;
  return RAIZ + (limpio.startsWith("/") ? limpio : "/" + limpio);
}

/** Si al hacer clic se sale del sitio: para target y rel. */
export const esExterna = (destino: string | null | undefined) =>
  EXTERNA.test((destino ?? "").trim());
