/**
 * La pantalla comparada.
 *
 * A la izquierda lo que hay hoy, a la derecha la propuesta, lado a lado y en
 * la misma página. Se navega en cualquiera de las dos mitades —su menú, sus
 * botones— y la otra la sigue; los atajos de arriba llevan a las cuatro
 * comparaciones que más enseñan.
 *
 * La mitad izquierda puede mostrar craftmines.org en vivo o la réplica. Que se
 * pueda alternar no es un adorno: es la forma de comprobar que la réplica es
 * fiel, sin tener que creérselo.
 */

"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Conmutador from "@/components/sitio/Conmutador";
import {
  enActual,
  enComparar,
  enPropuesta,
  enVivo,
  paginaDe,
  tieneReplica,
  tieneVivo,
} from "@/lib/vistas";

type Fuente = "vivo" | "replica";
type Lado = "izq" | "der";
type Marco = { src: string; n: number };

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

/** Cada cuánto se mira si alguna mitad cambió de página. */
const PULSO = 400;

/** Cuánto se espera a que una mitad llegue a donde se la mandó. */
const PACIENCIA = 10_000;

type Yendo = { a: string; hasta: number } | null;

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

const PILDORA = "rounded-full px-3.5 py-1 text-[12.5px] font-bold whitespace-nowrap transition-colors";
const SOLA = "ml-auto shrink-0 text-[11.5px] font-bold whitespace-nowrap text-white/70 underline-offset-2 hover:text-white hover:underline";

export default function Comparador({
  inicial,
  viejas,
}: {
  inicial: string;
  viejas: Record<string, string>;
}) {
  const [pagina, setPagina] = useState(inicial);
  const [fuente, setFuente] = useState<Fuente>("vivo");

  const aLaIzquierda = useCallback(
    (p: string, f: Fuente) => (f === "vivo" ? enVivo(p, viejas) : enActual(p)),
    [viejas],
  );

  /* Cada mitad lleva su dirección y un contador. Subir el contador la vuelve
     a cargar; no tocarlo la deja donde esté, aunque dentro se haya navegado. */
  const [izq, setIzq] = useState<Marco>(() => ({ src: aLaIzquierda(inicial, "vivo"), n: 0 }));
  const [der, setDer] = useState<Marco>(() => ({ src: enPropuesta(inicial), n: 0 }));
  const marcoIzq = useRef<HTMLIFrameElement>(null);
  const marcoDer = useRef<HTMLIFrameElement>(null);

  /* Lo último que se sabe de cada mitad, fuera del dibujo: lo lee el pulso.
     `yendo` dice a dónde se acaba de mandar a una mitad que aún no ha llegado. */
  const sabido = useRef({
    pagina: inicial,
    fuente: "vivo" as Fuente,
    izq: izq.src,
    der: der.src,
    yendo: { izq: null as Yendo, der: null as Yendo },
  });

  /**
   * Pone las dos mitades en una página.
   *
   * `origen` es la mitad donde ya se navegó: esa no se toca. La otra solo se
   * recarga si de verdad cambia de dirección — un documento y Recursos son la
   * misma página en el sitio de hoy, y no hay por qué hacerla parpadear.
   */
  const poner = useCallback(
    (p: string, f: Fuente, origen?: Lado) => {
      const s = sabido.current;
      s.pagina = p;
      s.fuente = f;
      setPagina(p);
      setFuente(f);

      const hasta = Date.now() + PACIENCIA;
      const nuevaIzq = aLaIzquierda(p, f);
      const nuevaDer = enPropuesta(p);
      if (origen !== "izq" && s.izq !== nuevaIzq) {
        s.izq = nuevaIzq;
        s.yendo.izq = { a: nuevaIzq, hasta };
        setIzq((m) => ({ src: nuevaIzq, n: m.n + 1 }));
      }
      if (origen !== "der" && s.der !== nuevaDer) {
        s.der = nuevaDer;
        s.yendo.der = { a: nuevaDer, hasta };
        setDer((m) => ({ src: nuevaDer, n: m.n + 1 }));
      }
      // La dirección de arriba dice dónde se está: recargar no devuelve a la portada.
      window.history.replaceState(null, "", enComparar(p));
    },
    [aLaIzquierda],
  );

  /**
   * El pulso: mira dónde está cada mitad y, si alguien navegó dentro de una,
   * lleva la otra a la misma página.
   *
   * Se pregunta en vez de esperar un aviso de carga porque los menús del
   * sitio cambian de página sin recargar, y ese aviso no llega. El sitio real
   * es de otro dominio y el navegador no deja leer su dirección: esa mitad
   * sigue a la otra, pero no al revés.
   *
   * A la mitad que se acaba de mandar a otra página no se le hace caso hasta
   * que llega: mientras carga sigue diciendo la dirección anterior, y tomarla
   * por una navegación devolvía a la otra mitad a donde estaba.
   */
  useEffect(() => {
    const pulso = window.setInterval(() => {
      const marcos: [Lado, HTMLIFrameElement | null][] = [
        ["der", marcoDer.current],
        ["izq", marcoIzq.current],
      ];
      for (const [lado, marco] of marcos) {
        let camino: string;
        try {
          camino = marco?.contentWindow?.location.pathname ?? "";
        } catch {
          continue; // otro dominio
        }
        const s = sabido.current;
        if (!camino) continue;
        const yendo = s.yendo[lado];
        if (yendo) {
          if (camino !== yendo.a && Date.now() < yendo.hasta) continue;
          s.yendo[lado] = null;
          s[lado] = camino;
          continue;
        }
        if (camino === s[lado]) continue;
        const p = paginaDe(camino);
        if (p === null) continue; // todavía en blanco, o fuera del sitio
        s[lado] = camino;
        if (p !== s.pagina) poner(p, s.fuente, lado);
      }
    }, PULSO);
    return () => window.clearInterval(pulso);
  }, [poner]);

  const atajo = ATAJOS.find((a) => a.pagina === pagina);
  const esArchivo = pagina === DOCUMENTO.pagina;
  const sinPropia = fuente === "vivo" ? !tieneVivo(pagina, viejas) : !tieneReplica(pagina);

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
                  onClick={() => poner(a.pagina, fuente)}
                  aria-pressed={a.pagina === pagina}
                  className={`${PILDORA} ${
                    a.pagina === pagina
                      ? "bg-white/20 text-white"
                      : "text-white/65 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {a.nombre}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-[11.5px] font-bold tracking-wider text-white/40 uppercase">
                A la izquierda
              </span>
              <div className="flex gap-1 rounded-full bg-white/10 p-1">
                {(
                  [
                    ["vivo", "Sitio real"],
                    ["replica", "Réplica"],
                  ] as const
                ).map(([clave, nombre]) => (
                  <button
                    key={clave}
                    type="button"
                    onClick={() => poner(pagina, clave)}
                    disabled={esArchivo}
                    aria-pressed={fuente === clave}
                    title={esArchivo ? "Hoy esto no es una página: es un archivo" : undefined}
                    className={`${PILDORA} ${
                      fuente === clave ? "bg-white text-[#1a0d07]" : "text-white/70 hover:text-white"
                    } ${esArchivo ? "cursor-not-allowed opacity-30" : ""}`}
                  >
                    {nombre}
                  </button>
                ))}
              </div>
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
              Como está hoy
            </span>
            <span className="truncate text-[11.5px] text-white/45">
              {esArchivo
                ? "hoy no es una página: es un archivo"
                : (fuente === "vivo" ? "craftmines.org en vivo" : "réplica · lee de Sanity") +
                  (sinPropia ? " · hoy no tiene página propia: aquí es donde se encuentra" : "")}
            </span>
            {fuente === "vivo" ? (
              !esArchivo && (
                <a href={enVivo(pagina, viejas)} target="_blank" rel="noopener noreferrer" className={SOLA}>
                  Abrir aparte ↗
                </a>
              )
            ) : (
              <Link href={enActual(pagina)} className={SOLA}>
                Ver solo esta →
              </Link>
            )}
          </div>
          {esArchivo && <ElArchivo url={DOCUMENTO.archivo} />}
          {/* Con el archivo delante el marco se esconde, no se quita: así sigue
              donde se le dejó y al volver no hay que adivinar dónde estaba. */}
          <iframe
            key={`izq-${izq.n}`}
            ref={marcoIzq}
            src={izq.src}
            title="Como está hoy"
            className={esArchivo ? "hidden" : "min-h-0 flex-1 border-0 bg-white"}
          />
        </section>

        <section className="flex min-h-0 flex-col bg-white">
          <div className="flex shrink-0 items-center gap-3 bg-[#4b1a0c] px-4 py-2">
            <span className="shrink-0 text-[11.5px] font-extrabold tracking-wider text-[#fed086] uppercase">
              Propuesta
            </span>
            <span className="truncate text-[11.5px] text-white/45">
              el mismo contenido, del mismo gestor
            </span>
            <Link href={enPropuesta(pagina)} className={SOLA}>
              Ver solo la propuesta →
            </Link>
          </div>
          <iframe
            key={`der-${der.n}`}
            ref={marcoDer}
            src={der.src}
            title="Propuesta"
            className="min-h-0 flex-1 border-0 bg-white"
          />
        </section>
      </div>
    </div>
  );
}
