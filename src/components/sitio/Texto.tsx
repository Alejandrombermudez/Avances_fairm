/**
 * Dibuja los bloques de contenido que vienen de Sanity.
 *
 * Los doce bloques del modelo tienen aquí su correspondencia. Las imágenes se
 * sirven desde el CDN de Sanity, al que se subieron durante la migración
 * conservando su original.
 */

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlImagen } from "@/lib/sanity";
import { extension, fichaDeArchivo } from "@/lib/archivos";
import IconoArchivo from "@/components/sitio/IconoArchivo";

const componentes: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-[15.5px] leading-relaxed font-light">{children}</p>
    ),
    /* Poppins 600 en cafe, como los suyos. La raya de arriba separa las
       secciones: en una pagina larga de descargas es lo que deja ver donde
       acaba un grupo y empieza el siguiente. El primero no la lleva. */
    h2: ({ children }) => (
      <h2 className="mt-10 border-t border-linea pt-8 text-[1.45rem] leading-snug font-semibold text-balance text-cafe first:mt-0 first:border-0 first:pt-0">
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
    link: ({ children, value }) => {
      const href = (value as { href?: string })?.href ?? "#";
      const fuera = href.startsWith("http");
      const formato = extension(href);
      return (
        <a
          href={href}
          className="text-cafe underline decoration-1 underline-offset-2 transition-opacity hover:opacity-70"
          target={fuera ? "_blank" : undefined}
          rel={fuera ? "noopener noreferrer" : undefined}
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
  },
  types: {
    /**
     * La imagen, a su tamano.
     *
     * Antes todas salian al ancho de la columna: un icono de descarga de
     * 49x54 se dibujaba a 688 pixeles. Ahora `maxWidth` la frena en su ancho
     * real, asi que una foto grande llena la columna y un icono sigue siendo
     * un icono.
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
        <figure className="my-6" style={{ maxWidth: ancho }}>
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
    /**
     * Imagen a la izquierda, titulo y texto a la derecha.
     *
     * Asi estan listados los volumenes de la norma en su sitio: el icono
     * numerado al lado del texto, no encima. En movil se apila, que es lo que
     * hace el suyo tambien.
     */
    cajaImagen: ({ value }) => {
      const v = value as {
        imagen?: unknown;
        alt?: string;
        titulo?: string;
        texto?: string;
        enlace?: string;
      };
      const fuera = (v.enlace ?? "").startsWith("http");
      const titulo = v.enlace ? (
        <a
          href={v.enlace}
          target={fuera ? "_blank" : undefined}
          rel={fuera ? "noopener noreferrer" : undefined}
          className="transition-opacity hover:opacity-70"
        >
          {v.titulo}
        </a>
      ) : (
        v.titulo
      );
      return (
        <div className="my-6 flex flex-col gap-5 sm:flex-row sm:items-start">
          {!!v.imagen && (
            <div className="w-[104px] shrink-0">
              {v.enlace ? (
                <a
                  href={v.enlace}
                  target={fuera ? "_blank" : undefined}
                  rel={fuera ? "noopener noreferrer" : undefined}
                >
                  <Image
                    src={urlImagen(v.imagen).width(208).fit("max").auto("format").url()}
                    alt={v.alt ?? ""}
                    width={104}
                    height={104}
                    className="h-auto w-full"
                  />
                </a>
              ) : (
                <Image
                  src={urlImagen(v.imagen).width(208).fit("max").auto("format").url()}
                  alt={v.alt ?? ""}
                  width={104}
                  height={104}
                  className="h-auto w-full"
                />
              )}
            </div>
          )}
          <div className="min-w-0 flex-1">
            {v.titulo && (
              <h3 className="text-[17px] leading-snug font-semibold text-cafe">{titulo}</h3>
            )}
            {v.texto && (
              <p className="mt-2 text-[15px] leading-relaxed font-light text-suave">{v.texto}</p>
            )}
          </div>
        </div>
      );
    },

    /**
     * Botones y descargas.
     *
     * En su sitio cada uno es una columna del constructor, cuatro por fila.
     * Aqui es una lista que se reparte sola: una columna en movil y dos desde
     * tableta, que es lo que cabe sin que la leyenda se parta en cinco
     * lineas. El que baja un archivo lleva su hoja con el formato; el que
     * lleva a otra pagina, una flecha.
     */
    botones: ({ value }) => {
      type Boton = {
        _key: string;
        etiqueta?: string;
        descripcion?: string;
        enlace?: string;
        url?: string | null;
        formato?: string | null;
        peso?: number | null;
      };
      const items = ((value as { items?: Boton[] }).items ?? []).filter((i) => i.url ?? i.enlace);
      if (!items.length) return null;
      return (
        <ul
          className={`my-6 grid gap-3 ${items.length > 1 ? "sm:grid-cols-2" : "sm:max-w-[440px]"}`}
        >
          {items.map((i) => {
            const url = (i.url ?? i.enlace) as string;
            const formato = i.formato ?? extension(url);
            const fuera = url.startsWith("http");
            const ficha = fichaDeArchivo(formato, i.peso);
            return (
              <li key={i._key}>
                <a
                  href={url}
                  target={fuera ? "_blank" : undefined}
                  rel={fuera ? "noopener noreferrer" : undefined}
                  className="flex h-full items-center gap-4 rounded-xl border border-linea bg-white px-4 py-3.5 transition-colors hover:border-cafe"
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
                    {/* El formato ya lo dice la hoja; la linea solo aparece
                        cuando ademas se sabe el peso, que es en los subidos. */}
                    {i.peso ? (
                      <span className="mt-1.5 block text-[11.5px] font-light text-suave">{ficha}</span>
                    ) : null}
                  </span>
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-current text-cafe">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                      {formato ? (
                        <path
                          d="M6.5 2v7m0 0L4 6.5M6.5 9 9 6.5M2.5 11h8"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      ) : (
                        <path
                          d="M2.5 6.5h8M7.5 3.5l3 3-3 3"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}
                    </svg>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
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
  },
};

export default function Texto({ valor }: { valor?: unknown[] | null }) {
  if (!valor?.length) return null;
  return (
    /* `overflow-wrap: anywhere` parte lo que no tiene por donde partirse: una
       direccion web escrita tal cual, que en la pagina de Impacto sacaba el
       texto 25 pixeles fuera de la pantalla en un telefono. */
    <div className="space-y-4 [overflow-wrap:anywhere]">
      <PortableText value={valor as never} components={componentes} />
    </div>
  );
}
