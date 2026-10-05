/**
 * Recursos: la biblioteca de la norma.
 *
 * Hoy esta página ofrece diez documentos y ninguno es un volumen del código.
 * Aquí están los 74, en fichas que muestran de un vistazo lo que hoy hay que
 * deducir del nombre del archivo: qué versión, qué volumen, qué idiomas.
 */

import Link from "next/link";
import { norma, documentosSueltos, borradores, type Documento } from "@/lib/sanity";
import FichaDocumento, { NOMBRE_TIPO } from "@/components/sitio/FichaDocumento";

export const revalidate = 3600;
export const metadata = { title: "Recursos" };

const GRUPO: Record<string, string> = {
  folleto: "Folletos e infografías",
  plantilla: "Plantillas de informe",
  acta: "Actas del Comité",
  tdr: "Términos de referencia",
  sintesis: "Síntesis de consultas",
  comunicado: "Comunicados",
  informe: "Informes",
  herramienta: "Herramientas",
  guia: "Guías",
  volumen: "Volúmenes sueltos",
};

function Rejilla({ docs }: { docs: Documento[] }) {
  return (
    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {docs.map((d) => (
        <FichaDocumento key={d._id} d={d} />
      ))}
    </div>
  );
}

export default async function Recursos() {
  const [n, sueltos, previos] = await Promise.all([
    norma(),
    documentosSueltos(),
    borradores(),
  ]);

  const porTipo = new Map<string, Documento[]>();
  for (const d of sueltos) {
    const t = d.tipo ?? "informe";
    porTipo.set(t, [...(porTipo.get(t) ?? []), d]);
  }

  const vigente = n?.versiones.find((v) => v.estado === "vigente");
  const anteriores = n?.versiones.filter((v) => v.estado !== "vigente") ?? [];
  const total =
    (n?.versiones ?? []).reduce((s, v) => s + (v.volumenes?.length ?? 0), 0) + sueltos.length;

  return (
    <main>
      {/* ── Encabezado ── */}
      <section className="bg-cafe px-6 pt-24 pb-20">
        <div className="mx-auto max-w-[1240px]">
          <p className="rotulo text-arena">Recursos</p>
          <h1 className="titular mt-5 max-w-3xl text-[clamp(2rem,5vw,3.2rem)] text-white">
            La norma y sus documentos
          </h1>
          <p className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-white/75">
            {total} documentos, cada uno con su versión, su volumen y sus idiomas. Hasta ahora todo
            eso vivía dentro del nombre del archivo.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-3">
            <span className="rotulo text-arena">Para quién</span>
            {["Mineros", "Compradores", "Gobiernos", "Auditores"].map((p) => (
              <span
                key={p}
                className="rounded-full border border-white/30 px-4 py-2 text-[13px] font-bold text-white/85"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1240px] px-6">
        {/* ── La versión vigente ── */}
        {vigente && (
          <section className="py-20">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <span className="rounded-full bg-arena px-3.5 py-1.5 text-[11px] font-extrabold tracking-wider text-cafe uppercase">
                  Vigente
                </span>
                <h2 className="titular mt-4 text-[clamp(1.8rem,4vw,2.6rem)]">
                  CRAFT {vigente.version}
                </h2>
              </div>
              <p className="text-[14.5px] text-suave">Publicada el {vigente.fecha}</p>
            </div>
            <div className="mt-12">
              <Rejilla docs={vigente.volumenes ?? []} />
            </div>
          </section>
        )}

        {/* ── Versiones anteriores ── */}
        {anteriores.map((v) => (
          <section key={v._id} className="border-t border-linea py-20">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <span className="rotulo text-suave">Reemplazada</span>
                <h2 className="titular mt-3 text-[clamp(1.5rem,3.4vw,2.1rem)] text-suave">
                  CRAFT {v.version}
                </h2>
              </div>
              <p className="text-[14.5px] text-suave">{v.fecha}</p>
            </div>
            <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-suave">
              Se conserva accesible. Quien citó esta versión en un informe sigue pudiendo llegar a
              ella.
            </p>
            <div className="mt-10">
              {v.volumenes?.length ? (
                <Rejilla docs={v.volumenes} />
              ) : (
                <p className="text-[14.5px] text-suave">Sin volúmenes definitivos publicados.</p>
              )}
            </div>
          </section>
        ))}

        {/* ── Borradores y consultas ── */}
        {previos.length > 0 && (
          <section className="border-t border-linea py-20">
            <h2 className="titular text-[clamp(1.8rem,4vw,2.6rem)]">
              Borradores y consultas
            </h2>
            <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-suave">
              Los textos que se sometieron a consulta pública antes de aprobarse. No son la
              norma vigente, pero son la prueba de cómo se construyó: {previos.length} documentos
              que hasta ahora no estaban enlazados desde ninguna página.
            </p>
            <div className="mt-12">
              <Rejilla docs={previos} />
            </div>
          </section>
        )}

        {/* ── Materiales de apoyo ── */}
        <section className="border-t border-linea py-20">
          <h2 className="titular text-[clamp(1.8rem,4vw,2.6rem)]">Materiales de apoyo</h2>
          <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-suave">
            Folletos, plantillas, actas del comité y todo lo que acompaña a la norma.
          </p>

          <div className="mt-14 space-y-16">
            {[...porTipo.entries()]
              .sort((a, b) => b[1].length - a[1].length)
              .map(([tipo, lista]) => (
                <section key={tipo}>
                  <div className="flex items-baseline gap-4">
                    <h3 className="text-[19px] font-bold">
                      {GRUPO[tipo] ?? NOMBRE_TIPO[tipo] ?? tipo}
                    </h3>
                    <span className="text-[14px] text-suave">{lista.length}</span>
                  </div>
                  <div className="mt-7">
                    <Rejilla docs={lista} />
                  </div>
                </section>
              ))}
          </div>
        </section>

        <p className="border-t border-linea py-12 text-[14px] leading-relaxed text-suave">
          Cada documento conserva la dirección exacta que tiene hoy.{" "}
          <Link href="/sitio/propuesta" className="underline underline-offset-2">
            Volver a la portada
          </Link>
        </p>
      </div>
    </main>
  );
}
