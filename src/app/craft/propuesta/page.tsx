/**
 * Propuesta de organización para craftmines.org.
 *
 * Deliberadamente conservadora: el menú no cambia y la portada conserva sus
 * mismos bloques. Lo que cambia es de dónde se alimenta cada uno.
 *
 * Se dibuja con la marca real de CRAFT, tomada del manual de imagen. Los
 * colores salen del arte del documento, no de los RGB impresos: el manual da
 * RGB 81 33 170 para el café principal, que es un morado; el relleno real de
 * la muestra es #4B1A0C.
 */

import Image from "next/image";
import Link from "next/link";
import vista from "@/data/craft-vista.json";

export const metadata = {
  title: "CRAFT, propuesta de organización — Migración web ARM",
  robots: { index: false, follow: false },
};

/* ── La paleta, con el papel que le da el manual ── */
const PALETA = [
  { hex: "#4B1A0C", nombre: "Café", papel: "Textos principales. El color del logo" },
  { hex: "#FED086", nombre: "Arena", papel: "Fondo para resaltar textos" },
  { hex: "#774340", nombre: "Terracota", papel: "Textos alternativos" },
  { hex: "#947961", nombre: "Taupe", papel: "Textos pequeños y subtítulos" },
  { hex: "#35632F", nombre: "Verde", papel: "Resaltar y contrastar" },
];

const CAMPANA = ["#E64776", "#F47534", "#FCAF17", "#00A450", "#159DAC", "#7DC356"];

/* ── El menú de hoy, tal cual ── */
const MENU = [
  { es: "Inicio", cambio: null },
  { es: "Qué es CRAFT", cambio: null },
  { es: "Gobernanza y Consultas Públicas", cambio: null },
  { es: "CRAFT Upstream Assurance Scheme", cambio: "Hoy solo aparece en inglés" },
  { es: "Impacto", cambio: null },
  { es: "Recursos", cambio: "Cambia por dentro" },
  { es: "Preguntas Frecuentes", cambio: null },
  { es: "Contacto", cambio: null },
];

/* ── Dónde viven hoy los documentos ── */
const DISPERSION = [
  { pagina: "Consultas Públicas", docs: 32, alto: "21.251 px" },
  { pagina: "Qué es CRAFT", docs: 22, alto: "—" },
  { pagina: "Revisión del Código", docs: 18, alto: "—" },
  { pagina: "Recursos", docs: 10, alto: "4.709 px" },
  { pagina: "Consulta CRAFT v.1", docs: 7, alto: "—" },
  { pagina: "Portada", docs: 1, alto: "64.887 px" },
];

/* ── Los bloques de la portada, que no se tocan ── */
const PORTADA = [
  {
    bloque: "¿Por qué aplicar CRAFT?",
    hoy: "Texto escrito a mano en la página",
    nuevo: "Igual. Sigue siendo texto",
    cambia: false,
  },
  {
    bloque: "Descarga el CRAFT",
    hoy: "Un solo enlace, al PDF completo en inglés",
    nuevo: "La versión vigente con sus volúmenes e idiomas, desde la ficha de la norma",
    cambia: true,
  },
  {
    bloque: "¿Quiénes están aplicando CRAFT?",
    hoy: "Seis páginas sueltas de primer nivel",
    nuevo: "Seis fichas de historia, con lugar y país",
    cambia: true,
  },
  {
    bloque: "¿Cómo se está creando CRAFT?",
    hoy: "La cronología, escrita cuatro veces en tres programas",
    nuevo: "Los 22 hitos, en un solo sitio",
    cambia: true,
  },
  {
    bloque: "Noticias y actividades",
    hoy: "Las entradas del blog",
    nuevo: "Igual",
    cambia: false,
  },
];

function Rotulo({ children, color = "var(--taupe-craft)" }: { children: React.ReactNode; color?: string }) {
  return (
    <p className="rotulo" style={{ color }}>
      {children}
    </p>
  );
}

export default function Propuesta() {
  const vigente = vista.norma.versiones.find((v) => v.estado === "vigente");
  const anteriores = vista.norma.versiones.filter((v) => v.estado !== "vigente");

  return (
    <main className="craft">
      {/* ── Portada ── */}
      <header className="px-6 pt-10 pb-16 sm:px-10 lg:px-16" style={{ background: "var(--cafe)" }}>
        <div className="mx-auto max-w-5xl">
          <Link
            href="/craft"
            className="rotulo transition-opacity hover:opacity-100"
            style={{ color: "var(--arena)", opacity: 0.65 }}
          >
            ← Volver
          </Link>

          <div className="mt-14 flex flex-wrap items-end gap-x-12 gap-y-8">
            <Image
              src="/craft/logo.png"
              alt="CRAFT — Pasaporte a mercados formales"
              width={1850}
              height={2375}
              className="h-[132px] w-auto brightness-0 invert"
              priority
            />
            <div className="min-w-[18rem] flex-1">
              <p className="rotulo" style={{ color: "var(--arena)" }}>
                Propuesta de organización
              </p>
              <h1
                className="mt-4 text-[2.5rem] leading-[1.08] font-light text-balance sm:text-[3rem]"
                style={{ color: "var(--papel)" }}
              >
                La misma página,
                <br />
                mejor organizada
              </h1>
            </div>
          </div>

          <p
            className="mt-10 max-w-xl text-[15.5px] leading-relaxed font-light"
            style={{ color: "#E8D9C6" }}
          >
            El menú no cambia. La portada conserva sus mismos cinco bloques. Lo que cambia
            es de dónde se alimenta cada uno, y dónde está lo que hoy hay que buscar.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-16">
        {/* ── La marca ── */}
        <section className="border-b py-14" style={{ borderColor: "var(--linea-craft)" }}>
          <Rotulo>La marca, aplicada</Rotulo>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed font-light" style={{ color: "var(--terracota)" }}>
            Todo lo de esta página usa los colores y la tipografía del manual de imagen.
            Hasta ahora el sitio no los aplicaba.
          </p>

          <div className="mt-9 grid gap-5 sm:grid-cols-5">
            {PALETA.map((c) => (
              <div key={c.hex}>
                <div
                  className="h-20 rounded-lg"
                  style={{ background: c.hex, border: "1px solid rgba(75,26,12,.12)" }}
                />
                <p className="mt-2.5 text-[14px] font-medium">{c.nombre}</p>
                <p className="font-mono text-[11.5px]" style={{ color: "var(--taupe-craft)" }}>
                  {c.hex}
                </p>
                <p className="mt-1 text-[12px] leading-snug font-light" style={{ color: "var(--terracota)" }}>
                  {c.papel}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Rotulo>Secundarios, para campañas</Rotulo>
            <div className="flex gap-2">
              {CAMPANA.map((c) => (
                <span
                  key={c}
                  className="size-7 rounded-full"
                  style={{ background: c, border: "1px solid rgba(75,26,12,.12)" }}
                  title={c}
                />
              ))}
            </div>
          </div>

          <div
            className="mt-10 rounded-xl px-6 py-5"
            style={{ background: "#fff", border: "1px solid var(--linea-craft)", borderLeft: "3px solid var(--arena)" }}
          >
            <h3 className="text-[19px] font-medium">Dos cosas que hay que decidir sobre la marca</h3>
            <p className="mt-3 max-w-[62ch] text-[14.5px] leading-relaxed font-light" style={{ color: "var(--terracota)" }}>
              <b className="font-semibold">La tipografía.</b> El manual pide Bw Modelica, que es
              comercial y no está disponible para web. O se compra la licencia web, o se usa una
              sustituta. Esta página está escrita en Mulish, que es gratuita y se le parece
              bastante. Es una decisión de ARM.
            </p>
            <p className="mt-3 max-w-[62ch] text-[14.5px] leading-relaxed font-light" style={{ color: "var(--terracota)" }}>
              <b className="font-semibold">Los códigos de color del manual no coinciden con el arte.</b>{" "}
              El manual imprime <span className="font-mono text-[13px]">RGB 81 33 170</span> para el
              café principal, que es un morado. El relleno real de la muestra es{" "}
              <span className="font-mono text-[13px]">#4B1A0C</span>. Usamos el del arte, que es el
              que se ve en el logo, pero conviene corregirlo en el manual.
            </p>
          </div>
        </section>

        {/* ── El menú ── */}
        <section className="border-b py-14" style={{ borderColor: "var(--linea-craft)" }}>
          <Rotulo>El menú</Rotulo>
          <h2 className="mt-4 text-[1.7rem] leading-snug font-light">No cambia</h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed font-light" style={{ color: "var(--terracota)" }}>
            Las ocho secciones se quedan, con los mismos nombres y en el mismo orden. Quien ya
            conoce el sitio no tiene que reaprender nada.
          </p>

          <ul className="mt-8 space-y-0">
            {MENU.map((m) => (
              <li
                key={m.es}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b py-3.5 last:border-b-0"
                style={{ borderColor: "var(--linea-craft)" }}
              >
                <span className="flex-1 text-[15px]">{m.es}</span>
                {m.cambio ? (
                  <span
                    className="rounded-full px-3 py-1 text-[12px]"
                    style={{ background: "var(--arena)", color: "var(--cafe)" }}
                  >
                    {m.cambio}
                  </span>
                ) : (
                  <span className="rotulo" style={{ color: "var(--taupe-craft)" }}>
                    Igual
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Dónde están los documentos ── */}
        <section className="border-b py-14" style={{ borderColor: "var(--linea-craft)" }}>
          <Rotulo>El problema de fondo</Rotulo>
          <h2 className="mt-4 max-w-2xl text-[1.7rem] leading-snug font-light text-balance">
            Los documentos están donde nadie los busca
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed font-light" style={{ color: "var(--terracota)" }}>
            CRAFT es una norma, y la norma son sus documentos. Pero la página de{" "}
            <b className="font-semibold">Recursos</b> —el sitio donde cualquiera iría a buscarlos—
            ofrece diez. La mayoría están dentro de páginas de gobernanza de veinte mil píxeles
            de alto.
          </p>

          <div className="mt-9">
            {DISPERSION.map((d) => (
              <div
                key={d.pagina}
                className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b py-3.5"
                style={{ borderColor: "var(--linea-craft)" }}
              >
                <span className="w-52 shrink-0 text-[14.5px]">{d.pagina}</span>
                <span className="flex min-w-[8rem] flex-1 items-center gap-3">
                  <span
                    className="h-[9px] rounded-full"
                    style={{
                      width: `${(d.docs / 32) * 100}%`,
                      background: d.pagina === "Recursos" ? "var(--arena)" : "var(--taupe-craft)",
                    }}
                  />
                  <span className="text-[13.5px] tabular-nums" style={{ color: "var(--terracota)" }}>
                    {d.docs}
                  </span>
                </span>
                <span className="rotulo shrink-0 tabular-nums" style={{ color: "var(--taupe-craft)" }}>
                  {d.alto}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-6 max-w-2xl text-[14px] leading-relaxed font-light" style={{ color: "var(--taupe-craft)" }}>
            La portada mide 64.887 píxeles de alto y enlaza un solo documento: el código completo
            en inglés. Los volúmenes en español hay que ir a buscarlos a Consultas Públicas.
          </p>
        </section>

        {/* ── La portada ── */}
        <section className="border-b py-14" style={{ borderColor: "var(--linea-craft)" }}>
          <Rotulo>La portada</Rotulo>
          <h2 className="mt-4 text-[1.7rem] leading-snug font-light">Los mismos cinco bloques</h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed font-light" style={{ color: "var(--terracota)" }}>
            La estructura actual ya es la correcta: responde las cuatro preguntas que un sitio de
            norma tiene que responder. No hay que reordenarla. Cambia de dónde saca cada bloque su
            contenido.
          </p>

          <div className="mt-9 space-y-0">
            {PORTADA.map((p) => (
              <div
                key={p.bloque}
                className="grid gap-x-6 gap-y-2 border-b py-5 sm:grid-cols-[minmax(0,15rem)_1fr_1fr]"
                style={{ borderColor: "var(--linea-craft)" }}
              >
                <h3 className="text-[15px] font-medium">{p.bloque}</h3>
                <p className="text-[14px] leading-relaxed font-light" style={{ color: "var(--taupe-craft)" }}>
                  <span className="rotulo mb-1 block">Hoy</span>
                  {p.hoy}
                </p>
                <p
                  className="text-[14px] leading-relaxed font-light"
                  style={{ color: p.cambia ? "var(--cafe)" : "var(--taupe-craft)" }}
                >
                  <span
                    className="rotulo mb-1 block"
                    style={{ color: p.cambia ? "var(--verde)" : "var(--taupe-craft)" }}
                  >
                    {p.cambia ? "Se arma solo" : "Igual"}
                  </span>
                  {p.nuevo}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Recursos, el mockup ── */}
        <section className="border-b py-14" style={{ borderColor: "var(--linea-craft)" }}>
          <Rotulo>El único cambio grande</Rotulo>
          <h2 className="mt-4 text-[1.7rem] leading-snug font-light">Recursos</h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed font-light" style={{ color: "var(--terracota)" }}>
            Pasa de ser una lista de seis materiales a ser la biblioteca de la norma. Así se vería,
            con el contenido real ya migrado.
          </p>

          <div
            className="mt-9 overflow-hidden rounded-xl"
            style={{ border: "1px solid var(--linea-craft)", background: "#fff" }}
          >
            {/* cabecera del mockup */}
            <div className="px-7 py-7" style={{ background: "var(--cafe)" }}>
              <p className="rotulo" style={{ color: "var(--arena)" }}>
                Versión vigente
              </p>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-2">
                <h3 className="text-[2rem] leading-none font-light" style={{ color: "var(--papel)" }}>
                  CRAFT {vigente?.version}
                </h3>
                <span className="text-[13.5px] font-light" style={{ color: "#D8C4AE" }}>
                  {vigente?.fecha}
                </span>
                <span
                  className="ml-auto rounded-full px-3.5 py-1.5 text-[12.5px] font-medium"
                  style={{ background: "var(--arena)", color: "var(--cafe)" }}
                >
                  Descargar completo
                </span>
              </div>
            </div>

            {/* volúmenes */}
            <div className="px-7 py-6">
              <p className="rotulo" style={{ color: "var(--taupe-craft)" }}>
                Volúmenes
              </p>
              <ul className="mt-4 space-y-0">
                {(vigente?.volumenes ?? [])
                  .filter((v) => v.etiqueta !== "Completo")
                  .map((v, i) => (
                    <li
                      key={i}
                      className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b py-3 last:border-b-0"
                      style={{ borderColor: "var(--linea-craft)" }}
                    >
                      <span className="w-16 shrink-0 text-[13px] font-medium">{v.etiqueta}</span>
                      <span className="min-w-[12rem] flex-1 text-[14.5px] font-light">
                        {v.titulo.replace(/^CRAFT [\d.]+ — /, "")}
                      </span>
                      <span className="flex shrink-0 gap-1.5">
                        {(v.idiomas as string[]).map((l) => (
                          <span
                            key={l}
                            className="rounded px-2 py-0.5 text-[11.5px] font-medium"
                            style={{ background: "var(--arena)", color: "var(--cafe)" }}
                          >
                            {l.toUpperCase()}
                          </span>
                        ))}
                        {!(v.idiomas as string[]).includes("es") && (
                          <span
                            className="rounded px-2 py-0.5 text-[11.5px]"
                            style={{ border: "1px dashed var(--terracota)", color: "var(--terracota)" }}
                          >
                            falta ES
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* filtros y versiones anteriores */}
            <div
              className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t px-7 py-5"
              style={{ borderColor: "var(--linea-craft)", background: "var(--papel)" }}
            >
              <span className="rotulo" style={{ color: "var(--taupe-craft)" }}>
                Para quién
              </span>
              {["Mineros", "Compradores", "Gobiernos", "Auditores"].map((p) => (
                <span
                  key={p}
                  className="rounded-full px-3 py-1 text-[12.5px]"
                  style={{ border: "1px solid var(--taupe-craft)", color: "var(--terracota)" }}
                >
                  {p}
                </span>
              ))}
            </div>
            <div
              className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t px-7 py-5"
              style={{ borderColor: "var(--linea-craft)" }}
            >
              <span className="rotulo" style={{ color: "var(--taupe-craft)" }}>
                Versiones anteriores
              </span>
              {anteriores.map((v) => (
                <span key={v.version} className="text-[13.5px] font-light" style={{ color: "var(--terracota)" }}>
                  CRAFT {v.version} · {v.fecha?.slice(0, 4)}
                </span>
              ))}
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-[13.5px] leading-relaxed font-light" style={{ color: "var(--taupe-craft)" }}>
            Los volúmenes, los idiomas y las fechas salen del contenido ya migrado. El filtro «para
            quién» usa los tres públicos que ARM ya definió al titular sus folletos:
            CRAFT-para-mineros, CRAFT-for-buyers y CRAFT-for-gov.
          </p>
        </section>

        {/* ── Lo que no cambia ── */}
        <section className="border-b py-14" style={{ borderColor: "var(--linea-craft)" }}>
          <Rotulo color="var(--verde)">Lo que no cambia</Rotulo>
          <div className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {[
              ["El menú", "Las mismas ocho secciones, mismos nombres, mismo orden."],
              ["Los textos", "«Qué es CRAFT», «Impacto», «Gobernanza» se migran tal cual. Nadie tiene que reescribir nada."],
              ["Las direcciones", "Cada documento conserva su enlace exacto. Lo que está citado desde fuera sigue funcionando."],
              ["Las fotos", "Las mismas imágenes, en la misma ruta."],
              ["Los dos idiomas", "Español e inglés, como hoy. El portugués de los documentos se ofrece sin traducir el sitio."],
              ["El tono", "Esto es una reorganización, no un relanzamiento. Quien entre va a reconocer el sitio."],
            ].map(([t, d]) => (
              <article key={t} className="border-t pt-4" style={{ borderColor: "var(--linea-craft)" }}>
                <h3 className="text-[16px] font-medium">{t}</h3>
                <p className="mt-2 text-[14px] leading-relaxed font-light" style={{ color: "var(--terracota)" }}>
                  {d}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Decisiones ── */}
        <section className="py-14">
          <Rotulo>Lo que decide ARM</Rotulo>
          <ol className="mt-8 space-y-5">
            {[
              "La tipografía: licencia web de Bw Modelica, o sustituta gratuita.",
              "Si CRAFT 2.1 se publica en español. Hoy la versión vigente solo está en inglés y portugués; en español está la candidata de 2023.",
              "Cuál de las dos portadas se queda. Hay dos publicadas en cada idioma desde hace años.",
              "Si «CRAFT Upstream Assurance Scheme» entra también al menú en español, donde hoy no está.",
              "La lista de temas, que es común a los tres sitios.",
            ].map((t, i) => (
              <li key={i} className="flex gap-4">
                <span
                  className="mt-[2px] flex size-6 shrink-0 items-center justify-center rounded-full text-[12px] font-medium tabular-nums"
                  style={{ background: "var(--arena)", color: "var(--cafe)" }}
                >
                  {i + 1}
                </span>
                <span className="text-[15px] leading-relaxed font-light" style={{ color: "var(--terracota)" }}>
                  {t}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <footer className="px-6 py-10 sm:px-10 lg:px-16" style={{ background: "var(--cafe)" }}>
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-y-4">
          <p className="text-[13.5px] font-light" style={{ color: "#D8C4AE" }}>
            Propuesta de organización · craftmines.org
          </p>
          <Link href="/craft" className="rotulo" style={{ color: "var(--arena)" }}>
            ← Volver a CRAFT reorganizado
          </Link>
        </div>
      </footer>
    </main>
  );
}
