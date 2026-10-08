/**
 * Todas las noticias.
 *
 * La portada ensena las ultimas; esta es la lista que crece. Hoy el sitio no
 * tiene ninguna: los articulos solo aparecen en la franja de la portada, y los
 * mas viejos no se alcanzan desde ningun sitio.
 */

import Link from "next/link";
import { articulos } from "@/lib/sanity";
import { ruta } from "@/lib/rutas";
import { fechaLarga } from "@/lib/fecha";
import { recortar } from "@/lib/texto";

export const revalidate = 3600;

export const metadata = { title: "Noticias y actividades" };

export default async function Noticias() {
  const art = await articulos();

  const porAno = art.reduce<Record<string, typeof art>>((acc, a) => {
    const ano = (a.publishedAt ?? "").slice(0, 4) || "Sin fecha";
    (acc[ano] ??= []).push(a);
    return acc;
  }, {});
  const anos = Object.keys(porAno).sort().reverse();

  return (
    <main className="px-6 py-14">
      <div className="mx-auto max-w-[900px]">
        <p className="rotulo text-terracota">
          {art.length} {art.length === 1 ? "publicación" : "publicaciones"}
        </p>
        <h1 className="titular mt-4 text-[clamp(1.9rem,4vw,2.6rem)]">Noticias y actividades</h1>

        {anos.map((ano) => (
          <section key={ano} className="mt-14">
            <h2 className="rotulo border-b border-linea pb-3 text-suave">{ano}</h2>
            <ul>
              {porAno[ano].map((a) => (
                <li key={a._id} className="border-b border-linea">
                  <Link
                    href={ruta(`/propuesta/noticias/${a.slug}`)}
                    className="block py-6 transition-colors hover:bg-gris"
                  >
                    <p className="text-[13px] font-light text-suave">
                      {[fechaLarga(a.publishedAt), ...(a.temas ?? [])].filter(Boolean).join(" · ")}
                    </p>
                    <h3 className="mt-1.5 max-w-3xl text-[19px] leading-snug font-semibold">
                      {a.title}
                    </h3>
                    {a.excerpt && (
                      <p className="mt-2 max-w-3xl text-[15px] leading-relaxed font-light text-suave">
                        {recortar(a.excerpt, 220)}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
