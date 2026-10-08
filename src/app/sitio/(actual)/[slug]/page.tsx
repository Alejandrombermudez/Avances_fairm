/**
 * Cualquier página migrada, en su dirección de siempre.
 *
 * Las rutas se generan desde los slugs que hay en el gestor: añadir una página
 * la publica sin tocar código.
 */

import { notFound } from "next/navigation";
import { paginaPorSlug, slugsDePagina, preguntas, hitos } from "@/lib/sanity";
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

async function Acordeones() {
  const faqs = await preguntas();
  return (
    <div className="mt-6 space-y-2.5">
      {faqs.map((f) => (
        <details key={f._id} className="border-b border-linea py-3">
          <summary className="cursor-pointer list-none text-[16px] font-semibold">
            <span className="mr-3 text-cafe">+</span>
            {f.question}
          </summary>
          <div className="mt-3 pl-7 text-suave">
            <Texto valor={f.answer} />
          </div>
        </details>
      ))}
    </div>
  );
}

async function Cronologia() {
  const hs = await hitos();
  return (
    <ol className="mt-6 border-l border-linea pl-6">
      {hs.map((h) => (
        <li key={h._id} className="relative pb-5 last:pb-0">
          <span className="absolute top-[9px] -left-[27px] size-[7px] rounded-full bg-cafe" />
          <p className="text-[13px] font-semibold text-suave">{h.date?.slice(0, 7)}</p>
          <p className="mt-1 text-[15px]">{h.title}</p>
        </li>
      ))}
    </ol>
  );
}

export default async function Pagina({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await paginaPorSlug(slug);
  if (!p) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-14 sm:px-10">
      <h1 className="text-[2.4rem] leading-tight font-light text-balance">{p.title}</h1>

      {p.lead && (
        <p className="mt-5 text-[17px] leading-relaxed font-light text-suave">{p.lead}</p>
      )}

      {p.temas?.length ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {p.temas.map((t) => (
            <span key={t} className="rounded-full bg-gris px-3 py-1 text-[12.5px] text-cafe">
              {t}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-9">
        <Texto valor={p.body} tono="pagina" />
      </div>

      {/* Las paginas que ya no guardan su contenido lo arman con las fichas.
          Su direccion sigue respondiendo, que es lo que importa. */}
      {p.arma === "faq" && <Acordeones />}
      {p.arma === "cronologia" && <Cronologia />}

      {p.legacyPaths?.length ? (
        <p className="mt-12 border-t border-linea pt-5 text-[13px] font-light text-suave">
          Dirección conservada: <span className="font-mono">{p.legacyPaths[0]}</span>
        </p>
      ) : null}
    </main>
  );
}
