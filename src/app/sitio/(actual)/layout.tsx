/**
 * El armazon, replicando el de craftmines.org.
 *
 * Cabecera cafe de 80px con el logo a la izquierda y el menu en blanco a 14px.
 * El pie sale de los ajustes del sitio en Sanity.
 */

import Image from "next/image";
import Link from "next/link";
import Conmutador from "@/components/sitio/Conmutador";
import { ajustes } from "@/lib/sanity";

export const metadata = { title: { default: "Craft Mines", template: "%s | Craft Mines" } };

const MENU = [
  { t: "Inicio", h: "/" },
  { t: "Qué es CRAFT", h: "/que-es-craft" },
  { t: "Gobernanza y Consultas Públicas", h: "/consultas-publicas" },
  { t: "Impacto", h: "/impacto" },
  { t: "Recursos", h: "/recursos" },
  { t: "Preguntas Frecuentes", h: "/preguntas-frecuentes" },
  { t: "Contacto", h: "/contacto" },
];

/** El armazon de la pagina tal como esta hoy. */
export default async function ActualLayout({ children }: { children: React.ReactNode }) {
  const a = await ajustes();

  return (
    <>
      <Conmutador activa="actual" />
        <header className="sticky top-0 z-50 bg-cafe">
          <div className="mx-auto flex max-w-[1180px] items-center gap-x-8 px-6 py-4">
            <Link href="/sitio" className="shrink-0">
              <Image src="/logo-craft.png" alt="CRAFT" width={133} height={208}
                className="h-14 w-auto" priority />
            </Link>
            <nav className="flex flex-1 flex-wrap items-center justify-end gap-x-6 gap-y-2">
              {MENU.map((m) => (
                <Link key={m.t} href={m.h}
                  className="text-[14px] font-semibold text-white transition-opacity hover:opacity-75">
                  {m.t}
                </Link>
              ))}
              <span className="text-[13px] font-semibold text-white/60">ES | EN</span>
            </nav>
          </div>
        </header>

        {children}

        <footer className="bg-cafe px-6 py-14">
          <div className="mx-auto grid max-w-[1180px] gap-10 sm:grid-cols-3">
            <div>
              <p className="text-[15px] font-semibold tracking-wide text-white">CONTACTO</p>
              <ul className="mt-4 space-y-1.5">
                {(a?.footerContacto ?? []).map((c) => (
                  <li key={c}>
                    <a href={`mailto:${c}`} className="text-[14px] font-light text-white/85 hover:text-white">
                      {c}
                    </a>
                  </li>
                ))}
              </ul>
              <a href="/sitio/contacto" className="boton boton-claro mt-5 text-[15px]">Escríbenos</a>
            </div>
            <div>
              <p className="text-[15px] font-semibold tracking-wide text-white">SÍGUENOS</p>
              <p className="mt-4 max-w-xs text-[14px] leading-relaxed font-light text-white/85">
                {a?.footerNota}
              </p>
              <ul className="mt-3 space-y-1">
                {(a?.footerEnlaces ?? []).map((e) => (
                  <li key={e._key}>
                    <a href={e.url} target="_blank" rel="noopener noreferrer"
                      className="text-[14px] font-light text-white/85 underline-offset-2 hover:underline">
                      {e.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[15px] font-semibold tracking-wide text-white">SUSCRÍBETE</p>
              <form className="mt-4 space-y-2.5" aria-label="Suscripción al boletín">
                <input type="text" placeholder="Nombre" disabled
                  className="w-full rounded border border-white/25 bg-white/10 px-3 py-2 text-[14px] text-white placeholder:text-white/50" />
                <input type="email" placeholder="Correo" disabled
                  className="w-full rounded border border-white/25 bg-white/10 px-3 py-2 text-[14px] text-white placeholder:text-white/50" />
                <button type="button" disabled className="boton boton-claro w-full text-[15px]">
                  Suscribirse
                </button>
              </form>
            </div>
          </div>
      </footer>
    </>
  );
}
