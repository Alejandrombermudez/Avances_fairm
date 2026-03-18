"use client";

import { useEffect, useMemo } from "react";
import { Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";

interface GeolocationLayerProps {
  position: { lat: number; lng: number } | null;
  accuracy: number | null;
  mapRef: React.MutableRefObject<L.Map | null>;
}

function createGpsIcon(): L.DivIcon {
  return L.divIcon({
    html: `
      <div style="position:relative;width:20px;height:20px;">
        <div style="
          position:absolute;
          inset:-6px;
          border-radius:50%;
          background:rgba(59,130,246,0.25);
          animation:gpsPulse 1.5s ease-out infinite;
        "></div>
        <div style="
          position:absolute;
          inset:0;
          border-radius:50%;
          background:#3b82f6;
          border:2px solid white;
          box-shadow:0 0 4px rgba(0,0,0,0.4);
        "></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    className: "",
  });
}

export function GeolocationLayer({ position, accuracy, mapRef }: GeolocationLayerProps) {
  const map = useMap();

  // Store the Leaflet map instance so MapContainer can call flyTo
  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);

  const gpsIcon = useMemo(() => createGpsIcon(), []);

  if (!position) return null;

  return (
    <>
      <Marker
        position={[position.lat, position.lng]}
        icon={gpsIcon}
        interactive={false}
        zIndexOffset={1000}
      />
      {accuracy !== null && accuracy > 0 && (
        <Circle
          center={[position.lat, position.lng]}
          radius={accuracy}
          pathOptions={{
            color: "#3b82f6",
            fillColor: "#3b82f6",
            fillOpacity: 0.1,
            weight: 1,
          }}
        />
      )}
    </>
  );
}
