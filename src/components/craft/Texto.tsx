/**
 * Dibuja los bloques de contenido.
 *
 * Es el equivalente de lo que hará el sitio real con el contenido que venga de
 * Sanity: los mismos bloques, la misma forma. Aquí se escribió a mano para no
 * añadir una dependencia solo por la demostración.
 */

import type { Bloque, MarkDef, Span } from "@/lib/craft";

function Trozo({ s, defs }: { s: Span; defs: MarkDef[] }) {
  let nodo: React.ReactNode = s.text;
  for (const m of s.marks ?? []) {
    if (m === "strong") nodo = <strong className="font-semibold">{nodo}</strong>;
    else if (m === "em") nodo = <em>{nodo}</em>;
    else {
      const def = defs.find((d) => d._key === m);
      if (def?.href) {
        nodo = (
          <a
            href={def.href}
            className="underline decoration-1 underline-offset-2 transition-colors hover:opacity-70"
            style={{ color: "var(--terracota)" }}
            target={def.href.startsWith("http") ? "_blank" : undefined}
            rel={def.href.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {nodo}
          </a>
        );
      }
    }
  }
  return <>{nodo}</>;
}

export default function Texto({ bloques }: { bloques?: Bloque[] }) {
  if (!bloques?.length) return null;

  /* Las viñetas seguidas se juntan en una sola lista. */
  const grupos: Bloque[][] = [];
  for (const b of bloques) {
    const esItem = b._type === "block" && b.listItem;
    const ult = grupos[grupos.length - 1];
    const ultEsItem = ult && ult[0]._type === "block" && ult[0].listItem;
    if (esItem && ultEsItem) ult.push(b);
    else grupos.push([b]);
  }

  return (
    <div className="space-y-4">
      {grupos.map((g, i) => {
        const p = g[0];

        if (p._type === "imagen") {
          return (
            <figure key={p._key}>
              <div
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-[13px]"
                style={{ background: "#fff", border: "1px dashed var(--linea-craft)", color: "var(--taupe-craft)" }}
              >
                <span className="rotulo">Imagen</span>
                <span className="truncate">{p.alt || "sin texto alternativo"}</span>
              </div>
            </figure>
          );
        }

        if (p._type === "block" && p.listItem) {
          return (
            <ul key={p._key} className="ml-5 list-disc space-y-1.5">
              {g.map((b) =>
                b._type === "block" ? (
                  <li key={b._key} className="text-[15px] leading-relaxed font-light">
                    {b.children.map((s) => (
                      <Trozo key={s._key} s={s} defs={b.markDefs ?? []} />
                    ))}
                  </li>
                ) : null,
              )}
            </ul>
          );
        }

        if (p._type !== "block") return null;
        const hijos = p.children.map((s) => <Trozo key={s._key} s={s} defs={p.markDefs ?? []} />);

        if (p.style === "h2")
          return (
            <h2 key={p._key} className="pt-4 text-[1.45rem] leading-snug font-medium">
              {hijos}
            </h2>
          );
        if (p.style === "h3")
          return (
            <h3 key={p._key} className="pt-3 text-[1.15rem] leading-snug font-medium">
              {hijos}
            </h3>
          );
        if (p.style === "blockquote")
          return (
            <blockquote
              key={p._key}
              className="border-l-2 pl-5 text-[15px] leading-relaxed font-light italic"
              style={{ borderColor: "var(--arena)", color: "var(--terracota)" }}
            >
              {hijos}
            </blockquote>
          );
        return (
          <p key={`${p._key}-${i}`} className="text-[15px] leading-relaxed font-light">
            {hijos}
          </p>
        );
      })}
    </div>
  );
}
