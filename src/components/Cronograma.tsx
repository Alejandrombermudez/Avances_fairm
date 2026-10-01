"use client";

import { useMemo, useState } from "react";
import { fases, type Estado } from "@/data/progreso";

const ETIQUETA: Record<Estado, string> = {
  hecho: "Completado",
  curso: "En curso",
  espera: "En espera",
  pendiente: "Pendiente",
};

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const dia = (iso: string) => {
  const [a, m, d] = iso.split("-").map(Number);
  return Date.UTC(a, m - 1, d);
};

const corto = (iso: string) => {
  const [, m, d] = iso.split("-").map(Number);
  return `${d} ${MESES[m - 1].slice(0, 3)}`;
};

/* ── Geometría del anillo ─────────────────────────────────────── */
const R = 104;
const GROSOR = 20;
const C = 2 * Math.PI * R;
const HUECO = 5; // grados de separación entre fases
const PASO = 360 / fases.length;
const BARRIDO = PASO - HUECO;

/** Longitud del trazo visible. Va en `style` para poder animarla. */
function trazo(indice: number, fraccion: number) {
  const largo = (C * BARRIDO) / 360;
  return `${largo * fraccion} ${C}`;
}

/** Rotacion de la fase. Va como ATRIBUTO de SVG, no como estilo:
 *  `rotate(a cx cy)` es sintaxis SVG y CSS no la entiende. */
function giro(indice: number) {
  return `rotate(${-90 + indice * PASO + HUECO / 2} 140 140)`;
}

export default function Cronograma() {
  const enCurso = fases.findIndex((f) => f.estado === "curso");
  const [sel, setSel] = useState(enCurso >= 0 ? enCurso : 0);

  const avances = useMemo(
    () =>
      fases.map((f) => {
        const hechas = f.tareas.filter((t) => t.estado === "hecho").length;
        return f.tareas.length ? hechas / f.tareas.length : 0;
      }),
    [],
  );

  const total = fases.reduce((n, f) => n + f.tareas.length, 0);
  const hechas = fases.reduce(
    (n, f) => n + f.tareas.filter((t) => t.estado === "hecho").length,
    0,
  );
  const pct = Math.round((hechas / total) * 100);
  const f = fases[sel];

  /* ── Escala del calendario ── */
  const t0 = Math.min(...fases.map((x) => dia(x.inicio)));
  const t1 = Math.max(...fases.map((x) => dia(x.fin)));
  const span = t1 - t0;
  const pos = (iso: string) => ((dia(iso) - t0) / span) * 100;

  const hoy = Date.now();
  const hoyPct = Math.min(100, Math.max(0, ((hoy - t0) / span) * 100));

  const meses = useMemo(() => {
    const out: { nombre: string; left: number; ancho: number }[] = [];
    const d = new Date(t0);
    let cur = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1);
    while (cur <= t1) {
      const sig = new Date(cur);
      sig.setUTCMonth(sig.getUTCMonth() + 1);
      const ini = Math.max(cur, t0);
      const fin = Math.min(sig.getTime(), t1);
      out.push({
        nombre: MESES[new Date(cur).getUTCMonth()],
        left: ((ini - t0) / span) * 100,
        ancho: ((fin - ini) / span) * 100,
      });
      cur = sig.getTime();
    }
    return out;
  }, [t0, t1, span]);

  return (
    <section className="border-b border-linea py-14">
      <p className="rotulo text-taupe">Cronograma</p>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed font-light text-tinta-2">
        Toca una fase para ver en qué consiste.
      </p>

      {/* ── Anillo + ficha ── */}
      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[280px_1fr]">
        <div className="mx-auto lg:mx-0">
          <svg
            viewBox="0 0 280 280"
            className="h-[280px] w-[280px] overflow-visible"
            role="group"
            aria-label="Fases del proyecto"
          >
            {fases.map((fase, i) => (
              <g key={fase.n}>
                {/* pista */}
                <circle
                  cx="140"
                  cy="140"
                  r={R}
                  fill="none"
                  stroke={fase.color}
                  strokeOpacity={i === sel ? 0.3 : 0.14}
                  strokeWidth={i === sel ? GROSOR + 5 : GROSOR}
                  strokeLinecap="round"
                  transform={giro(i)}
                  style={{
                    strokeDasharray: trazo(i, 1),
                    transition: "stroke-width .45s cubic-bezier(.4,0,.2,1), stroke-opacity .45s",
                  }}
                />
                {/* avance */}
                <circle
                  cx="140"
                  cy="140"
                  r={R}
                  fill="none"
                  stroke={fase.color}
                  strokeWidth={i === sel ? GROSOR + 5 : GROSOR}
                  strokeLinecap="round"
                  transform={giro(i)}
                  style={{
                    strokeDasharray: trazo(i, avances[i]),
                    transition:
                      "stroke-dasharray .9s cubic-bezier(.4,0,.2,1), stroke-width .45s cubic-bezier(.4,0,.2,1)",
                  }}
                />
                {/* zona sensible */}
                <circle
                  cx="140"
                  cy="140"
                  r={R}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={GROSOR + 16}
                  transform={giro(i)}
                  style={{ strokeDasharray: trazo(i, 1), cursor: "pointer" }}
                  onClick={() => setSel(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSel(i);
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Fase ${fase.n}: ${fase.nombre}`}
                  aria-pressed={i === sel}
                  className="focus:outline-none focus-visible:stroke-tinta/30"
                />
              </g>
            ))}

            {/* centro */}
            <text
              x="140"
              y="124"
              textAnchor="middle"
              className="fill-tinta-3"
              style={{ fontSize: 10, letterSpacing: "0.19em", textTransform: "uppercase" }}
            >
              FASE {f.n}
            </text>
            <text
              x="140"
              y="152"
              textAnchor="middle"
              className="fill-tinta"
              style={{ fontSize: 21, fontFamily: "var(--font-josefin)", fontWeight: 300 }}
            >
              {f.nombre.length > 14 ? f.nombre.split(" ")[0] : f.nombre}
            </text>
            <text
              x="140"
              y="176"
              textAnchor="middle"
              className="fill-taupe"
              style={{ fontSize: 13, fontVariantNumeric: "tabular-nums" }}
            >
              {pct}% del total
            </text>
          </svg>
        </div>

        {/* ficha de la fase */}
        <div key={sel} className="animar-entrada">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span
              className="font-display text-sm tabular-nums"
              style={{ color: f.color }}
            >
              {String(f.n).padStart(2, "0")}
            </span>
            <h3 className="font-display text-2xl leading-snug font-light text-tinta">
              {f.nombre}
            </h3>
            <span className="rotulo ml-auto text-tinta-3">
              {corto(f.inicio)} — {corto(f.fin)}
            </span>
          </div>

          <p className="mt-4 max-w-lg text-[15px] leading-relaxed font-light text-tinta-2">
            {f.resumen}
          </p>

          <div className="mt-5 flex flex-wrap gap-x-7 gap-y-2">
            <span className="rotulo text-tinta-3">{f.duracion}</span>
            <span className="rotulo" style={{ color: f.color }}>
              {ETIQUETA[f.estado]}
            </span>
            <span className="rotulo text-tinta-3 tabular-nums">
              {f.tareas.filter((t) => t.estado === "hecho").length} de {f.tareas.length} listas
            </span>
          </div>

          <ul className="mt-7 space-y-3">
            {f.tareas.map((t, i) => (
              <li
                key={t.t}
                className="animar-fila flex items-start gap-3.5"
                style={{ animationDelay: `${Math.min(i * 45, 400)}ms` }}
              >
                <span
                  className="mt-[7px] size-[7px] shrink-0 rounded-full"
                  style={
                    t.estado === "hecho"
                      ? { background: f.color }
                      : t.estado === "curso"
                        ? { background: f.color, boxShadow: `0 0 0 4px ${f.color}33` }
                        : t.estado === "espera"
                          ? { border: `1px solid ${f.color}`, opacity: 0.8 }
                          : { border: "1px solid var(--color-linea)" }
                  }
                  aria-hidden="true"
                />
                <span
                  className={`text-[14.5px] leading-snug font-light ${
                    t.estado === "hecho"
                      ? "text-tinta-3 line-through decoration-linea"
                      : t.estado === "pendiente"
                        ? "text-tinta-2"
                        : "text-tinta"
                  }`}
                >
                  {t.t}
                  <span className="sr-only"> — {ETIQUETA[t.estado]}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Calendario ── */}
      <div className="mt-14">
        <p className="rotulo text-taupe">Calendario</p>

        <div className="relative mt-6">
          {/* meses */}
          <div className="relative h-5 border-b border-linea">
            {meses.map((m) => (
              <span
                key={m.nombre}
                className="rotulo absolute top-0 text-tinta-3"
                style={{ left: `${m.left}%`, width: `${m.ancho}%` }}
              >
                {m.nombre}
              </span>
            ))}
          </div>

          {/* hoy */}
          <div
            className="pointer-events-none absolute top-5 bottom-0 z-10 w-px bg-ambar"
            style={{ left: `${hoyPct}%` }}
            aria-hidden="true"
          >
            <span className="absolute -top-1 -left-[3px] size-[7px] rounded-full bg-ambar" />
          </div>

          {/* barras */}
          <div className="mt-3 space-y-2">
            {fases.map((fase, i) => {
              const izq = pos(fase.inicio);
              const ancho = Math.max(1.5, pos(fase.fin) - izq);
              return (
                <button
                  key={fase.n}
                  type="button"
                  onClick={() => setSel(i)}
                  className="group relative block h-9 w-full text-left"
                  aria-label={`Fase ${fase.n}: ${fase.nombre}, ${corto(fase.inicio)} a ${corto(fase.fin)}`}
                  aria-pressed={i === sel}
                >
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-linea-2" />
                  <span
                    className="animar-barra absolute top-1/2 flex h-7 -translate-y-1/2 items-center rounded-full px-3"
                    style={{
                      left: `${izq}%`,
                      width: `${ancho}%`,
                      background: fase.color,
                      opacity: i === sel ? 1 : 0.42,
                      animationDelay: `${i * 70}ms`,
                      transition: "opacity .4s, transform .4s cubic-bezier(.4,0,.2,1)",
                      transform: i === sel ? "scaleY(1.12)" : "scaleY(1)",
                    }}
                  >
                    <span className="truncate text-[11.5px] font-medium text-[#1e1a18]">
                      {fase.nombre}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-5 text-[13.5px] font-light text-tinta-3">
          La línea ámbar marca hoy. Las fases 0 y 1 van en paralelo.
        </p>
      </div>
    </section>
  );
}
