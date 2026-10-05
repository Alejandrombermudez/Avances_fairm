/**
 * Cuando se publica algo en Sanity, el sitio se entera.
 *
 * Las paginas del sitio se generan una vez y se sirven desde el borde, que es
 * lo que las hace rapidas. El precio es que un documento nuevo tarda en
 * asomar: la ficha sale al instante —esa se genera en la primera visita— pero
 * los listados esperan a que caduque su copia, hasta una hora.
 *
 * Medido el 5 de octubre de 2026: tras crear una noticia, su ficha respondia
 * 200 de inmediato y la portada, el listado de noticias y Recursos seguian sin
 * mencionarla.
 *
 * Esto cierra ese hueco. Sanity llama aqui al publicar y las paginas se
 * regeneran en segundos. El `revalidate` de cada pagina se queda como red: si
 * el aviso no llega, el sitio se pone al dia solo dentro de la hora.
 *
 * Se revalida todo el arbol de /sitio de una vez, en vez de adivinar que
 * paginas toca cada documento: un documento sale en su ficha, en la portada,
 * en el listado y en el recuento de la franja, y acertar con esa lista a mano
 * es justo la clase de cosa que se desincroniza.
 */

import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

/** Comparacion en tiempo constante, para no filtrar el secreto a tientas. */
function igual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

export async function POST(peticion: Request) {
  const esperado = process.env.REVALIDAR_SECRETO;

  // Sin secreto configurado no se abre: cualquiera podria tirar la cache.
  if (!esperado) {
    return Response.json(
      { ok: false, error: "Falta REVALIDAR_SECRETO en el entorno" },
      { status: 503 },
    );
  }

  const enviado =
    peticion.headers.get("x-revalidar-secreto") ??
    new URL(peticion.url).searchParams.get("secreto") ??
    "";

  if (!igual(enviado, esperado)) {
    return Response.json({ ok: false, error: "Secreto incorrecto" }, { status: 401 });
  }

  revalidatePath("/sitio", "layout");

  return Response.json({ ok: true, revalidado: "/sitio", cuando: new Date().toISOString() });
}

/** Para comprobar de un navegador que la ruta existe, sin revelar nada. */
export async function GET() {
  return Response.json({
    ok: true,
    listo: Boolean(process.env.REVALIDAR_SECRETO),
    comoSeUsa: "POST con la cabecera x-revalidar-secreto",
  });
}
