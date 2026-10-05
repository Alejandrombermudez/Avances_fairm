/**
 * Vista previa de CRAFT con el modelo de contenido aplicado.
 *
 * No es el sitio nuevo: es el contenido de craftmines.org ya organizado, para
 * que ARM lo vea antes de que exista ninguna cuenta contratada. Los datos
 * salen de `tools/migrar_craft.py`, el mismo archivo que se importará a Sanity
 * con un comando el día que se abra el proyecto.
 *
 * Falta el manual de marca, así que esto se dibuja con el sistema visual de la
 * página de avances. El diseño de CRAFT es otra conversación.
 */

import Link from "next/link";
import vista from "@/data/craft-vista.json";
import { meta } from "@/data/progreso";

export const metadata = {
  title: "CRAFT reorganizado — Migración web ARM",
  robots: { index: false, follow: false },
};

const ETIQUETA_TIPO: Record<string, string> = {
  volumen: "Volúmenes de la norma",
  folleto: "Folletos e infografías",
  plantilla: "Plantillas de informe",
  acta: "Actas del Comité",
  tdr: "Términos de referencia",
  sintesis: "Síntesis de consultas",
  comunicado: "Comunicados",
  informe: "Informes",
  herramienta: "Herramientas",
  guia: "Guías",
};

/** En minúscula y en español: van dentro de una frase, no en una etiqueta. */
const IDIOMA: Record<string, string> = {
  es: "español",
  en: "inglés",
  fr: "francés",
  pt: "portugués",
  de: "alemán",
};

function Rotulo({ children, tono = "taupe" }: { children: React.ReactNode; tono?: string }) {
  return <p className={`rotulo text-${tono}`}>{children}</p>;
}

function Pastilla({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-linea bg-crema px-2.5 py-0.5 text-[12px] font-light text-tinta-2">
      {children}
    </span>
  );
}

export default function CraftPreview() {
  const r = vista.resumen as Record<string, number>;
  const vigente = vista.norma.versiones.find((v) => v.estado === "vigente");

  /* Los idiomas en que existe la versión vigente, para poder decir cuál falta. */
  const idiomasVigente = new Set(
    (vigente?.volumenes ?? []).flatMap((v) => v.idiomas as string[]),
  );

  const porTipo = (vista.documentos as { tipo: string }[]).reduce<Record<string, number>>(
    (acc, d) => ({ ...acc, [d.tipo]: (acc[d.tipo] ?? 0) + 1 }),
    {},
  );

  const hitosUnicos = Array.from(
    new Map((vista.hitos as { fecha: string; titulo: string }[]).map((h) => [h.fecha, h])).values(),
  );

  const historiasEs = (vista.historias as { idioma: string }[]).filter((h) => h.idioma === "es");

  return (
    <main>
      {/* ── Encabezado ── */}
      <header className="bg-carbon px-6 pt-12 pb-14 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <p className="rotulo font-display font-semibold tracking-[0.26em] text-arena">
              {meta.cliente}
            </p>
            <Link href="/" className="rotulo text-arena/55 transition-colors hover:text-arena">
              ← Volver a los avances
            </Link>
          </div>

          <p className="rotulo mt-10 text-arena/50">Vista previa · craftmines.org</p>
          <h1 className="mt-4 font-display text-[2.6rem] leading-[1.05] font-light text-hueso text-balance sm:text-5xl">
            CRAFT, reorganizado
          </h1>
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed font-light text-arena/70">
            El mismo contenido que hoy está en craftmines.org, puesto en la estructura
            nueva. Nada se escribió de cero: esto es lo que había, ordenado.
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-4">
            {[
              ["74", "fichas de documento", "de 161 archivos sueltos"],
              ["60", "preguntas frecuentes", "estaban dentro de una página"],
              ["22", "hitos de cronología", "estaban en cuatro sitios"],
              ["3", "versiones de la norma", "ninguna existía como tal"],
            ].map(([n, t, nota]) => (
              <div key={t} className="border-t border-arena/15 pt-4">
                <dt className="sr-only">{t}</dt>
                <dd>
                  <span className="block font-display text-[2rem] leading-none font-light tabular-nums text-hueso">
                    {n}
                  </span>
                  <span className="mt-2 block text-[13px] leading-snug font-light text-arena/70">
                    {t}
                  </span>
                  <span className="mt-1 block text-[12px] font-light text-arena/40">{nota}</span>
                </dd>
              </div>
            ))}
          </dl>

          <Link
            href="/sitio"
            className="group mt-10 mr-3 inline-flex items-center gap-3 rounded-full bg-ambar px-5 py-2.5 transition-[background-color,transform] duration-200 hover:bg-[#d49a3b] active:scale-[.98]"
          >
            <span className="rotulo text-carbon">Ver el sitio de CRAFT</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
              className="shrink-0 text-carbon transition-transform duration-200 group-hover:translate-x-0.5"
            >
              <path
                d="M2 7h10M8 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <Link
            href="/craft/propuesta"
            className="group mt-10 inline-flex items-center gap-3 rounded-full border border-ambar/45 px-5 py-2.5 transition-colors duration-200 hover:border-ambar hover:bg-ambar"
          >
            <span className="rotulo text-arena transition-colors duration-200 group-hover:text-carbon">
              Ver la propuesta de organización
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
              className="shrink-0 text-arena/70 transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:text-carbon"
            >
              <path
                d="M2 7h10M8 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-16">
        {/* ── La norma ── */}
        <section className="border-b border-linea py-14">
          <Rotulo>La norma</Rotulo>
          <h2 className="mt-4 font-display text-2xl leading-snug font-light text-tinta">
            Código CRAFT
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed font-light text-tinta-2">
            Es la pieza que hoy no existe en el sistema. Sin ella, saber cuál es la
            versión vigente obliga a leer nombres de archivo y adivinar qué significa{" "}
            <code className="font-mono text-[13px] text-tinta">_LOW</code>,{" "}
            <code className="font-mono text-[13px] text-tinta">-clean</code> o{" "}
            <code className="font-mono text-[13px] text-tinta">VersionFinal</code>.
          </p>

          <div className="mt-10 space-y-10">
            {vista.norma.versiones.map((v) => (
              <article key={v.version}>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-linea pb-3">
                  <h3 className="font-display text-xl font-light text-tinta tabular-nums">
                    CRAFT {v.version}
                  </h3>
                  <span
                    className="rotulo"
                    style={{
                      color: v.estado === "vigente" ? "var(--color-ambar)" : "var(--color-tinta-3)",
                    }}
                  >
                    {v.estado === "vigente" ? "Vigente" : "Reemplazada"}
                  </span>
                  <span className="rotulo ml-auto text-tinta-3 tabular-nums">{v.fecha}</span>
                </div>

                <ul className="mt-4 space-y-2.5">
                  {v.volumenes.map((vol, i) => (
                    <li
                      key={`${v.version}-${i}`}
                      className="flex flex-wrap items-baseline gap-x-4 gap-y-1"
                    >
                      <span className="rotulo w-20 shrink-0 text-tinta-3">{vol.etiqueta}</span>
                      <span className="flex-1 text-[14.5px] font-light text-tinta">
                        {vol.titulo}
                      </span>
                      <span className="flex shrink-0 gap-1.5">
                        {(vol.idiomas as string[]).map((l) => (
                          <Pastilla key={l}>{l.toUpperCase()}</Pastilla>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          {/* Un hueco que el orden deja a la vista */}
          {vigente && !idiomasVigente.has("es") && (
            <div className="mt-10 rounded-xl border border-linea border-l-[3px] border-l-ambar bg-superficie px-6 py-5">
              <h3 className="font-display text-xl font-normal text-tinta">
                La versión vigente no está en español
              </h3>
              <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed font-light text-tinta-2">
                CRAFT {vigente.version} está publicada en{" "}
                {Array.from(idiomasVigente)
                  .map((l) => IDIOMA[l] ?? l)
                  .join(" y ")}
                . En español solo está la versión candidata de 2023, no la definitiva. Para
                una norma cuyo público principal son mineros de habla hispana, es el tipo de
                hueco que solo se ve cuando el contenido está ordenado.
              </p>
            </div>
          )}
        </section>

        {/* ── Documentos ── */}
        <section className="border-b border-linea py-14">
          <Rotulo>Los documentos</Rotulo>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed font-light text-tinta-2">
            161 archivos sueltos pasan a <b className="font-medium text-tinta">74 fichas</b>. Las
            copias del mismo documento se reconocen por su contenido, no por el nombre: el
            código CRAFT 1.0 en inglés estaba subido cuatro veces.
          </p>

          <div className="mt-9 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {Object.entries(porTipo)
              .sort((a, b) => b[1] - a[1])
              .map(([tipo, n]) => (
                <div
                  key={tipo}
                  className="flex items-baseline justify-between gap-4 border-t border-linea pt-3"
                >
                  <span className="text-[14.5px] font-light text-tinta">
                    {ETIQUETA_TIPO[tipo] ?? tipo}
                  </span>
                  <span className="font-display text-lg font-light tabular-nums text-tinta-2">
                    {n}
                  </span>
                </div>
              ))}
          </div>

          <details className="mt-10 border-t border-linea pt-5">
            <summary className="rotulo cursor-pointer text-taupe transition-colors hover:text-tinta">
              Ver las 74 fichas
            </summary>
            <ul className="mt-5 space-y-2">
              {(vista.documentos as { titulo: string; tipo: string; anio: number | null; idiomas: string[] }[]).map(
                (d, i) => (
                  <li
                    key={i}
                    className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-linea-2 py-2 last:border-b-0"
                  >
                    <span className="flex-1 text-[14px] font-light text-tinta">{d.titulo}</span>
                    {d.anio && (
                      <span className="rotulo shrink-0 text-tinta-3 tabular-nums">{d.anio}</span>
                    )}
                    <span className="flex shrink-0 gap-1.5">
                      {d.idiomas.map((l) => (
                        <Pastilla key={l}>{l.toUpperCase()}</Pastilla>
                      ))}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </details>
        </section>

        {/* ── Cronología ── */}
        <section className="border-b border-linea py-14">
          <Rotulo>La cronología</Rotulo>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed font-light text-tinta-2">
            Estaba implementada cuatro veces, con tres programas distintos y repetida por
            idioma: 61 registros para{" "}
            <b className="font-medium text-tinta">{hitosUnicos.length} hitos reales</b>.
          </p>
          <ol className="mt-9 border-l border-linea pl-6">
            {hitosUnicos.map((h) => (
              <li key={h.fecha} className="relative pb-5 last:pb-0">
                <span className="absolute top-[7px] -left-[27px] size-[7px] rounded-full bg-taupe" />
                <p className="rotulo text-tinta-3 tabular-nums">{h.fecha.slice(0, 7)}</p>
                <p className="mt-1 text-[14.5px] font-light text-tinta">{h.titulo}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Lo demás ── */}
        <section className="border-b border-linea py-14">
          <Rotulo>Lo demás</Rotulo>
          <div className="mt-9 grid gap-x-10 gap-y-9 sm:grid-cols-2">
            <article className="border-t border-linea pt-4">
              <h3 className="font-display text-lg font-normal text-tinta">
                {r.faq} preguntas frecuentes
              </h3>
              <p className="mt-2 text-[14.5px] leading-relaxed font-light text-tinta-2">
                Estaban dentro de una página de 66.594 caracteres, en acordeones. Sueltas se
                buscan, se enlazan una por una y se muestran donde corresponda.
              </p>
              <ul className="mt-4 space-y-1.5">
                {(vista.preguntas as { pregunta: string; idioma: string }[])
                  .filter((p) => p.idioma === "es")
                  .slice(0, 5)
                  .map((p) => (
                    <li key={p.pregunta} className="text-[13.5px] font-light text-tinta-3">
                      {p.pregunta}
                    </li>
                  ))}
              </ul>
            </article>

            <article className="border-t border-linea pt-4">
              <h3 className="font-display text-lg font-normal text-tinta">
                {historiasEs.length} historias de comunidades
              </h3>
              <p className="mt-2 text-[14.5px] leading-relaxed font-light text-tinta-2">
                Eran páginas de primer nivel, al mismo rango que «Qué es CRAFT». Pasan a
                fichas con lugar, país y proveedor relacionado.
              </p>
              <ul className="mt-4 space-y-1.5">
                {(vista.historias as { titulo: string; idioma: string }[])
                  .filter((h) => h.idioma === "es")
                  .map((h) => (
                    <li key={h.titulo} className="text-[13.5px] font-light text-tinta-3">
                      {h.titulo}
                    </li>
                  ))}
              </ul>
            </article>

            <article className="border-t border-linea pt-4">
              <h3 className="font-display text-lg font-normal text-tinta">
                {r.article} artículos
              </h3>
              <p className="mt-2 text-[14.5px] leading-relaxed font-light text-tinta-2">
                Nueve de los once son anuncios de versiones del código. CRAFT no es un sitio
                de noticias: es el sitio de una norma.
              </p>
            </article>

            <article className="border-t border-linea pt-4">
              <h3 className="font-display text-lg font-normal text-tinta">{r.page} páginas</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed font-light text-tinta-2">
                Incluyen las nueve de la generación anterior, que siguen publicadas. Cuál se
                queda lo decide ARM: hace falta ver qué direcciones reciben visitas de verdad.
              </p>
            </article>
          </div>
        </section>

        {/* ── Qué es y qué no ── */}
        <section className="py-14">
          <Rotulo>Sobre esta vista</Rotulo>
          <h2 className="mt-5 max-w-2xl font-display text-2xl leading-snug font-light text-tinta text-balance">
            Esto es la organización del contenido, no el diseño del sitio
          </h2>
          <div className="mt-6 grid max-w-3xl gap-x-10 gap-y-6 sm:grid-cols-2">
            <p className="text-[14.5px] leading-relaxed font-light text-tinta-2">
              El manual de marca sigue pendiente, así que esta página usa el sistema visual
              del informe de avances. Cómo se ve CRAFT es una conversación aparte y viene con
              los prototipos.
            </p>
            <p className="text-[14.5px] leading-relaxed font-light text-tinta-2">
              Los datos salen del mismo archivo que se cargará en el gestor de contenidos
              cuando se abra la cuenta. No hay que rehacer nada: se importa con un comando y
              queda igual que aquí.
            </p>
          </div>
        </section>
      </div>

      <footer className="bg-carbon px-6 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-5xl flex-wrap items-baseline justify-between gap-y-4">
          <div>
            <p className="text-[15px] font-light text-arena">{meta.responsable}</p>
            <p className="rotulo mt-1.5 text-taupe">{meta.titulo}</p>
          </div>
          <Link href="/" className="rotulo text-arena/55 transition-colors hover:text-arena">
            ← Volver a los avances
          </Link>
        </div>
      </footer>
    </main>
  );
}
