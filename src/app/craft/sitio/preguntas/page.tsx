/**
 * Preguntas frecuentes, armadas con las fichas.
 *
 * Hoy son treinta acordeones dentro de una página de 66.594 caracteres. Aquí
 * cada una es una ficha: se puede buscar, enlazar sola y mostrar donde
 * corresponda.
 */

import { traer } from "@/lib/craft";
import Texto from "@/components/craft/Texto";

export default function Preguntas() {
  const faqs = traer("faq", "es").sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <main className="mx-auto max-w-4xl px-6 py-14 sm:px-10">
      <p className="rotulo" style={{ color: "var(--taupe-craft)" }}>
        Preguntas frecuentes
      </p>
      <h1 className="mt-4 text-[2.4rem] leading-tight font-light">
        {faqs.length} preguntas sobre CRAFT
      </h1>
      <p
        className="mt-5 max-w-2xl text-[15.5px] leading-relaxed font-light"
        style={{ color: "var(--terracota)" }}
      >
        Cada una es una ficha independiente. La página se arma sola con ellas.
      </p>

      <div className="mt-10 space-y-3">
        {faqs.map((f) => (
          <details
            key={f._id}
            className="group rounded-xl px-6 py-4"
            style={{ background: "#fff", border: "1px solid var(--linea-craft)" }}
          >
            <summary className="cursor-pointer list-none text-[16px] leading-snug font-medium">
              <span className="mr-3" style={{ color: "var(--arena)" }}>
                +
              </span>
              {f.question}
            </summary>
            <div className="mt-4 pl-7" style={{ color: "var(--terracota)" }}>
              <Texto bloques={f.answer} />
            </div>
          </details>
        ))}
      </div>
    </main>
  );
}
