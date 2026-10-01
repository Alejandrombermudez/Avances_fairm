/**
 * Los entregables que ya existen, en versión corta para leer en pantalla.
 *
 * Cada documento se parte en hojas para que ninguna quede larga. La hoja es la
 * unidad: si no cabe en una pantalla de portátil sin desplazarse mucho, se
 * parte en dos.
 *
 * ESTA PÁGINA ES PÚBLICA. Valen los números y los nombres de contenido. No
 * valen versiones de software del cliente, direcciones de paneles, rutas del
 * servidor ni asuntos del contrato. Ver README.
 *
 * El asterisco marca negrita: "se arman *solas*".
 */

export type Bloque =
  | { k: "texto"; texto: string }
  | {
      k: "par";
      hoy: { titulo: string; lineas: string[] };
      nuevo: { titulo: string; lineas: string[] };
    }
  | { k: "ficha"; titulo: string; filas: { campo: string; valor: string; pastillas?: string[] }[] }
  | { k: "junta"; filas: { de: string[]; a: string; nota: string }[] }
  | { k: "cifras"; items: { n: string; t: string }[] }
  | { k: "tabla"; cabeceras: [string, string]; filas: [string, string][] }
  | { k: "barras"; items: { etiqueta: string; pct: number; n: string }[] }
  | { k: "nota"; titulo: string; texto: string }
  | { k: "puntos"; items: { titulo: string; texto: string }[] };

export type Hoja = { titulo: string; bloques: Bloque[] };

export type Documento = {
  titulo: string;
  resumen: string;
  fecha: string;
  hojas: Hoja[];
};

export const documentos: Record<string, Documento> = {
  /* ───────────────────────────────────────────────────────────── */
  "modelo-de-contenido": {
    titulo: "Cómo queda organizado el contenido",
    resumen:
      "Hoy el contenido de los tres sitios está repartido en más de veinte tipos distintos, muchos creados por programas que se fueron instalando con los años. Queda agrupado en nueve.",
    fecha: "2026-09-30",
    hojas: [
      {
        titulo: "Las publicaciones",
        bloques: [
          {
            k: "texto",
            texto:
              "Sus informes, estándares y publicaciones son el material que más se cita desde fuera. Hoy el sistema no los trata como documentos, sino como archivos pegados a una noticia.",
          },
          {
            k: "par",
            hoy: {
              titulo: "Un archivo suelto",
              lineas: [
                "El documento se llama *09-08-2014-ARM-Niveles-de-Responsabilidad-Ingles.pdf*",
                "El título, la fecha y el idioma están metidos en el nombre del archivo. Para el sistema es solo un adjunto.",
                "No se puede buscar por año ni por tema, y la página de Publicaciones hay que armarla enlazando a mano uno por uno.",
              ],
            },
            nuevo: {
              titulo: "Una publicación con ficha",
              lineas: [
                "Los mismos datos, pero cada uno en su casilla. Se llenan una vez, al subir el documento.",
                "A partir de ahí se puede buscar, filtrar y ordenar. Y las páginas que listan publicaciones *se arman solas*.",
              ],
            },
          },
          {
            k: "ficha",
            titulo: "La ficha, por dentro",
            filas: [
              { campo: "Título", valor: "Niveles de Responsabilidad" },
              { campo: "Tipo", valor: "Guía" },
              { campo: "Año", valor: "2014" },
              { campo: "Idioma", valor: "Inglés" },
              { campo: "Temas", valor: "", pastillas: ["Debida diligencia", "Cadena de suministro"] },
              { campo: "Proyecto", valor: "Somos Tesoro" },
              { campo: "Archivo", valor: "El PDF, en la misma dirección de siempre" },
            ],
          },
          {
            k: "nota",
            titulo: "Los enlaces no cambian",
            texto:
              "Esa última línea importa. Los enlaces que ya están publicados en otros sitios y documentos siguen funcionando.",
          },
        ],
      },
      {
        titulo: "Lo que se junta",
        bloques: [
          {
            k: "texto",
            texto:
              "Con los años se instalaron programas distintos para hacer lo mismo. Cada uno creó su propio tipo de contenido.",
          },
          {
            k: "junta",
            filas: [
              {
                de: [
                  "Línea de tiempo de ARM",
                  "Historias de ARM",
                  "Línea de tiempo de CRAFT",
                  "Anuncios de CRAFT",
                ],
                a: "Evento",
                nota: "Cuatro programas distintos hacían lo mismo",
              },
              {
                de: ["Catálogo de proveedores", "Proveedores del mapa"],
                a: "Proveedor",
                nota: "Eran dos listas del mismo proveedor",
              },
              {
                de: [
                  "Aliados y donantes",
                  "Clientes",
                  "Marcas joyeras y diseñadores",
                  "Marcas licenciadas",
                ],
                a: "Organización",
                nota: "Todas son empresas externas con logo, país y sitio web. Un campo dice qué papel cumple cada una",
              },
            ],
          },
        ],
      },
      {
        titulo: "Lo que deja de estar suelto",
        bloques: [
          {
            k: "par",
            hoy: {
              titulo: "El equipo son páginas sueltas",
              lineas: [
                "Cada integrante es una página independiente, al mismo nivel que Quiénes Somos o Publicaciones.",
                "Por eso el sitio de ARM tiene cien secciones principales, y setenta y cinco tienen un solo elemento dentro.",
              ],
            },
            nuevo: {
              titulo: "El equipo es una lista",
              lineas: [
                "Cada persona tiene su ficha con nombre, cargo, foto y área.",
                "La página de equipo se arma sola con esas fichas. Agregar a alguien es *llenar una ficha, no crear una página*.",
              ],
            },
          },
          {
            k: "par",
            hoy: {
              titulo: "Las marcas joyeras son solo un nombre",
              lineas: [
                "Las *95 marcas que trabajan con oro Fairmined* —Alex Monroe, April Doubleday, Aether Diamonds, Adoro Mi Oro, Anna Loucah— están en el sistema como etiquetas de clasificación.",
                "Una etiqueta solo guarda un nombre. *No puede tener logo, ni país, ni sitio web*, porque no está hecha para eso.",
              ],
            },
            nuevo: {
              titulo: "Cada marca tiene su ficha",
              lineas: [
                "Con logo, país, sitio web y las colecciones que hicieron con su oro.",
                "Pueden aparecer en el catálogo, tener página propia, y filtrarse por país igual que los proveedores.",
              ],
            },
          },
        ],
      },
      {
        titulo: "Las etiquetas",
        bloques: [
          {
            k: "cifras",
            items: [
              { n: "2.299", t: "etiquetas y categorías distintas hay hoy entre los tres sitios" },
              { n: "~20", t: "temas quedan, elegidos por ustedes" },
            ],
          },
          {
            k: "texto",
            texto:
              "En ARM hay *1.054 etiquetas para 1.078 noticias*. Es casi una etiqueta distinta por noticia, así que en la práctica no agrupan nada: buscar por etiqueta devuelve una sola noticia casi siempre.",
          },
          {
            k: "texto",
            texto:
              "Pasó porque el sistema actual permite crear una etiqueta con solo escribirla. Nadie hizo nada mal; la herramienta lo facilitaba y con los años se acumularon.",
          },
          {
            k: "texto",
            texto:
              "En el sistema nuevo los temas se eligen de una lista. No se pueden inventar desde el formulario. Ampliar la lista es una decisión que se toma aparte.",
          },
          {
            k: "nota",
            titulo: "Esto lo deciden ustedes",
            texto:
              "Esa lista de unos veinte temas es la columna vertebral de cómo queda agrupado todo el contenido. Nosotros proponemos un borrador a partir de lo que ya existe, pero quién mejor que ustedes sabe cómo habla la organización de su trabajo.",
          },
        ],
      },
      {
        titulo: "El resumen",
        bloques: [
          { k: "texto", texto: "Todo lo que hay hoy, y en qué queda." },
          {
            k: "tabla",
            cabeceras: ["Lo que tienen hoy", "Queda como"],
            filas: [
              ["Noticias y comunicados", "Artículo"],
              ["Páginas del sitio", "Página"],
              ["PDFs de informes, estándares y publicaciones", "Publicación · tipo nuevo"],
              ["Proyectos", "Proyecto"],
              ["Catálogo y mapa de proveedores", "Proveedor"],
              ["Perfiles de comunidades e historias", "Historia"],
              ["Preguntas frecuentes", "Pregunta frecuente"],
              ["Cuatro tipos de línea de tiempo y anuncios", "Evento"],
              ["Páginas de cada integrante del equipo", "Persona · tipo nuevo"],
              ["Aliados, donantes, clientes, marcas joyeras", "Organización · tipo nuevo"],
              ["2.299 etiquetas y categorías", "~20 temas y listas cerradas"],
              ["Páginas vacías que crea el sistema solo", "No pasan. Se redirigen"],
            ],
          },
        ],
      },
      {
        titulo: "Para quien publica",
        bloques: [
          {
            k: "puntos",
            items: [
              {
                titulo: "Se llenan campos, no se maqueta",
                texto:
                  "Hoy una noticia se arma arrastrando bloques. En adelante se escribe el título, el texto, se eligen los temas y se sube la foto. El diseño lo pone el sitio.",
              },
              {
                titulo: "Se publica una vez, en varios idiomas",
                texto:
                  "Hoy cada traducción es una página aparte que puede quedar desactualizada sin que nadie lo note. En adelante es un solo contenido con sus versiones, y se ve de un vistazo cuál falta traducir.",
              },
              {
                titulo: "Las listas se arman solas",
                texto:
                  "La página de Publicaciones, la de Equipo, la de Proyectos. Se agrega la ficha y aparece donde corresponda, sin tocar la página.",
              },
              {
                titulo: "No se puede romper el sitio",
                texto:
                  "El lugar donde se escribe y el sitio público son dos sistemas separados. Un error al publicar no tumba la página.",
              },
            ],
          },
        ],
      },
    ],
  },

  /* ───────────────────────────────────────────────────────────── */
  inventario: {
    titulo: "Qué hay hoy en los tres sitios",
    resumen:
      "Las direcciones de los tres sitios, contadas una por una a partir de lo que ellos mismos declaran a los buscadores.",
    fecha: "2026-09-24",
    hojas: [
      {
        titulo: "La cuenta",
        bloques: [
          {
            k: "cifras",
            items: [
              { n: "10.369", t: "direcciones indexadas en total" },
              { n: "2.679", t: "son contenido que alguien escribió" },
            ],
          },
          {
            k: "texto",
            texto:
              "*Tres de cada cuatro direcciones no son contenido.* El resto lo fabrica el sistema solo, una por cada archivo subido y una por cada etiqueta creada. Nadie las escribió y nadie las lee.",
          },
          {
            k: "tabla",
            cabeceras: ["Sitio", "Direcciones"],
            filas: [
              ["responsiblemines.org", "5.759"],
              ["fairmined.org", "4.513"],
              ["craftmines.org", "97"],
            ],
          },
        ],
      },
      {
        titulo: "De dónde sale el resto",
        bloques: [
          {
            k: "puntos",
            items: [
              {
                titulo: "5.331 páginas de archivo",
                texto:
                  "El sistema crea una página por cada imagen o PDF que se sube. No tienen texto ni título. Están indexadas en Google y compiten con las páginas reales.",
              },
              {
                titulo: "2.346 páginas de etiqueta",
                texto:
                  "Una página por cada etiqueta y categoría. En ARM hay 1.054 etiquetas de noticias y 432 de proyectos, para 217 proyectos.",
              },
              {
                titulo: "459 direcciones repetidas",
                texto:
                  "Llevan el sufijo que el sistema añade cuando el nombre ya existía: una misma página guardada dos veces. Se queda la buena y la otra se redirige.",
              },
            ],
          },
          {
            k: "nota",
            titulo: "Retirarlas mejora la posición en Google",
            texto:
              "Son páginas sin contenido que diluyen la autoridad del sitio. Antes de retirar nada se cruza con los datos de visitas reales, para no tocar una dirección que sí recibe gente.",
          },
        ],
      },
      {
        titulo: "Los idiomas",
        bloques: [
          {
            k: "texto",
            texto:
              "Los tres sitios son multilingües y cada traducción es hoy una página aparte. *Es lo que más pesa en el cronograma.*",
          },
          {
            k: "tabla",
            cabeceras: ["Sitio", "Idiomas y direcciones"],
            filas: [
              ["responsiblemines.org", "Español 2.651 · Inglés 2.470 · Francés 638"],
              ["fairmined.org", "Inglés 2.752 · Español 1.162 · Francés 332 · Alemán 267"],
              ["craftmines.org", "Español 97"],
            ],
          },
          {
            k: "texto",
            texto:
              "Las direcciones de CRAFT bajo /en/ listan las mismas páginas que las de español: son espejos, no contenido aparte.",
          },
        ],
      },
    ],
  },

  /* ───────────────────────────────────────────────────────────── */
  constructores: {
    titulo: "Con qué está construido el contenido",
    resumen:
      "Antes de escribir la herramienta que traslada el contenido hay que saber en qué formato está guardado. Medido sobre los 2.650 registros de contenido real.",
    fecha: "2026-09-29",
    hojas: [
      {
        titulo: "La medición",
        bloques: [
          {
            k: "texto",
            texto:
              "Los tres sitios no se maquetaron con la misma herramienta. Con los años se usaron *dos constructores visuales distintos*, y cada uno guarda el contenido en su propio formato.",
          },
          {
            k: "barras",
            items: [
              { etiqueta: "Divi", pct: 37.9, n: "1.005 registros" },
              { etiqueta: "Texto limpio", pct: 34.9, n: "926 registros" },
              { etiqueta: "Elementor", pct: 14.6, n: "388 registros" },
              { etiqueta: "Sin contenido", pct: 12.5, n: "331 registros" },
            ],
          },
          {
            k: "texto",
            texto:
              "ARM es casi todo Divi: 266 de sus 296 páginas y los 214 proyectos. Fairmined es Elementor. CRAFT mezcla los dos.",
          },
        ],
      },
      {
        titulo: "Qué implica",
        bloques: [
          {
            k: "puntos",
            items: [
              {
                titulo: "Hacen falta dos conversores, no uno",
                texto:
                  "Uno por constructor. Es trabajo medible: nueve etiquetas cubren casi todo Divi, y ocho componentes cubren Elementor de los 53 que existen.",
              },
              {
                titulo: "Un tercio del contenido pasa directo",
                texto:
                  "Los 926 registros de texto limpio no necesitan conversión. Son sobre todo noticias, que es el contenido que más se consulta.",
              },
              {
                titulo: "331 registros están vacíos",
                texto:
                  "Fichas de proveedor y anuncios que guardan sus datos en campos aparte, no en el cuerpo del texto. Se migran por esos campos.",
              },
              {
                titulo: "Las 44 páginas difíciles están identificadas",
                texto:
                  "Páginas con maquetación especial que no se resuelven automáticamente. Se rehacen a mano, y ya sabemos cuáles son: no van a aparecer como sorpresa a mitad del proyecto.",
              },
            ],
          },
        ],
      },
    ],
  },

  /* ───────────────────────────────────────────────────────────── */
  respaldo: {
    titulo: "Qué quedó guardado",
    resumen:
      "Antes de tocar nada se descargó todo lo que los tres sitios publican, y se verificó archivo por archivo contra lo que la biblioteca de medios declara.",
    fecha: "2026-09-30",
    hojas: [
      {
        titulo: "La descarga",
        bloques: [
          {
            k: "tabla",
            cabeceras: ["Sitio", "Archivos y tamaño"],
            filas: [
              ["craftmines.org", "640 archivos · 1,10 GB"],
              ["fairmined.org", "3.805 archivos · 2,66 GB"],
              ["responsiblemines.org", "5.213 archivos · 6,67 GB"],
              ["Total", "9.658 archivos · 10,42 GB"],
            ],
          },
          {
            k: "texto",
            texto:
              "Cada archivo quedó en disco *conservando su ruta original*, la misma que tiene hoy en el servidor. Archivos ausentes: 0. Archivos vacíos: 0.",
          },
          {
            k: "texto",
            texto:
              "Entre ellos hay 1.599 documentos descargables: informes anuales, estándares y publicaciones. Son el material que más se cita desde fuera y el que no puede cambiar de dirección.",
          },
        ],
      },
      {
        titulo: "153 enlaces ya estaban rotos",
        bloques: [
          {
            k: "cifras",
            items: [
              { n: "153", t: "direcciones que la biblioteca lista pero el servidor ya no entrega" },
              { n: "15", t: "de ellas son documentos descargables" },
            ],
          },
          {
            k: "texto",
            texto:
              "*Es de antes, no de la migración.* Aparecen en la biblioteca de medios, pero el archivo ya no está. Quedaron listadas una por una.",
          },
          {
            k: "nota",
            titulo: "Qué se hace con ellas",
            texto:
              "Si el archivo aparece en el respaldo del servidor, se recupera y el enlace vuelve a funcionar. Si no aparece, el enlace se retira de donde esté citado, que es mejor que dejarlo dando error.",
          },
        ],
      },
      {
        titulo: "Lo que no entra por esta vía",
        bloques: [
          {
            k: "texto",
            texto:
              "Esta descarga cubre lo que los sitios publican hacia fuera. Hay dos cosas que desde fuera no se ven.",
          },
          {
            k: "puntos",
            items: [
              {
                titulo: "Archivos sin registro en la biblioteca",
                texto:
                  "Si alguien subió un archivo por fuera del sistema, no aparece listado en ningún sitio y no hay forma de pedirlo. Para eso hace falta el respaldo del servidor.",
              },
              {
                titulo: "Contenido sin publicar",
                texto:
                  "Borradores y páginas despublicadas. No se sirven hacia fuera, así que no se pueden descargar por esta vía.",
              },
            ],
          },
          {
            k: "nota",
            titulo: "Por eso el respaldo del servidor todavía hace falta",
            texto:
              "No para rehacer el trabajo, que ya está hecho, sino para cerrar estos dos huecos y poder afirmar que no se perdió nada.",
          },
        ],
      },
    ],
  },
};
