// Genera los íconos del sitio (iniciales "RV" sobre fondo sólido) usando
// next/og (Satori + resvg), sin dependencias extra.
//
//   node scripts/generate-icons.mjs
//
// Salida:
//   app/favicon.ico   -> ICO con entradas PNG de 16, 32 y 48 px
//   app/icon.png      -> 192x192 (Next lo publica como <link rel="icon">)
//   app/apple-icon.png-> 180x180 (Next lo publica como apple-touch-icon)
import { createRequire } from "node:module";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { ImageResponse } = require("next/og");
const React = require("react");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BG = "#4f46e5"; // indigo-600, mismo acento que el sitio
const FG = "#ffffff";

async function renderPng(px) {
  const el = React.createElement(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BG,
        color: FG,
        fontFamily: "sans-serif",
        fontSize: `${Math.round(px * 0.52)}px`,
        letterSpacing: `${-(px * 0.03)}px`,
      },
    },
    "RV",
  );
  const res = new ImageResponse(el, { width: px, height: px });
  return Buffer.from(await res.arrayBuffer());
}

// ICO con entradas PNG (soportado por todos los navegadores actuales).
function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4);

  const dirSize = 16 * pngs.length;
  let offset = 6 + dirSize;
  const entries = [];
  for (const { px, data } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(px >= 256 ? 0 : px, 0); // width
    e.writeUInt8(px >= 256 ? 0 : px, 1); // height
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // planes
    e.writeUInt16LE(32, 6); // bpp
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

const icoSizes = [16, 32, 48];
const icoPngs = [];
for (const px of icoSizes) icoPngs.push({ px, data: await renderPng(px) });

await writeFile(path.join(ROOT, "app/favicon.ico"), buildIco(icoPngs));
await writeFile(path.join(ROOT, "app/icon.png"), await renderPng(192));
await writeFile(path.join(ROOT, "app/apple-icon.png"), await renderPng(180));

console.log("ok: app/favicon.ico (16/32/48), app/icon.png (192), app/apple-icon.png (180)");
