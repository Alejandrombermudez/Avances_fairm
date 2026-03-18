"use client";

import dynamic from "next/dynamic";

// Leaflet uses window/document — must be client-only, no SSR
const MapContainer = dynamic(() => import("@/components/map/MapContainer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-[#1a1a2e]">
      <div className="text-center">
        <div className="mb-4 text-4xl">🗺️</div>
        <p className="text-white text-lg font-medium">Cargando mapa...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <MapContainer />
    </main>
  );
}
