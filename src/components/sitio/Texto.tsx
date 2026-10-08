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

const componentes: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-[15.5px] leading-relaxed font-light">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="pt-6 text-[1.5rem] leading-snug font-medium">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="pt-4 text-[1.2rem] leading-snug font-medium">{children}</h3>
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
      return (
        <a
          href={href}
          className="text-cafe underline decoration-1 underline-offset-2 transition-opacity hover:opacity-70"
          target={fuera ? "_blank" : undefined}
          rel={fuera ? "noopener noreferrer" : undefined}
        >
          {children}
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
    <div className="space-y-4">
      <PortableText value={valor as never} components={componentes} />
    </div>
  );
}
