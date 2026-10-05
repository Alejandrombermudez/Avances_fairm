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
    imagen: ({ value }) => {
      const v = value as { asset?: unknown; alt?: string; caption?: string };
      if (!v?.asset) return null;
      return (
        <figure className="my-6">
          <Image
            src={urlImagen(v).width(1400).fit("max").auto("format").url()}
            alt={v.alt ?? ""}
            width={1400}
            height={900}
            className="h-auto w-full rounded-lg"
            sizes="(max-width: 768px) 100vw, 760px"
          />
          {v.caption && (
            <figcaption className="mt-2 text-[13px] font-light text-suave">{v.caption}</figcaption>
          )}
        </figure>
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
