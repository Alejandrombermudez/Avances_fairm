import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    // Las imagenes del contenido migrado salen del CDN de Sanity.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async redirects() {
    return [
      // La direccion que ya circula del demo anterior.
      { source: "/craft/sitio", destination: "/sitio", permanent: false },
      { source: "/craft/sitio/:ruta*", destination: "/sitio/:ruta*", permanent: false },
      // Aqui hubo una replica del sitio de hoy, en /sitio y /sitio/<pagina>.
      // Se quito: para comparar esta el sitio real. Sus direcciones, que ya
      // circulan, llevan a la misma pagina en la propuesta.
      { source: "/sitio", destination: "/sitio/propuesta", permanent: false },
      {
        source: "/sitio/:pagina((?!propuesta$|comparar$)[^/]+)",
        destination: "/sitio/propuesta/:pagina",
        permanent: false,
      },
      // En la propuesta las preguntas tienen pagina disenada. El menu viene
      // del gestor y apunta a la pagina de siempre, asi que se la lleva alli.
      {
        source: "/sitio/propuesta/preguntas-frecuentes",
        destination: "/sitio/propuesta/preguntas",
        permanent: false,
      },
    ];
  },
};

export default config;
