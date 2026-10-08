/**
 * Dibuja el cuerpo de una página, una noticia o una historia.
 *
 * El gestor ofrece catorce piezas para armar un cuerpo y aquí están las
 * catorce. No siempre fue así: hasta el 8 de octubre de 2026 se dibujaban
 * cinco, y una galería, un video o un acordeón se guardaban sin error y no
 * aparecían en ninguna parte. La regla es que una pieza que se ofrece en
 * `sanity/schemas/objetos/cuerpo.ts` tiene aquí su dibujo, o no se ofrece.
 *
 * Todas se ajustan solas al ancho de la pantalla: lo que en el sitio de hoy
 * eran columnas del constructor aquí son rejillas que pasan de una columna a
 * dos y a las que haga falta.
 */

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlImagen, type Documento } from "@/lib/sanity";
import { extension, fichaDeArchivo } from "@/lib/archivos";
import { mesYAno } from "@/lib/fecha";
import { RAIZ, esExterna, ruta, rutaPropuesta } from "@/lib/rutas";
import IconoArchivo from "@/components/sitio/IconoArchivo";
import { NOMBRE_TIPO, nombre } from "@/components/sitio/FichaDocumento";

/**
 * `pagina` para las páginas del sitio: los titulares van centrados y con su
 * raya debajo, como los suyos. `prosa` para noticias e historias, que se leen
 * de corrido y llevan los titulares a la izquierda.
 */
type Tono = "pagina" | "prosa";

type Boton = {
  _key: string;
  etiqueta?: string;
  descripcion?: string;
  enlace?: string;
  url?: string | null;
  formato?: string | null;
  peso?: number | null;
};

type Tarjeta = {
  _key: string;
  titulo?: string;
  texto?: string;
  imagen?: unknown;
  alt?: string;
  ancho?: number | null;
  alto?: number | null;
  botones?: Boton[] | null;
};

/* ── A dónde lleva un enlace ───────────────────────────────────────── */

/**
 * Un enlace escrito en el gestor puede ser de fuera —y pasa tal cual— o de
 * dentro, como «/contacto». Los de dentro se resuelven a la versión del sitio
 * en la que se esté: sin esto, un «/contacto» escrito por el equipo saldría
 * de /sitio y daría 404.
 */
function resolvedor(enPropuesta: boolean) {
  return (destino: string | null | undefined) => {
    const d = (destino ?? "").trim();
    if (!d) return { href: "#", fuera: false };
    if (d.startsWith("#")) return { href: d, fuera: false };
    if (esExterna(d)) return { href: d, fuera: /^(https?:)?\/\//i.test(d) };
    if (d === RAIZ || d.startsWith(`${RAIZ}/`)) return { href: d, fuera: false };
    return { href: enPropuesta ? rutaPropuesta(d) : ruta(d), fuera: false };
  };
}

const atributos = (fuera: boolean) =>
  fuera ? { target: "_blank", rel: "noopener noreferrer" } : {};

/* ── Iconos pequeños ───────────────────────────────────────────────── */

function Flecha({ baja }: { baja: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path
        d={baja ? "M6.5 2v7m0 0L4 6.5M6.5 9 9 6.5M2.5 11h8" : "M2.5 6.5h8M7.5 3.5l3 3-3 3"}
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Video e incrustados ───────────────────────────────────────────── */

/** La dirección del reproductor, si el video es de YouTube o de Vimeo. */
function reproductor(direccion: string | undefined): string | null {
  try {
    const u = new URL(direccion ?? "");
    const casa = u.hostname.replace(/^www\./, "");
    const ultimo = u.pathname.split("/").filter(Boolean).pop() ?? "";
    if (casa === "youtu.be" && ultimo) return `https://www.youtube-nocookie.com/embed/${ultimo}`;
    if (casa.endsWith("youtube.com")) {
      const id = u.searchParams.get("v") ?? ultimo;
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (casa.endsWith("vimeo.com") && /^\d+$/.test(ultimo)) {
      return `https://player.vimeo.com/video/${ultimo}`;
    }
  } catch {
    /* no era una dirección */
  }
  return null;
}

/**
 * Los servicios que se dejan meter dentro de una página. Cualquier otro se
 * ofrece como enlace: un marco con contenido de un tercero desconocido es
 * darle a ese tercero un trozo de la página.
 */
const CASAS_PERMITIDAS = [
  "google.com",
  "surveymonkey.com",
  "typeform.com",
  "airtable.com",
  "youtube.com",
  "youtube-nocookie.com",
  "vimeo.com",
];

function sePuedeIncrustar(direccion: string | undefined): boolean {
  try {
    const u = new URL(direccion ?? "");
    if (u.protocol !== "https:") return false;
    return CASAS_PERMITIDAS.some((c) => u.hostname === c || u.hostname.endsWith(`.${c}`));
  } catch {
    return false;
  }
}

/* ── Las piezas ────────────────────────────────────────────────────── */

/** El ancho de cada tarjeta según cuántas vayan por fila. La separación es de
 *  1,5rem, así que a cada una le toca el ancho de la fila menos su parte. */
const ANCHO_TARJETA: Record<number, string> = {
  2: "sm:basis-[calc(50%-0.75rem)]",
  3: "sm:basis-[calc(50%-0.75rem)] lg:basis-[calc(33.333%-1rem)]",
  4: "sm:basis-[calc(50%-0.75rem)] lg:basis-[calc(25%-1.125rem)]",
};

function piezas(tono: Tono, enPropuesta: boolean): PortableTextComponents {
  const resolver = resolvedor(enPropuesta);

  return {
    block: {
      normal: ({ children }) => (
        <p className="text-[15.5px] leading-relaxed font-light">{children}</p>
      ),
      /* Poppins 600 en café, como los suyos. En las páginas va centrado y
         con su raya debajo, que es como titulan ellos cada sección; en la
         prosa va a la izquierda y sin raya. */
      h2: ({ children }) =>
        tono === "pagina" ? (
          <h2 className="mt-12 border-b border-linea pb-3 text-center text-[1.45rem] leading-snug font-semibold text-balance text-cafe first:mt-0">
            {children}
          </h2>
        ) : (
          <h2 className="pt-6 text-[1.45rem] leading-snug font-semibold text-balance text-cafe">
            {children}
          </h2>
        ),
      h3: ({ children }) => (
        <h3 className="pt-3 text-[1.15rem] leading-snug font-semibold text-cafe">{children}</h3>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-2 border-cafe/30 pl-5 text-[15.5px] leading-relaxed font-light text-cafe italic">
          {children}
        </blockquote>
      ),
    },

    list: {
      bullet: ({ children }) => <ul className="ml-5 list-disc space-y-1.5">{children}</ul>,
      number: ({ children }) => <ol className="ml-5 list-decimal space-y-1.5">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="text-[15.5px] leading-relaxed font-light">{children}</li>
      ),
      number: ({ children }) => (
        <li className="text-[15.5px] leading-relaxed font-light">{children}</li>
      ),
    },

    marks: {
      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      em: ({ children }) => <em>{children}</em>,

      /* El enlace que baja un archivo lo dice, con su formato al lado. */
      link: ({ children, value }) => {
        const { href, fuera } = resolver((value as { href?: string })?.href);
        const formato = extension(href);
        return (
          <a
            href={href}
            className="text-cafe underline decoration-1 underline-offset-2 transition-opacity hover:opacity-70"
            {...atributos(fuera)}
          >
            {children}
            {formato && (
              <span className="ml-1.5 inline-block rounded border border-current px-1 py-px align-[1px] text-[9.5px] leading-none font-bold tracking-wide no-underline">
                {formato.toUpperCase()}
              </span>
            )}
          </a>
        );
      },

      /* El enlace a una ficha de la biblioteca. En la propuesta lleva a la
         ficha; en la réplica, que no tiene fichas, al archivo. */
      refDocumento: ({ children, value }) => {
        const v = value as { slug?: string | null; archivo?: string | null };
        const destino =
          enPropuesta && v.slug ? `/propuesta/documentos/${v.slug}` : (v.archivo ?? null);
        if (!destino) return <>{children}</>;
        const { href, fuera } = resolver(destino);
        return (
          <a
            href={href}
            className="text-cafe underline decoration-1 underline-offset-2 transition-opacity hover:opacity-70"
            {...atributos(fuera)}
          >
            {children}
          </a>
        );
      },
    },

    types: {
      /**
       * La imagen, a su tamaño. `maxWidth` la frena en su ancho real: una
       * foto grande llena la columna y un icono sigue siendo un icono.
       */
      imagen: ({ value }) => {
        const v = value as {
          asset?: unknown;
          alt?: string;
          caption?: string;
          ancho?: number;
          alto?: number;
        };
        if (!v?.asset) return null;
        const ancho = v.ancho && v.ancho > 0 ? v.ancho : 1400;
        const alto = v.alto && v.alto > 0 ? v.alto : 900;
        const pedido = Math.min(ancho, 1400);
        return (
          <figure className="mx-auto my-6" style={{ maxWidth: ancho }}>
            <Image
              src={urlImagen(v).width(pedido).fit("max").auto("format").url()}
              alt={v.alt ?? ""}
              width={ancho}
              height={alto}
              className="h-auto w-full rounded-lg"
              sizes={`(max-width: 768px) 100vw, ${pedido}px`}
            />
            {v.caption && (
              <figcaption className="mt-2 text-[13px] font-light text-suave">{v.caption}</figcaption>
            )}
          </figure>
        );
      },

      /** Imagen a la izquierda, título y texto a la derecha. En móvil se apila. */
      cajaImagen: ({ value }) => {
        const v = value as {
          imagen?: unknown;
          alt?: string;
          titulo?: string;
          texto?: string;
          enlace?: string;
        };
        const { href, fuera } = resolver(v.enlace);
        const enlazar = (hijo: React.ReactNode) =>
          v.enlace ? (
            <a href={href} className="transition-opacity hover:opacity-70" {...atributos(fuera)}>
              {hijo}
            </a>
          ) : (
            hijo
          );
        /* Sin título, el texto hace de título: es el nombre del documento. */
        const titulo = v.titulo ?? v.texto;
        const texto = v.titulo ? v.texto : undefined;
        const formato = extension(v.enlace);
        return (
          <div className="my-6 flex flex-col gap-5 sm:flex-row sm:items-start">
            {!!v.imagen && (
              <div className="w-[104px] shrink-0">
                {enlazar(
                  <Image
                    src={urlImagen(v.imagen).width(208).fit("max").auto("format").url()}
                    alt={v.alt ?? ""}
                    width={104}
                    height={104}
                    className="h-auto w-full"
                  />,
                )}
              </div>
            )}
            <div className="min-w-0 flex-1 sm:pt-1">
              {titulo && (
                <h3 className="text-[17px] leading-snug font-semibold text-cafe">
                  {enlazar(titulo)}
                  {formato && (
                    <span className="ml-2 inline-block rounded border border-current px-1 py-px align-[2px] text-[9.5px] leading-none font-bold tracking-wide">
                      {formato.toUpperCase()}
                    </span>
                  )}
                </h3>
              )}
              {texto && (
                <p className="mt-2 text-[15px] leading-relaxed font-light text-suave">{texto}</p>
              )}
            </div>
          </div>
        );
      },

      /**
       * Botones y descargas: una columna en móvil y dos desde tableta. El que
       * baja un archivo lleva su hoja con el formato; el que lleva a otra
       * página, una flecha.
       */
      botones: ({ value }) => {
        const items = ((value as { items?: Boton[] }).items ?? []).filter(
          (i) => i.url ?? i.enlace,
        );
        if (!items.length) return null;
        return (
          <ul
            className={`my-6 grid gap-3 ${items.length > 1 ? "sm:grid-cols-2" : "sm:max-w-[440px]"}`}
          >
            {items.map((i) => {
              const { href, fuera } = resolver(i.url ?? i.enlace);
              const formato = i.formato ?? extension(href);
              return (
                <li key={i._key}>
                  <a
                    href={href}
                    className="flex h-full items-center gap-4 rounded-xl border border-linea bg-white px-4 py-3.5 transition-colors hover:border-cafe"
                    {...atributos(fuera)}
                  >
                    {formato && <IconoArchivo formato={formato} className="text-cafe" />}
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] leading-snug font-semibold text-cafe">
                        {i.etiqueta}
                      </span>
                      {i.descripcion && (
                        <span className="mt-1 block text-[13.5px] leading-snug font-light text-suave">
                          {i.descripcion}
                        </span>
                      )}
                      {/* El formato ya lo dice la hoja; la línea solo aparece
                          cuando además se sabe el peso, que es en los subidos. */}
                      {i.peso ? (
                        <span className="mt-1.5 block text-[11.5px] font-light text-suave">
                          {fichaDeArchivo(formato, i.peso)}
                        </span>
                      ) : null}
                    </span>
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-current text-cafe">
                      <Flecha baja={!!formato} />
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        );
      },

      /**
       * Una rejilla de tarjetas: imagen, título, texto y sus botones.
       *
       * En su sitio son columnas del constructor. Aquí van de a una en móvil,
       * de a dos en tableta y de a las que se pidan en pantalla ancha, y la
       * última fila queda centrada cuando no se llena, como la suya.
       *
       * Si alguna trae descargas o una portada, todas llevan marco, que es
       * como dibujan ellos los volúmenes; si son iconos con un enlace van
       * sueltas, como sus listas de públicos.
       */
      tarjetas: ({ value }) => {
        const v = value as { columnas?: number; items?: Tarjeta[] };
        const items = (v.items ?? []).filter((i) => i.titulo);
        if (!items.length) return null;
        const porFila = Math.min(Math.max(v.columnas ?? 3, 2), 4);
        const conMarco = items.some(
          (i) =>
            (i.ancho ?? 0) > 100 ||
            (i.botones ?? []).some((b) => b.formato ?? extension(b.url ?? b.enlace)),
        );
        const tope = conMarco ? 92 : 76;
        return (
          <ul className="my-8 flex flex-wrap justify-center gap-6">
            {items.map((i) => {
              const ancho = Math.min(i.ancho ?? tope, tope);
              const alto = i.ancho && i.alto ? Math.round((ancho * i.alto) / i.ancho) : ancho;
              const botones = (i.botones ?? []).filter((b) => b.url ?? b.enlace);
              return (
                <li
                  key={i._key}
                  className={`flex shrink-0 grow-0 basis-full flex-col items-center text-center ${ANCHO_TARJETA[porFila]} ${
                    conMarco ? "rounded-xl border border-linea bg-white px-4 py-6" : ""
                  }`}
                >
                  {!!i.imagen && (
                    <Image
                      src={urlImagen(i.imagen).width(ancho * 2).fit("max").auto("format").url()}
                      alt={i.alt ?? ""}
                      width={ancho}
                      height={alto}
                      className="h-auto"
                      style={{ width: ancho }}
                    />
                  )}
                  <h3 className="mt-3.5 text-[15.5px] leading-snug font-semibold text-balance text-cafe">
                    {i.titulo}
                  </h3>
                  {i.texto && (
                    <p className="mt-2 text-[13.5px] leading-snug font-light whitespace-pre-line text-suave">
                      {i.texto}
                    </p>
                  )}
                  {botones.length > 0 && (
                    <div className="mt-auto flex flex-col items-center gap-2 pt-4">
                      {botones.map((b) => {
                        const { href, fuera } = resolver(b.url ?? b.enlace);
                        const formato = b.formato ?? extension(href);
                        return formato ? (
                          <a
                            key={b._key}
                            href={href}
                            className="inline-flex items-center gap-2 rounded-full border border-linea bg-white py-1.5 pr-4 pl-3 text-[12.5px] font-semibold text-cafe transition-colors hover:border-cafe"
                            {...atributos(fuera)}
                          >
                            <span className="rounded border border-current px-1 py-px text-[9px] leading-none font-bold tracking-wide">
                              {formato.toUpperCase()}
                            </span>
                            {b.etiqueta}
                          </a>
                        ) : (
                          <a
                            key={b._key}
                            href={href}
                            className="text-[13.5px] leading-snug font-medium text-cafe underline decoration-1 underline-offset-2 transition-opacity hover:opacity-70"
                            {...atributos(fuera)}
                          >
                            {b.etiqueta}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        );
      },

      galeria: ({ value }) => {
        const fotos = (
          (value as { imagenes?: { _key: string; asset?: unknown; alt?: string; caption?: string }[] })
            .imagenes ?? []
        ).filter((f) => f.asset);
        if (!fotos.length) return null;
        return (
          <ul className={`my-8 grid grid-cols-2 gap-3 ${fotos.length > 2 ? "sm:grid-cols-3" : ""}`}>
            {fotos.map((f) => (
              <li key={f._key}>
                <figure>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gris">
                    <Image
                      src={urlImagen(f).width(720).height(540).fit("crop").auto("format").url()}
                      alt={f.alt ?? ""}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 280px"
                    />
                  </div>
                  {f.caption && (
                    <figcaption className="mt-1.5 text-[12.5px] font-light text-suave">
                      {f.caption}
                    </figcaption>
                  )}
                </figure>
              </li>
            ))}
          </ul>
        );
      },

      video: ({ value }) => {
        const v = value as { url?: string; caption?: string };
        const marco = reproductor(v.url);
        if (!marco && !v.url) return null;
        return (
          <figure className="my-8">
            {marco ? (
              <div className="relative aspect-video overflow-hidden rounded-lg bg-cafe">
                <iframe
                  src={marco}
                  title={v.caption ?? "Video"}
                  loading="lazy"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
            ) : (
              <a
                href={v.url}
                className="text-cafe underline decoration-1 underline-offset-2"
                {...atributos(true)}
              >
                Ver el video
              </a>
            )}
            {v.caption && (
              <figcaption className="mt-2 text-[13px] font-light text-suave">{v.caption}</figcaption>
            )}
          </figure>
        );
      },

      /** Una franja destacada con su botón. */
      llamada: ({ value }) => {
        const v = value as { titulo?: string; texto?: string; etiqueta?: string; enlace?: string };
        if (!v.titulo && !v.texto && !v.etiqueta) return null;
        const { href, fuera } = resolver(v.enlace);
        return (
          <aside className="my-8 rounded-xl bg-cafe px-6 py-9 text-center sm:px-10">
            {v.titulo && (
              <p className="text-[1.35rem] leading-snug font-semibold text-balance text-white">
                {v.titulo}
              </p>
            )}
            {v.texto && (
              <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed font-light text-white/85">
                {v.texto}
              </p>
            )}
            {v.etiqueta && v.enlace && (
              <a href={href} className="boton boton-claro mt-6" {...atributos(fuera)}>
                {v.etiqueta}
              </a>
            )}
          </aside>
        );
      },

      acordeon: ({ value }) => {
        const paneles = (
          (value as { items?: { _key: string; titulo?: string; contenido?: unknown[] }[] }).items ?? []
        ).filter((p) => p.titulo);
        if (!paneles.length) return null;
        return (
          <div className="my-6 space-y-2.5">
            {paneles.map((p) => (
              <details key={p._key} className="group rounded-xl border border-linea bg-white px-5 py-3.5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15.5px] leading-snug font-semibold text-cafe [&::-webkit-details-marker]:hidden">
                  {p.titulo}
                  <span
                    className="shrink-0 text-[20px] leading-none font-light transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <div className="mt-3 text-suave">
                  <Texto valor={p.contenido} enPropuesta={enPropuesta} />
                </div>
              </details>
            ))}
          </div>
        );
      },

      cita: ({ value }) => {
        const v = value as { texto?: string; autor?: string; cargo?: string };
        return (
          <blockquote className="my-6 border-l-2 border-cafe/30 pl-5">
            <p className="text-[17px] leading-relaxed font-light italic">{v.texto}</p>
            {v.autor && (
              <footer className="rotulo mt-2 text-suave">
                {v.autor}
                {v.cargo ? ` · ${v.cargo}` : ""}
              </footer>
            )}
          </blockquote>
        );
      },

      cifras: ({ value }) => {
        const cifras = (
          (value as { items?: { _key: string; valor?: string; etiqueta?: string }[] }).items ?? []
        ).filter((c) => c.valor);
        if (!cifras.length) return null;
        return (
          <dl className="my-8 flex flex-wrap justify-center gap-x-10 gap-y-8 text-center">
            {cifras.map((c) => (
              <div key={c._key} className="flex min-w-[7rem] flex-col-reverse">
                <dt className="mt-2 text-[13.5px] leading-snug font-light text-suave">{c.etiqueta}</dt>
                <dd className="text-[2.3rem] leading-none font-semibold text-cafe tabular-nums">
                  {c.valor}
                </dd>
              </div>
            ))}
          </dl>
        );
      },

      /**
       * Fichas de la biblioteca, traídas por su filtro o elegidas a mano. En
       * la propuesta cada una lleva a su ficha; en la réplica, al archivo.
       */
      listaDocumentos: ({ value }) => {
        const v = value as { titulo?: string; docs?: Documento[] | null };
        const docs = (v.docs ?? []).filter(Boolean);
        if (!docs.length) return null;
        return (
          <section className="my-8">
            {v.titulo && (
              <h3 className="text-[1.15rem] leading-snug font-semibold text-cafe">{v.titulo}</h3>
            )}
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {docs.map((d) => {
                const primero = (d.archivos ?? []).find((a) => a.url);
                const destino =
                  enPropuesta && d.slug ? `/propuesta/documentos/${d.slug}` : (primero?.url ?? null);
                if (!destino) return null;
                const { href, fuera } = resolver(destino);
                const datos = [
                  NOMBRE_TIPO[d.tipo ?? ""] ?? d.tipo,
                  d.anio,
                  (d.idiomas ?? []).map((l) => l.toUpperCase()).join(" "),
                ].filter(Boolean);
                return (
                  <li key={d._id}>
                    <a
                      href={href}
                      className="flex h-full items-center gap-4 rounded-xl border border-linea bg-white px-4 py-3.5 transition-colors hover:border-cafe"
                      {...atributos(fuera)}
                    >
                      <IconoArchivo
                        formato={primero?.formato ?? extension(primero?.url)}
                        className="text-cafe"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14.5px] leading-snug font-semibold text-cafe">
                          {nombre(d)}
                        </span>
                        <span className="mt-1 block text-[12px] font-light text-suave">
                          {datos.join(" · ")}
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      },

      cronologia: ({ value }) => {
        const hitos = (
          (value as {
            lista?: { _id: string; title?: string; date?: string; description?: string }[] | null;
          }).lista ?? []
        ).filter(Boolean);
        if (!hitos.length) return null;
        return (
          <ol className="my-8 border-l border-linea pl-6">
            {hitos.map((h) => (
              <li key={h._id} className="relative pb-6 last:pb-0">
                <span className="absolute top-[7px] -left-[28px] size-[9px] rounded-full bg-cafe" />
                <p className="text-[12.5px] font-semibold text-suave">
                  {mesYAno(h.date) ?? h.date?.slice(0, 7)}
                </p>
                <p className="mt-1 text-[15.5px] leading-snug font-medium">{h.title}</p>
                {h.description && (
                  <p className="mt-1.5 text-[14px] leading-relaxed font-light text-suave">
                    {h.description}
                  </p>
                )}
              </li>
            ))}
          </ol>
        );
      },

      /**
       * Algo de fuera: un mapa, un formulario, una encuesta. Va en su marco y
       * solo si es de un servicio conocido; si no, queda como enlace.
       */
      incrustado: ({ value }) => {
        const v = value as { url?: string; titulo?: string; alto?: number };
        if (!v.url) return null;
        if (!sePuedeIncrustar(v.url)) {
          return (
            <p className="my-6">
              <a
                href={v.url}
                className="text-cafe underline decoration-1 underline-offset-2"
                {...atributos(true)}
              >
                {v.titulo ?? "Abrir"} ↗
              </a>
            </p>
          );
        }
        return (
          <div className="my-8 overflow-hidden rounded-lg border border-linea">
            <iframe
              src={reproductor(v.url) ?? v.url}
              title={v.titulo ?? "Contenido incrustado"}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              className="block w-full border-0"
              style={{ height: Math.min(Math.max(v.alto ?? 480, 200), 1600) }}
            />
          </div>
        );
      },
    },
  };
}

export default function Texto({
  valor,
  tono = "prosa",
  enPropuesta = false,
}: {
  valor?: unknown[] | null;
  tono?: Tono;
  enPropuesta?: boolean;
}) {
  if (!valor?.length) return null;
  return (
    /* `overflow-wrap: anywhere` parte lo que no tiene por dónde partirse: una
       dirección web escrita tal cual, que en la página de Impacto sacaba el
       texto 25 píxeles fuera de la pantalla en un teléfono. */
    <div className="space-y-4 [overflow-wrap:anywhere]">
      <PortableText value={valor as never} components={piezas(tono, enPropuesta)} />
    </div>
  );
}
