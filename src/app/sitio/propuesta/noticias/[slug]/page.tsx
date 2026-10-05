/**
 * Una noticia, completa.
 *
 * Es la plantilla que cierra el camino del articulo. Lo que se escribe en el
 * gestor —titular, fecha, entradilla, cuerpo, temas— cae aqui sin que haya que
 * tocar nada: la pagina se genera a partir de los slugs que haya en Sanity.
 *
 * Las direcciones de los articulos del sitio de hoy van dentro del ano
 * (/2024/consulte-la-ultima-version...). Aqui no: el ano es un dato del
 * documento, no parte de su direccion, y asi una noticia no cambia de sitio
 * por haberse publicado en enero o en diciembre.
 */

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articulo, slugsDeArticulo, urlImagen } from "@/lib/sanity";
import { ruta } from "@/lib/rutas";
import { fechaLarga } from "@/lib/fecha";
import Texto from "@/components/sitio/Texto";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await slugsDeArticulo();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await articulo(slug);
  return a ? { title: a.title, description: a.excerpt ?? undefined } : { title: "Noticia" };
}

export default async function Noticia({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await articulo(slug);
  if (!a) notFound();

  return (
    <main className="px-6 py-14">
      <article className="mx-auto max-w-[760px]">
        <Link href={ruta("/propuesta/noticias")} className="rotulo text-terracota">
          ← Noticias
        </Link>

        <header className="mt-8 border-b border-linea pb-9">
          <p className="rotulo text-terracota">
            {[fechaLarga(a.publishedAt), ...(a.temas ?? [])].filter(Boolean).join(" · ")}
          </p>
          <h1 className="titular mt-4 text-[clamp(1.8rem,4vw,2.5rem)]">{a.title}</h1>
          {a.excerpt && (
            <p className="mt-6 text-[17px] leading-relaxed font-light text-suave">{a.excerpt}</p>
          )}
          {!!(a.autores ?? []).length && (
            <p className="mt-5 text-[14px] text-suave">{(a.autores ?? []).join(" · ")}</p>
          )}
        </header>

        {!!a.portada && (
          <Image
            src={urlImagen(a.portada).width(1520).fit("max").auto("format").url()}
            alt=""
            width={1520}
            height={960}
            className="mt-9 h-auto w-full rounded-lg"
            sizes="(max-width: 800px) 100vw, 760px"
            priority
          />
        )}

        <div className="mt-9">
          <Texto valor={a.body} />
        </div>

        {!!(a.rutas ?? []).length && (
          <footer className="mt-12 rounded-xl bg-gris px-6 py-5">
            <p className="rotulo text-terracota">Direcciones conservadas</p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-suave">
              Esta noticia sigue respondiendo en su direccion anterior, asi que lo que este citado
              o compartido desde fuera no se rompe.
            </p>
            <ul className="mt-3 space-y-1">
              {(a.rutas ?? []).map((r) => (
                <li key={r} className="truncate font-mono text-[12px] text-suave">{r}</li>
              ))}
            </ul>
          </footer>
        )}
      </article>
    </main>
  );
}
