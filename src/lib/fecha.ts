/** Fechas en palabras, para el sitio de CRAFT. */

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/**
 * «24 de mayo de 2024».
 *
 * Parte la cadena en vez de usar Date: las fechas de Sanity llegan en UTC y
 * `new Date(...)` las corre un dia en los husos al oeste de Greenwich, que es
 * donde esta casi todo el mundo que lee esto.
 */
export function fechaLarga(iso: string | null | undefined): string | null {
  const [a, m, d] = (iso ?? "").slice(0, 10).split("-").map(Number);
  if (!a || !m || !d) return null;
  return `${d} de ${MESES[m - 1]} de ${a}`;
}

/** «mayo de 2024», para la cronologia. */
export function mesYAno(iso: string | null | undefined): string | null {
  const [a, m] = (iso ?? "").slice(0, 7).split("-").map(Number);
  if (!a || !m) return null;
  return `${MESES[m - 1]} de ${a}`;
}
