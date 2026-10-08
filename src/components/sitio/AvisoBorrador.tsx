"use client";

/**
 * El recordatorio de que se están viendo borradores.
 *
 * Dentro del gestor sobra —ahí ya se sabe— así que solo aparece cuando la
 * página está abierta por su cuenta, en una pestaña normal: es el caso en que
 * alguien podría creer que lo que ve ya está publicado.
 */

import { useSyncExternalStore } from "react";

const sinCambios = () => () => {};

export default function AvisoBorrador() {
  const enMarco = useSyncExternalStore(
    sinCambios,
    () => window.self !== window.top,
    () => true,
  );
  if (enMarco) return null;
  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed bottom-4 left-4 z-[60] rounded-full bg-cafe px-4 py-2 text-[12.5px] font-semibold text-white shadow-lg transition-opacity hover:opacity-85"
    >
      Estás viendo borradores · Salir
    </a>
  );
}
