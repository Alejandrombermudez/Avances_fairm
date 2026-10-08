/**
 * La hoja con la esquina doblada y el formato escrito dentro.
 *
 * Los enlaces a archivos no decían que lo eran: un PDF y una página se veían
 * igual hasta hacer clic. Con esto se distingue de un vistazo qué se baja y
 * en qué formato viene.
 */

export default function IconoArchivo({
  formato,
  className = "",
}: {
  formato?: string | null;
  className?: string;
}) {
  const sigla = (formato ?? "").toUpperCase().slice(0, 4);
  return (
    <span
      className={`relative inline-flex h-11 w-9 shrink-0 items-end justify-center ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 36 44" fill="none" className="absolute inset-0 h-full w-full">
        <path
          d="M8 1.5h14.5L31 10v29.5a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-35a3 3 0 0 1 3-3Z"
          fill="#fff"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M22.5 1.5V10H31" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <span className="relative mb-[8px] text-[8.5px] leading-none font-bold tracking-wide">
        {sigla}
      </span>
    </span>
  );
}
