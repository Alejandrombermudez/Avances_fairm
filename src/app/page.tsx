export const revalidate = 3600;

import {
  meta,
  metricas,
  fases,
  esperando,
  hallazgos,
  proximoHito,
  type Estado,
} from "@/data/progreso";

const ESTADO_ETIQUETA: Record<Estado, string> = {
  hecho: "Completado",
  curso: "En curso",
  espera: "En espera",
  pendiente: "Pendiente",
};

const ESTADO_CLASE: Record<Estado, string> = {
  hecho: "bg-pine-soft text-pine",
  curso: "bg-pine text-white",
  espera: "bg-amber-soft text-amber",
  pendiente: "bg-surface-2 text-ink-3",
};

const PUNTO_CLASE: Record<Estado, string> = {
  hecho: "bg-pine",
  curso: "bg-pine ring-4 ring-pine-soft",
  espera: "bg-amber",
  pendiente: "bg-line",
};

function fechaLarga(iso: string) {
  const [a, m, d] = iso.split("-").map(Number);
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  return `${d} de ${meses[m - 1]} de ${a}`;
}

function diasDesde(iso: string) {
  const [a, m, d] = iso.split("-").map(Number);
  const desde = Date.UTC(a, m - 1, d);
  const hoy = Date.UTC(
    new Date().getUTCFullYear(),
    new Date().getUTCMonth(),
    new Date().getUTCDate(),
  );
  return Math.max(0, Math.round((hoy - desde) / 86_400_000));
}

export default function Page() {
  const total = fases.reduce((n, f) => n + f.tareas.length, 0);
  const hechas = fases.reduce(
    (n, f) => n + f.tareas.filter((t) => t.estado === "hecho").length,
    0,
  );
  const pct = Math.round((hechas / total) * 100);
  const faseActual = fases.find((f) => f.estado === "curso") ?? fases[0];

  return (
    <main className="mx-auto max-w-4xl px-4 pt-8 pb-20 sm:px-6">
      {/* Encabezado */}
      <header className="border-b border-line pb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
          {meta.cliente}
        </p>
        <h1 className="mt-3 font-display text-3xl leading-tight font-semibold text-balance sm:text-4xl">
          {meta.proyecto}
        </h1>
        <p className="mt-3 text-ink-2">
          {meta.sitios.join(" · ")}
        </p>

        <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3">
              Avance general
            </p>
            <p className="mt-1 font-display text-4xl font-semibold tabular-nums text-pine">
              {pct}%
            </p>
          </div>
          <p className="text-sm text-ink-3">
            Actualizado el {fechaLarga(meta.actualizado)}
          </p>
        </div>

        <div
          className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-2"
          role="img"
          aria-label={`Avance del proyecto: ${pct} por ciento, ${hechas} de ${total} tareas completadas`}
        >
          <div className="h-full rounded-full bg-pine" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-sm text-ink-3 tabular-nums">
          {hechas} de {total} tareas completadas · Fase {faseActual.n}: {faseActual.nombre}
        </p>
      </header>

      {/* Cifras */}
      <section className="mt-12">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.13em] text-ink-3">
          Lo que se ha medido
        </h2>
        <p className="mt-1 max-w-2xl text-ink-2">
          Diagnóstico completo de los tres sitios, hecho sobre la información que
          publican abiertamente.
        </p>
        <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4">
          {metricas.map((m) => (
            <div key={m.etiqueta} className="bg-surface p-5">
              <dt className="sr-only">{m.etiqueta}</dt>
              <dd>
                <span className="block font-display text-2xl font-semibold tabular-nums">
                  {m.valor}
                </span>
                <span className="mt-1 block text-sm text-ink-2">{m.etiqueta}</span>
                {m.nota && (
                  <span className="mt-0.5 block text-xs text-ink-3">{m.nota}</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Hallazgos */}
      <section className="mt-12">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.13em] text-ink-3">
          Hallazgos del diagnóstico
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {hallazgos.map((h) => (
            <article
              key={h.titulo}
              className="rounded-xl border border-line bg-surface p-5"
            >
              <h3 className="font-display text-lg leading-snug font-semibold">
                {h.titulo}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{h.texto}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Fases */}
      <section className="mt-12">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.13em] text-ink-3">
          Las seis fases
        </h2>
        <div className="mt-5 flex flex-col gap-4">
          {fases.map((f) => (
            <article
              key={f.n}
              className={`overflow-hidden rounded-xl border bg-surface ${
                f.estado === "curso" ? "border-pine" : "border-line"
              }`}
            >
              <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line-2 bg-surface-2 px-5 py-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-pine-soft font-display text-sm font-bold text-pine">
                  {f.n}
                </span>
                <h3 className="min-w-[9rem] flex-1 font-display text-lg font-semibold">
                  {f.nombre}
                </h3>
                <span className="font-mono text-xs text-ink-3">{f.duracion}</span>
                <span
                  className={`rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wider ${ESTADO_CLASE[f.estado]}`}
                >
                  {ESTADO_ETIQUETA[f.estado]}
                </span>
              </header>
              <div className="px-5 py-4">
                <p className="text-[15px] leading-relaxed text-ink-2">{f.resumen}</p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {f.tareas.map((t) => (
                    <li key={t.t} className="flex items-start gap-3">
                      <span
                        className={`mt-[7px] size-2 shrink-0 rounded-full ${PUNTO_CLASE[t.estado]}`}
                        aria-hidden="true"
                      />
                      <span
                        className={`text-[15px] ${
                          t.estado === "hecho" ? "text-ink-3 line-through" : "text-ink"
                        }`}
                      >
                        {t.t}
                        <span className="sr-only"> — {ESTADO_ETIQUETA[t.estado]}</span>
                      </span>
                      {t.estado === "espera" && (
                        <span className="ml-auto shrink-0 rounded bg-amber-soft px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber">
                          En espera
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* En espera */}
      {esperando.length > 0 && (
        <section className="mt-12">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.13em] text-ink-3">
            Insumos en espera
          </h2>
          <p className="mt-1 max-w-2xl text-ink-2">
            Estos elementos son necesarios para continuar. El equipo de ARM los está
            gestionando.
          </p>
          <div className="mt-5 overflow-hidden rounded-xl border border-line bg-surface">
            {esperando.map((e, i) => (
              <div
                key={e.que}
                className={`px-5 py-4 ${i > 0 ? "border-t border-line-2" : ""}`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">{e.que}</h3>
                  <span className="font-mono text-xs text-ink-3 tabular-nums">
                    solicitado hace {diasDesde(e.desde)} días
                  </span>
                </div>
                <p className="mt-1 text-[15px] text-ink-2">{e.para}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Próximo hito */}
      <section className="mt-12">
        <div className="rounded-xl border border-line border-l-[3px] border-l-pine bg-surface p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.13em] text-ink-3">
            Próximo hito
          </p>
          <h2 className="mt-2 font-display text-xl leading-snug font-semibold text-balance">
            {proximoHito.titulo}
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
            {proximoHito.detalle}
          </p>
        </div>
      </section>

      <footer className="mt-12 border-t border-line pt-6 font-mono text-xs leading-relaxed text-ink-3">
        <p>
          {meta.responsable} · {meta.contacto}
        </p>
        <p className="mt-1">
          Esta página se actualiza a medida que avanza el proyecto. Las cifras
          provienen del diagnóstico realizado sobre los sitios actuales.
        </p>
      </footer>
    </main>
  );
}
