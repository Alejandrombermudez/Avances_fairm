import type { Metadata, Viewport } from "next";
import "./globals.css";

const APP_NAME = "OpenMaps";
const APP_TITLE = "OpenMaps — Geovisor Offline";
const APP_DESCRIPTION =
  "Geovisor offline para trabajo de campo. Carga GeoJSON y MBTiles, visualiza tu ubicación GPS y descarga mapas base sin internet.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: APP_TITLE,
  description: APP_DESCRIPTION,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_NAME,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#16213e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
