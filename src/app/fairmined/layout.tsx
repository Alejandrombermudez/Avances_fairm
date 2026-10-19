/**
 * Fairmined dentro de la página de avances.
 *
 * Primero una réplica: el sitio de hoy, con su texto, sus imágenes y su
 * aspecto, servido desde el gestor nuevo. Es la referencia para lo que venga
 * después —las fichas, el mapa nuevo, las mejoras—: si lo de hoy funciona, lo
 * que se sume aporta en vez de quitar.
 *
 * `.sitio-fairmined` aísla sus colores y su letra de los del informe y de los
 * de CRAFT.
 *
 * La letra de los títulos y del menú es Century Gothic, que es de pago: el
 * sitio de hoy la sirve desde la cuenta de Monotype de quien la contrató. Aquí
 * se usa la del equipo si la tiene instalada —Windows con Office la trae— y si
 * no, Questrial, la libre que más se le parece. Hace falta decidir con ARM si
 * se compra la licencia (docs/fairmined-diagnostico.md, 3.6).
 */

import { Questrial, Roboto } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import AvisoBorrador from "@/components/sitio/AvisoBorrador";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--fm-roboto",
  display: "swap",
});

const gotica = Questrial({
  subsets: ["latin"],
  weight: "400",
  variable: "--fm-gotica",
  display: "swap",
});

export const metadata = {
  title: { default: "Fairmined — réplica", template: "%s - Fairmined" },
  robots: { index: false, follow: false },
};

export default async function FairminedLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: enBorrador } = await draftMode();
  return (
    <div className={`sitio-fairmined ${roboto.variable} ${gotica.variable}`}>
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
