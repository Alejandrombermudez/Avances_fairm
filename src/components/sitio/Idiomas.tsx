/**
 * Las pastillas de idioma de un documento.
 *
 * El recuadro punteado cuando falta el espanol no es decoracion: la version
 * vigente de la norma solo esta publicada en ingles y portugues, y eso solo se
 * ve cuando los archivos estan ordenados por idioma.
 */

export default function Idiomas({ idiomas }: { idiomas?: string[] | null }) {
  const ls = [...(idiomas ?? [])].sort();
  return (
    <span className="flex shrink-0 gap-1.5">
      {ls.map((l) => (
        <span key={l} className="rounded bg-cafe px-2 py-0.5 text-[11.5px] font-semibold text-white">
          {l.toUpperCase()}
        </span>
      ))}
      {ls.length > 0 && !ls.includes("es") && (
        <span className="rounded border border-dashed border-cafe/50 px-2 py-0.5 text-[11.5px] text-cafe/70">
          falta ES
        </span>
      )}
    </span>
  );
}
