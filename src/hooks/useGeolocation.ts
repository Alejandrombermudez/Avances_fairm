import { useState, useRef, useEffect, useCallback } from "react";

export type GeolocationStatus = "idle" | "loading" | "active" | "error";

export interface GeolocationState {
  status: GeolocationStatus;
  position: { lat: number; lng: number } | null;
  accuracy: number | null;
  error: string | null;
}

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
};

function getErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case GeolocationPositionError.PERMISSION_DENIED:
      return "Acceso a ubicación denegado. Habilítalo en la configuración del navegador.";
    case GeolocationPositionError.POSITION_UNAVAILABLE:
      return "Ubicación no disponible. Verifica tu señal GPS.";
    case GeolocationPositionError.TIMEOUT:
      return "Tiempo de espera agotado. Intenta de nuevo.";
    default:
      return "Error al obtener la ubicación.";
  }
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    status: "idle",
    position: null,
    accuracy: null,
    error: null,
  });

  const watchIdRef = useRef<number | null>(null);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setState({ status: "idle", position: null, accuracy: null, error: null });
  }, []);

  const requestLocation = useCallback(() => {
    if (state.status === "loading") return;

    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setState({
        status: "error",
        position: null,
        accuracy: null,
        error: "Tu navegador no soporta geolocalización.",
      });
      return;
    }

    setState((prev) => ({ ...prev, status: "loading", error: null }));

    // Initial fix
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          status: "active",
          position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          accuracy: pos.coords.accuracy,
          error: null,
        });

        // Start continuous tracking after initial fix
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
        }
        watchIdRef.current = navigator.geolocation.watchPosition(
          (watchPos) => {
            setState({
              status: "active",
              position: { lat: watchPos.coords.latitude, lng: watchPos.coords.longitude },
              accuracy: watchPos.coords.accuracy,
              error: null,
            });
          },
          (watchErr) => {
            setState((prev) => ({
              ...prev,
              status: "error",
              error: getErrorMessage(watchErr),
            }));
          },
          GEO_OPTIONS
        );
      },
      (err) => {
        setState({
          status: "error",
          position: null,
          accuracy: null,
          error: getErrorMessage(err),
        });
      },
      GEO_OPTIONS
    );
  }, [state.status]);

  // Cleanup watcher on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return { ...state, requestLocation, stopTracking };
}
