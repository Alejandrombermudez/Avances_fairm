/**
 * La portada propuesta.
 *
 * Se parece mucho a la de hoy, y es deliberado: mismas secciones, mismos
 * títulos, misma letra, mismo reparto de color. Quien conoce craftmines.org
 * tiene que reconocerla. Lo que cambia es de dónde sale cada sección:
 * «Descarga el CRAFT» hoy son dos botones escritos a mano, y aquí es la
 * versión vigente con sus volúmenes; «¿Quiénes están aplicando CRAFT?» hoy es
 * un párrafo y un botón, y aquí están las historias.
 *
 * La página no sabe qué secciones tiene. Recorre las franjas que haya en
 * «Ajustes del sitio», en su orden, y dibuja cada una según su tipo y según
 * lo que lista. Antes las buscaba por cómo empezaba el título —«¿Por qué…»,
 * «Descarga…»— y bastaba con que alguien corrigiera un título en el gestor
 * para que esa sección desapareciera de la portada. Ahora se puede cambiar
 * cualquier texto, reordenar, quitar una franja o añadir una de solo texto, y
 * la portada sigue en pie.
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
import { rutaPropuesta } from "@/lib/rutas";
import { fechaLarga, mesYAno } from "@/lib/fecha";
import Icono from "@/components/sitio/Icono";
import InterruptorFuentes from "@/components/sitio/InterruptorFuentes";

export const revalidate = 3600;

type Norma = Awaited<ReturnType<typeof norma>>;
type Historias = Awaited<ReturnType<typeof historias>>;
type Hitos = Awaited<ReturnType<typeof hitos>>;
type Articulos = Awaited<ReturnType<typeof articulos>>;

/** Dice qué consulta alimenta la sección. Oculto salvo que se pida. */
function Fuente({ children }: { children: React.ReactNode }) {
  return <p className="fuente rotulo mb-3 text-verde">{children}</p>;
}

const recortar = (t: string, n: number) => (t.length > n ? `${t.slice(0, n).trimEnd()}…` : t);

/* ── El marco de una franja: su fondo y, con él, el color de la letra ── */

/**
 * El fondo se elige en el gestor: blanco, gris, café o foto. Sobre café y
 * sobre foto la letra va en blanco; lo decide el marco, no cada sección, para
 * que cualquier franja se lea bien con cualquier fondo.
 */
function Marco({
  b,
  children,
}: {
  b: Banda;
  children: (oscuro: boolean) => React.ReactNode;
}) {
  const foto =
    b.fondo === "foto" && b.imagen ? urlImagen(b.imagen).width(1800).auto("format").url() : null;
  const oscuro = !!foto || b.fondo === "cafe";
  const fondo = foto ? "" : b.fondo === "cafe" ? "bg-cafe" : b.fondo === "gris" ? "bg-gris" : "";
  return (
    <section className={`relative px-6 py-20 ${fondo}`}>
      {foto && (
        <>
          <Image src={foto} alt="" fill sizes="100vw" className="object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(rgba(0,0,0,.42) 0%, rgba(0,0,0,.34) 100%)" }}
          />
        </>
      )}
      <div className="relative mx-auto max-w-[1180px]">{children(oscuro)}</div>
    </section>
  );
}

/** El título y el texto de la franja, centrados, como en su sitio. */
function Encabezado({
  b,
  oscuro,
  ancho = "max-w-3xl",
}: {
  b: Banda;
  oscuro: boolean;
  ancho?: string;
}) {
  return (
    <>
      {b.titulo && (
        <h2
          className={`titular text-[32px] text-balance sm:text-[40px] ${oscuro ? "text-white" : ""}`}
        >
          {b.titulo}
        </h2>
      )}
      {b.texto && (
        <p
          className={`mx-auto mt-5 text-[16px] leading-relaxed font-light ${ancho} ${
            oscuro ? "text-white/90" : "text-suave"
          }`}
        >
          {b.texto}
        </p>
      )}
    </>
  );
}

function Botones({ b, oscuro }: { b: Banda; oscuro: boolean }) {
  const botones = (b.botones ?? []).filter((x) => x.url && x.etiqueta);
  if (!botones.length) return null;
  return (
    <div className="mt-10 flex flex-wrap justify-center gap-4">
      {botones.map((x) => (
        <Link
          key={x._key}
          href={rutaPropuesta(x.url)}
          className={`boton ${oscuro ? "boton-claro" : ""}`}
        >
          {x.etiqueta}
        </Link>
      ))}
    </div>
  );
}

/* ── Las franjas ── */

function Hero({ b }: { b: Banda }) {
  const foto = b.imagen ? urlImagen(b.imagen).width(2400).auto("format").url() : null;
  return (
    <section className={`relative flex min-h-[560px] items-center ${foto ? "" : "bg-cafe"}`}>
      {foto && <Image src={foto} alt="" fill priority sizes="100vw" className="object-cover" />}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(rgba(10,10,10,.57) 0%, rgba(10,2,2,0) 24%), rgba(0,0,0,.18)",
        }}
      />
      {/* El corte está en 980, como en su constructor: encima, la caja ocupa
          media fila y va a la derecha; debajo pasa a todo el ancho y a la
          izquierda, y el párrafo baja de 24 a 22. Medido sobre el suyo el 8
          de octubre de 2026: caja rgba(25,25,25,.5), titular de 26px,
          párrafo de 24px con peso 500, los dos con sombra. */}
      <div className="relative mx-auto grid w-full max-w-[1180px] px-6 py-12 min-[980px]:grid-cols-2">
        <div className="hidden min-[980px]:block" />
        <div
          className="py-7 pr-[22px] pl-[22px] text-left min-[980px]:pr-8 min-[980px]:text-right"
          style={{ background: "rgba(25,25,25,.5)" }}
        >
          <h1
            className="titular text-[26px] leading-tight text-balance text-white"
            style={{ textShadow: "0 2.6px 2.6px rgba(0,0,0,.4)" }}
          >
            {b.titulo}
          </h1>
          {b.texto && (
            <p
              className="mt-4 text-[22px] leading-[1.2] font-medium text-white min-[980px]:text-[24px]"
              style={{ textShadow: "0 2.4px 2.4px rgba(0,0,0,.67)" }}
            >
              {b.texto}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function Tarjetas({ b }: { b: Banda }) {
  const tarjetas = b.tarjetas ?? [];
  /* Tres por fila como en su sitio; si el equipo deja dos o pone cuatro, la
     rejilla se ajusta en vez de dejar un hueco. */
  const columnas =
    tarjetas.length >= 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : tarjetas.length === 2
        ? "sm:grid-cols-2"
        : "md:grid-cols-3";
  return (
    <Marco b={b}>
      {(oscuro) => (
        <div className="text-center">
          <Fuente>Texto de la página, igual que hoy</Fuente>
          <Encabezado b={b} oscuro={oscuro} />
          {/* Icono arriba y texto justificado, como en el sitio: Poppins a
              22px, peso 500, interlineado 1,24. En pantallas estrechas baja
              a 19 y deja de justificar, que con columnas angostas abre ríos
              blancos entre las palabras. */}
          <div className={`mt-12 grid gap-10 text-left ${columnas}`}>
            {tarjetas.map((t) => (
              <article key={t._key}>
                <Icono nombre={t.icono} />
                {t.titulo && (
                  <h3 className={`mt-3 text-[19px] ${oscuro ? "text-white" : ""}`}>{t.titulo}</h3>
                )}
                <p
                  className={`mt-4 text-[19px] leading-[1.3] font-medium lg:text-justify lg:text-[22px] lg:leading-[1.24] ${
                    oscuro ? "text-white" : "text-tinta"
                  }`}
                >
                  {t.texto}
                </p>
              </article>
            ))}
          </div>
          <Botones b={b} oscuro={oscuro} />
        </div>
      )}
    </Marco>
  );
}

function Volumenes({ b, n }: { b: Banda; n: Norma }) {
  const vigente = n?.vigente;
  const vols = (vigente?.volumenes ?? []).filter((v) => v.volumen !== "Completo");
  const completo = (vigente?.volumenes ?? []).find((v) => v.volumen === "Completo");
  return (
    <Marco b={b}>
      {(oscuro) => (
        <>
          <div className="text-center">
            <Fuente>Ficha de la norma, versión marcada como vigente</Fuente>
            <Encabezado b={b} oscuro={oscuro} ancho="max-w-2xl" />
          </div>

          {vigente && (
            <div className={`mx-auto mt-12 max-w-3xl ${oscuro ? "tarjeta p-6 sm:p-8" : ""}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-cafe pb-3">
                <h3 className="text-[22px]">Código CRAFT {vigente.version}</h3>
                <span className="text-[14px] font-light text-suave">
                  Versión vigente{vigente.fecha ? `, ${vigente.fecha.slice(0, 4)}` : ""}
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
                        href={rutaPropuesta(`/propuesta/documentos/${v.slug}`)}
                        className="min-w-0 flex-1 basis-[14rem] text-[15.5px] hover:underline"
                      >
                        {v.volumen?.replace("Vol. ", "Volumen ")}.{" "}
                        <span className="font-light text-suave">
                          {(v.titulo ?? "").replace(/^CRAFT [\d.]+ — /, "")}
                        </span>
                      </Link>
                      <span className="flex shrink-0 flex-wrap gap-1.5">
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
                  <Link
                    href={rutaPropuesta(`/propuesta/documentos/${completo.slug}`)}
                    className="boton"
                  >
                    Descarga CRAFT {vigente.version}
                  </Link>
                )}
                <Link
                  href={rutaPropuesta("/propuesta/recursos")}
                  className="boton bg-transparent text-cafe"
                  style={{ border: "1px solid var(--color-cafe)" }}
                >
                  Versiones anteriores
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </Marco>
  );
}

function Historias({ b, hist }: { b: Banda; hist: Historias }) {
  const lista = hist.filter((h) => h.slug).slice(0, b.cuantos ?? undefined);
  return (
    <Marco b={b}>
      {(oscuro) => (
        <>
          <div className="text-center">
            <Fuente>Fichas de historia, {hist.length} publicadas</Fuente>
            <Encabezado b={b} oscuro={oscuro} />
          </div>
          {lista.length > 0 && (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {lista.map((h) => (
                <Link
                  key={h._id}
                  href={rutaPropuesta(`/propuesta/historias/${h.slug}`)}
                  className="tarjeta block p-6 transition-colors hover:border-cafe"
                >
                  {h.place && <p className="rotulo text-cafe">{h.place}</p>}
                  <h3 className="mt-2.5 text-[17px] leading-snug font-normal text-pretty">
                    {recortar(h.title.replace(/^[^–]+–\s*/, ""), 140)}
                  </h3>
                  {h.excerpt && (
                    <p className="mt-3 text-[14px] leading-relaxed font-light text-suave">
                      {recortar(h.excerpt, 150)}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </Marco>
  );
}

function Cronologia({ b, hit }: { b: Banda; hit: Hitos }) {
  return (
    <Marco b={b}>
      {(oscuro) => (
        <div className="text-center">
          <Fuente>Fichas de hito, {hit.length} en la cronología</Fuente>
          <Encabezado b={b} oscuro={oscuro} ancho="max-w-2xl" />

          {hit.length > 0 && (
            <ol className="mx-auto mt-12 grid max-w-4xl gap-x-10 gap-y-6 text-left sm:grid-cols-2 lg:grid-cols-3">
              {hit.map((h) => (
                <li
                  key={h._id}
                  className={`border-t pt-3 ${oscuro ? "border-white/30" : "border-linea"}`}
                >
                  <p
                    className={`text-[13px] font-semibold ${oscuro ? "text-white/70" : "text-suave"}`}
                  >
                    {mesYAno(h.date) ?? h.date?.slice(0, 7)}
                  </p>
                  <p className={`mt-1 text-[14.5px] font-light ${oscuro ? "text-white" : ""}`}>
                    {h.title}
                  </p>
                </li>
              ))}
            </ol>
          )}

          <Botones b={b} oscuro={oscuro} />
        </div>
      )}
    </Marco>
  );
}

function Noticias({ b, art }: { b: Banda; art: Articulos }) {
  const lista = art.filter((x) => x.slug).slice(0, b.cuantos ?? 6);
  return (
    <Marco b={b}>
      {(oscuro) => (
        <>
          <div className="text-center">
            <Fuente>Artículos, los {lista.length} más recientes</Fuente>
            <Encabezado b={b} oscuro={oscuro} />
          </div>
          {lista.length > 0 && (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {lista.map((x) => (
                <Link
                  key={x._id}
                  href={rutaPropuesta(`/propuesta/noticias/${x.slug}`)}
                  className="tarjeta block p-6 transition-colors hover:border-cafe"
                >
                  <p className="text-[13px] font-light text-suave">{fechaLarga(x.publishedAt)}</p>
                  <h3 className="mt-2 text-[17px] leading-snug font-normal text-pretty">
                    {recortar(x.title, 140)}
                  </h3>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-12 text-center">
            <Link
              href={rutaPropuesta("/propuesta/noticias")}
              className={`boton ${oscuro ? "boton-claro" : ""}`}
            >
              Ver todas las noticias
            </Link>
          </div>
        </>
      )}
    </Marco>
  );
}

/** Una franja de solo texto: título, párrafo y sus botones. */
function SoloTexto({ b }: { b: Banda }) {
  return (
    <Marco b={b}>
      {(oscuro) => (
        <div className="text-center">
          <Encabezado b={b} oscuro={oscuro} />
          <Botones b={b} oscuro={oscuro} />
        </div>
      )}
    </Marco>
  );
}

export default async function PortadaPropuesta() {
  const [a, n, hist, hit, art] = await Promise.all([
    ajustes(),
    norma(),
    historias(),
    hitos(),
    articulos("es", 12),
  ]);

  return (
    <main>
      {(a?.bandas ?? []).map((b) => {
        if (b.tipo === "hero") return <Hero key={b._key} b={b} />;
        if (b.tipo === "tarjetas") return <Tarjetas key={b._key} b={b} />;
        if (b.listado === "volumenes") return <Volumenes key={b._key} b={b} n={n} />;
        if (b.listado === "historias") return <Historias key={b._key} b={b} hist={hist} />;
        if (b.listado === "hitos") return <Cronologia key={b._key} b={b} hit={hit} />;
        if (b.listado === "articulos") return <Noticias key={b._key} b={b} art={art} />;
        return <SoloTexto key={b._key} b={b} />;
      })}

      {/* El interruptor va al final, discreto: es una ayuda para explicar,
          no parte del sitio. */}
      <div className="px-6 py-8 text-center">
        <InterruptorFuentes />
      </div>
    </main>
  );
}
