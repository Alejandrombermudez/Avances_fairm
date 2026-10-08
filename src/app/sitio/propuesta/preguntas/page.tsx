/**
 * Preguntas frecuentes, armadas con las fichas.
 *
 * Hoy son treinta acordeones dentro de una página de 66.594 caracteres. Como
 * fichas se pueden buscar, enlazar una por una y mostrar donde corresponda.
 */

import { preguntas } from "@/lib/sanity";
import Texto from "@/components/sitio/Texto";

export const revalidate = 3600;
export const metadata = { title: "Preguntas frecuentes" };

export default async function Preguntas() {
  const faqs = await preguntas();

  return (
    <main className="mx-auto max-w-4xl px-6 py-14 sm:px-10">
      <p className="rotulo text-suave">Preguntas frecuentes</p>
      <h1 className="titular mt-4 text-[clamp(1.9rem,4vw,2.6rem)]">
        {faqs.length} preguntas sobre CRAFT
      </h1>

      <div className="mt-10 space-y-3">
        {faqs.map((f) => (
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
    </main>
  );
}
