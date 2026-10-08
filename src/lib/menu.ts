/**
 * El menú de arriba, tal como viene del gestor.
 *
 * Vive en «Ajustes del sitio → Menú»: el equipo añade una sección, la
 * renombra o la cambia de sitio, y la barra lo sigue. Estaba escrito a mano
 * en el código de las dos versiones del sitio, y el formulario del gestor no
 * hacía nada.
 */

import type { Ajustes } from "@/lib/sanity";

export type Entrada = { t: string; h: string };

/**
 * Las siete secciones de hoy. Solo se usan si el gestor no trae ninguna:
 * una barra vacía dejaría el sitio sin por dónde entrar.
 */
const DE_RESPALDO: Entrada[] = [
  { t: "Inicio", h: "/" },
  { t: "Qué es CRAFT", h: "/que-es-craft" },
  { t: "Gobernanza y Consultas Públicas", h: "/consultas-publicas" },
  { t: "Impacto", h: "/impacto" },
  { t: "Recursos", h: "/recursos" },
  { t: "Preguntas Frecuentes", h: "/preguntas-frecuentes" },
  { t: "Contacto", h: "/contacto" },
];

/**
 * Cada sección lleva a su página —y entonces usa la dirección que esa página
 * tenga hoy— o a la dirección que se haya escrito. Las que no tienen texto o
 * no llevan a ningún sitio se saltan en vez de dibujar un hueco.
 */
export function menuDe(a: Ajustes | null): Entrada[] {
  const secciones = (a?.menu ?? [])
    .map((s) => ({
      t: (s.t ?? "").trim(),
      h: s.slug ? `/${s.slug}` : (s.url ?? "").trim(),
    }))
    .filter((s) => s.t && s.h);
  return secciones.length ? secciones : DE_RESPALDO;
}
