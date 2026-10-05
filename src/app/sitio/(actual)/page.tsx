/**
 * La portada, replicando la de craftmines.org.
 *
 * Las seis bandas y su orden salen de los ajustes del sitio en Sanity: título,
 * texto, fondo, foto, tarjetas y botones. Nada está escrito aquí.
 *
 * La diferencia con la de hoy está en la última banda: en vez de una lista de
 * noticias puesta a mano, dice qué quiere listar y el sitio lo trae. Añadir una
 * noticia en el gestor la hace aparecer sin tocar la portada.
 */

import Image from "next/image";
import Link from "next/link";
import { ajustes, articulos, historias, hitos, norma, urlImagen, type Banda } from "@/lib/sanity";
import Idiomas from "@/components/sitio/Idiomas";
import { ruta } from "@/lib/rutas";

export const revalidate = 3600;

const FONDO: Record<string, string> = {
  blanco: "bg-white",
  gris: "bg-gris",
  cafe: "bg-cafe text-white",
};

function Botones({ b }: { b: Banda }) {
  if (!b.botones?.length) return null;
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-4">
      {b.botones.map((x) => (
        <Link key={x._key} href={ruta(x.url)} className="boton">
          {x.etiqueta}
        </Link>
      ))}
    </div>
  );
}

/* ── Las bandas ────────────────────────────────────────────────── */

function Hero({ b }: { b: Banda }) {
  const fondo = b.imagen ? urlImagen(b.imagen).width(2000).auto("format").url() : null;
  return (
    <section className="relative flex min-h-[624px] items-center">
      {fondo && (
        <Image src={fondo} alt="" fill priority sizes="100vw" className="object-cover object-center" />
      )}
      {/* El mismo degradado que usa el sitio hoy */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(rgba(10,10,10,.57) 0%, rgba(10,2,2,0) 24%), rgba(0,0,0,.18)",
        }}
      />
      <div className="relative mx-auto grid w-full max-w-[1180px] px-6 py-10 sm:grid-cols-2">
        <div />
        {/* La caja translucida de la derecha, igual que en el sitio actual */}
        <div className="px-5 py-8 text-right sm:pr-8" style={{ background: "rgba(25,25,25,.5)" }}>
          <h1 className="text-[34px] leading-tight font-semibold text-white sm:text-[40px]">
            {b.titulo}
          </h1>
          <p className="mt-4 text-[20px] leading-[1.15] font-light text-white sm:text-[22px]">
            {b.texto}
          </p>
        </div>
      </div>
    </section>
  );
}

function Tarjetas({ b }: { b: Banda }) {
  return (
    <section className={`${FONDO[b.fondo ?? "blanco"]} px-6 py-16`}>
      <div className="mx-auto max-w-[1180px] text-center">
        <h2 className="text-[32px] leading-tight font-semibold sm:text-[40px]">{b.titulo}</h2>
        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {(b.tarjetas ?? []).map((t) => (
            <article key={t._key}>
              <h3 className="text-[19px] font-semibold">{t.titulo}</h3>
              <p className="mt-3 text-[15px] leading-relaxed font-light text-suave">{t.texto}</p>
            </article>
          ))}
        </div>
        <Botones b={b} />
      </div>
    </section>
  );
}

function Texto({ b }: { b: Banda }) {
  const conFoto = b.fondo === "foto" && b.imagen;
  const fondo = conFoto ? urlImagen(b.imagen).width(2000).auto("format").url() : null;

  return (
    <section
      className={`relative px-6 py-20 ${conFoto ? "" : FONDO[b.fondo ?? "blanco"]}`}
    >
      {fondo && (
        <>
          <Image src={fondo} alt="" fill sizes="100vw" className="object-cover object-center" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(rgba(0,0,0,.37) 0%, rgba(0,0,0,.29) 100%)" }}
          />
        </>
      )}
      <div className={`relative mx-auto max-w-[900px] text-center ${conFoto ? "text-white" : ""}`}>
        <h2
          className={`text-[32px] leading-tight font-semibold sm:text-[40px] ${
            conFoto ? "text-white" : ""
          }`}
        >
          {b.titulo}
        </h2>
        <p
          className={`mt-6 text-[16px] leading-relaxed font-light ${
            conFoto ? "text-white/90" : "text-suave"
          }`}
        >
          {b.texto}
        </p>
        <Botones b={b} />
      </div>
    </section>
  );
}

async function Listado({ b }: { b: Banda }) {
  const n = b.cuantos ?? 6;

  if (b.listado === "historias") {
    const items = await historias();
    return (
      <Rejilla b={b}>
        {items.slice(0, n).map((h) => (
          <article key={h._id} className="rounded border border-linea bg-white p-6">
            {h.place && <p className="text-[12px] font-semibold tracking-wide text-cafe">{h.place}</p>}
            <h3 className="mt-2 text-[17px] leading-snug font-semibold">
              {h.title.replace(/^[^–]+–\s*/, "")}
            </h3>
          </article>
        ))}
      </Rejilla>
    );
  }

  if (b.listado === "hitos") {
    const items = await hitos();
    return (
      <Rejilla b={b}>
        {items.slice(0, n).map((h) => (
          <article key={h._id} className="rounded border border-linea bg-white p-6">
            <p className="text-[12px] font-semibold tracking-wide text-cafe">
              {h.date?.slice(0, 7)}
            </p>
            <h3 className="mt-2 text-[17px] leading-snug font-semibold">{h.title}</h3>
          </article>
        ))}
      </Rejilla>
    );
  }

  if (b.listado === "volumenes") {
    const nm = await norma();
    return (
      <Rejilla b={b}>
        {(nm?.vigente?.volumenes ?? []).slice(0, n).map((v) => (
          <article key={v._id} className="rounded border border-linea bg-white p-6">
            <p className="text-[12px] font-semibold tracking-wide text-cafe">{v.volumen}</p>
            <h3 className="mt-2 text-[16px] leading-snug font-semibold">
              {(v.titulo ?? "").replace(/^CRAFT [\d.]+ — /, "")}
            </h3>
            <div className="mt-3">
              <Idiomas idiomas={v.idiomas} />
            </div>
          </article>
        ))}
      </Rejilla>
    );
  }

  const items = await articulos();
  return (
    <Rejilla b={b}>
      {items.slice(0, n).map((a) => (
        <article key={a._id} className="rounded border border-linea bg-white p-6">
          <p className="text-[12px] font-semibold tracking-wide text-cafe">
            {a.publishedAt?.slice(0, 10)}
          </p>
          <h3 className="mt-2 text-[17px] leading-snug font-semibold">{a.title}</h3>
        </article>
      ))}
    </Rejilla>
  );
}

function Rejilla({ b, children }: { b: Banda; children: React.ReactNode }) {
  return (
    <section className={`${FONDO[b.fondo ?? "blanco"]} px-6 py-16`}>
      <div className="mx-auto max-w-[1180px]">
        <h2 className="text-center text-[32px] leading-tight font-semibold sm:text-[40px]">
          {b.titulo}
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
        <Botones b={b} />
      </div>
    </section>
  );
}

/* ── La página ─────────────────────────────────────────────────── */

export default async function Portada() {
  const a = await ajustes();
  const bandas = a?.bandas ?? [];

  return (
    <main>
      {bandas.map((b) => {
        if (b.tipo === "hero") return <Hero key={b._key} b={b} />;
        if (b.tipo === "tarjetas") return <Tarjetas key={b._key} b={b} />;
        if (b.tipo === "listado") return <Listado key={b._key} b={b} />;
        return <Texto key={b._key} b={b} />;
      })}
    </main>
  );
}
