import type { Metadata, Viewport } from "next";
import { Josefin_Sans, Mulish, Poppins } from "next/font/google";
import "./globals.css";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-josefin",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-poppins",
  display: "swap",
});

/* Sustituta de Bw Modelica, la tipografía del manual de CRAFT, que es comercial
   y no está en la web. Solo se usa en la propuesta de CRAFT. */
const mulish = Mulish({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mulish",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Estado del proyecto — Migración web ARM",
  description:
    "Seguimiento del proyecto de migración del ecosistema web de la Alianza por la Minería Responsable: responsiblemines.org, fairmined.org y craftmines.org.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1e1a18",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${josefin.variable} ${poppins.variable} ${mulish.variable}`}>
      <body>{children}</body>
    </html>
  );
}
