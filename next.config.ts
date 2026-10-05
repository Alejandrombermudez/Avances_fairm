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
    ];
  },
};

export default config;
