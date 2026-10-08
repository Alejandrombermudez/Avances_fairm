/**
 * La pantalla comparada.
 *
 * A la izquierda lo que hay hoy, a la derecha la propuesta, lado a lado y
 * sincronizados: al elegir qué mirar, las dos mitades van al equivalente.
 *
 * La mitad izquierda puede mostrar craftmines.org en vivo o la réplica. Que se
 * pueda alternar no es un adorno: es la forma de comprobar que la réplica es
 * fiel, sin tener que creérselo.
 */

"use client";

import Link from "next/link";
import { useState } from "react";

type Comparacion = {
  clave: string;
  nombre: string;
  vivo: string;
  replica: string | null;
  propuesta: string;
  nota: string;
};

const COMPARACIONES: Comparacion[] = [
  {
    clave: "portada",
    nombre: "Portada",
    vivo: "https://www.craftmines.org/",
    replica: "/sitio",
    propuesta: "/sitio/propuesta",
    nota:
      "Las mismas cinco secciones, en el mismo orden. A la derecha, «Descarga el CRAFT» " +
      "muestra la versión vigente con sus volúmenes en vez de dos botones escritos a mano.",
  },
  {
    clave: "recursos",
    nombre: "Recursos",
    vivo: "https://www.craftmines.org/recursos/",
    replica: "/sitio/recursos",
    propuesta: "/sitio/propuesta/recursos",
    nota:
      "Es el cambio más grande. Hoy esta página ofrece diez documentos y ninguno es un " +
      "volumen del código. A la derecha están los 74, por versión y por tipo.",
  },
  {
    clave: "preguntas",
    nombre: "Preguntas frecuentes",
    vivo: "https://www.craftmines.org/preguntas-frecuentes/",
    replica: "/sitio/preguntas-frecuentes",
    propuesta: "/sitio/propuesta/preguntas",
    nota:
      "Las mismas 30 preguntas. Hoy viven dentro de una página de 66.594 caracteres; " +
      "a la derecha cada una es una ficha que se puede buscar y enlazar sola.",
  },
  {
    clave: "documento",
    nombre: "Un documento",
    vivo:
      "https://www.craftmines.org/wp-content/uploads/2024/10/CRAFT-2.1-Vol.2A-Final-clean.pdf",
    replica: null,
    propuesta: "/sitio/propuesta/documentos/craft-2-1-volumen-2a",
    nota:
      "A la izquierda, lo que hay hoy: el archivo. Su título, su versión, su volumen y su " +
      "idioma viven dentro del nombre. A la derecha, los mismos datos en su casilla.",
  },
];

/**
 * Para la comparación de un documento, la mitad izquierda no enmarca el PDF.
 *
 * No es por comodidad: enmarcarlo depende de cómo tenga configurado el
 * navegador cada quien, y un marco en blanco no dice nada. Lo que hay que
 * enseñar no es el PDF — es que el sistema no sabe nada de él salvo su nombre.
 */
function ElArchivo({ url }: { url: string }) {
  const nombre = decodeURIComponent(url.split("/").pop() ?? "");
  const partes: [string, string][] = [
    ["Título", "no existe como dato"],
    ["Versión de la norma", "no existe como dato"],
    ["Volumen", "no existe como dato"],
    ["Idioma", "no existe como dato"],
    ["Año", "no existe como dato"],
  ];
  return (
    <div className="min-h-0 flex-1 overflow-auto bg-white p-8 text-[#1a0d07]">
      <p className="text-[11.5px] font-extrabold tracking-wider text-[#774340] uppercase">
        Lo que el sistema guarda hoy
      </p>

      <div className="mt-5 rounded-lg border border-[#e7dbcb] bg-[#f6f1ea] p-5">
        <p className="font-mono text-[13px] leading-relaxed break-all">{nombre}</p>
      </div>

      <p className="mt-5 max-w-md text-[14px] leading-relaxed text-[#6b5a4d]">
        Eso es todo. El título, la versión, el volumen y el idioma están dentro del nombre del
        archivo, donde ningún programa puede leerlos.
      </p>

      <dl className="mt-8 max-w-md">
        {partes.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 border-t border-[#e7dbcb] py-3">
            <dt className="text-[13.5px] font-bold">{k}</dt>
            <dd className="text-[13.5px] text-[#b0a192] italic">{v}</dd>
          </div>
        ))}
      </dl>

      <a href={url} target="_blank" rel="noopener noreferrer"
        className="mt-8 inline-block text-[13.5px] font-bold text-[#774340] underline underline-offset-2">
        Abrir el archivo ↗
      </a>
    </div>
  );
}

export default function Comparar() {
  const [sel, setSel] = useState(COMPARACIONES[0]);
  const [izquierda, setIzquierda] = useState<"vivo" | "replica">("vivo");

  const usaReplica = izquierda === "replica" && sel.replica;
  const urlIzq = usaReplica ? (sel.replica as string) : sel.vivo;

  return (
    <div className="flex h-screen flex-col bg-[#1a0d07] text-white">
      {/* ── Mando ── */}
      <header className="shrink-0 px-5 pt-4 pb-3">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link href="/craft" className="text-[12.5px] font-bold text-white/60 hover:text-white">
            ← Volver al informe
          </Link>

          <div className="flex flex-wrap gap-1 rounded-full bg-white/10 p-1">
            {COMPARACIONES.map((c) => (
              <button
                key={c.clave}
                type="button"
                onClick={() => setSel(c)}
                className={`rounded-full px-4 py-1.5 text-[13px] font-bold transition-colors ${
                  sel.clave === c.clave ? "bg-white text-[#1a0d07]" : "text-white/70 hover:text-white"
                }`}
              >
                {c.nombre}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-[11.5px] font-bold tracking-wider text-white/40 uppercase">
              Izquierda
            </span>
            <div className="flex gap-1 rounded-full bg-white/10 p-1">
              <button
                type="button"
                onClick={() => setIzquierda("vivo")}
                className={`rounded-full px-3.5 py-1 text-[12.5px] font-bold transition-colors ${
                  izquierda === "vivo" ? "bg-white text-[#1a0d07]" : "text-white/70"
                }`}
              >
                Sitio real
              </button>
              <button
                type="button"
                onClick={() => sel.replica && setIzquierda("replica")}
                disabled={!sel.replica}
                className={`rounded-full px-3.5 py-1 text-[12.5px] font-bold transition-colors ${
                  usaReplica ? "bg-white text-[#1a0d07]" : "text-white/70"
                } ${sel.replica ? "" : "cursor-not-allowed opacity-30"}`}
                title={sel.replica ? undefined : "Esta comparación no tiene réplica: hoy es un archivo"}
              >
                Réplica
              </button>
            </div>
          </div>
        </div>

        <p className="mt-3 max-w-4xl text-[13px] leading-relaxed text-white/60">{sel.nota}</p>
      </header>

      {/* ── Las dos mitades ── */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-px bg-white/10 lg:grid-cols-2">
        <section className="flex min-h-0 flex-col bg-white">
          <div className="flex shrink-0 items-center gap-3 bg-[#2b1309] px-4 py-2">
            <span className="text-[11.5px] font-extrabold tracking-wider text-white uppercase">
              Como está hoy
            </span>
            <span className="truncate text-[11.5px] text-white/45">
              {usaReplica ? "réplica · lee de Sanity" : "craftmines.org en vivo"}
            </span>
          </div>
          {sel.clave === "documento" ? (
            <ElArchivo url={sel.vivo} />
          ) : (
            <iframe
              key={`izq-${sel.clave}-${izquierda}`}
              src={urlIzq}
              title={`${sel.nombre}, como está hoy`}
              className="min-h-0 flex-1 border-0 bg-white"
            />
          )}
        </section>

        <section className="flex min-h-0 flex-col bg-white">
          <div className="flex shrink-0 items-center gap-3 bg-[#4b1a0c] px-4 py-2">
            <span className="text-[11.5px] font-extrabold tracking-wider text-[#fed086] uppercase">
              Propuesta
            </span>
            <span className="truncate text-[11.5px] text-white/45">
              el mismo contenido, del mismo gestor
            </span>
          </div>
          <iframe
            key={`der-${sel.clave}`}
            src={sel.propuesta}
            title={`${sel.nombre}, propuesta`}
            className="min-h-0 flex-1 border-0 bg-white"
          />
        </section>
      </div>
    </div>
  );
}
