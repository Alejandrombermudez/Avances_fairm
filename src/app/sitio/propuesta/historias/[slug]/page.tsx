/**
 * Una historia, completa.
 *
 * «¿Quienes estan aplicando CRAFT?» es hoy un parrafo y un boton a una pagina
 * que las lista por encima. El relato de cada organizacion minera —entre 13 y
 * 26 bloques— estaba migrado y no tenia donde leerse.
 *
 * Desde el 15 de octubre de 2026 se ve como en craftmines.org: la foto de la
 * organizacion a la izquierda y, a la derecha, el relato, el video y el cuadro
 * de Ubicacion, Aliados y Logros. Antes era una columna de titulares sueltos
 * y el video no estaba.
 */

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hayImagen, historia, slugsDeHistoria, urlImagen } from "@/lib/sanity";
import { rutaPropuesta } from "@/lib/rutas";
import Texto from "@/components/sitio/Texto";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await slugsDeHistoria();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Los titulos vienen como «Boyaca - Cooperativa...»: el lugar va delante,
 * separado por raya. Se parte para que el lugar sea el rotulo y el nombre de
 * la organizacion sea el titular.
 */
function partir(titulo: string, lugar: string | null) {
  const m = titulo.match(/^(.+?)\s+[–—-]\s+(.+)$/);
  if (m) return { encima: lugar ?? m[1], titular: m[2] };
  return { encima: lugar, titular: titulo };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const h = await historia(slug);
  if (!h) return { title: "Historia" };
  return { title: partir(h.title, h.place).titular, description: h.excerpt ?? undefined };
}

export default async function Historia({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const h = await historia(slug);
  if (!h) notFound();

  const { encima, titular } = partir(h.title, h.place);

  return (
    <main className="px-6 py-14">
      <article className="mx-auto max-w-[1080px]">
        {/* En el sitio de hoy las historias se eligen por país en Impacto. */}
        <Link href={rutaPropuesta("/impacto")} className="rotulo text-terracota">
          ← Historias
        </Link>

        <header className="mt-8 border-b border-linea pb-9">
          {encima && (
            <p className="rotulo text-terracota">
              {[encima, h.pais, ...(h.temas ?? [])].filter(Boolean).join(" · ")}
            </p>
          )}
          <h1 className="titular mt-4 max-w-[760px] text-[clamp(1.7rem,3.6vw,2.3rem)]">{titular}</h1>
        </header>

        {/* La entradilla no se repite aquí: es el comienzo del relato, que
            está justo al lado. Sirve para las tarjetas que llevan aquí. */}
        <div
          className={`mt-10 grid gap-9 ${
            hayImagen(h.portada) ? "lg:grid-cols-[minmax(0,5fr)_minmax(0,9fr)] lg:gap-12" : "max-w-[760px]"
          }`}
        >
          {/* Recorte en 4:3 en vez de alto y ancho fijos: asi la foto que se
              suba no se deforma, sea cual sea su proporcion. En pantalla ancha
              acompaña al texto mientras se lee. */}
          {hayImagen(h.portada) && (
            <div className="lg:sticky lg:top-8 lg:self-start">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gris">
                <Image
                  src={urlImagen(h.portada).width(960).height(720).fit("crop").auto("format").url()}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 380px"
                  priority
                />
              </div>
            </div>
          )}
          <div className="min-w-0">
            <Texto valor={h.body} enPropuesta />
          </div>
        </div>

        {!!(h.rutas ?? []).length && (
          <footer className="mt-12 rounded-xl bg-gris px-6 py-5">
            <p className="rotulo text-terracota">Direcciones conservadas</p>
            <ul className="mt-3 space-y-1">
              {(h.rutas ?? []).map((r) => (
                <li key={r} className="font-mono break-all text-[12px] text-suave">{r}</li>
              ))}
            </ul>
          </footer>
        )}
      </article>
    </main>
  );
}
