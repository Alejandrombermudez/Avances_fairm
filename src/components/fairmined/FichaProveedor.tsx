/**
 * La ficha de un proveedor del catálogo, como /suppliers-portfolio/alloy-sas
 * en fairmined.org: su identificador Fairmined, su web, lo que tiene en
 * existencia y por encargo, sus servicios, el pedido mínimo, a dónde envía y
 * a quién escribir.
 *
 * El original tiene además unas estrellas de valoración que no valoran nada
 * —«/5» sin número—; no se replican.
 */

import Image from "next/image";
import { hayImagen, urlImagen } from "@/lib/sanity";
import { enIdioma, type IdiomaFm, type ProveedorDetalle } from "@/lib/fairmined";

/**
 * Las etiquetas de la ficha. Van en inglés también en las fichas en español:
 * así están en el original (/es/suppliers-portfolio/sdc-designs dice
 * «Products on demand», «Deliver», «Contact»).
 */
const ROTULOS = {
  arriba: "Fairmined suppliers",
  id: "Fairmined ID:",
  stock: "Products in Stock:",
  encargo: "Products on demand:",
  servicios: "Services:",
  minimo: "Minimum order quantity:",
  entrega: "Deliver:",
  contacto: "Contact:",
};

function Campo({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="mt-[22px]">
      <p className="fm-titulos text-[15px] text-[#222] uppercase">{rotulo}</p>
      <div className="mt-1 text-[16px] leading-[25px] font-light text-[#444]">{children}</div>
    </div>
  );
}

const lineas = (t: string) =>
  t.split("\n").filter(Boolean).map((l, i) => <p key={i}>{l}</p>);

export default function FichaProveedor({ p, idioma }: { p: ProveedorDetalle; idioma: IdiomaFm }) {
  const r = ROTULOS;
  const stock = enIdioma(p.enExistencia, idioma);
  const encargo = enIdioma(p.porEncargo, idioma);
  const servicios = (p.servicios ?? []).map((s) => enIdioma(s, idioma)).filter(Boolean);
  const minimo = enIdioma(p.pedidoMinimo, idioma);
  const entrega = enIdioma(p.entrega, idioma);
  const c = p.contacto;
  return (
    <div className="mx-auto grid max-w-[1170px] gap-10 px-[15px] py-[40px] md:grid-cols-[300px_1fr]">
      <div>
        {hayImagen(p.logo) && (
          <Image
            src={urlImagen(p.logo).width(600).auto("format").url()}
            alt={p.nombre}
            width={600}
            height={420}
            className="h-auto w-full border border-[#eee] object-contain p-6"
          />
        )}
      </div>
      <div>
        <p className="fm-titulos text-[14px] text-oro uppercase">{r.arriba}</p>
        <h2 className="fm-titulos mt-2 text-[28px] leading-[36px] text-[#222] uppercase">{p.nombre}</h2>
        {p.fairminedId && <Campo rotulo={r.id}>{p.fairminedId}</Campo>}
        {p.web && (
          <p className="mt-[16px]">
            <a
              href={p.web}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[16px] break-all text-oro hover:opacity-80"
            >
              {p.web}
            </a>
          </p>
        )}
        {stock && <Campo rotulo={r.stock}>{lineas(stock)}</Campo>}
        {encargo && <Campo rotulo={r.encargo}>{lineas(encargo)}</Campo>}
        {servicios.length > 0 && <Campo rotulo={r.servicios}>{servicios.join(", ")}</Campo>}
        {minimo && <Campo rotulo={r.minimo}>{minimo}</Campo>}
        {entrega && <Campo rotulo={r.entrega}>{entrega}</Campo>}
        {c && (c.nombre || c.correo || c.telefono || c.direccion) && (
          <Campo rotulo={r.contacto}>
            {c.nombre && <p>{c.nombre}</p>}
            {c.correo && (
              <p>
                <a href={`mailto:${c.correo}`} className="text-oro hover:opacity-80">
                  {c.correo}
                </a>
              </p>
            )}
            {c.telefono && <p>{c.telefono}</p>}
            {c.direccion && lineas(c.direccion)}
            {p.sede && <p>{p.sede}</p>}
          </Campo>
        )}
      </div>
    </div>
  );
}
