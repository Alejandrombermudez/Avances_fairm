/**
 * Estado del proyecto — el único archivo que hay que editar para actualizar la página.
 *
 * Al terminar una tarea, cambia su `estado` a "hecho" y actualiza `meta.actualizado`.
 * El despliegue en Vercel se regenera solo al hacer push.
 *
 * ESTA PÁGINA ES PÚBLICA. No incluir aquí: versiones de software del cliente,
 * direcciones IP, paneles de administración, credenciales, asuntos contractuales
 * ni nada que suene a reproche. Ver README.
 */

export type Estado = "hecho" | "curso" | "espera" | "pendiente";

export const meta = {
  cliente: "Alianza por la Minería Responsable",
  proyecto: "Migración del ecosistema web",
  sitios: ["responsiblemines.org", "fairmined.org", "craftmines.org"],
  actualizado: "2026-09-29",
  responsable: "Alejandro Bermúdez",
  contacto: "alejucha@gmail.com",
};

/** Cifras del diagnóstico. Medidas sobre la información que los sitios publican. */
export const metricas: { valor: string; etiqueta: string; nota?: string }[] = [
  { valor: "10.369", etiqueta: "direcciones inventariadas", nota: "en los tres sitios" },
  { valor: "2.679", etiqueta: "son contenido real", nota: "el resto lo genera el sistema" },
  { valor: "9.241", etiqueta: "archivos catalogados", nota: "solo en ARM" },
  { valor: "8", etiqueta: "combinaciones de sitio e idioma", nota: "hasta cuatro idiomas por sitio" },
];

export const fases: {
  n: number;
  nombre: string;
  duracion: string;
  estado: Estado;
  resumen: string;
  tareas: { t: string; estado: Estado }[];
}[] = [
  {
    n: 0,
    nombre: "Extracción y resguardo",
    duracion: "1 a 1,5 semanas",
    estado: "curso",
    resumen:
      "Se recupera todo el contenido publicado y sus archivos, y se genera una copia de resguardo antes de tocar nada.",
    tareas: [
      { t: "Inventario completo de los tres sitios", estado: "hecho" },
      { t: "Análisis de la estructura de contenido actual", estado: "hecho" },
      { t: "Censo de plantillas y componentes", estado: "hecho" },
      { t: "Extracción del contenido publicado", estado: "curso" },
      { t: "Descarga de la biblioteca de archivos", estado: "curso" },
      { t: "Copia de resguardo entregable", estado: "pendiente" },
      { t: "Análisis de tráfico por dirección", estado: "espera" },
      { t: "Inventario de decisiones, para aprobación", estado: "pendiente" },
    ],
  },
  {
    n: 1,
    nombre: "Fundaciones",
    duracion: "1,5 a 2 semanas",
    estado: "curso",
    resumen:
      "Se define cómo queda organizada la información y cómo se van a ver los tres sitios.",
    tareas: [
      { t: "Modelo de contenido unificado", estado: "curso" },
      { t: "Gestor de contenidos configurado por sitio", estado: "pendiente" },
      { t: "Sistema de diseño y componentes", estado: "espera" },
      { t: "Prototipos de los tres sitios, para aprobación", estado: "espera" },
      { t: "Preservación de las direcciones de archivos", estado: "pendiente" },
    ],
  },
  {
    n: 2,
    nombre: "Motor de migración",
    duracion: "1,5 semanas",
    estado: "pendiente",
    resumen:
      "La herramienta que traslada el contenido, verificable y repetible.",
    tareas: [
      { t: "Traslado de contenido al gestor nuevo", estado: "pendiente" },
      { t: "Mapeo de traducciones entre idiomas", estado: "pendiente" },
      { t: "Conversión de las páginas con maquetación especial", estado: "pendiente" },
      { t: "Reporte de verificación", estado: "pendiente" },
    ],
  },
  {
    n: 3,
    nombre: "CRAFT en producción",
    duracion: "1 semana",
    estado: "pendiente",
    resumen:
      "El sitio más pequeño va primero: valida toda la arquitectura con el menor riesgo.",
    tareas: [
      { t: "Desarrollo del sitio", estado: "pendiente" },
      { t: "Traslado del contenido", estado: "pendiente" },
      { t: "Mapa de redirecciones", estado: "pendiente" },
      { t: "Revisión en ambiente de pruebas", estado: "pendiente" },
      { t: "Salida a producción", estado: "pendiente" },
    ],
  },
  {
    n: 4,
    nombre: "ARM en producción",
    duracion: "2,5 semanas",
    estado: "pendiente",
    resumen:
      "El sitio institucional, con sus publicaciones e informes conservando su dirección exacta.",
    tareas: [
      { t: "Desarrollo del sitio en tres idiomas", estado: "pendiente" },
      { t: "Traslado de noticias, páginas y proyectos", estado: "pendiente" },
      { t: "Publicaciones e informes con dirección idéntica", estado: "pendiente" },
      { t: "Revisión y salida a producción", estado: "pendiente" },
    ],
  },
  {
    n: 5,
    nombre: "Fairmined en producción",
    duracion: "2,5 semanas",
    estado: "pendiente",
    resumen:
      "Incluye la reconstrucción del catálogo de proveedores con su buscador y su mapa.",
    tareas: [
      { t: "Desarrollo del sitio en cuatro idiomas", estado: "pendiente" },
      { t: "Catálogo de proveedores y mapa", estado: "pendiente" },
      { t: "Buscador por criterios combinables", estado: "pendiente" },
      { t: "Revisión y salida a producción", estado: "pendiente" },
    ],
  },
  {
    n: 6,
    nombre: "Cierre y garantía",
    duracion: "1 semana, más 90 días",
    estado: "pendiente",
    resumen:
      "Capacitación, documentación y acompañamiento durante los tres meses posteriores.",
    tareas: [
      { t: "Manual técnico y manual de uso", estado: "pendiente" },
      { t: "Taller con el equipo", estado: "pendiente" },
      { t: "Hoja de ruta de analítica", estado: "pendiente" },
      { t: "Monitoreo de enlaces durante 90 días", estado: "pendiente" },
    ],
  },
];

/** Lo que el proyecto necesita de ARM para seguir avanzando. */
export const esperando: { que: string; para: string; desde: string }[] = [
  {
    que: "Acceso al servidor de hosting",
    para: "Generar la copia de resguardo completa y recuperar los archivos que no son visibles desde fuera",
    desde: "2026-09-22",
  },
  {
    que: "Acceso a Google Search Console",
    para: "Saber qué direcciones reciben visitas reales y decidir con datos cuáles conservar",
    desde: "2026-09-22",
  },
  {
    que: "Manual de marca de los tres sitios",
    para: "Elaborar las propuestas de diseño",
    desde: "2026-09-22",
  },
  {
    que: "Definición de los servicios mensuales",
    para: "Crear las cuentas a nombre de ARM",
    desde: "2026-09-22",
  },
];

/** Hallazgos que vale la pena que el cliente conozca. En tono constructivo. */
export const hallazgos: { titulo: string; texto: string }[] = [
  {
    titulo: "Los sitios son multilingües",
    texto:
      "ARM publica en español, inglés y francés; Fairmined suma alemán. Son ocho combinaciones de sitio e idioma, y es el factor que más pesa en el cronograma.",
  },
  {
    titulo: "Tres de cada cuatro direcciones no son contenido",
    texto:
      "El sistema actual genera automáticamente miles de páginas vacías que nadie escribió. No se trasladan, y retirarlas mejora el posicionamiento en buscadores.",
  },
  {
    titulo: "El catálogo de proveedores se reconstruye por completo",
    texto:
      "Funciona sobre herramientas que solo existen dentro del sistema actual. Es el componente más extenso del proyecto.",
  },
  {
    titulo: "Nada se pierde",
    texto:
      "Antes de trasladar cualquier cosa se genera una copia íntegra que se entrega y se conserva. El material que no pase al sitio nuevo queda siempre disponible.",
  },
];

export const proximoHito = {
  titulo: "Copia de resguardo entregada y decisiones de contenido aprobadas",
  detalle:
    "Con eso cierra la fase de descubrimiento y empieza la construcción del primer sitio.",
};
