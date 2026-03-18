/**
 * Genera íconos PNG básicos para la PWA usando Canvas API de Node.js (via --experimental-vm-modules)
 * o usando un SVG incrustado. Requiere: node generate-icons.mjs
 *
 * Alternativa más simple: usa https://progressier.com/pwa-icons-and-ios-splash-screen-generator
 * y reemplaza los archivos en public/icons/
 */

import { createCanvas } from "canvas";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, "../public/icons");

mkdirSync(iconsDir, { recursive: true });

function generateIcon(size, maskable = false) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  const padding = maskable ? size * 0.1 : 0;

  // Fondo
  ctx.fillStyle = "#16213e";
  ctx.fillRect(0, 0, size, size);

  // Círculo verde (pin de mapa)
  const cx = size / 2;
  const cy = size * 0.42;
  const r = (size - padding * 2) * 0.28;

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = "#22c55e";
  ctx.fill();

  // Punto interior blanco
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  // Cola del pin
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.5, cy + r * 0.7);
  ctx.lineTo(cx + r * 0.5, cy + r * 0.7);
  ctx.lineTo(cx, cy + r * 1.8);
  ctx.closePath();
  ctx.fillStyle = "#22c55e";
  ctx.fill();

  return canvas.toBuffer("image/png");
}

// Necesita el paquete 'canvas': npm install canvas
try {
  const sizes = [192, 512];
  for (const size of sizes) {
    writeFileSync(join(iconsDir, `icon-${size}.png`), generateIcon(size, false));
    writeFileSync(join(iconsDir, `icon-maskable-${size}.png`), generateIcon(size, true));
    console.log(`✓ Generado icon-${size}.png e icon-maskable-${size}.png`);
  }
  console.log("\n✅ Íconos generados en public/icons/");
} catch (e) {
  console.error("Error: instala 'canvas' primero: npm install canvas");
  console.error(e.message);
}
