/**
 * Los países de la familia Fairmined: dónde va su punto en el mapa de actores
 * y cómo se llaman en español.
 *
 * El punto es el centro del país. La lista de actores 2026 dice el país de
 * cada uno, no su dirección: el mapa es preciso a ese nivel, y lo dice. Un
 * actor que en el gestor tenga su ubicación exacta (el campo «Ubicación» del
 * proveedor) sale en su sitio en vez de en el centro de su país.
 */

export const PAISES: Record<string, { lat: number; lng: number; es: string }> = {
  "United States": { lat: 39.8, lng: -98.6, es: "Estados Unidos" },
  "United Kingdom": { lat: 53.5, lng: -2.0, es: "Reino Unido" },
  France: { lat: 46.6, lng: 2.4, es: "Francia" },
  Germany: { lat: 51.2, lng: 10.4, es: "Alemania" },
  Italy: { lat: 42.8, lng: 12.6, es: "Italia" },
  Spain: { lat: 40.2, lng: -3.6, es: "España" },
  Netherlands: { lat: 52.2, lng: 5.3, es: "Países Bajos" },
  Canada: { lat: 53.0, lng: -100.0, es: "Canadá" },
  Colombia: { lat: 4.6, lng: -74.1, es: "Colombia" },
  Belgium: { lat: 50.6, lng: 4.6, es: "Bélgica" },
  Switzerland: { lat: 46.8, lng: 8.2, es: "Suiza" },
  India: { lat: 22.0, lng: 78.9, es: "India" },
  Austria: { lat: 47.6, lng: 14.6, es: "Austria" },
  Japan: { lat: 36.2, lng: 138.3, es: "Japón" },
  Denmark: { lat: 56.0, lng: 10.0, es: "Dinamarca" },
  Australia: { lat: -25.3, lng: 133.8, es: "Australia" },
  Sweden: { lat: 62.0, lng: 15.0, es: "Suecia" },
  Greece: { lat: 39.1, lng: 22.0, es: "Grecia" },
  Peru: { lat: -9.2, lng: -75.0, es: "Perú" },
  "New Zealand": { lat: -41.0, lng: 174.0, es: "Nueva Zelanda" },
  "South Africa": { lat: -29.0, lng: 24.7, es: "Sudáfrica" },
  Poland: { lat: 52.1, lng: 19.4, es: "Polonia" },
  "Czech Republic": { lat: 49.8, lng: 15.5, es: "República Checa" },
  Norway: { lat: 61.0, lng: 9.0, es: "Noruega" },
  "United Arab Emirates": { lat: 24.3, lng: 54.4, es: "Emiratos Árabes Unidos" },
  Bolivia: { lat: -16.3, lng: -64.0, es: "Bolivia" },
  Mongolia: { lat: 46.9, lng: 103.8, es: "Mongolia" },
  Ecuador: { lat: -1.8, lng: -78.2, es: "Ecuador" },
};

export const nombrePais = (pais: string | null | undefined, idioma: string) =>
  !pais ? "" : idioma === "es" ? (PAISES[pais]?.es ?? pais) : pais;
