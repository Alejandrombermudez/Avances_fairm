import { stegaClean } from "next-sanity";

/**
 * Recorta un texto a `n` letras, con puntos suspensivos si sobra.
 *
 * Cuenta letras de verdad. En la vista previa del gestor cada texto lleva
 * detrás una marca invisible —la que permite hacer clic y abrir su campo— que
 * son cientos de caracteres que no se ven: contándolos, un título de 60
 * letras parecía de 700 y salía cortado y con puntos suspensivos solo para
 * quien edita.
 *
 * Si cabe, se devuelve tal cual, con su marca. Si no cabe, se recorta el texto
 * limpio: ese trozo deja de ser editable con un clic, que es preferible a
 * enseñarlo distinto de como lo verá el público.
 */
export function recortar(texto: string, n: number): string {
  const limpio = stegaClean(texto);
  if (limpio.length <= n) return texto;
  return `${limpio.slice(0, n).trimEnd()}…`;
}
