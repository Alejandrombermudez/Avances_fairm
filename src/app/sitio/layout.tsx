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
 */

export const metadata = {
  title: {
    default: "CRAFT — propuesta",
    template: "%s | CRAFT",
  },
  robots: { index: false, follow: false },
};

export default function SitioLayout({ children }: { children: React.ReactNode }) {
  return <div className="sitio-craft">{children}</div>;
}
