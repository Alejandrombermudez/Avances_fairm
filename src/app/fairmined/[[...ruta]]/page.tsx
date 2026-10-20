/**
 * Cualquier dirección de fairmined.org, en la réplica.
 *
 * /fairmined/es/donde-comprar-fairmined es la página que hoy vive en
 * fairmined.org/es/donde-comprar-fairmined, y así con las 207 páginas y las
 * 387 noticias de los cuatro idiomas: se busca la ficha que tenía esa
 * dirección y se dibuja con el armazón del sitio de hoy.
 *
 * Tres páginas no se dibujan solo con su texto, porque WordPress las armaba
 * al vuelo:
 *   - la de noticias, que lista las del idioma de cinco en cinco;
 *   - «Where to buy», el catálogo de proveedores con sus filtros;
 *   - el mapa de actores, que no se replica: se rehace de cero.
 *
 * Las páginas se generan en la primera visita y se guardan una hora; el aviso
 * del gestor al publicar las renueva antes.
 */

import type { Metadata } from "next";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import Texto from "@/components/sitio/Texto";
import Cabecera from "@/components/fairmined/Cabecera";
import Encabezado from "@/components/fairmined/Encabezado";
import ListaNoticias, { POR_PAGINA, fechaLarga } from "@/components/fairmined/ListaNoticias";
import Pie from "@/components/fairmined/Pie";
import Catalogo, { type Faceta, type TarjetaProveedor } from "@/components/fairmined/Catalogo";
import FichaProveedor from "@/components/fairmined/FichaProveedor";
import Galeria from "@/components/fairmined/Galeria";
import MapaActores, { type ActorMapa } from "@/components/fairmined/MapaActores";
import { hayImagen, urlImagen } from "@/lib/sanity";
import {
  actoresFm,
  ajustesFm,
  enIdioma,
  fichaPorRuta,
  idiomaDe,
  noticiasFm,
  proveedorPorRuta,
  proveedoresFm,
  rutaDeProveedor,
  rutaFm,
  rutaPorNombre,
  type IdiomaFm,
  type ProveedorFm,
} from "@/lib/fairmined";

export const revalidate = 3600;
export const dynamicParams = true;

/* Ninguna se genera al compilar: son casi seiscientas, y la compilación de
   la página de avances no tiene por qué esperarlas. */
export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ ruta?: string[] }> };

/** La dirección de fairmined.org que se pide, y la página de la lista. */
async function leer(params: Props["params"]) {
  const { ruta = [] } = await params;
  let camino = "/" + ruta.map((t) => decodeURIComponent(t)).join("/");
  let pagina = 1;
  const m = camino.match(/^(.*)\/page\/(\d+)$/);
  if (m) {
    camino = m[1] || "/";
    pagina = Math.max(1, Number(m[2]));
  }
  return { camino: camino.replace(/\/+$/, "") || "/", pagina };
}

const INICIO: Record<IdiomaFm, string> = { en: "/", es: "/es", de: "/de", fr: "/fr" };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { camino } = await leer(params);
  const ficha = await fichaPorRuta(camino);
  if (ficha) return { title: ficha.titulo };
  const proveedor = await proveedorPorRuta(camino);
  return { title: proveedor?.nombre ?? "Fairmined" };
}

/* ── El catálogo ─────────────────────────────────────────────────── */

/** Los títulos de los filtros, copiados del original —errata incluida: en
 *  inglés dice «TYPE TO» donde quería decir «TYPE OF»—. */
const FACETAS: Record<"en" | "es", [keyof ProveedorFm, string][]> = {
  en: [
    ["materiales", "TYPE TO CERTIFIED METALS OFFERED:"],
    ["productos", "PRODUCTS OFFER:"],
    ["servicios", "SERVICES OFFER:"],
    ["paises", "SHIPPING COUNTRIES:"],
  ],
  es: [
    ["materiales", "TIPO DE METALES CERTIFICADOS OFRECIDOS:"],
    ["productos", "PRODUCTOS QUE OFRECE:"],
    ["servicios", "SERVICIOS QUE OFRECE:"],
    ["paises", "PAÍSES DE ENVÍO:"],
  ],
};
const TEXTOS_CATALOGO = {
  en: { buscar: "Search", marcador: "keyword...", limpiar: "Clear All", ninguno: "No suppliers match." },
  es: { buscar: "Buscar", marcador: "palabra clave...", limpiar: "Borrar todo", ninguno: "Ningún proveedor coincide." },
};

async function catalogo(idioma: IdiomaFm) {
  const lista = await proveedoresFm();
  const lengua = idioma === "es" ? "es" : "en";
  const facetas: Faceta[] = FACETAS[lengua].map(([campo, titulo]) => ({
    campo: String(campo),
    titulo,
    opciones: [
      ...new Set(
        lista.flatMap((p) => ((p[campo] as { en?: string }[] | null) ?? []).map((t) => enIdioma(t, idioma))),
      ),
    ]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, lengua)),
  }));
  const tarjetas: TarjetaProveedor[] = lista.map((p) => ({
    id: p._id,
    nombre: p.nombre,
    logo: hayImagen(p.logo) ? urlImagen(p.logo).width(434).auto("format").url() : null,
    web: p.web,
    sede: p.sede,
    ruta: rutaFm(rutaDeProveedor(p.rutas, idioma)),
    facetas: Object.fromEntries(
      facetas.map((f) => [
        f.campo,
        ((p[f.campo as keyof ProveedorFm] as { en?: string }[] | null) ?? []).map((t) => enIdioma(t, idioma)),
      ]),
    ),
  }));
  return { tarjetas, facetas, textos: TEXTOS_CATALOGO[lengua] };
}

export default async function PaginaFairmined({ params }: Props) {
  const { camino, pagina } = await leer(params);
  const idioma = idiomaDe(camino);
  const [ficha, ajustes] = await Promise.all([fichaPorRuta(camino), ajustesFm(idioma)]);

  /* No es una página ni una noticia: puede ser la ficha de un proveedor, que
     vive en /suppliers-portfolio/<nombre> y en /es/suppliers-portfolio/… */
  if (!ficha) {
    const proveedor = await proveedorPorRuta(camino);
    if (!proveedor) {
      /* Como WordPress: /en/… es lo mismo sin /en, y una página pedida por
         otra ruta lleva a la suya. Lo que tampoco encuentra WordPress —hay
         enlaces rotos desde antes, como /fr/info-material— da 404 igual. */
      if (camino === "/en" || camino.startsWith("/en/")) permanentRedirect(rutaFm(camino.slice(3) || "/"));
      const nombre = camino.split("/").filter(Boolean).pop();
      const buena = nombre ? await rutaPorNombre(nombre, idioma) : null;
      if (buena && buena !== camino) permanentRedirect(rutaFm(buena));
      notFound();
    }
    const traducciones = (proveedor.rutas ?? []).map((r) => ({ idioma: idiomaDe(r), ruta: r }));
    return (
      <div className="min-h-screen bg-white">
        <Cabecera ajustes={ajustes} idioma={idioma} traducciones={traducciones} />
        <main>
          <Encabezado titulo={proveedor.nombre} inicio={INICIO[idioma]} />
          <FichaProveedor p={proveedor} idioma={idioma} />
        </main>
        <Pie ajustes={ajustes} />
      </div>
    );
  }

  const esPortada = camino === INICIO[ficha.idioma];
  const esNoticias = ficha.arma === "noticias";
  const noticias = esNoticias
    ? await noticiasFm(ficha.idioma, (pagina - 1) * POR_PAGINA, POR_PAGINA)
    : null;
  if (pagina > 1 && !esNoticias) notFound();
  const datosCatalogo = ficha.arma === "catalogo" ? await catalogo(ficha.idioma) : null;
  const actores: ActorMapa[] | null =
    ficha.arma === "mapa"
      ? (await actoresFm()).map((a) => ({
          id: a._id,
          nombre: a.nombre,
          roles: a.roles ?? [],
          pais: a.pais,
          web: a.web,
          fairminedId: a.fairminedId,
          anio: a.alta ? a.alta.slice(0, 4) : null,
          ubicacion: a.ubicacion,
          ficha: a.rutas?.length
            ? rutaFm(rutaDeProveedor(a.rutas, ficha.idioma))
            : a.perfil
              ? rutaFm(a.perfil)
              : null,
        }))
      : null;

  /* La portada abre con su carrusel a todo el ancho, como la de hoy. */
  type FotoGaleria = { _key: string; asset?: unknown; alt?: string; caption?: string };
  const primera = (ficha.body ?? [])[0] as { _type?: string; imagenes?: FotoGaleria[] } | undefined;
  const cabecera =
    esPortada && primera?._type === "galeria"
      ? (primera.imagenes ?? []).filter((f) => hayImagen(f))
      : null;
  const cuerpo = cabecera ? (ficha.body ?? []).slice(1) : (ficha.body ?? []);

  return (
    <div className="min-h-screen bg-white">
      <Cabecera ajustes={ajustes} idioma={ficha.idioma} traducciones={ficha.traducciones ?? []} />

      <main>
        {!esPortada && (
          <Encabezado
            titulo={ficha.titulo}
            migas={ficha.migas ?? []}
            inicio={INICIO[ficha.idioma]}
            dorado={esNoticias}
          />
        )}

        {ficha._type === "article" && (
          <div className="mx-auto max-w-[1170px] px-[15px] pt-[30px]">
            <p className="inline-block bg-[#e4e4e4] px-[10px] py-[4px] text-[12px] leading-[25px] font-bold uppercase">
              {fechaLarga(ficha.fecha, ficha.idioma)}
            </p>
            {hayImagen(ficha.portada) && (
              <Image
                src={urlImagen(ficha.portada).width(1140).auto("format").url()}
                alt=""
                width={ficha.portada?.ancho ?? 1140}
                height={ficha.portada?.alto ?? 760}
                className="mt-[20px] h-auto w-full"
                sizes="(max-width: 1170px) 100vw, 1140px"
                priority
              />
            )}
          </div>
        )}

        {cabecera && cabecera.length > 0 && (
          <Galeria
            forma="cabecera"
            fotos={cabecera.map((f) => ({
              key: f._key,
              src: urlImagen(f).width(2000).auto("format").url(),
              ancho: 2000,
              alto: 900,
              alt: f.alt ?? "",
              pie: f.caption,
            }))}
          />
        )}

        {cuerpo.length > 0 && (
          /* El cuerpo ocupa los 1140 px del original, para que quepan sus
             columnas; el texto suelto va en la columna de 780 px, centrada,
             que es como lo ponen casi todas sus paginas (globals.css). */
          <div className="texto-fm mx-auto max-w-[1170px] px-[15px] py-[40px]">
            <Texto valor={cuerpo} sitio="fairmined" />
          </div>
        )}

        {actores && <MapaActores actores={actores} idioma={ficha.idioma} />}

        {datosCatalogo && (
          <Catalogo
            proveedores={datosCatalogo.tarjetas}
            facetas={datosCatalogo.facetas}
            textos={datosCatalogo.textos}
          />
        )}

        {noticias && (
          <ListaNoticias
            lista={noticias.lista}
            total={noticias.total}
            pagina={pagina}
            base={ficha.ruta}
            idioma={ficha.idioma}
          />
        )}
      </main>

      <Pie ajustes={ajustes} />
    </div>
  );
}
