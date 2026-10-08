/**
 * El sitio de CRAFT, dentro de la página de avances.
 *
 * Vive aquí a propósito mientras sea una propuesta: un solo despliegue, una
 * sola dirección que enviar, nada que configurar dos veces. El día que pase a
 * las cuentas de ARM sale de aquí y se lleva el dominio craftmines.org.
 *
 * `.sitio-craft` aísla sus colores y su tipografía de los del informe. Las dos
 * cosas comparten nombres de token —tinta, línea, arena— con valores
 * distintos, y sin este ámbito se pisarían.
 *
 * Cuando quien mira entró desde la vista previa del gestor, se añade lo que
 * hace posible editar mirando: los recuadros sobre cada texto y el aviso de
 * que son borradores. Para el resto del mundo no se carga nada de eso.
 */

import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import AvisoBorrador from "@/components/sitio/AvisoBorrador";

export const metadata = {
  title: {
    default: "CRAFT — propuesta",
    template: "%s | CRAFT",
  },
  robots: { index: false, follow: false },
};

export default async function SitioLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: enBorrador } = await draftMode();
  return (
    <div className="sitio-craft">
      {children}
      {enBorrador && (
        <>
          <VisualEditing />
          <AvisoBorrador />
        </>
      )}
    </div>
  );
}
