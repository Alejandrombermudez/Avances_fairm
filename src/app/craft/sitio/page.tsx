/**
 * La portada, con los mismos cinco bloques que tiene hoy.
 *
 * Lo que cambia es de dónde sale cada uno. El rótulo verde de cada bloque
 * dice qué consulta lo alimenta: ninguno está escrito a mano.
 */

import Link from "next/link";
import { norma, traer, idiomasDe, pagina } from "@/lib/craft";
import Texto from "@/components/craft/Texto";

function Fuente({ children }: { children: React.ReactNode }) {
  return (
    <p className="rotulo mb-3" style={{ color: "var(--verde)" }}>
      ↻ {children}
    </p>
  );
}

export default function Portada() {
  const { vigente, versiones } = norma();
  const vols = (versiones.find((v) => v._id === vigente?._id)?.vols ?? []).filter(
    (v) => v.volumeLabel !== "Completo",
  );
  const historias = traer("story", "es");
  const hitos = traer("timelineEvent", "es").sort((a, b) =>
    (a.date ?? "").localeCompare(b.date ?? ""),
  );
  const noticias = traer("article", "es").sort((a, b) =>
    (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""),
  );
  const inicio = pagina("inicio");

  return (
    <main>
      {/* ── Entrada ── */}
      <section className="px-6 py-16 sm:px-10" style={{ background: "var(--cafe)" }}>
        <div className="mx-auto max-w-6xl">
          <p className="rotulo" style={{ color: "var(--arena)" }}>
            Pasaporte a mercados formales
          </p>
          <h1
            className="mt-5 max-w-3xl text-[2.6rem] leading-[1.1] font-light text-balance sm:text-[3.2rem]"
            style={{ color: "var(--papel)" }}
          >
            CRAFT reduce los riesgos de la minería artesanal y de pequeña escala
          </h1>
          <p className="mt-6 max-w-xl text-[16px] leading-relaxed font-light" style={{ color: "#E8D9C6" }}>
            Y abre el camino para que su producción entre en cadenas de suministro legales.
          </p>
          <Link
            href="/craft/sitio/recursos"
            className="mt-9 inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-[15px] font-medium transition-transform active:scale-[.98]"
            style={{ background: "var(--arena)", color: "var(--cafe)" }}
          >
            Descargar el Código CRAFT {vigente?.version}
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        {/* ── 1 ── */}
        <section className="border-b py-14" style={{ borderColor: "var(--linea-craft)" }}>
          <Fuente>Texto de la página. Igual que hoy</Fuente>
          <h2 className="text-[1.8rem] leading-snug font-light">¿Por qué aplicar CRAFT?</h2>
          <div className="mt-6 max-w-3xl">
            <Texto bloques={(inicio?.body ?? []).slice(2, 9)} />
          </div>
        </section>

        {/* ── 2 ── */}
        <section className="border-b py-14" style={{ borderColor: "var(--linea-craft)" }}>
          <Fuente>Ficha de la norma · versión marcada como vigente</Fuente>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="text-[1.8rem] leading-snug font-light">Descarga el CRAFT</h2>
            <Link href="/craft/sitio/recursos" className="rotulo" style={{ color: "var(--terracota)" }}>
              Ver todos los documentos →
            </Link>
          </div>

          <div
            className="mt-7 overflow-hidden rounded-xl"
            style={{ border: "1px solid var(--linea-craft)", background: "#fff" }}
          >
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 px-7 py-5" style={{ background: "var(--cafe)" }}>
              <span className="text-[1.6rem] font-light" style={{ color: "var(--papel)" }}>
                CRAFT {vigente?.version}
              </span>
              <span className="rotulo" style={{ color: "var(--arena)" }}>
                Vigente
              </span>
              <span className="ml-auto text-[13px] font-light" style={{ color: "#D8C4AE" }}>
                {vigente?.releaseDate}
              </span>
            </div>
            <ul>
              {vols.map((v) => (
                <li
                  key={v._id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-7 py-3.5 last:border-b-0"
                  style={{ borderColor: "var(--linea-craft)" }}
                >
                  <span className="w-16 shrink-0 text-[13px] font-medium">{v.volumeLabel}</span>
                  <span className="min-w-[12rem] flex-1 text-[14.5px] font-light">
                    {(v.title as unknown as { es: string })?.es?.replace(/^CRAFT [\d.]+ — /, "")}
                  </span>
                  <span className="flex shrink-0 gap-1.5">
                    {idiomasDe(v).map((l) => (
                      <span
                        key={l}
                        className="rounded px-2 py-0.5 text-[11.5px] font-medium"
                        style={{ background: "var(--arena)", color: "var(--cafe)" }}
                      >
                        {l.toUpperCase()}
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── 3 ── */}
        <section className="border-b py-14" style={{ borderColor: "var(--linea-craft)" }}>
          <Fuente>Fichas de historia · {historias.length} publicadas</Fuente>
          <h2 className="text-[1.8rem] leading-snug font-light">¿Quiénes están aplicando CRAFT?</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {historias.map((h) => (
              <article
                key={h._id}
                className="rounded-xl p-5"
                style={{ background: "#fff", border: "1px solid var(--linea-craft)" }}
              >
                {h.place && (
                  <p className="rotulo" style={{ color: "var(--verde)" }}>
                    {h.place}
                  </p>
                )}
                <h3 className="mt-2.5 text-[15.5px] leading-snug font-medium">
                  {h.title?.replace(/^[^–]+–\s*/, "")}
                </h3>
              </article>
            ))}
          </div>
        </section>

        {/* ── 4 ── */}
        <section className="border-b py-14" style={{ borderColor: "var(--linea-craft)" }}>
          <Fuente>Fichas de hito · {hitos.length}, ordenados por fecha</Fuente>
          <h2 className="text-[1.8rem] leading-snug font-light">¿Cómo se está creando CRAFT?</h2>
          <ol className="mt-8 border-l pl-6" style={{ borderColor: "var(--linea-craft)" }}>
            {hitos.map((h) => (
              <li key={h._id} className="relative pb-5 last:pb-0">
                <span
                  className="absolute top-[7px] -left-[27px] size-[7px] rounded-full"
                  style={{ background: "var(--taupe-craft)" }}
                />
                <p className="rotulo tabular-nums" style={{ color: "var(--taupe-craft)" }}>
                  {h.date?.slice(0, 7)}
                </p>
                <p className="mt-1 text-[14.5px] font-light">{h.title}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── 5 ── */}
        <section className="py-14">
          <Fuente>Artículos · los {noticias.length} más recientes</Fuente>
          <h2 className="text-[1.8rem] leading-snug font-light">Noticias y actividades</h2>
          <ul className="mt-8 space-y-0">
            {noticias.map((n) => (
              <li
                key={n._id}
                className="flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b py-4 last:border-b-0"
                style={{ borderColor: "var(--linea-craft)" }}
              >
                <span className="rotulo w-24 shrink-0 tabular-nums" style={{ color: "var(--taupe-craft)" }}>
                  {n.publishedAt?.slice(0, 10)}
                </span>
                <span className="min-w-[14rem] flex-1 text-[15px] font-light">{n.title}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
