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

const DIA_MS = 86_400_000;

const dia = (iso: string) => {
  const [a, m, d] = iso.split("-").map(Number);
  return Date.UTC(a, m - 1, d);
};

const corto = (iso: string) => {
  const [, m, d] = iso.split("-").map(Number);
  return `${d} ${MESES[m - 1].slice(0, 3)}`;
};

const duracion = (a: string, b: string) =>
  Math.round((dia(b) - dia(a)) / DIA_MS) + 1;

/* ── Geometría del anillo ─────────────────────────────────────── */
const R = 104;
const GROSOR = 20;
const C = 2 * Math.PI * R;
const HUECO = 5;
const PASO = 360 / fases.length;
const BARRIDO = PASO - HUECO;

/** Longitud del trazo visible. Va en `style` para poder animarla. */
const trazo = (fraccion: number) =>
  `${((C * BARRIDO) / 360) * fraccion} ${C}`;

/** Giro de cada fase. Va como ATRIBUTO de SVG: `rotate(a cx cy)` es
 *  sintaxis SVG y CSS no la entiende. */
const giro = (i: number) => `rotate(${-90 + i * PASO + HUECO / 2} 140 140)`;

const ANCHO_ETIQUETA = 236;

export default function Cronograma() {
  const enCurso = fases.findIndex((f) => f.estado === "curso");
  const [sel, setSel] = useState(enCurso >= 0 ? enCurso : 0);

  const avances = useMemo(
    () =>
      fases.map((f) =>
        f.tareas.length
          ? f.tareas.filter((t) => t.estado === "hecho").length / f.tareas.length
          : 0,
      ),
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
  const hoyPct = Math.min(100, Math.max(0, ((Date.now() - t0) / span) * 100));
  const semanasTotales = Math.round(span / (7 * DIA_MS));

  const meses = useMemo(() => {
    const out: { nombre: string; left: number }[] = [];
    const d0 = new Date(t0);
    let cur = Date.UTC(d0.getUTCFullYear(), d0.getUTCMonth(), 1);
    while (cur <= t1) {
      if (cur >= t0) {
        out.push({
          nombre: MESES[new Date(cur).getUTCMonth()],
          left: ((cur - t0) / span) * 100,
        });
      } else {
        out.push({ nombre: MESES[new Date(cur).getUTCMonth()], left: 0 });
      }
      const sig = new Date(cur);
      sig.setUTCMonth(sig.getUTCMonth() + 1);
      cur = sig.getTime();
    }
    return out;
  }, [t0, t1, span]);

  /** El lunes de cada semana. Es la rejilla que da la escala. */
  const semanas = useMemo(() => {
    const out: { left: number; dia: number; inicioDeMes: boolean }[] = [];
    const d = new Date(t0);
    d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
    let cur = d.getTime();
    let mesPrevio = -1;
    while (cur <= t1) {
      const fecha = new Date(cur);
      if (cur >= t0) {
        out.push({
          left: ((cur - t0) / span) * 100,
          dia: fecha.getUTCDate(),
          inicioDeMes: fecha.getUTCMonth() !== mesPrevio,
        });
        mesPrevio = fecha.getUTCMonth();
      }
      cur += 7 * DIA_MS;
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
                <circle
                  cx="140" cy="140" r={R} fill="none"
                  stroke={fase.color}
                  strokeOpacity={i === sel ? 0.3 : 0.14}
                  strokeWidth={i === sel ? GROSOR + 5 : GROSOR}
                  strokeLinecap="round"
                  transform={giro(i)}
                  style={{
                    strokeDasharray: trazo(1),
                    transition: "stroke-width .45s cubic-bezier(.4,0,.2,1), stroke-opacity .45s",
                  }}
                />
                <circle
                  cx="140" cy="140" r={R} fill="none"
                  stroke={fase.color}
                  strokeWidth={i === sel ? GROSOR + 5 : GROSOR}
                  strokeLinecap="round"
                  transform={giro(i)}
                  style={{
                    strokeDasharray: trazo(avances[i]),
                    transition:
                      "stroke-dasharray .9s cubic-bezier(.4,0,.2,1), stroke-width .45s cubic-bezier(.4,0,.2,1)",
                  }}
                />
                <circle
                  cx="140" cy="140" r={R} fill="none"
                  stroke="transparent"
                  strokeWidth={GROSOR + 16}
                  transform={giro(i)}
                  style={{ strokeDasharray: trazo(1), cursor: "pointer" }}
                  onClick={() => setSel(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSel(i);
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Fase ${fase.n}: ${fase.nombre}`}
                  aria-pressed={i === sel}
                  className="focus:outline-none focus-visible:stroke-tinta/25"
                />
              </g>
            ))}

            <text x="140" y="124" textAnchor="middle" className="fill-tinta-3"
              style={{ fontSize: 10, letterSpacing: "0.19em" }}>
              FASE {f.n}
            </text>
            <text x="140" y="152" textAnchor="middle" className="fill-tinta"
              style={{ fontSize: 21, fontFamily: "var(--font-josefin)", fontWeight: 300 }}>
              {f.nombre.length > 14 ? f.nombre.split(" ")[0] : f.nombre}
            </text>
            <text x="140" y="176" textAnchor="middle" className="fill-taupe"
              style={{ fontSize: 13, fontVariantNumeric: "tabular-nums" }}>
              {pct}% del total
            </text>
          </svg>
        </div>

        {/* ficha */}
        <div key={sel} className="animar-entrada">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-display text-sm tabular-nums" style={{ color: f.color }}>
              {String(f.n).padStart(2, "0")}
            </span>
            <h3 className="font-display text-2xl leading-snug font-light text-tinta">
              {f.nombre}
            </h3>
            <span className="rotulo ml-auto text-tinta-3 tabular-nums">
              {corto(f.inicio)} – {corto(f.fin)}
            </span>
          </div>

          <p className="mt-4 max-w-lg text-[15px] leading-relaxed font-light text-tinta-2">
            {f.resumen}
          </p>

          <div className="mt-5 flex flex-wrap gap-x-7 gap-y-2">
            <span className="rotulo text-tinta-3 tabular-nums">
              {duracion(f.inicio, f.fin)} días
            </span>
            <span className="rotulo" style={{ color: f.color }}>
              {ETIQUETA[f.estado]}
            </span>
            <span className="rotulo text-tinta-3 tabular-nums">
              {f.tareas.filter((t) => t.estado === "hecho").length} de {f.tareas.length} listas
            </span>
          </div>

          <ul className="mt-7 space-y-3">
            {f.tareas.map((t, i) => (
              <li key={t.t} className="animar-fila flex items-start gap-3.5"
                style={{ animationDelay: `${Math.min(i * 45, 400)}ms` }}>
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
                <span className={`text-[14.5px] leading-snug font-light ${
                  t.estado === "hecho"
                    ? "text-tinta-3 line-through decoration-linea"
                    : t.estado === "pendiente" ? "text-tinta-2" : "text-tinta"
                }`}>
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
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="rotulo text-taupe">Calendario</p>
          <p className="rotulo text-tinta-3 tabular-nums">
            {semanasTotales} semanas · {corto(fases[0].inicio)} a{" "}
            {corto(fases[fases.length - 1].fin)}
          </p>
        </div>
        <p className="mt-4 text-[15px] leading-relaxed font-light text-tinta-2">
          Cada línea vertical es una semana.
        </p>

        <div className="mt-8 overflow-x-auto pb-2">
          <div className="min-w-[720px]">
            {/* cabecera */}
            <div className="flex">
              <div style={{ width: ANCHO_ETIQUETA }} className="shrink-0" />
              <div className="relative h-10 flex-1">
                {meses.map((m) => (
                  <span key={m.nombre}
                    className="rotulo absolute top-0 border-l border-linea pl-2 text-taupe"
                    style={{ left: `${m.left}%` }}>
                    {m.nombre}
                  </span>
                ))}
                {semanas.map((w, i) => (
                  <span key={i}
                    className="absolute top-[22px] -translate-x-1/2 text-[10.5px] tabular-nums"
                    style={{
                      left: `${w.left}%`,
                      color: w.inicioDeMes ? "var(--color-taupe)" : "var(--color-tinta-3)",
                    }}>
                    {w.dia}
                  </span>
                ))}
              </div>
            </div>

            {/* filas */}
            <div className="relative border-t border-linea">
              {/* rejilla semanal */}
              <div className="pointer-events-none absolute inset-0 flex" aria-hidden="true">
                <div style={{ width: ANCHO_ETIQUETA }} className="shrink-0" />
                <div className="relative flex-1">
                  {semanas.map((w, i) => (
                    <span key={i} className="absolute inset-y-0 w-px"
                      style={{
                        left: `${w.left}%`,
                        background: w.inicioDeMes
                          ? "var(--color-linea)"
                          : "var(--color-linea-2)",
                      }} />
                  ))}
                  <span className="absolute inset-y-0 z-10 w-px bg-ambar"
                    style={{ left: `${hoyPct}%` }}>
                    <span className="absolute -top-[3px] -left-[3px] size-[7px] rounded-full bg-ambar" />
                  </span>
                </div>
              </div>

              {fases.map((fase, i) => {
                const izq = pos(fase.inicio);
                const ancho = Math.max(0.8, pos(fase.fin) - izq);
                const activa = i === sel;
                return (
                  <button key={fase.n} type="button" onClick={() => setSel(i)}
                    className="relative flex w-full items-center border-b border-linea-2 text-left last:border-b-0"
                    aria-label={`Fase ${fase.n}: ${fase.nombre}, del ${corto(fase.inicio)} al ${corto(fase.fin)}`}
                    aria-pressed={activa}>
                    <span style={{ width: ANCHO_ETIQUETA, opacity: activa ? 1 : 0.6,
                        transition: "opacity .35s" }}
                      className="flex shrink-0 items-baseline gap-2 py-2.5 pr-5">
                      <span className="font-display text-[11px] tabular-nums"
                        style={{ color: fase.color }}>
                        {String(fase.n).padStart(2, "0")}
                      </span>
                      <span className="flex-1 truncate text-[13.5px] font-light text-tinta">
                        {fase.nombre}
                      </span>
                      <span className="rotulo shrink-0 text-tinta-3 tabular-nums">
                        {duracion(fase.inicio, fase.fin)} d
                      </span>
                    </span>

                    <span className="relative h-9 flex-1">
                      <span className="animar-barra absolute top-1/2 -translate-y-1/2 rounded-full"
                        style={{
                          left: `${izq}%`,
                          width: `${ancho}%`,
                          height: activa ? 13 : 9,
                          background: fase.color,
                          opacity: activa ? 1 : 0.4,
                          animationDelay: `${i * 70}ms`,
                          transition: "opacity .35s, height .35s cubic-bezier(.4,0,.2,1)",
                        }} />
                      <span className="rotulo absolute top-1/2 -translate-y-1/2 whitespace-nowrap tabular-nums"
                        style={{
                          left: `calc(${izq + ancho}% + 10px)`,
                          color: activa ? "var(--color-tinta-2)" : "var(--color-tinta-3)",
                          opacity: activa ? 1 : 0.7,
                          transition: "opacity .35s, color .35s",
                        }}>
                        {corto(fase.inicio)} – {corto(fase.fin)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className="mt-6 text-[13.5px] font-light text-tinta-3">
          La línea ámbar marca hoy. Las fases 0 y 1 se solapan: el modelo de contenido
          arrancó antes de cerrar el inventario.
        </p>
      </div>
    </section>
  );
}
