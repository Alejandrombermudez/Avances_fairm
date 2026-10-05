/**
 * Una historia, completa.
 *
 * «¿Quienes estan aplicando CRAFT?» es hoy un parrafo y un boton a una pagina
 * que las lista por encima. El relato de cada organizacion minera —entre 13 y
 * 26 bloques— estaba migrado y no tenia donde leerse.
 */

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { historia, slugsDeHistoria, urlImagen } from "@/lib/sanity";
import { ruta } from "@/lib/rutas";
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
      <article className="mx-auto max-w-[760px]">
        <Link href={ruta("/historias-craft")} className="rotulo text-terracota">
          ← Historias CRAFT
        </Link>

        <header className="mt-8 border-b border-linea pb-9">
          {encima && (
            <p className="rotulo text-terracota">
              {[encima, h.pais, ...(h.temas ?? [])].filter(Boolean).join(" · ")}
            </p>
          )}
          <h1 className="titular mt-4 text-[clamp(1.7rem,3.6vw,2.3rem)]">{titular}</h1>
          {h.excerpt && (
            <p className="mt-6 text-[17px] leading-relaxed font-light text-suave">{h.excerpt}</p>
          )}
        </header>

        {!!h.portada && (
          <Image
            src={urlImagen(h.portada).width(1520).fit("max").auto("format").url()}
            alt=""
            width={1520}
            height={960}
            className="mt-9 h-auto w-full rounded-lg"
            sizes="(max-width: 800px) 100vw, 760px"
            priority
          />
        )}

        <div className="mt-9">
          <Texto valor={h.body} />
        </div>

        {!!(h.rutas ?? []).length && (
          <footer className="mt-12 rounded-xl bg-gris px-6 py-5">
            <p className="rotulo text-terracota">Direcciones conservadas</p>
            <ul className="mt-3 space-y-1">
              {(h.rutas ?? []).map((r) => (
                <li key={r} className="truncate font-mono text-[12px] text-suave">{r}</li>
              ))}
            </ul>
          </footer>
        )}
      </article>
    </main>
  );
}
