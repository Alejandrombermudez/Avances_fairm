import type { Metadata, Viewport } from "next";
import { Domine, Public_Sans } from "next/font/google";
import "./globals.css";

const domine = Domine({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-domine",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-public-sans",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${domine.variable} ${publicSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
