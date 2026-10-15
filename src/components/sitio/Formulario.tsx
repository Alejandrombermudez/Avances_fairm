"use client";

/**
 * El formulario de contacto, con los cuatro campos del de hoy.
 *
 * Envía abriendo el programa de correo de quien escribe, con el destinatario,
 * el asunto y el mensaje ya puestos. No pasa por ningún servidor ni guarda
 * nada: hasta que ARM tenga un servicio de envío, es la única manera de que
 * el mensaje llegue sin que alguien tenga que ir a buscarlo a otra parte. Lo
 * dice debajo del botón, y deja el correo a la vista por si el programa no
 * se abre.
 */

import { useState, type FormEvent } from "react";

const CAMPO =
  "mt-1.5 block w-full rounded-md border border-linea bg-white px-3.5 py-2.5 text-[15px] font-light text-tinta outline-none transition-colors focus:border-cafe";

export default function Formulario({
  destinatario,
  asunto,
  boton,
}: {
  destinatario: string;
  asunto: string;
  boton: string;
}) {
  const [abierto, setAbierto] = useState(false);

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    const dato = (n: string) => String(datos.get(n) ?? "").trim();
    const firma = [`Nombre: ${dato("nombre")}`, `Correo: ${dato("correo")}`];
    if (dato("telefono")) firma.push(`Teléfono: ${dato("telefono")}`);
    const cuerpo = [dato("mensaje"), "", "—", ...firma].join("\n");
    const q = new URLSearchParams({ subject: asunto, body: cuerpo });
    /* URLSearchParams escribe los espacios como «+», y los programas de
       correo los dejan tal cual en el asunto. */
    window.location.href = `mailto:${destinatario}?${q.toString().replace(/\+/g, "%20")}`;
    setAbierto(true);
  }

  return (
    <form onSubmit={enviar} className="my-8 grid gap-4 sm:max-w-[560px]">
      <label className="block text-[13.5px] font-medium text-cafe">
        Correo <span aria-hidden="true">*</span>
        <input name="correo" type="email" required autoComplete="email" className={CAMPO} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-[13.5px] font-medium text-cafe">
          Nombre
          <input name="nombre" type="text" autoComplete="name" className={CAMPO} />
        </label>
        <label className="block text-[13.5px] font-medium text-cafe">
          Teléfono
          <input name="telefono" type="tel" autoComplete="tel" className={CAMPO} />
        </label>
      </div>
      <label className="block text-[13.5px] font-medium text-cafe">
        Mensaje <span aria-hidden="true">*</span>
        <textarea name="mensaje" required rows={5} className={`${CAMPO} resize-y`} />
      </label>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <button type="submit" className="boton">
          {boton}
        </button>
        <p className="text-[12.5px] leading-snug font-light text-suave" aria-live="polite">
          {abierto
            ? "Se abrió tu programa de correo con el mensaje listo. Si no se abrió, escribe a "
            : "Se abre tu programa de correo con el mensaje listo para "}
          <a href={`mailto:${destinatario}`} className="text-cafe underline underline-offset-2">
            {destinatario}
          </a>
          .
        </p>
      </div>
    </form>
  );
}
