/**
 * Lo que se puede saber de un archivo mirando su dirección.
 *
 * Sirve para decidir si un enlace es una descarga —y entonces lleva su icono
 * y dice su formato— o es una página, y para escribir el peso en palabras.
 */

const CONOCIDAS = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "zip", "csv"];

/** «pdf», «docx»… o null si la dirección no es de un archivo conocido. */
export function extension(url: string | null | undefined): string | null {
  const limpia = (url ?? "").split(/[?#]/)[0];
  const m = limpia.match(/\.([a-z0-9]{2,5})$/i);
  const e = m ? m[1].toLowerCase() : null;
  return e && CONOCIDAS.includes(e) ? e : null;
}

/** «2,4 MB». Solo se sabe de los archivos subidos al gestor. */
export function tamano(bytes: number | null | undefined): string | null {
  if (!bytes) return null;
  const mb = bytes / 1024 / 1024;
  if (mb >= 1) return `${mb.toFixed(1).replace(".", ",")} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} kB`;
}

/** «PDF · 2,4 MB», o lo que se sepa de las dos cosas. */
export function fichaDeArchivo(
  formato: string | null | undefined,
  bytes?: number | null,
): string | null {
  return [formato?.toUpperCase(), tamano(bytes)].filter(Boolean).join(" · ") || null;
}
