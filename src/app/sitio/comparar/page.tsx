/**
 * La pantalla comparada, en la página que se pida.
 *
 * Se llega desde el mando de arriba estando en cualquier página, y se abre en
 * esa misma: /sitio/comparar?p=/recursos pone Recursos a los dos lados, el
 * del sitio real a la izquierda y el de la propuesta a la derecha.
 */

import { rutasDeHoy } from "@/lib/sanity";
import { esPagina } from "@/lib/vistas";
import Comparador from "./Comparador";

export const metadata = { title: "Comparar con el sitio real" };

export default async function Comparar({
  searchParams,
}: {
  searchParams: Promise<{ p?: string | string[] }>;
}) {
  const { p } = await searchParams;
  const pedida = typeof p === "string" && esPagina(p) ? p.replace(/\/+$/, "") || "/" : "/";

  // Sin las direcciones de hoy la comparación sigue sirviendo: el sitio real
  // se busca por el nombre de la página, que acierta en las principales.
  const viejas = await rutasDeHoy().catch(() => ({}) as Record<string, string>);

  return <Comparador inicial={pedida} viejas={viejas} />;
}
