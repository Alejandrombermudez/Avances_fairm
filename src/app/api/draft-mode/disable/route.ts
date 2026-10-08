/** Sale de la vista previa y vuelve al sitio como lo ve todo el mundo. */

import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(peticion: NextRequest) {
  (await draftMode()).disable();
  return NextResponse.redirect(new URL("/sitio/propuesta", peticion.url));
}
