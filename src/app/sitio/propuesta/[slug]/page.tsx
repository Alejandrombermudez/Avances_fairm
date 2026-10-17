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
import Image from "next/image";
import { stegaClean } from "next-sanity";
import Link from "next/link";
import { hayImagen, paginaPorSlug, slugsDePagina, preguntas, hitos, urlImagen } from "@/lib/sanity";
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

type Seccion = { id: string; texto: string };

/** Los titulares de primer nivel del cuerpo, con el ancla que les pone
 *  `Texto`: «s-» y la llave del bloque, que no cambia aunque cambie el texto. */
function secciones(cuerpo: unknown[] | null): Seccion[] {
  return (cuerpo ?? []).flatMap((b) => {
    const x = b as {
      _type?: string;
      _key?: string;
      style?: string;
      listItem?: string;
      children?: { text?: string }[];
    };
    if (x._type !== "block" || x.style !== "h2" || x.listItem || !x._key) return [];
    const texto = stegaClean((x.children ?? []).map((c) => c.text ?? "").join("")).trim();
    return texto ? [{ id: `s-${x._key}`, texto }] : [];
  });
}

/**
 * «En esta página»: un salto a cada sección. Gobernanza mide más de 14.000
 * píxeles y no había manera de llegar a los integrantes del comité sin
 * recorrerla entera. Con pocas secciones son botones a la vista; con muchas,
 * una lista que se despliega, para no tapar el comienzo de la página.
 */
function Indice({ lista }: { lista: Seccion[] }) {
  if (lista.length < 3) return null;
  if (lista.length <= 8) {
    return (
      <nav aria-label="En esta página" className="mt-8">
        <p className="rotulo text-suave">En esta página</p>
        <ul className="mt-3 flex flex-wrap justify-center gap-2">
          {lista.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="inline-block rounded-full border border-linea bg-white px-4 py-1.5 text-[13px] font-medium text-cafe transition-colors hover:border-cafe hover:bg-cafe hover:text-white"
              >
                {s.texto}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
  return (
    <details className="tarjeta group mx-auto mt-8 max-w-[640px] px-6 py-3.5 text-left">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-semibold text-cafe [&::-webkit-details-marker]:hidden">
        <span>
          En esta página <span className="font-light text-suave">· {lista.length} secciones</span>
        </span>
        <span aria-hidden="true" className="text-[18px] font-light transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <nav aria-label="En esta página">
        <ol className="mt-3 gap-8 border-t border-linea pt-3 sm:columns-2">
          {lista.map((s) => (
            <li key={s.id} className="break-inside-avoid">
              <a
                href={`#${s.id}`}
                className="block py-1.5 text-[13.5px] leading-snug text-tinta transition-colors hover:text-cafe hover:underline"
              >
                {s.texto}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
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
  const ancho = p.cabecera?.ancho ?? 2400;
  const alto = p.cabecera?.alto ?? 1000;

  return (
    <main className="bg-gris">
      {/* La franja de arriba, entera. Las de CRAFT llevan texto escrito
          dentro —la de «Qué es CRAFT», un párrafo pegado al borde
          izquierdo— y cualquier recorte se lo come. Se ve a su proporción,
          sin cortar ni estirar; para que una alta no ocupe toda la pantalla,
          lo que se limita es el ancho: nunca más de 460 píxeles de alto. En
          el teléfono va de borde a borde. */}
      {hayImagen(p.cabecera) && p.cabecera && (
        <div className="sm:px-6 sm:pt-8">
          <div
            className="mx-auto overflow-hidden bg-cafe sm:rounded-xl sm:shadow-[0_10px_30px_-12px_rgba(81,33,17,.35)]"
            style={{ maxWidth: `min(1180px, ${Math.round((460 * ancho) / alto)}px)` }}
          >
            <Image
              src={urlImagen(p.cabecera).width(2400).fit("max").auto("format").url()}
              alt=""
              width={ancho}
              height={alto}
              priority
              sizes="(max-width: 640px) 100vw, 1180px"
              className="block h-auto w-full"
            />
          </div>
        </div>
      )}
      <div className="mx-auto max-w-[908px] px-6 py-14">
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
          <Indice lista={secciones(p.body)} />
        </header>

        <div className="mt-10 space-y-6" data-revelar>
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
