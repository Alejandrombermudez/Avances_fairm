/**
 * La portada propuesta.
 *
 * Se parece mucho a la de hoy, y es deliberado: mismas secciones, mismos
 * títulos, misma letra, mismo reparto de color. Quien conoce craftmines.org
 * tiene que reconocerla.
 *
 * Lo que cambia es de dónde sale cada sección. Se ve sobre todo en tres:
 *
 *   «Descarga el CRAFT» hoy son dos botones escritos a mano, uno de ellos a
 *   un PDF en inglés. Aquí es la versión vigente con sus volúmenes.
 *
 *   «¿Quiénes están aplicando CRAFT?» hoy es un párrafo y un botón. Aquí
 *   están las seis historias.
 *
 *   «¿Cómo se está creando CRAFT?» hoy son dos botones. Aquí está la
 *   cronología.
 */

import Image from "next/image";
import Link from "next/link";
import {
  ajustes,
  articulos,
  historias,
  hitos,
  norma,
  urlImagen,
  type Banda,
} from "@/lib/sanity";
import { ruta } from "@/lib/rutas";
import { fechaLarga } from "@/lib/fecha";
import Icono from "@/components/sitio/Icono";
import InterruptorFuentes from "@/components/sitio/InterruptorFuentes";

export const revalidate = 3600;

/** Dice qué consulta alimenta la sección. Oculto salvo que se pida. */
function Fuente({ children }: { children: React.ReactNode }) {
  return <p className="fuente rotulo mb-3 text-verde">{children}</p>;
}

export default async function PortadaPropuesta() {
  const [a, n, hist, hit, art] = await Promise.all([
    ajustes(),
    norma(),
    historias(),
    hitos(),
    articulos("es", 6),
  ]);

  const bandas = a?.bandas ?? [];
  const busca = (t: string) => bandas.find((b: Banda) => (b.titulo ?? "").startsWith(t));
  const hero = bandas.find((b: Banda) => b.tipo === "hero");
  const porque = busca("¿Por qué");
  const descarga = busca("Descarga");
  const quienes = busca("¿Quiénes");
  const como = busca("¿Cómo");

  const vigente = n?.vigente;
  const vols = (vigente?.volumenes ?? []).filter((v) => v.volumen !== "Completo");
  const completo = (vigente?.volumenes ?? []).find((v) => v.volumen === "Completo");

  const foto = hero?.imagen ? urlImagen(hero.imagen).width(2400).auto("format").url() : null;
  const fotoComo = como?.imagen ? urlImagen(como.imagen).width(1800).auto("format").url() : null;

  return (
    <main>
      {/* ── Cabecera, como la suya ── */}
      <section className="relative flex min-h-[560px] items-center">
        {foto && <Image src={foto} alt="" fill priority sizes="100vw" className="object-cover" />}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(rgba(10,10,10,.57) 0%, rgba(10,2,2,0) 24%), rgba(0,0,0,.18)",
          }}
        />
        {/* El corte esta en 980, como en su constructor: encima, la caja
            ocupa media fila y va alineada a la derecha; debajo pasa a todo
            el ancho y a la izquierda, y el parrafo baja de 24 a 22. Antes
            partiamos en 640 y la caja se quedaba a media fila dentro del
            marco de la comparacion, cuando el suyo ya se habia estirado. */}
        <div className="relative mx-auto grid w-full max-w-[1180px] px-6 py-12 min-[980px]:grid-cols-2">
          <div className="hidden min-[980px]:block" />
          {/* Medido sobre el suyo el 8 de octubre de 2026: la caja gris es
              rgba(25,25,25,.5) —esa ya la teniamos—, pero el titular son 26px
              y el parrafo 24px con peso 500, los dos con sombra. El nuestro
              llevaba el titular a 40 y el parrafo a 22 en fina: por eso se
              veia desproporcionado al lado del suyo. */}
          <div
            className="py-7 pr-[22px] pl-[22px] text-left min-[980px]:pr-8 min-[980px]:text-right"
            style={{ background: "rgba(25,25,25,.5)" }}
          >
            <h1
              className="titular text-[26px] leading-none text-white"
              style={{ textShadow: "0 2.6px 2.6px rgba(0,0,0,.4)" }}
            >
              {hero?.titulo}
            </h1>
            <p
              className="mt-4 text-[22px] leading-[1.2] font-medium text-white min-[980px]:text-[24px]"
              style={{ textShadow: "0 2.4px 2.4px rgba(0,0,0,.67)" }}
            >
              {hero?.texto}
            </p>
          </div>
        </div>
      </section>

      {/* ── 1. Por qué ── */}
      <section className="bg-gris px-6 py-20">
        <div className="mx-auto max-w-[1180px] text-center">
          <Fuente>Texto de la página, igual que hoy</Fuente>
          <h2 className="titular text-[32px] sm:text-[40px]">{porque?.titulo}</h2>
          {/* Icono arriba y texto justificado, como en el sitio: Poppins a
              22px, peso 500, interlineado 1,24. Sin título: estas tarjetas
              no lo llevan. */}
          <div className="mt-12 grid gap-10 text-left sm:grid-cols-3">
            {(porque?.tarjetas ?? []).map((t) => (
              <article key={t._key}>
                <Icono nombre={t.icono} />
                {t.titulo && <h3 className="mt-3 text-[19px]">{t.titulo}</h3>}
                <p className="mt-4 text-[22px] leading-[1.24] font-medium text-tinta text-justify">
                  {t.texto}
                </p>
              </article>
            ))}
          </div>
          {porque?.botones?.[0] && (
            <Link href={ruta(porque.botones[0].url)} className="boton mt-10">
              {porque.botones[0].etiqueta}
            </Link>
          )}
        </div>
      </section>

      {/* ── 2. Descarga el CRAFT ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-[1180px]">
          <div className="text-center">
            <Fuente>Ficha de la norma, versión marcada como vigente</Fuente>
            <h2 className="titular text-[32px] sm:text-[40px]">{descarga?.titulo}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-relaxed font-light text-suave">
              {descarga?.texto}
            </p>
          </div>

          {vigente && (
            <div className="mx-auto mt-12 max-w-3xl">
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-cafe pb-3">
                <h3 className="text-[22px]">Código CRAFT {vigente.version}</h3>
                <span className="text-[14px] font-light text-suave">
                  Versión vigente, {vigente.fecha?.slice(0, 4)}
                </span>
              </div>

              <ul>
                {vols.map((v) => {
                  const idiomas = [...(v.idiomas ?? [])].sort();
                  return (
                    <li
                      key={v._id}
                      className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-linea py-4"
                    >
                      <Link
                        href={`/sitio/propuesta/documentos/${v.slug}`}
                        className="min-w-[14rem] flex-1 text-[15.5px] hover:underline"
                      >
                        {v.volumen?.replace("Vol. ", "Volumen ")}.{" "}
                        <span className="font-light text-suave">
                          {(v.titulo ?? "").replace(/^CRAFT [\d.]+ — /, "")}
                        </span>
                      </Link>
                      <span className="flex shrink-0 gap-1.5">
                        {idiomas.map((l) => (
                          <span
                            key={l}
                            className="rounded border border-linea px-2 py-0.5 text-[12px] font-semibold text-suave"
                          >
                            {l.toUpperCase()}
                          </span>
                        ))}
                        {!idiomas.includes("es") && (
                          <span className="px-1 text-[12px] font-light text-suave italic">
                            aún no en español
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                {completo && (
                  <Link href={`/sitio/propuesta/documentos/${completo.slug}`} className="boton">
                    Descarga CRAFT {vigente.version}
                  </Link>
                )}
                <Link href={ruta("/propuesta/recursos")} className="boton bg-transparent text-cafe"
                  style={{ border: "1px solid var(--color-cafe)" }}>
                  Versiones anteriores
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 3. Quiénes ── */}
      <section className="bg-gris px-6 py-20">
        <div className="mx-auto max-w-[1180px]">
          <div className="text-center">
            <Fuente>Fichas de historia, {hist.length} publicadas</Fuente>
            <h2 className="titular text-[32px] sm:text-[40px]">{quienes?.titulo}</h2>
            <p className="mx-auto mt-5 max-w-3xl text-[16px] leading-relaxed font-light text-suave">
              {quienes?.texto}
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hist.map((h) => (
              <Link
                key={h._id}
                href={ruta(`/propuesta/historias/${h.slug}`)}
                className="tarjeta block p-6 transition-colors hover:border-cafe"
              >
                {h.place && <p className="rotulo text-cafe">{h.place}</p>}
                <h3 className="mt-2.5 text-[17px] leading-snug font-normal">
                  {h.title.replace(/^[^–]+–\s*/, "")}
                </h3>
                {h.excerpt && (
                  <p className="mt-3 text-[14px] leading-relaxed font-light text-suave">
                    {h.excerpt.length > 150 ? `${h.excerpt.slice(0, 150).trimEnd()}…` : h.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Cómo se está creando ── */}
      <section className="relative px-6 py-20">
        {fotoComo && (
          <>
            <Image src={fotoComo} alt="" fill sizes="100vw" className="object-cover" />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(rgba(0,0,0,.42) 0%, rgba(0,0,0,.34) 100%)" }}
            />
          </>
        )}
        <div className="relative mx-auto max-w-[1180px] text-center">
          <Fuente>Fichas de hito, {hit.length} en la cronología</Fuente>
          <h2 className="titular text-[32px] text-white sm:text-[40px]">{como?.titulo}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-relaxed font-light text-white/90">
            {como?.texto}
          </p>

          <ol className="mx-auto mt-12 grid max-w-4xl gap-x-10 gap-y-6 text-left sm:grid-cols-2 lg:grid-cols-3">
            {hit.map((h) => (
              <li key={h._id} className="border-t border-white/30 pt-3">
                <p className="text-[13px] font-semibold text-white/70">{h.date?.slice(0, 7)}</p>
                <p className="mt-1 text-[14.5px] font-light text-white">{h.title}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {(como?.botones ?? []).map((b) => (
              <Link key={b._key} href={ruta(b.url)} className="boton boton-claro">
                {b.etiqueta}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Noticias ── */}
      <section className="bg-gris px-6 py-20">
        <div className="mx-auto max-w-[1180px]">
          <div className="text-center">
            <Fuente>Artículos, los {art.length} más recientes</Fuente>
            <h2 className="titular text-[32px] sm:text-[40px]">Noticias y actividades</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {art.map((x) => (
              <Link
                key={x._id}
                href={ruta(`/propuesta/noticias/${x.slug}`)}
                className="tarjeta block p-6 transition-colors hover:border-cafe"
              >
                <p className="text-[13px] font-light text-suave">{fechaLarga(x.publishedAt)}</p>
                <h3 className="mt-2 text-[17px] leading-snug font-normal">{x.title}</h3>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href={ruta("/propuesta/noticias")} className="boton">
              Ver todas las noticias
            </Link>
          </div>
        </div>
      </section>

      {/* El interruptor va al final, discreto: es una ayuda para explicar,
          no parte del sitio. */}
      <div className="px-6 py-8 text-center">
        <InterruptorFuentes />
      </div>
    </main>
  );
}
