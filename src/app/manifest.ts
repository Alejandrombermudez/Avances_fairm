import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OpenMaps — Geovisor Offline",
    short_name: "OpenMaps",
    description:
      "Geovisor offline para trabajo de campo. Carga GeoJSON y MBTiles, visualiza tu ubicación GPS y descarga mapas base sin internet.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1a1a2e",
    theme_color: "#16213e",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["navigation", "utilities"],
  };
}
