/**
 * El armazón del sitio de CRAFT funcionando.
 *
 * El menú son las ocho secciones que el sitio tiene hoy, con los mismos
 * nombres: la propuesta no cambia la navegación.
 */

import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "CRAFT — demostración con el contenido migrado",
  robots: { index: false, follow: false },
};

const MENU = [
  { t: "Inicio", h: "/craft/sitio" },
  { t: "Qué es CRAFT", h: "/craft/sitio/que-es-craft" },
  { t: "Gobernanza y Consultas", h: null },
  { t: "Impacto", h: null },
  { t: "Recursos", h: "/craft/sitio/recursos" },
  { t: "Preguntas Frecuentes", h: "/craft/sitio/preguntas" },
  { t: "Contacto", h: null },
];

export default function SitioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="craft min-h-screen">
      {/* aviso: esto es una demostración, no el sitio en producción */}
      <div
        className="px-6 py-2.5 text-center text-[12.5px] font-light sm:px-10"
        style={{ background: "var(--arena)", color: "var(--cafe)" }}
      >
        Demostración · contenido real migrado de craftmines.org ·{" "}
        <Link href="/craft" className="underline underline-offset-2">
          volver al informe
        </Link>
      </div>

      <header style={{ background: "var(--cafe)" }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-4 px-6 py-5 sm:px-10">
          <Link href="/craft/sitio" className="shrink-0">
            <Image
              src="/craft/logo.png"
              alt="CRAFT"
              width={1850}
              height={2375}
              className="h-12 w-auto brightness-0 invert"
              priority
            />
          </Link>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {MENU.map((m) =>
              m.h ? (
                <Link
                  key={m.t}
                  href={m.h}
                  className="text-[13.5px] font-light transition-opacity hover:opacity-100"
                  style={{ color: "var(--papel)", opacity: 0.85 }}
                >
                  {m.t}
                </Link>
              ) : (
                <span
                  key={m.t}
                  className="text-[13.5px] font-light"
                  style={{ color: "#D8C4AE", opacity: 0.45 }}
                  title="Fuera del alcance de la demostración"
                >
                  {m.t}
                </span>
              ),
            )}
          </nav>
          <span
            className="ml-auto rounded-full px-3 py-1 text-[12px]"
            style={{ border: "1px solid rgba(254,208,134,.4)", color: "var(--arena)" }}
          >
            ES · EN
          </span>
        </div>
      </header>

      {children}

      <footer className="mt-20" style={{ background: "var(--cafe)" }}>
        <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
          <p className="text-[13px] font-light" style={{ color: "#D8C4AE" }}>
            CRAFT · Pasaporte a mercados formales · Una iniciativa de la Alianza por la Minería
            Responsable
          </p>
        </div>
      </footer>
    </div>
  );
}
