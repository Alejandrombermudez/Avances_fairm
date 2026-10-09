/**
 * La pantalla comparada.
 *
 * A la izquierda el sitio real, craftmines.org tal como está en línea; a la
 * derecha la propuesta. Lado a lado y en la misma página: se navega en la
 * propuesta —su menú, sus botones— y el sitio real la sigue. Los atajos de
 * arriba llevan a las cuatro comparaciones que más enseñan.
 *
 * Al revés no se puede: el sitio real es de otro dominio y el navegador no
 * deja saber en qué página está.
 */

"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Conmutador from "@/components/sitio/Conmutador";
import { enComparar, enPropuesta, enVivo, paginaDe, tieneVivo } from "@/lib/vistas";

/** Las comparaciones que más enseñan, con lo que hay que mirar en cada una. */
const ATAJOS: { pagina: string; nombre: string; nota: string }[] = [
  {
    pagina: "/",
    nombre: "Portada",
    nota:
      "Las mismas cinco secciones, en el mismo orden. A la derecha, «Descarga el CRAFT» " +
      "muestra la versión vigente con sus volúmenes en vez de dos botones escritos a mano.",
  },
  {
    pagina: "/recursos",
    nombre: "Recursos",
    nota:
      "Es el cambio más grande. Hoy esta página ofrece diez documentos y ninguno es un " +
      "volumen del código. A la derecha está la biblioteca entera, por versión y por tipo.",
  },
  {
    pagina: "/preguntas-frecuentes",
    nombre: "Preguntas frecuentes",
    nota:
      "Las mismas preguntas. Hoy viven dentro de una sola página de 66.594 caracteres; " +
      "a la derecha cada una es una ficha que se puede buscar y enlazar sola.",
  },
  {
    pagina: "/documentos/craft-2-1-volumen-2a",
    nombre: "Un documento",
    nota:
      "A la izquierda, lo que hay hoy: el archivo. Su título, su versión, su volumen y su " +
      "idioma viven dentro del nombre. A la derecha, los mismos datos en su casilla.",
  },
];

/** El documento del atajo: a la izquierda se enseña su archivo, no una página. */
const DOCUMENTO = {
  pagina: "/documentos/craft-2-1-volumen-2a",
  archivo: "https://www.craftmines.org/wp-content/uploads/2024/10/CRAFT-2.1-Vol.2A-Final-clean.pdf",
};

/** Cada cuánto se mira si la propuesta cambió de página. */
const PULSO = 400;

/** Cuánto se espera a que la propuesta llegue a donde se la mandó. */
const PACIENCIA = 10_000;

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

const SOLA = "ml-auto shrink-0 text-[11.5px] font-bold whitespace-nowrap text-white/70 underline-offset-2 hover:text-white hover:underline";

export default function Comparador({
  inicial,
  viejas,
}: {
  inicial: string;
  viejas: Record<string, string>;
}) {
  const [pagina, setPagina] = useState(inicial);

  /* La propuesta lleva su dirección y un contador. Subir el contador la vuelve
     a cargar; no tocarlo la deja donde esté, aunque dentro se haya navegado. */
  const [propuesta, setPropuesta] = useState(() => ({ src: enPropuesta(inicial), n: 0 }));
  const marco = useRef<HTMLIFrameElement>(null);

  /* Lo último que se sabe de la propuesta, fuera del dibujo: lo lee el pulso.
     `yendo` dice a dónde se la acaba de mandar, si aún no ha llegado. */
  const sabido = useRef({
    pagina: inicial,
    donde: propuesta.src,
    yendo: null as { a: string; hasta: number } | null,
  });

  /**
   * Pone las dos mitades en una página.
   *
   * Si el cambio viene de haber navegado dentro de la propuesta, ella ya está
   * donde tiene que estar y no se toca: solo la sigue el sitio real.
   */
  const poner = useCallback((p: string, desdeDentro = false) => {
    const s = sabido.current;
    s.pagina = p;
    setPagina(p);

    const nueva = enPropuesta(p);
    if (!desdeDentro && s.donde !== nueva) {
      s.donde = nueva;
      s.yendo = { a: nueva, hasta: Date.now() + PACIENCIA };
      setPropuesta((m) => ({ src: nueva, n: m.n + 1 }));
    }
    // La dirección de arriba dice dónde se está: recargar no devuelve a la portada.
    window.history.replaceState(null, "", enComparar(p));
  }, []);

  /**
   * El pulso: mira en qué página está la propuesta y, si se navegó dentro de
   * ella, lleva el sitio real a la misma.
   *
   * Se pregunta en vez de esperar un aviso de carga porque el menú de la
   * propuesta cambia de página sin recargar, y ese aviso no llega.
   *
   * Recién mandada a otra página no se le hace caso hasta que llega: mientras
   * carga sigue diciendo la dirección anterior, y tomarla por una navegación
   * la devolvía a donde estaba.
   */
  useEffect(() => {
    const pulso = window.setInterval(() => {
      let camino: string;
      try {
        camino = marco.current?.contentWindow?.location.pathname ?? "";
      } catch {
        return; // salió del sitio
      }
      const s = sabido.current;
      if (!camino) return;
      if (s.yendo) {
        if (camino !== s.yendo.a && Date.now() < s.yendo.hasta) return;
        s.yendo = null;
        s.donde = camino;
        return;
      }
      if (camino === s.donde) return;
      const p = paginaDe(camino);
      if (p === null) return; // todavía en blanco, o fuera de la propuesta
      s.donde = camino;
      if (p !== s.pagina) poner(p, true);
    }, PULSO);
    return () => window.clearInterval(pulso);
  }, [poner]);

  const atajo = ATAJOS.find((a) => a.pagina === pagina);
  const esArchivo = pagina === DOCUMENTO.pagina;
  const real = enVivo(pagina, viejas);

  return (
    <div className="flex h-screen flex-col bg-[#1a0d07] text-white">
      <Conmutador activa="comparar" pagina={pagina} />

      {/* ── Mando ── */}
      <header className="shrink-0 px-4 pt-1 pb-3 sm:px-6">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
            <Link href="/craft" className="text-[12.5px] font-bold text-white/55 hover:text-white">
              ← Informe
            </Link>

            <div className="flex flex-wrap items-center gap-1">
              <span className="mr-1 text-[11.5px] font-bold tracking-wider text-white/40 uppercase">
                Ir a
              </span>
              {ATAJOS.map((a) => (
                <button
                  key={a.pagina}
                  type="button"
                  onClick={() => poner(a.pagina)}
                  aria-pressed={a.pagina === pagina}
                  className={`rounded-full px-3.5 py-1 text-[12.5px] font-bold whitespace-nowrap transition-colors ${
                    a.pagina === pagina
                      ? "bg-white/20 text-white"
                      : "text-white/65 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {a.nombre}
                </button>
              ))}
            </div>
          </div>

          {atajo && (
            <p className="mt-2.5 max-w-4xl text-[13px] leading-relaxed text-white/60">{atajo.nota}</p>
          )}
        </div>
      </header>

      {/* ── Las dos mitades ── */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-px bg-white/10 lg:grid-cols-2">
        <section className="flex min-h-0 flex-col bg-white">
          <div className="flex shrink-0 items-center gap-3 bg-[#2b1309] px-4 py-2">
            <span className="shrink-0 text-[11.5px] font-extrabold tracking-wider text-white uppercase">
              El sitio real
            </span>
            <span className="truncate text-[11.5px] text-white/45">
              {esArchivo
                ? "hoy esto no es una página: es un archivo"
                : tieneVivo(pagina, viejas)
                  ? "craftmines.org, como está hoy en línea"
                  : "craftmines.org · hoy esto no tiene página propia: aquí es donde se encuentra"}
            </span>
            {!esArchivo && (
              <a href={real} target="_blank" rel="noopener noreferrer" className={SOLA}>
                Abrir aparte ↗
              </a>
            )}
          </div>
          {esArchivo ? (
            <ElArchivo url={DOCUMENTO.archivo} />
          ) : (
            /* La dirección hace de llave: solo se recarga si cambia. Un
               documento y Recursos son la misma página en el sitio real. */
            <iframe
              key={real}
              src={real}
              title="El sitio real"
              className="min-h-0 flex-1 border-0 bg-white"
            />
          )}
        </section>

        <section className="flex min-h-0 flex-col bg-white">
          <div className="flex shrink-0 items-center gap-3 bg-[#4b1a0c] px-4 py-2">
            <span className="shrink-0 text-[11.5px] font-extrabold tracking-wider text-[#fed086] uppercase">
              Propuesta
            </span>
            <span className="truncate text-[11.5px] text-white/45">
              el mismo contenido, desde el gestor nuevo
            </span>
            <Link href={enPropuesta(pagina)} className={SOLA}>
              Ver solo la propuesta →
            </Link>
          </div>
          <iframe
            key={`propuesta-${propuesta.n}`}
            ref={marco}
            src={propuesta.src}
            title="Propuesta"
            className="min-h-0 flex-1 border-0 bg-white"
          />
        </section>
      </div>
    </div>
  );
}
