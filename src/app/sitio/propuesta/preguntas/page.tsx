/**
 * Preguntas frecuentes, armadas con las fichas.
 *
 * Hoy son treinta acordeones dentro de una página de 66.594 caracteres. Como
 * fichas se pueden buscar, enlazar una por una y mostrar donde corresponda.
 *
 * Van en los tres bloques del sitio de hoy y en su orden: las generales sin
 * titular, luego las de mineros y mineras y luego las de las compañías.
 * Hasta el 15 de octubre de 2026 salían las treinta en una sola lista.
 */

import { preguntas } from "@/lib/sanity";
import Texto from "@/components/sitio/Texto";

export const revalidate = 3600;
export const metadata = { title: "Preguntas frecuentes" };

/* Los mismos de `GRUPOS_PREGUNTAS` en sanity/schemas/editorial.ts. El
   primero no lleva titular, como en craftmines.org. */
const GRUPOS: { valor: string; titulo: string | null }[] = [
  { valor: "general", titulo: null },
  { valor: "mineros", titulo: "Mineros y mineras" },
  { valor: "industria", titulo: "Compañías de la industria que se abastecen de la MAPE" },
];

export default async function Preguntas() {
  const faqs = await preguntas();
  const conocidos = new Set(GRUPOS.map((g) => g.valor));
  /* Una pregunta nueva sin grupo, o con uno que no está aquí, va con las
     generales: no se pierde. */
  const de = (valor: string) =>
    faqs.filter((f) => (conocidos.has(f.grupo ?? "") ? f.grupo : "general") === valor);

  return (
    <main className="mx-auto max-w-4xl px-6 py-14 sm:px-10">
      <p className="rotulo text-suave">Preguntas frecuentes</p>
      <h1 className="titular mt-4 text-[clamp(1.9rem,4vw,2.6rem)]">
        {faqs.length} preguntas sobre CRAFT
      </h1>

      {GRUPOS.map((g) => {
        const lista = de(g.valor);
        if (!lista.length) return null;
        return (
          <section key={g.valor} className="mt-10" data-revelar>
            {g.titulo && (
              <h2 className="mb-5 border-b border-linea pb-3 text-[1.25rem] leading-snug font-semibold text-cafe">
                {g.titulo}
              </h2>
            )}
            <div className="space-y-3">
              {lista.map((f) => (
                <details key={f._id} className="tarjeta px-7 py-5">
                  <summary className="cursor-pointer list-none text-[16px] leading-snug font-medium">
                    <span className="mr-3 font-semibold text-cafe">+</span>
                    {f.question}
                  </summary>
                  <div className="mt-4 pl-7 text-suave">
                    <Texto valor={f.answer} enPropuesta />
                  </div>
                </details>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
