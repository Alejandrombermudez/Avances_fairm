/**
 * Las páginas de contenido, en la propuesta.
 *
 * Hasta ahora la propuesta solo tenía portada, recursos, preguntas y
 * noticias: «Qué es CRAFT», «Impacto» o «Contacto» solo existían en la
 * réplica. Y la réplica no se puede tocar —su trabajo es demostrar que el
 * contenido llegó entero—, así que el sitio para enseñar no tenía dónde
 * mostrar una página escrita.
 *
 * Aquí está, con el mismo contenido del mismo gestor y la estética de la
 * propuesta: el texto dentro de una tarjeta blanca sobre fondo gris, que es
 * como se leen las demás pantallas de esta parte.
 *
 * Comprobado el 8 de octubre de 2026: craftmines.org no tiene tarjetas en
 * estas páginas. Esto es una propuesta, no una réplica.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { paginaPorSlug, slugsDePagina, preguntas, hitos } from "@/lib/sanity";
import { ruta } from "@/lib/rutas";
import Texto from "@/components/sitio/Texto";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await slugsDePagina();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await paginaPorSlug(slug);
  return { title: p?.title ?? "Página" };
}

function Tarjeta({ children }: { children: React.ReactNode }) {
  return <div className="tarjeta px-7 py-9 sm:px-10 sm:py-11">{children}</div>;
}

async function Acordeones() {
  const faqs = await preguntas();
  return (
    <div className="space-y-3">
      {faqs.map((f) => (
        <details key={f._id} className="tarjeta px-6 py-4">
          <summary className="cursor-pointer list-none text-[16px] font-semibold">
            <span className="mr-3 text-cafe">+</span>
            {f.question}
          </summary>
          <div className="mt-3 pl-7 text-suave">
            <Texto valor={f.answer} enPropuesta />
          </div>
        </details>
      ))}
    </div>
  );
}

async function Cronologia() {
  const hs = await hitos();
  return (
    <Tarjeta>
      <ol className="border-l border-linea pl-6">
        {hs.map((h) => (
          <li key={h._id} className="relative pb-5 last:pb-0">
            <span className="absolute top-[9px] -left-[27px] size-[7px] rounded-full bg-cafe" />
            <p className="text-[13px] font-semibold text-suave">{h.date?.slice(0, 7)}</p>
            <p className="mt-1 text-[15px]">{h.title}</p>
          {h.description && (
            <p className="mt-1.5 text-[14px] leading-relaxed font-light text-suave">
              {h.description}
            </p>
          )}
          </li>
        ))}
      </ol>
    </Tarjeta>
  );
}

export default async function PaginaPropuesta({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await paginaPorSlug(slug);
  if (!p) notFound();

  const tieneCuerpo = !!p.body?.length;

  return (
    <main className="bg-gris px-6 py-14">
      <div className="mx-auto max-w-[860px]">
        <header className="text-center">
          {p.temas?.length ? (
            <p className="rotulo text-terracota">{p.temas.join(" · ")}</p>
          ) : null}
          <h1 className="titular mt-4 text-[clamp(1.9rem,4vw,2.6rem)]">{p.title}</h1>
          {p.lead && (
            <p className="mx-auto mt-5 max-w-2xl text-[16.5px] leading-relaxed font-light text-suave">
              {p.lead}
            </p>
          )}
        </header>

        <div className="mt-10 space-y-6">
          {tieneCuerpo && (
            <Tarjeta>
              <Texto valor={p.body} tono="pagina" enPropuesta />
            </Tarjeta>
          )}

          {/* Las paginas que ya no guardan su texto lo arman con las fichas. */}
          {p.arma === "faq" && <Acordeones />}
          {p.arma === "cronologia" && <Cronologia />}
        </div>

        {p.legacyPaths?.length ? (
          <p className="mt-10 text-center text-[13px] font-light text-suave">
            Dirección conservada: <span className="font-mono">{p.legacyPaths[0]}</span>
          </p>
        ) : null}

        <p className="mt-10 text-center">
          <Link href={ruta(`/${slug}`)} className="rotulo text-terracota">
            Ver esta misma página como está hoy →
          </Link>
        </p>
      </div>
    </main>
  );
}
