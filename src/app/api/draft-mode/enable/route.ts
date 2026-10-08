/**
 * La puerta de la vista previa.
 *
 * La abre la pestaña «Vista previa» del gestor. Cada vez que alguien entra,
 * el gestor guarda un secreto de un solo uso y lo manda aquí; esta ruta lo
 * comprueba contra el propio gestor antes de encender nada. Quien escriba
 * esta dirección a mano, sin ese secreto, recibe un 401.
 */

import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { cliente } from "@/lib/sanity";

export const { GET } = defineEnableDraftMode({
  client: cliente.withConfig({ token: process.env.SANITY_READ_TOKEN }),
});
