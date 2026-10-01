/**
 * Estado del proyecto — el único archivo que hay que editar para actualizar la página.
 *
 * Al terminar una tarea, cambia su `estado` a "hecho" y actualiza `meta.actualizado`.
 * El despliegue en Vercel se regenera solo al hacer push.
 *
 * ESTA PÁGINA ES PÚBLICA. No incluir aquí: versiones de software del cliente,
 * direcciones IP, paneles de administración, credenciales, asuntos contractuales
 * ni nada que suene a reproche. Ver README.
 *
 * Sobre el tono: frases cortas, números en vez de adjetivos, sin impersonal
 * ("se recupera", "se genera"). Si una frase tiene tres comas, va larga.
 */

export type Estado = "hecho" | "curso" | "espera" | "pendiente";

export const meta = {
  cliente: "Alianza por la Minería Responsable",
  proyecto: "Migración del ecosistema web",
  sitios: ["responsiblemines.org", "fairmined.org", "craftmines.org"],
  actualizado: "2026-09-30",
  responsable: "Alejandro Bermúdez",
  titulo: "Desarrollo web y plataformas",
  contacto: "alejucha@gmail.com",
  celular: "+57 305 890 5505",
};

export const metricas: { valor: string; etiqueta: string; nota?: string }[] = [
  { valor: "19.228", etiqueta: "registros de contenido rescatados", nota: "de los tres sitios" },
  { valor: "9.658", etiqueta: "archivos descargados", nota: "10,4 GB" },
  { valor: "1.599", etiqueta: "documentos a salvo", nota: "informes, estándares, publicaciones" },
  { valor: "153", etiqueta: "enlaces ya rotos", nota: "encontrados de paso" },
];

export const fases: {
  n: number;
  nombre: string;
  duracion: string;
  inicio: string;
  fin: string;
  color: string;
  estado: Estado;
  resumen: string;
  tareas: { t: string; estado: Estado }[];
}[] = [
  {
    n: 0,
    nombre: "Inventario y respaldo",
    duracion: "1 a 1,5 semanas",
    inicio: "2026-09-21",
    fin: "2026-10-02",
    color: "#8f7a5c",
    estado: "curso",
    resumen: "Sacar todo lo que está publicado y guardarlo aparte antes de tocar nada.",
    tareas: [
      { t: "Inventario de los tres sitios", estado: "hecho" },
      { t: "Análisis de cómo está organizado hoy", estado: "hecho" },
      { t: "Censo de plantillas", estado: "hecho" },
      { t: "Contenido publicado, 19.228 registros", estado: "hecho" },
      { t: "Biblioteca de archivos, 10,4 GB", estado: "hecho" },
      { t: "Verificación de que no faltó nada", estado: "hecho" },
      { t: "Copia de resguardo para ARM", estado: "curso" },
      { t: "Cruce con los datos de Google", estado: "espera" },
      { t: "Qué se conserva y qué no, para aprobación", estado: "pendiente" },
    ],
  },
  {
    n: 1,
    nombre: "Cimientos",
    duracion: "1,5 a 2 semanas",
    inicio: "2026-09-29",
    fin: "2026-10-14",
    color: "#b08647",
    estado: "curso",
    resumen: "Cómo queda organizada la información y cómo se ven los tres sitios.",
    tareas: [
      { t: "Modelo de contenido", estado: "curso" },
      { t: "Cuentas a nombre de ARM", estado: "espera" },
      { t: "Gestor de contenidos, uno por sitio", estado: "pendiente" },
      { t: "Sistema de diseño", estado: "espera" },
      { t: "Prototipos de los tres sitios", estado: "espera" },
      { t: "Direcciones de archivos conservadas", estado: "pendiente" },
    ],
  },
  {
    n: 2,
    nombre: "Motor de migración",
    duracion: "1,5 semanas",
    inicio: "2026-10-14",
    fin: "2026-10-24",
    color: "#cf9a3f",
    estado: "pendiente",
    resumen: "La herramienta que pasa el contenido. Repetible y verificable.",
    tareas: [
      { t: "Traslado al gestor nuevo", estado: "pendiente" },
      { t: "Traducciones entre idiomas", estado: "pendiente" },
      { t: "Las 44 páginas con maquetación especial", estado: "pendiente" },
      { t: "Reporte de verificación", estado: "pendiente" },
    ],
  },
  {
    n: 3,
    nombre: "CRAFT en línea",
    duracion: "1 semana",
    inicio: "2026-10-26",
    fin: "2026-10-31",
    color: "#e1a644",
    estado: "pendiente",
    resumen: "El sitio más pequeño va primero. Si algo falla, falla donde menos duele.",
    tareas: [
      { t: "Desarrollo del sitio", estado: "pendiente" },
      { t: "Paso del contenido", estado: "pendiente" },
      { t: "Redirecciones", estado: "pendiente" },
      { t: "Revisión en pruebas", estado: "pendiente" },
      { t: "Salida a producción", estado: "pendiente" },
    ],
  },
  {
    n: 4,
    nombre: "ARM en línea",
    duracion: "2,5 semanas",
    inicio: "2026-11-02",
    fin: "2026-11-19",
    color: "#c98a55",
    estado: "pendiente",
    resumen: "El sitio institucional. Tres idiomas y los informes conservando su dirección.",
    tareas: [
      { t: "Desarrollo en tres idiomas", estado: "pendiente" },
      { t: "Noticias, páginas y proyectos", estado: "pendiente" },
      { t: "Publicaciones e informes, misma dirección", estado: "pendiente" },
      { t: "Revisión y salida", estado: "pendiente" },
    ],
  },
  {
    n: 5,
    nombre: "Fairmined en línea",
    duracion: "2,5 semanas",
    inicio: "2026-11-19",
    fin: "2026-12-07",
    color: "#ad7257",
    estado: "pendiente",
    resumen: "Cuatro idiomas y el catálogo de proveedores, que se rehace entero.",
    tareas: [
      { t: "Desarrollo en cuatro idiomas", estado: "pendiente" },
      { t: "Catálogo y mapa de proveedores", estado: "pendiente" },
      { t: "Buscador por criterios", estado: "pendiente" },
      { t: "Revisión y salida", estado: "pendiente" },
    ],
  },
  {
    n: 6,
    nombre: "Entrega",
    duracion: "1 semana, más 90 días",
    inicio: "2026-12-07",
    fin: "2026-12-14",
    color: "#8d6055",
    estado: "pendiente",
    resumen: "Que el equipo pueda manejarlo solo, y tres meses de acompañamiento.",
    tareas: [
      { t: "Manuales", estado: "pendiente" },
      { t: "Taller con el equipo", estado: "pendiente" },
      { t: "Analítica", estado: "pendiente" },
      { t: "Vigilancia de enlaces, 90 días", estado: "pendiente" },
    ],
  },
];

export const esperando: { que: string; para: string; desde: string }[] = [
  {
    que: "Acceso al servidor",
    para: "Traer los archivos que no se ven desde fuera y cerrar la copia de resguardo.",
    desde: "2026-09-22",
  },
  {
    que: "Acceso a Google Search Console",
    para: "Ver qué direcciones tienen visitas de verdad. Sin eso, decidir qué se retira sería a ciegas.",
    desde: "2026-09-22",
  },
  {
    que: "Manual de marca",
    para: "Diseñar los tres sitios.",
    desde: "2026-09-22",
  },
  {
    que: "Definición de los servicios mensuales",
    para: "Abrir las cuentas a nombre de ARM.",
    desde: "2026-09-22",
  },
];

export const hallazgos: { titulo: string; texto: string }[] = [
  {
    titulo: "Nada se pierde",
    texto:
      "Ya está descargado todo lo que los sitios publican: 19.228 registros y 10,4 GB de archivos. Entre ellos 1.599 documentos, que conservan su dirección exacta.",
  },
  {
    titulo: "Los sitios hablan cuatro idiomas",
    texto:
      "ARM en español, inglés y francés. Fairmined suma alemán. Es lo que más pesa en el cronograma.",
  },
  {
    titulo: "Tres de cada cuatro direcciones no son contenido",
    texto:
      "WordPress fabrica solo miles de páginas vacías. Nadie las escribió. Retirarlas mejora la posición en Google.",
  },
  {
    titulo: "153 enlaces ya estaban rotos",
    texto:
      "Aparecen en la biblioteca pero el servidor no los entrega. Es de antes, no de la migración. Ya están identificados uno por uno.",
  },
];

export const proximoHito = {
  titulo: "Cerrar la copia de resguardo y acordar qué contenido pasa al sitio nuevo",
  detalle: "Con eso arranca la construcción del primer sitio.",
};
