/**
 * La ficha completa de un documento.
 *
 * Es la plantilla que hoy no existe: un documento es un archivo adjunto cuyo
 * titulo, fecha e idioma viven dentro del nombre. Aqui cada dato esta en su
 * casilla y se puede enlazar, buscar y relacionar.
 */

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { documento, slugsDeDocumento, urlImagen, type Documento } from "@/lib/sanity";
import { campoDe, NOMBRE_TIPO, nombre } from "@/components/sitio/FichaDocumento";

export const revalidate = 3600;

const IDIOMA: Record<string, string> = {
  es: "Español", en: "English", fr: "Français", de: "Deutsch", pt: "Português",
};

const PUBLICO: Record<string, string> = {
  mineros: "Mineros", compradores: "Compradores", gobiernos: "Gobiernos",
  auditores: "Auditores", general: "Público general",
};

export async function generateStaticParams() {
  const slugs = await slugsDeDocumento();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = await documento(slug);
  return { title: d ? nombre(d) : "Documento" };
}

/** «2,4 MB». Solo se sabe de los archivos subidos al gestor. */
function tamano(bytes: number | null) {
  if (!bytes) return null;
  const mb = bytes / 1024 / 1024;
  if (mb >= 1) return `${mb.toFixed(1).replace(".", ",")} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} kB`;
}

function Dato({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="border-t border-linea py-3.5">
      <dt className="rotulo text-terracota">{etiqueta}</dt>
      <dd className="mt-1.5 text-[15px]">{children}</dd>
    </div>
  );
}

export default async function FichaCompleta({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = await documento(slug);
  if (!d) notFound();

  const { color, sobreClaro } = campoDe(d);
  const marca = (d.volumen ?? NOMBRE_TIPO[d.tipo ?? ""] ?? "Documento").replace("Vol. ", "Volumen ");
  /* Solo los que de verdad se pueden descargar: un boton que no baja nada
     es peor que no tener boton. */
  const archivos = (d.archivos ?? []).filter((f) => f.url);

  return (
    <main className="px-6 py-14">
      <div className="mx-auto max-w-[1240px]">
        <Link href="/sitio/propuesta/recursos" className="rotulo text-terracota">
          ← Recursos
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-[380px_1fr]">
          {/* El campo, en grande */}
          <div>
            {/* El ancho se acota cuando la ficha no cabe en dos columnas: con
                proporcion 3:4 y el ancho entero, el campo de color se comia
                la pantalla y empujaba todos los datos fuera de la vista. Se
                veia al abrir la ficha dentro del marco de la comparacion. */}
            <div
              className="relative aspect-[3/4] w-full max-w-[300px] overflow-hidden lg:max-w-none"
              style={{ borderRadius: 16, background: d.portada ? undefined : color }}
            >
              {d.portada ? (
                <Image src={urlImagen(d.portada).width(900).auto("format").url()} alt=""
                  fill sizes="380px" className="object-cover" />
              ) : (
                <>
                  <span className="titular absolute bottom-6 left-7 text-[clamp(2rem,6vw,3rem)] leading-none"
                    style={{ color: sobreClaro ? "var(--color-cafe)" : "#fff", opacity: sobreClaro ? .7 : .8 }}>
                    {marca}
                  </span>
                  <span className="rotulo absolute top-7 left-7"
                    style={{ color: sobreClaro ? "var(--color-cafe)" : "#fff", opacity: .8 }}>
                    {NOMBRE_TIPO[d.tipo ?? ""] ?? d.tipo}
                  </span>
                </>
              )}
            </div>

            {archivos.length > 0 && (
              <div className="mt-6">
                <p className="rotulo text-terracota">Descargar</p>
                <ul className="mt-3 space-y-2">
                  {archivos.map((f) => (
                    <li key={f._key}>
                      <a href={f.url as string} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 rounded-xl border border-linea bg-white px-5 py-3.5 transition-colors hover:border-cafe">
                        <span>
                          <span className="block text-[14.5px] font-bold">
                            {IDIOMA[f.lang] ?? f.lang}
                          </span>
                          {(f.formato || f.peso) && (
                            <span className="mt-0.5 block text-[12px] font-light text-suave">
                              {[f.formato?.toUpperCase(), tamano(f.peso)].filter(Boolean).join(" · ")}
                            </span>
                          )}
                        </span>
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-current text-cafe">
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                            <path d="M6.5 2v7m0 0L4 6.5M6.5 9 9 6.5M2.5 11h8" stroke="currentColor"
                              strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Los datos */}
          <div>
            <p className="rotulo text-terracota">
              {NOMBRE_TIPO[d.tipo ?? ""] ?? d.tipo}
              {d.deVersion ? ` · CRAFT ${d.deVersion.version}` : ""}
            </p>
            <h1 className="titular mt-4 max-w-3xl text-[clamp(1.9rem,4vw,2.6rem)]">
              {nombre(d)}
            </h1>
            {d.resumen && (
              <p className="mt-6 max-w-2xl text-[16.5px] leading-relaxed text-suave">{d.resumen}</p>
            )}

            <dl className="mt-10 grid max-w-2xl gap-x-10 sm:grid-cols-2">
              <Dato etiqueta="Año">{d.anio}</Dato>
              <Dato etiqueta="Volumen">{d.volumen}</Dato>
              <Dato etiqueta="Idiomas disponibles">
                {archivos.map((f) => IDIOMA[f.lang] ?? f.lang).join(" · ") || null}
              </Dato>
              <Dato etiqueta="Versión de la norma">
                {d.deVersion ? `CRAFT ${d.deVersion.version} · ${d.deVersion.estado}` : null}
              </Dato>
              <Dato etiqueta="Para quién">
                {(d.publicos ?? []).map((p) => PUBLICO[p] ?? p).join(" · ") || null}
              </Dato>
              <Dato etiqueta="Temas">{(d.temas ?? []).join(" · ") || null}</Dato>
            </dl>

            {!!(d.rutas ?? []).length && (
              <div className="mt-10 max-w-2xl rounded-xl bg-gris px-6 py-5">
                <p className="rotulo text-terracota">Direcciones conservadas</p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-suave">
                  Este documento sigue respondiendo en {(d.rutas ?? []).length}{" "}
                  {(d.rutas ?? []).length === 1 ? "dirección" : "direcciones"} anteriores. Lo que
                  esté citado desde fuera no se rompe.
                </p>
                <ul className="mt-3 space-y-1">
                  {(d.rutas ?? []).slice(0, 4).map((r) => (
                    <li key={r} className="truncate font-mono text-[12px] text-suave">{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
