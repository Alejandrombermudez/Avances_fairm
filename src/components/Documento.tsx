"use client";

import { useEffect, useRef, useState } from "react";
import type { Bloque, Documento as Doc } from "@/data/documentos";

/* ── Negrita con asteriscos ───────────────────────────────────── */
function Realce({ children }: { children: string }) {
  return (
    <>
      {children.split(/(\*[^*]+\*)/g).map((t, i) =>
        t.length > 2 && t.startsWith("*") && t.endsWith("*") ? (
          <b key={i} className="font-medium text-tinta">
            {t.slice(1, -1)}
          </b>
        ) : (
          t
        ),
      )}
    </>
  );
}

/** La flecha que separa el antes del después. En vertical cuando se apilan. */
function Paso() {
  return (
    <span
      className="flex items-center justify-center text-taupe max-[640px]:h-5 max-[640px]:rotate-90"
      aria-hidden="true"
    >
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path
          d="M2 8.5h12M9.5 4l4.5 4.5-4.5 4.5"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

const CAJA = "rounded-xl border border-linea bg-superficie px-6 py-5";

/* ── Un bloque ────────────────────────────────────────────────── */
function Pieza({ b }: { b: Bloque }) {
  switch (b.k) {
    case "texto":
      return (
        <p className="max-w-[62ch] text-[15px] leading-relaxed font-light text-tinta-2">
          <Realce>{b.texto}</Realce>
        </p>
      );

    case "par":
      return (
        <div className="grid items-stretch gap-2.5 sm:grid-cols-[1fr_38px_1fr] sm:gap-0">
          <div className={`${CAJA} border-dashed bg-transparent`}>
            <p className="rotulo mb-3 text-tinta-3">Hoy</p>
            <h4 className="font-display text-[19px] leading-snug font-normal text-tinta">
              {b.hoy.titulo}
            </h4>
            <div className="mt-2 space-y-2">
              {b.hoy.lineas.map((l) => (
                <p key={l} className="text-[14.5px] leading-relaxed font-light text-tinta-2">
                  <Realce>{l}</Realce>
                </p>
              ))}
            </div>
          </div>
          <Paso />
          <div className={CAJA}>
            <p className="rotulo mb-3 text-ambar">Queda así</p>
            <h4 className="font-display text-[19px] leading-snug font-normal text-tinta">
              {b.nuevo.titulo}
            </h4>
            <div className="mt-2 space-y-2">
              {b.nuevo.lineas.map((l) => (
                <p key={l} className="text-[14.5px] leading-relaxed font-light text-tinta-2">
                  <Realce>{l}</Realce>
                </p>
              ))}
            </div>
          </div>
        </div>
      );

    case "ficha":
      return (
        <div>
          <p className="rotulo mb-3 text-taupe">{b.titulo}</p>
          <dl className="rounded-xl border border-linea bg-superficie px-6">
            {b.filas.map((f) => (
              <div
                key={f.campo}
                className="grid gap-x-4 gap-y-1 border-b border-linea-2 py-3 last:border-b-0 sm:grid-cols-[132px_1fr]"
              >
                <dt className="text-[13.5px] font-light text-tinta-3">{f.campo}</dt>
                <dd className="text-[15px] font-light text-tinta">
                  {f.pastillas ? (
                    <span className="flex flex-wrap gap-1.5">
                      {f.pastillas.map((p) => (
                        <span
                          key={p}
                          className="rounded-full border border-linea bg-crema px-2.5 py-0.5 text-[13px] text-tinta-2"
                        >
                          {p}
                        </span>
                      ))}
                    </span>
                  ) : (
                    f.valor
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      );

    case "junta":
      return (
        <div>
          {b.filas.map((f) => (
            <div
              key={f.a}
              className="grid items-center gap-x-5 gap-y-2 border-b border-linea-2 py-5 last:border-b-0 sm:grid-cols-[1fr_auto_1fr]"
            >
              <ul className="space-y-1">
                {f.de.map((d) => (
                  <li key={d} className="text-[14.5px] font-light text-tinta-2">
                    {d}
                  </li>
                ))}
              </ul>
              <Paso />
              <div>
                <p className="font-display text-[19px] leading-snug font-normal text-tinta">
                  {f.a}
                </p>
                <p className="mt-0.5 text-[13px] leading-snug font-light text-tinta-3">
                  {f.nota}
                </p>
              </div>
            </div>
          ))}
        </div>
      );

    case "cifras":
      return (
        <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {b.items.map((c) => (
            <div key={c.n} className="flex flex-wrap items-baseline gap-x-4">
              <span className="font-display text-[50px] leading-none font-light tabular-nums text-ambar">
                {c.n}
              </span>
              <span className="max-w-[30ch] text-[15px] leading-snug font-light text-tinta-2">
                {c.t}
              </span>
            </div>
          ))}
        </div>
      );

    case "tabla":
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[15px]">
            <thead>
              <tr>
                {b.cabeceras.map((h) => (
                  <th
                    key={h}
                    className="rotulo border-b border-linea pr-3 pb-2.5 text-left font-normal text-tinta-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.filas.map(([a, c]) => (
                <tr key={a}>
                  <td className="border-b border-linea-2 py-2.5 pr-3 align-top font-light text-tinta-2">
                    {a}
                  </td>
                  <td className="border-b border-linea-2 py-2.5 pr-3 align-top font-light text-tinta">
                    {c}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "barras":
      return (
        <div className="space-y-4">
          {b.items.map((x, i) => (
            <div key={x.etiqueta}>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[14.5px] font-light text-tinta">{x.etiqueta}</span>
                <span className="rotulo text-tinta-3 tabular-nums">
                  {String(x.pct).replace(".", ",")}% · {x.n}
                </span>
              </div>
              <div className="mt-2 h-[7px] rounded-full bg-linea-2">
                <div
                  className="animar-barra h-[7px] rounded-full bg-ambar"
                  style={{ width: `${x.pct}%`, animationDelay: `${i * 90}ms` }}
                />
              </div>
            </div>
          ))}
        </div>
      );

    case "descarga":
      return (
        <div>
          <a
            href={b.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-full bg-ambar px-7 py-4 font-display text-[17px] font-normal text-carbon transition-[background-color,transform] duration-200 hover:bg-[#d49a3b] active:scale-[.98]"
          >
            {b.etiqueta}
            <svg
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-y-0.5"
            >
              <path
                d="M8.5 2v9m0 0L5 7.5M8.5 11 12 7.5M2.5 14h12"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <p className="mt-3.5 max-w-[46ch] text-[13.5px] leading-relaxed font-light text-tinta-3">
            {b.nota}
          </p>
        </div>
      );

    case "nota":
      return (
        <div className="rounded-xl border border-linea border-l-[3px] border-l-ambar bg-superficie px-6 py-5">
          <h4 className="font-display text-xl leading-snug font-normal text-tinta">
            {b.titulo}
          </h4>
          <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed font-light text-tinta-2">
            <Realce>{b.texto}</Realce>
          </p>
        </div>
      );

    case "puntos":
      return (
        <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
          {b.items.map((p) => (
            <article key={p.titulo} className="border-t border-linea pt-4">
              <h4 className="font-display text-[17px] leading-snug font-normal text-tinta">
                {p.titulo}
              </h4>
              <p className="mt-2 text-[14.5px] leading-relaxed font-light text-tinta-2">
                <Realce>{p.texto}</Realce>
              </p>
            </article>
          ))}
        </div>
      );
  }
}

/* ── El documento ─────────────────────────────────────────────── */
export default function Documento({
  doc,
  fase,
  tarea,
  color,
  onCerrar,
}: {
  doc: Doc;
  fase: string;
  tarea: string;
  color: string;
  onCerrar: () => void;
}) {
  const [h, setH] = useState(0);
  const tope = useRef<HTMLDivElement>(null);

  /* Al abrir otro documento se vuelve a la primera hoja. */
  useEffect(() => setH(0), [doc]);

  const hoja = doc.hojas[h];
  const ir = (n: number) => {
    setH(n);
    tope.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="animar-entrada mt-10" style={{ animationDelay: "140ms" }}>
      <div ref={tope} className="scroll-mt-6" />

      {/* cabecera */}
      <div className="rounded-t-xl border-x border-t border-linea bg-carbon px-6 py-7 sm:px-9">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
          <p className="rotulo text-taupe">
            {fase} <span className="text-arena/30">·</span> {tarea}
          </p>
          <button
            type="button"
            onClick={onCerrar}
            className="rotulo flex items-center gap-2 text-arena/55 transition-colors hover:text-arena"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path
                d="M11 6.5H2M6 2L1.5 6.5 6 11"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Volver al cronograma
          </button>
        </div>

        <h3 className="mt-5 max-w-[32ch] font-display text-[2rem] leading-[1.1] font-light text-hueso text-balance">
          {doc.titulo}
        </h3>
        <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed font-light text-arena/70">
          {doc.resumen}
        </p>
      </div>

      {/* índice de hojas */}
      <div className="flex flex-wrap gap-1 border-x border-b border-linea bg-crema px-3 py-2.5 sm:px-6">
        {doc.hojas.map((x, i) => (
          <button
            key={x.titulo}
            type="button"
            onClick={() => ir(i)}
            aria-current={i === h ? "page" : undefined}
            className="rotulo shrink-0 rounded-full px-3.5 py-2 whitespace-nowrap transition-colors"
            style={
              i === h
                ? { background: color, color: "var(--color-hueso)" }
                : { color: "var(--color-tinta-3)" }
            }
          >
            <span className="tabular-nums opacity-55">{i + 1}</span>
            <span className="ml-2">{x.titulo}</span>
          </button>
        ))}
      </div>

      {/* hoja */}
      <div
        key={h}
        className="animar-fila space-y-7 border-x border-linea bg-hueso px-6 py-9 sm:px-9"
      >
        <div className="flex items-baseline justify-between gap-5 border-b border-linea pb-4">
          <h4 className="font-display text-xl leading-snug font-normal text-tinta">
            {hoja.titulo}
          </h4>
          <span className="rotulo shrink-0 text-tinta-3 tabular-nums">
            {h + 1} de {doc.hojas.length}
          </span>
        </div>

        {hoja.bloques.map((b, i) => (
          <Pieza key={i} b={b} />
        ))}
      </div>

      {/* pie: pasar hoja */}
      <div className="flex items-center justify-between gap-4 rounded-b-xl border border-linea bg-crema px-4 py-3 sm:px-6">
        <Pasar
          hacia="atras"
          hoja={doc.hojas[h - 1]}
          onClick={() => ir(h - 1)}
        />
        <span className="rotulo shrink-0 text-tinta-3 tabular-nums">
          {doc.fecha.split("-").reverse().join(".")}
        </span>
        <Pasar hacia="adelante" hoja={doc.hojas[h + 1]} onClick={() => ir(h + 1)} />
      </div>
    </div>
  );
}

function Pasar({
  hacia,
  hoja,
  onClick,
}: {
  hacia: "atras" | "adelante";
  hoja?: { titulo: string };
  onClick: () => void;
}) {
  const atras = hacia === "atras";
  if (!hoja) return <span className="min-w-0 flex-1" aria-hidden="true" />;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-w-0 flex-1 items-center gap-2.5 py-1 ${
        atras ? "justify-start" : "justify-end"
      }`}
    >
      {atras && <Punta atras />}
      <span className="min-w-0">
        <span className="rotulo block text-tinta-3">{atras ? "Anterior" : "Siguiente"}</span>
        <span className="block truncate text-[13.5px] font-light text-tinta-2 transition-colors group-hover:text-tinta">
          {hoja.titulo}
        </span>
      </span>
      {!atras && <Punta />}
    </button>
  );
}

function Punta({ atras = false }: { atras?: boolean }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 text-taupe transition-transform ${
        atras ? "rotate-180 group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5"
      }`}
    >
      <path
        d="M2 7.5h11M8.5 3l4.5 4.5L8.5 12"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
