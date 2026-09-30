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

const ETIQUETA: Record<Estado, string> = {
  hecho: "Completado",
  curso: "En curso",
  espera: "En espera",
  pendiente: "Pendiente",
};

/* Marcador de estado sobre fondo claro */
const MARCA: Record<Estado, string> = {
  hecho: "bg-taupe",
  curso: "bg-ambar",
  espera: "border border-taupe bg-transparent",
  pendiente: "border border-linea bg-transparent",
};

const TEXTO_TAREA: Record<Estado, string> = {
  hecho: "text-tinta-3 line-through decoration-linea",
  curso: "text-tinta",
  espera: "text-tinta",
  pendiente: "text-tinta-2",
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
  const hoy = new Date();
  const ms =
    Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate()) -
    Date.UTC(a, m - 1, d);
  return Math.max(0, Math.round(ms / 86_400_000));
}

function Rotulo({
  children,
  tono = "taupe",
}: {
  children: React.ReactNode;
  tono?: "taupe" | "tinta" | "arena";
}) {
  const color =
    tono === "arena" ? "text-arena/50" : tono === "tinta" ? "text-tinta-3" : "text-taupe";
  return <p className={`rotulo ${color}`}>{children}</p>;
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
    <main>
      {/* ───────────── Encabezado oscuro ───────────── */}
      <header className="bg-carbon px-6 pt-14 pb-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="rotulo font-display font-semibold tracking-[0.26em] text-arena">
            {meta.cliente}
          </p>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-end">
            <div>
              <Rotulo tono="arena">Seguimiento del proyecto</Rotulo>
              <h1 className="mt-4 font-display text-[2.6rem] leading-[1.05] font-light text-hueso text-balance sm:text-5xl">
                Migración del
                <br />
                ecosistema web
              </h1>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed font-light text-arena/70">
                Los tres sitios de la organización pasan a una arquitectura nueva,
                más rápida y más fácil de administrar, conservando las direcciones
                de los documentos publicados.
              </p>
              <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
                {meta.sitios.map((s) => (
                  <li key={s} className="text-[13px] font-light text-arena/55">
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Avance */}
            <div className="border-t border-arena/15 pt-7 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
              <Rotulo tono="arena">Avance general</Rotulo>
              <p className="mt-3 font-display text-6xl leading-none font-light tabular-nums text-hueso">
                {pct}
                <span className="text-3xl text-arena/45">%</span>
              </p>
              <div
                className="mt-6 h-px w-full bg-arena/15"
                role="img"
                aria-label={`${pct} por ciento completado: ${hechas} de ${total} tareas`}
              >
                <div className="h-px bg-ambar" style={{ width: `${pct}%` }} />
              </div>
              <dl className="mt-6 space-y-2.5">
                <div className="flex justify-between gap-4 text-[13px] font-light">
                  <dt className="text-arena/50">Tareas completadas</dt>
                  <dd className="tabular-nums text-arena">
                    {hechas} de {total}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 text-[13px] font-light">
                  <dt className="text-arena/50">Fase actual</dt>
                  <dd className="text-arena">{faseActual.nombre}</dd>
                </div>
                <div className="flex justify-between gap-4 text-[13px] font-light">
                  <dt className="text-arena/50">Actualizado</dt>
                  <dd className="text-arena">{fechaLarga(meta.actualizado)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-16">
        {/* ───────────── Cifras ───────────── */}
        <section className="border-b border-linea py-14">
          <Rotulo>Lo que se ha medido</Rotulo>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed font-light text-tinta-2">
            Diagnóstico completo de los tres sitios, hecho sobre la información que
            publican abiertamente.
          </p>
          <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-9 lg:grid-cols-4">
            {metricas.map((m) => (
              <div key={m.etiqueta} className="border-t border-linea pt-4">
                <dt className="sr-only">{m.etiqueta}</dt>
                <dd>
                  <span className="block font-display text-[2rem] leading-none font-light tabular-nums text-tinta">
                    {m.valor}
                  </span>
                  <span className="mt-2.5 block text-[13.5px] leading-snug font-light text-tinta-2">
                    {m.etiqueta}
                  </span>
                  {m.nota && (
                    <span className="mt-1 block text-[12px] font-light text-tinta-3">
                      {m.nota}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ───────────── Hallazgos ───────────── */}
        <section className="border-b border-linea py-14">
          <Rotulo>Hallazgos del diagnóstico</Rotulo>
          <div className="mt-9 grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {hallazgos.map((h) => (
              <article key={h.titulo} className="border-t border-linea pt-4">
                <h3 className="font-display text-lg leading-snug font-normal text-tinta">
                  {h.titulo}
                </h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed font-light text-tinta-2">
                  {h.texto}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ───────────── Fases ───────────── */}
        <section className="border-b border-linea py-14">
          <Rotulo>Las seis fases</Rotulo>
          <div className="mt-9">
            {fases.map((f) => (
              <article
                key={f.n}
                className="grid gap-x-10 gap-y-5 border-t border-linea py-7 lg:grid-cols-[minmax(0,15rem)_1fr]"
              >
                <div>
                  <div className="flex items-baseline gap-3">
                    <span
                      className={`font-display text-[13px] tabular-nums ${
                        f.estado === "curso" ? "text-ambar" : "text-tinta-3"
                      }`}
                    >
                      {String(f.n).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-xl leading-snug font-normal text-tinta">
                      {f.nombre}
                    </h3>
                  </div>
                  <p className="rotulo mt-3 text-tinta-3">
                    {f.duracion}
                    {f.estado === "curso" && (
                      <span className="ml-2 text-ambar">· {ETIQUETA[f.estado]}</span>
                    )}
                  </p>
                  <p className="mt-4 max-w-xs text-[14px] leading-relaxed font-light text-tinta-2">
                    {f.resumen}
                  </p>
                </div>

                <ul className="space-y-3 lg:pt-1">
                  {f.tareas.map((t) => (
                    <li key={t.t} className="flex items-start gap-3.5">
                      <span
                        className={`mt-[7px] size-[7px] shrink-0 rounded-full ${MARCA[t.estado]}`}
                        aria-hidden="true"
                      />
                      <span
                        className={`text-[14.5px] leading-snug font-light ${TEXTO_TAREA[t.estado]}`}
                      >
                        {t.t}
                        <span className="sr-only"> — {ETIQUETA[t.estado]}</span>
                      </span>
                      {t.estado === "espera" && (
                        <span className="rotulo mt-[3px] ml-auto shrink-0 text-taupe">
                          En espera
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* ───────────── Insumos en espera ───────────── */}
        {esperando.length > 0 && (
          <section className="border-b border-linea py-14">
            <Rotulo>Insumos en gestión</Rotulo>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed font-light text-tinta-2">
              Elementos necesarios para continuar, que el equipo de ARM está
              gestionando.
            </p>
            <div className="mt-9">
              {esperando.map((e) => (
                <div
                  key={e.que}
                  className="grid gap-x-10 gap-y-2 border-t border-linea py-5 sm:grid-cols-[minmax(0,17rem)_1fr]"
                >
                  <div className="flex items-baseline justify-between gap-4 sm:block">
                    <h3 className="text-[15px] font-normal text-tinta">{e.que}</h3>
                    <p className="rotulo mt-1.5 shrink-0 text-taupe tabular-nums">
                      hace {diasDesde(e.desde)} días
                    </p>
                  </div>
                  <p className="text-[14px] leading-relaxed font-light text-tinta-2">
                    {e.para}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ───────────── Próximo hito ───────────── */}
        <section className="py-14">
          <Rotulo>Próximo hito</Rotulo>
          <h2 className="mt-5 max-w-2xl font-display text-2xl leading-snug font-light text-tinta text-balance sm:text-[1.7rem]">
            {proximoHito.titulo}
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed font-light text-tinta-2">
            {proximoHito.detalle}
          </p>
        </section>
      </div>

      {/* ───────────── Pie ───────────── */}
      <footer className="bg-carbon px-6 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-5xl flex-wrap items-baseline justify-between gap-y-4">
          <div>
            <p className="text-[14px] font-light text-arena">{meta.responsable}</p>
            <p className="mt-1 text-[13px] font-light text-arena/50">
              {meta.contacto}
            </p>
          </div>
          <p className="rotulo max-w-xs text-right text-arena/40 sm:leading-relaxed">
            Esta página se actualiza a medida que avanza el proyecto
          </p>
        </div>
      </footer>
    </main>
  );
}
