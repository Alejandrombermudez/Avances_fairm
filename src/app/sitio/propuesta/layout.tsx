/**
 * El armazón de la propuesta.
 *
 * Es el suyo: barra café de altura fija, logo a la izquierda, menú a la
 * derecha. Probé con una barra flotante tomada de otro sitio y quedaba bien,
 * pero no quedaba suyo.
 *
 * Las ocho secciones del menú son las de hoy, con los mismos nombres y en el
 * mismo orden.
 */

import Link from "next/link";
import Conmutador from "@/components/sitio/Conmutador";
import Navegacion from "@/components/sitio/Navegacion";
import { ajustes } from "@/lib/sanity";
import { rutaPropuesta } from "@/lib/rutas";

export const metadata = {
  title: { default: "CRAFT · propuesta", template: "%s · propuesta | CRAFT" },
  robots: { index: false, follow: false },
};

const MENU = [
  { t: "Inicio", h: "/" },
  { t: "Qué es CRAFT", h: "/que-es-craft" },
  { t: "Gobernanza y Consultas Públicas", h: "/consultas-publicas" },
  { t: "Impacto", h: "/impacto" },
  { t: "Recursos", h: "/recursos" },
  { t: "Preguntas Frecuentes", h: "/propuesta/preguntas" },
  { t: "Contacto", h: "/contacto" },
];

export default async function PropuestaLayout({ children }: { children: React.ReactNode }) {
  const a = await ajustes();

  return (
    <div className="propuesta min-h-screen">
      <Conmutador activa="propuesta" />

      <Navegacion menu={MENU} inicio="/propuesta" enPropuesta />

      {children}

      <footer className="bg-cafe px-6 py-14">
        <div className="mx-auto grid max-w-[1180px] gap-10 sm:grid-cols-3">
          <div>
            <p className="rotulo text-white">Contacto</p>
            <ul className="mt-4 space-y-1.5">
              {(a?.footerContacto ?? []).map((c) => (
                <li key={c}>
                  <a href={`mailto:${c}`} className="text-[14px] text-white/85 hover:text-white">
                    {c}
                  </a>
                </li>
              ))}
            </ul>
            <a href={rutaPropuesta("/contacto")} className="boton boton-claro mt-5 text-[15px]">
              Escríbenos
            </a>
          </div>
          <div>
            <p className="rotulo text-white">Síguenos</p>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-white/85">
              {a?.footerNota}
            </p>
            <ul className="mt-3 space-y-1">
              {(a?.footerEnlaces ?? []).map((e) => (
                <li key={e._key}>
                  <a
                    href={e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] text-white/85 underline-offset-2 hover:underline"
                  >
                    {e.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="rotulo text-white">Suscríbete</p>
            <form className="mt-4 space-y-2.5" aria-label="Suscripción al boletín">
              <input
                type="text"
                placeholder="Nombre"
                disabled
                className="w-full rounded border border-white/25 bg-white/10 px-3 py-2 text-[14px] text-white placeholder:text-white/50"
              />
              <input
                type="email"
                placeholder="Correo"
                disabled
                className="w-full rounded border border-white/25 bg-white/10 px-3 py-2 text-[14px] text-white placeholder:text-white/50"
              />
              <button type="button" disabled className="boton boton-claro w-full text-[15px]">
                Suscribirse
              </button>
            </form>
          </div>
        </div>
      </footer>
    </div>
  );
}
