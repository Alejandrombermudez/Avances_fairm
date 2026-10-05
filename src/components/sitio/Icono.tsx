/**
 * Los iconos de las tarjetas.
 *
 * En el sitio de hoy son glifos de ETmodules —la tipografía de iconos del
 * constructor visual— en los puntos de código e0ed, e08b y e0ef. Esa
 * tipografía es propietaria y desaparece con el constructor, así que se
 * redibujan como parte del sitio.
 *
 * Mismo tamaño y mismo color que los suyos: 32px y #511112.
 */

type Nombre = "moneda" | "personas" | "edificio" | "documento" | "mapa" | "balanza";

const TRAZO = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const DIBUJOS: Record<Nombre, React.ReactNode> = {
  /* e0ed — moneda: el círculo con el signo de peso */
  moneda: (
    <>
      <circle cx="16" cy="16" r="12.5" {...TRAZO} />
      <path d="M16 8.5v15" {...TRAZO} />
      <path
        d="M19.8 12.2c-.6-1.3-2-2.1-3.8-2.1-2.2 0-3.9 1.2-3.9 2.9 0 1.6 1.3 2.4 3.9 3 2.6.6 3.9 1.4 3.9 3 0 1.7-1.7 2.9-3.9 2.9-1.9 0-3.3-.8-3.9-2.2"
        {...TRAZO}
      />
    </>
  ),

  /* e08b — personas: el grupo */
  personas: (
    <>
      <circle cx="12" cy="11" r="4.2" {...TRAZO} />
      <path d="M4.5 25.5c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7" {...TRAZO} />
      <path d="M21.5 7.6a4.2 4.2 0 0 1 0 8.1" {...TRAZO} />
      <path d="M22.5 19a7.6 7.6 0 0 1 5 6.5" {...TRAZO} />
    </>
  ),

  /* e0ef — edificio: la institución */
  edificio: (
    <>
      <path d="M4 27.5h24" {...TRAZO} />
      <path d="M6.5 27.5V13l9.5-6 9.5 6v14.5" {...TRAZO} />
      <path d="M12.5 27.5v-6h7v6" {...TRAZO} />
      <path d="M11 16.5h2.5M18.5 16.5H21" {...TRAZO} />
    </>
  ),

  documento: (
    <>
      <path d="M8 4.5h11l5 5v22H8z" {...TRAZO} />
      <path d="M19 4.5v5h5" {...TRAZO} />
      <path d="M12 16h8M12 20.5h8M12 25h5" {...TRAZO} />
    </>
  ),

  mapa: (
    <>
      <path d="M4.5 8l7.5-3 8 3 7.5-3v19l-7.5 3-8-3-7.5 3z" {...TRAZO} />
      <path d="M12 5v19M20 8v19" {...TRAZO} />
    </>
  ),

  balanza: (
    <>
      <path d="M16 5v22M8 27.5h16" {...TRAZO} />
      <path d="M6 9h20" {...TRAZO} />
      <path d="M6 9l-3.5 8h7zM26 9l-3.5 8h7z" {...TRAZO} />
    </>
  ),
};

export default function Icono({
  nombre,
  tam = 32,
  className,
}: {
  nombre?: string | null;
  tam?: number;
  className?: string;
}) {
  const dibujo = DIBUJOS[(nombre ?? "") as Nombre];
  if (!dibujo) return null;
  return (
    <svg
      width={tam}
      height={tam}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={className}
      style={{ color: "#511112" }}
    >
      {dibujo}
    </svg>
  );
}
