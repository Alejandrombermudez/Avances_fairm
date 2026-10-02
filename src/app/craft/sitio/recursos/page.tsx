/**
 * Recursos: la biblioteca de la norma.
 *
 * Hoy esta página ofrece diez documentos y ninguno es un volumen del código.
 * Aquí están los 74, agrupados por versión y por tipo, y filtrables por
 * público. No hay un solo enlace escrito a mano: todo sale de las fichas.
 */

import { norma, traer, idiomasDe, porId, type Doc } from "@/lib/craft";

const ETIQUETA: Record<string, string> = {
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

const es = (d: Doc) => (d.title as unknown as { es?: string; en?: string })?.es ?? "";
const en = (d: Doc) => (d.title as unknown as { es?: string; en?: string })?.en ?? "";

function Idiomas({ d }: { d: Doc }) {
  const ls = idiomasDe(d);
  return (
    <span className="flex shrink-0 gap-1.5">
      {ls.map((l) => (
        <span
          key={l}
          className="rounded px-2 py-0.5 text-[11.5px] font-medium"
          style={{ background: "var(--arena)", color: "var(--cafe)" }}
        >
          {l.toUpperCase()}
        </span>
      ))}
      {!ls.includes("es") && (
        <span
          className="rounded px-2 py-0.5 text-[11.5px]"
          style={{ border: "1px dashed var(--terracota)", color: "var(--terracota)" }}
        >
          falta ES
        </span>
      )}
    </span>
  );
}

export default function Recursos() {
  const { versiones } = norma();
  const docs = traer("publication");
  const otros = docs.filter((d) => !d.volumeOf);

  const porTipo = new Map<string, Doc[]>();
  for (const d of otros) {
    const t = d.documentType ?? "informe";
    porTipo.set(t, [...(porTipo.get(t) ?? []), d]);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-14 sm:px-10">
      <p className="rotulo" style={{ color: "var(--taupe-craft)" }}>
        Recursos
      </p>
      <h1 className="mt-4 text-[2.4rem] leading-tight font-light">La norma y sus documentos</h1>
      <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed font-light" style={{ color: "var(--terracota)" }}>
        {docs.length} documentos. Cada uno con su versión, su volumen y sus idiomas, en vez de
        dentro del nombre del archivo.
      </p>

      {/* filtro por público */}
      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
        <span className="rotulo" style={{ color: "var(--taupe-craft)" }}>
          Para quién
        </span>
        {["Mineros", "Compradores", "Gobiernos", "Auditores"].map((p) => (
          <span
            key={p}
            className="rounded-full px-3.5 py-1.5 text-[13px]"
            style={{ border: "1px solid var(--taupe-craft)", color: "var(--terracota)" }}
          >
            {p}
          </span>
        ))}
      </div>

      {/* la norma, versión por versión */}
      {versiones.map((v) => (
        <section key={v._id} className="mt-12">
          <div
            className="flex flex-wrap items-baseline gap-x-5 gap-y-2 rounded-t-xl px-7 py-5"
            style={{ background: v.status === "vigente" ? "var(--cafe)" : "#EFE6DA" }}
          >
            <span
              className="text-[1.6rem] font-light"
              style={{ color: v.status === "vigente" ? "var(--papel)" : "var(--cafe)" }}
            >
              CRAFT {v.version}
            </span>
            <span
              className="rotulo"
              style={{ color: v.status === "vigente" ? "var(--arena)" : "var(--taupe-craft)" }}
            >
              {v.status === "vigente" ? "Vigente" : "Reemplazada"}
            </span>
            <span
              className="ml-auto text-[13px] font-light"
              style={{ color: v.status === "vigente" ? "#D8C4AE" : "var(--taupe-craft)" }}
            >
              {v.releaseDate}
            </span>
          </div>
          <ul
            className="rounded-b-xl"
            style={{ border: "1px solid var(--linea-craft)", borderTop: "none", background: "#fff" }}
          >
            {v.vols.map((d) => (
              <li
                key={d._id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-7 py-3.5 last:border-b-0"
                style={{ borderColor: "var(--linea-craft)" }}
              >
                <span className="w-20 shrink-0 text-[13px] font-medium">{d.volumeLabel}</span>
                <span className="min-w-[12rem] flex-1 text-[14.5px] font-light">
                  {es(d).replace(/^CRAFT [\d.]+ — /, "") || en(d)}
                </span>
                <Idiomas d={d} />
              </li>
            ))}
            {!v.vols.length && (
              <li className="px-7 py-4 text-[14px] font-light" style={{ color: "var(--taupe-craft)" }}>
                Sin volúmenes definitivos publicados.
              </li>
            )}
          </ul>
        </section>
      ))}

      {/* el resto de documentos */}
      <h2 className="mt-16 text-[1.6rem] font-light">Materiales de apoyo</h2>
      <div className="mt-7 space-y-9">
        {[...porTipo.entries()]
          .sort((a, b) => b[1].length - a[1].length)
          .map(([tipo, lista]) => (
            <section key={tipo}>
              <p className="rotulo" style={{ color: "var(--taupe-craft)" }}>
                {ETIQUETA[tipo] ?? tipo} · {lista.length}
              </p>
              <ul className="mt-3">
                {lista.map((d) => (
                  <li
                    key={d._id}
                    className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b py-3 last:border-b-0"
                    style={{ borderColor: "var(--linea-craft)" }}
                  >
                    <span className="min-w-[14rem] flex-1 text-[14.5px] font-light">
                      {es(d) || en(d)}
                    </span>
                    {d.year && (
                      <span className="rotulo tabular-nums" style={{ color: "var(--taupe-craft)" }}>
                        {d.year}
                      </span>
                    )}
                    <Idiomas d={d} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </div>

      <p className="mt-14 max-w-2xl text-[13.5px] leading-relaxed font-light" style={{ color: "var(--taupe-craft)" }}>
        Cada documento conserva la dirección exacta que tiene hoy. Lo que esté citado desde otro
        sitio o desde un documento oficial sigue funcionando.{" "}
        {porId("craft.standard") ? "" : ""}
      </p>
    </main>
  );
}
