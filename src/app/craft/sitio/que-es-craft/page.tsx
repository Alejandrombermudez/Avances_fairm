/**
 * Una página de contenido corriente, migrada tal cual.
 *
 * No tiene nada especial, y ese es el punto: el texto, los enlaces y las
 * imágenes salieron del sitio actual sin que nadie los reescribiera.
 */

import { pagina, temasDe } from "@/lib/craft";
import Texto from "@/components/craft/Texto";

export default function QueEsCraft() {
  const p = pagina("que-es-craft");
  const temas = p ? temasDe(p) : [];

  return (
    <main className="mx-auto max-w-3xl px-6 py-14 sm:px-10">
      <p className="rotulo" style={{ color: "var(--taupe-craft)" }}>
        Qué es CRAFT
      </p>
      <h1 className="mt-4 text-[2.4rem] leading-tight font-light">{p?.title}</h1>

      {temas.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="rotulo" style={{ color: "var(--verde)" }}>
            ↻ Temas asignados
          </span>
          {temas.map((t) => (
            <span
              key={t}
              className="rounded-full px-3 py-1 text-[12.5px]"
              style={{ background: "var(--arena)", color: "var(--cafe)" }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-9">
        <Texto bloques={p?.body} />
      </div>

      {p?.legacyPaths?.length ? (
        <p
          className="mt-12 border-t pt-5 text-[13px] font-light"
          style={{ borderColor: "var(--linea-craft)", color: "var(--taupe-craft)" }}
        >
          Dirección conservada: <span className="font-mono">{p.legacyPaths[0]}</span>
        </p>
      ) : null}
    </main>
  );
}
