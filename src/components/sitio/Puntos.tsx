"use client";

/**
 * El paso de franja en franja de la portada, y los puntos del costado.
 *
 * Los puntos, uno por franja, dicen en qué sección se está —el punto lleno— y
 * llevan a cualquiera con un clic; al pasar por encima, el nombre de la
 * sección. Sin ellos, que la página encaje sola no se entiende: se siente
 * como si la rueda fallara.
 *
 * El paso. Primero lo hacía el navegador solo (`scroll-snap`, ver
 * globals.css), pero su velocidad no se puede elegir: era rápida y, girando la
 * rueda seguido, las franjas pasaban una tras otra y mareaba (lo dijo el
 * equipo el 18 de octubre de 2026). Ahora lo lleva esto:
 *
 *   - Cada paso dura alrededor de un segundo, con una curva que arranca y
 *     frena despacio. Los cortos —el último tramo de una franja alta— duran
 *     menos, para no sentirse pesados.
 *   - No se encadenan: mientras la página se mueve, y hasta que la rueda se
 *     suelta un momento, los giros no cuentan. Con un panel táctil, que sigue
 *     mandando giros por inercia, es lo que evita pasar tres franjas de golpe.
 *   - Una franja más alta que la pantalla se recorre libre; al acercarse a su
 *     borde, el paso la termina de mostrar y el siguiente pasa a la otra.
 *   - Avance de página, retroceso de página y la barra espaciadora hacen lo
 *     mismo que la rueda. Las flechas siguen moviendo poco a poco.
 *
 * Solo en pantalla ancha con ratón o panel táctil y sin «menos movimiento»
 * pedido al sistema; si no, la página se desplaza como siempre. Los puntos
 * solo se ven en pantalla ancha.
 */

import { useEffect, useRef, useState } from "react";

export type Seccion = { id: string; titulo: string };

const CUANDO =
  "(min-width: 980px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const BARRA = 76; // alto de la barra de arriba compactada: cada franja encaja debajo
const LIBRE = 160; // en una franja alta, hasta esta distancia de su borde la rueda va libre
const UMBRAL = 40; // lo que hay que girar para que cuente (un panel táctil manda giros mínimos)
const SILENCIO = 220; // pausa de la rueda que hace falta para aceptar otro paso
const REPOSO = 450; // y, después de llegar, al menos esto

/** Arranca y frena despacio. */
const suave = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

type Tramo = { inicio: number; fin: number };

/**
 * Dónde se para la página: arriba del todo, el comienzo de cada franja bajo
 * la barra, y el final. `fin` es donde termina de verse una franja más alta
 * que la pantalla; en las demás es igual a `inicio`.
 */
function tramos(): Tramo[] {
  const alto = window.innerHeight;
  const max = Math.max(0, document.documentElement.scrollHeight - alto);
  const lista: Tramo[] = [{ inicio: 0, fin: 0 }];
  document.querySelectorAll<HTMLElement>(".secciones > .seccion").forEach((s, i) => {
    const caja = s.getBoundingClientRect();
    const arriba = caja.top + window.scrollY;
    const abajo = arriba + caja.height;
    if (i === 0) {
      lista[0].fin = Math.max(0, Math.round(abajo - alto));
      return;
    }
    const inicio = Math.round(arriba - BARRA);
    lista.push({ inicio, fin: Math.max(inicio, Math.round(abajo - alto)) });
  });
  lista.push({ inicio: max, fin: max });
  return lista.map((t) => ({ inicio: Math.min(t.inicio, max), fin: Math.min(t.fin, max) }));
}

/** A dónde lleva un paso desde `y`. `null`: a ninguna parte; `libre`: que
 *  se desplace normal, porque se está dentro de una franja alta. */
function destino(y: number, abajo: boolean): { a: number | null; libre: boolean } {
  const ts = tramos();
  const k = ts.findIndex((t) => y >= t.inicio - 2 && y <= t.fin + 2);
  if (abajo) {
    if (k >= 0 && y < ts[k].fin - 2) {
      const falta = ts[k].fin - y;
      return falta > LIBRE ? { a: null, libre: true } : { a: ts[k].fin, libre: false };
    }
    const siguiente = ts.find((t) => t.inicio > y + 2);
    return { a: siguiente ? siguiente.inicio : null, libre: false };
  }
  if (k >= 0 && y > ts[k].inicio + 2) {
    const sobra = y - ts[k].inicio;
    return sobra > LIBRE ? { a: null, libre: true } : { a: ts[k].inicio, libre: false };
  }
  const anterior = [...ts].reverse().find((t) => t.fin < y - 2);
  return { a: anterior ? anterior.fin : null, libre: false };
}

export default function Puntos({ secciones }: { secciones: Seccion[] }) {
  const [actual, setActual] = useState(secciones[0]?.id ?? "");
  const estado = useRef({ moviendo: false, bloqueado: false, llegada: 0, ultimo: 0, giro: 0, marco: 0 });
  const enMarcha = useRef(false);

  /** Lleva la página a `a`, despacio. */
  function ir(a: number) {
    const s = estado.current;
    const desde = window.scrollY;
    const distancia = a - desde;
    if (Math.abs(distancia) < 2) return;
    cancelAnimationFrame(s.marco);
    const dura = Math.min(1100, Math.max(450, 1050 * Math.sqrt(Math.abs(distancia) / window.innerHeight)));
    const t0 = performance.now();
    s.moviendo = true;
    const paso = (t: number) => {
      const p = Math.min(1, (t - t0) / dura);
      window.scrollTo({ top: desde + distancia * suave(p), behavior: "instant" });
      if (p < 1) {
        s.marco = requestAnimationFrame(paso);
      } else {
        s.moviendo = false;
        s.llegada = performance.now();
      }
    };
    s.marco = requestAnimationFrame(paso);
  }

  useEffect(() => {
    /* La que cruza la mitad de la pantalla es la actual. */
    const vigia = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) setActual(e.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const s of secciones) {
      const el = document.getElementById(s.id);
      if (el) vigia.observe(el);
    }
    return () => vigia.disconnect();
  }, [secciones]);

  useEffect(() => {
    const raiz = document.documentElement;
    const condicion = window.matchMedia(CUANDO);
    const decidir = () => {
      enMarcha.current = condicion.matches;
      /* Con esto encendido, el encaje del navegador se apaga: los dos a la
         vez se pelean y la página tiembla. */
      raiz.classList.toggle("pasos", condicion.matches);
    };
    decidir();
    condicion.addEventListener("change", decidir);

    const rueda = (e: WheelEvent) => {
      if (!enMarcha.current || e.ctrlKey || e.shiftKey) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // de lado: los carruseles
      const s = estado.current;
      const ahora = performance.now();
      if (s.bloqueado) {
        if (!s.moviendo && ahora - s.llegada >= REPOSO && ahora - s.ultimo >= SILENCIO) {
          s.bloqueado = false;
        } else {
          s.ultimo = ahora;
          e.preventDefault();
          return;
        }
      }
      const d = destino(window.scrollY, e.deltaY > 0);
      if (d.libre) {
        s.giro = 0;
        return;
      }
      e.preventDefault();
      if (d.a === null) return;
      if (ahora - s.ultimo > 200) s.giro = 0;
      s.ultimo = ahora;
      s.giro += e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      if (Math.abs(s.giro) < UMBRAL) return;
      s.giro = 0;
      s.bloqueado = true;
      ir(d.a);
    };

    const teclas = (e: KeyboardEvent) => {
      if (!enMarcha.current || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const el = e.target as HTMLElement | null;
      if (el?.closest?.("input, textarea, select, [contenteditable]")) return;
      let abajo: boolean | null = null;
      if (e.key === "PageDown") abajo = true;
      else if (e.key === "PageUp") abajo = false;
      else if (e.key === " " && !el?.closest?.("button, a, summary")) abajo = !e.shiftKey;
      if (abajo === null) return;
      const d = destino(window.scrollY, abajo);
      if (d.libre || d.a === null) return;
      e.preventDefault();
      if (!estado.current.moviendo) ir(d.a);
    };

    window.addEventListener("wheel", rueda, { passive: false });
    window.addEventListener("keydown", teclas);
    return () => {
      condicion.removeEventListener("change", decidir);
      window.removeEventListener("wheel", rueda);
      window.removeEventListener("keydown", teclas);
      cancelAnimationFrame(estado.current.marco);
      raiz.classList.remove("pasos");
    };
  }, []);

  /* Un punto lleva al comienzo de su franja, con el mismo paso que la rueda. */
  function saltar(i: number) {
    const t = tramos()[i];
    if (!t) return;
    if (enMarcha.current) ir(t.inicio);
    else window.scrollTo({ top: t.inicio });
  }

  if (secciones.length < 2) return null;

  return (
    <nav
      aria-label="Secciones de la portada"
      className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 min-[980px]:block"
    >
      <ul className="flex flex-col gap-3.5">
        {secciones.map((s, i) => {
          const esta = s.id === actual;
          return (
            <li key={s.id} className="group relative flex justify-end">
              <button
                type="button"
                onClick={() => saltar(i)}
                aria-label={s.titulo}
                aria-current={esta ? "true" : undefined}
                className="flex size-5 items-center justify-center rounded-full"
              >
                <span
                  className={`block rounded-full border-2 border-cafe shadow-[0_0_0_2px_rgba(255,255,255,.85)] transition-all duration-500 ${
                    esta ? "size-3 bg-cafe" : "size-2 bg-white group-hover:bg-arena"
                  }`}
                />
              </button>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-7 -translate-y-1/2 translate-x-1 rounded-md bg-cafe px-2.5 py-1 text-[12px] font-medium whitespace-nowrap text-white opacity-0 transition-all duration-200 group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:translate-x-0 group-hover:opacity-100"
              >
                {s.titulo}
              </span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
