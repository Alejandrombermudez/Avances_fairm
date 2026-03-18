"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer as LeafletMapContainer, TileLayer, ZoomControl } from "react-leaflet";
import L from "leaflet";
import { useGeolocation } from "@/hooks/useGeolocation";
import { GeolocationLayer } from "./GeolocationControl";

// Fix Leaflet default icon paths when bundled with webpack/turbopack
function fixLeafletIcons() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// SVG icons for the locate button states
const IconGpsIdle = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
  </svg>
);

const IconGpsActive = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="3" />
    <path fill="none" stroke="currentColor" strokeWidth="2" d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const IconSpinner = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 2a10 10 0 1 0 10 10" style={{ animation: "spin 1s linear infinite", transformOrigin: "center" }} />
  </svg>
);

const IconWarning = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

interface LocateButtonProps {
  status: "idle" | "loading" | "active" | "error";
  error: string | null;
  onLocate: () => void;
}

function LocateButton({ status, error, onLocate }: LocateButtonProps) {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (status === "error" && error) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [status, error]);

  const bgColor =
    status === "active" ? "#22c55e"
    : status === "error"  ? "#ef4444"
    : "#16213e";

  const label =
    status === "loading" ? "Obteniendo ubicación..."
    : status === "active" ? "Centrar en mi ubicación"
    : status === "error"  ? "Reintentar ubicación"
    : "Mi ubicación";

  return (
    <div className="absolute bottom-24 right-2.5 z-[400] flex flex-col items-end gap-1">
      {showToast && error && (
        <div className="bg-[#16213e] text-white text-xs rounded-lg px-3 py-1.5 shadow-lg whitespace-nowrap max-w-[220px] text-right">
          {error}
        </div>
      )}
      <button
        onClick={status !== "loading" ? onLocate : undefined}
        disabled={status === "loading"}
        aria-label={label}
        title={label}
        className="flex items-center justify-center rounded-full shadow-lg transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
        style={{
          width: 44,
          height: 44,
          backgroundColor: bgColor,
          color: "white",
          border: "none",
          outline: "none",
        }}
      >
        {status === "loading" ? <IconSpinner />
        : status === "active"  ? <IconGpsActive />
        : status === "error"   ? <IconWarning />
        : <IconGpsIdle />}
      </button>
    </div>
  );
}

export default function MapContainer() {
  const mapRef = useRef<L.Map | null>(null);
  const hasFlownRef = useRef(false);
  const { status, position, accuracy, error, requestLocation } = useGeolocation();

  // Fix Leaflet icons on mount
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  // Fly to position on first GPS fix
  useEffect(() => {
    if (status === "active" && position && !hasFlownRef.current) {
      mapRef.current?.flyTo([position.lat, position.lng], 16, { animate: true, duration: 1.2 });
      hasFlownRef.current = true;
    }
    if (status === "idle") {
      hasFlownRef.current = false;
    }
  }, [status, position]);

  function handleLocate() {
    if (status === "active" && position) {
      mapRef.current?.flyTo([position.lat, position.lng], 16, { animate: true, duration: 1.2 });
    } else {
      requestLocation();
    }
  }

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <LeafletMapContainer
        center={[4.711, -74.0721]} // Colombia — Bogotá por defecto
        zoom={6}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer url={OSM_TILE_URL} attribution={OSM_ATTRIBUTION} maxZoom={19} />
        <ZoomControl position="bottomright" />
        <GeolocationLayer position={position} accuracy={accuracy} mapRef={mapRef} />
      </LeafletMapContainer>

      <LocateButton status={status} error={error} onLocate={handleLocate} />
    </div>
  );
}
