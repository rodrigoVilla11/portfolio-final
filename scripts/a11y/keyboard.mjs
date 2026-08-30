// Requiere playwright y @axe-core/playwright, que NO son dependencias del
// proyecto (el postinstall de playwright descargaría navegadores en cada
// deploy). Con el sitio corriendo (npm run build && npm run start):
//
//   PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npx -y -p playwright -p @axe-core/playwright \
//     node scripts/a11y/axe-audit.mjs        # o keyboard.mjs
//
// Usa el Edge instalado (channel "msedge"); BASE=http://localhost:3000 por defecto.
// Navegación por teclado real (Playwright + Edge): home, proyecto con galería,
// /contact y menú móvil. Imprime el elemento con foco tras cada tecla.
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
let failures = 0;
const check = (cond, msg) => {
  console.log(`   ${cond ? "✓" : "✗"} ${msg}`);
  if (!cond) failures += 1;
};

const describe = (p = page) =>
  p.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return "body";
    const label =
      el.getAttribute("aria-label") ||
      (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 38) ||
      el.getAttribute("placeholder") ||
      "";
    const extra = el.getAttribute("href")
      ? ` href=${el.getAttribute("href")}`
      : el.id
        ? ` #${el.id}`
        : "";
    const cs = getComputedStyle(el);
    const focusRing =
      cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0
        ? `outline ${cs.outlineWidth} ${cs.outlineStyle}`
        : cs.boxShadow !== "none"
          ? "ring"
          : "SIN INDICADOR";
    return `<${el.tagName.toLowerCase()}${extra}> "${label}" [${focusRing}]`;
  });

async function tabs(n, p = page) {
  const out = [];
  for (let i = 0; i < n; i++) {
    await p.keyboard.press("Tab");
    out.push(await describe(p));
  }
  return out;
}

/* ---------------------------- HOME ---------------------------- */
console.log("\n=== HOME (/) ===");
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.keyboard.press("Tab");
const first = await describe();
console.log(`1.º Tab → ${first}`);
check(first.includes('href=#main'), "el primer Tab cae en el skip link");
await page.keyboard.press("Enter");
await page.waitForTimeout(150);
const afterSkip = await describe();
console.log(`Enter → ${afterSkip}`);
check(afterSkip.includes("#main"), "Enter en el skip link mueve el foco a <main id=main>");
const homeOrder = await tabs(16);
homeOrder.forEach((s, i) => console.log(`   Tab ${String(i + 1).padStart(2)} → ${s}`));
check(homeOrder.every((s) => !s.includes("SIN INDICADOR")), "todos los elementos recorridos muestran indicador de foco");
check(homeOrder.some((s) => s.includes("href=/cv_en.pdf")), "el botón de descarga del CV es alcanzable");

/* ------------------- PROYECTO CON GALERÍA ---------------------- */
console.log("\n=== PROYECTO (/projects/gourmetify) ===");
await page.goto(BASE + "/projects/gourmetify", { waitUntil: "networkidle" });
let steps = 0;
let opener = "";
while (steps < 40) {
  await page.keyboard.press("Tab");
  steps += 1;
  const isZoom = await page.evaluate(() => document.activeElement?.getAttribute("aria-haspopup") === "dialog");
  if (isZoom) {
    opener = await describe();
    break;
  }
}
console.log(`Tab ×${steps} → ${opener}`);
check(opener.includes("aria") || opener.includes("Enlarge"), "se llega por Tab a un botón de ampliar imagen");
await page.keyboard.press("Enter");
await page.waitForSelector("dialog[open]", { timeout: 3000 });
const inDialog = () => page.evaluate(() => !!document.activeElement?.closest("dialog[open]"));
console.log(`Enter → dialog abierto; foco en ${await describe()}`);
check(await inDialog(), "el foco entra al dialog al abrir");
const dialogAttrs = await page.evaluate(() => {
  const d = document.querySelector("dialog[open]");
  return { role: d?.getAttribute("role") ?? "dialog (nativo)", modal: d?.getAttribute("aria-modal"), label: d?.getAttribute("aria-label") };
});
console.log(`   atributos: role=${dialogAttrs.role} aria-modal=${dialogAttrs.modal} aria-label="${dialogAttrs.label}"`);
for (let i = 0; i < 3; i++) {
  await page.keyboard.press("Tab");
  console.log(`   Tab → ${await describe()} | dentro del dialog: ${await inDialog()}`);
}
check(await inDialog(), "Tab ×3 no saca el foco del dialog (focus trap)");
await page.keyboard.press("Shift+Tab");
check(await inDialog(), "Shift+Tab tampoco sale del dialog");
await page.keyboard.press("Escape");
await page.waitForSelector("dialog[open]", { state: "detached", timeout: 3000 });
const afterEsc = await describe();
console.log(`Escape → dialog cerrado; foco en ${afterEsc}`);
check(afterEsc === opener, "el foco vuelve exactamente al botón que abrió el visor");
// Cierre con el botón ×
await page.waitForTimeout(150);
await page.keyboard.press("Enter");
await page.waitForSelector("dialog[open]", { timeout: 3000 });
console.log(`Enter (reabrir) → dialog abierto; foco en ${await describe()}`);
await page.keyboard.press("Enter"); // el foco inicial está en el botón de cerrar
await page.waitForSelector("dialog[open]", { state: "detached", timeout: 3000 });
await page.waitForTimeout(150);
check((await describe()) === opener, "cerrar con Enter en el botón × también devuelve el foco al opener");

/* --------------------------- CONTACT --------------------------- */
console.log("\n=== CONTACT (/contact) ===");
await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
const contactOrder = await tabs(18);
contactOrder.forEach((s, i) => console.log(`   Tab ${String(i + 1).padStart(2)} → ${s}`));
const idx = (needle) => contactOrder.findIndex((s) => s.includes(needle));
check(idx("#name") >= 0 && idx("#email") > idx("#name") && idx("#message") > idx("#email"), "orden nombre → email → mensaje");
check(contactOrder.some((s) => s.includes("Send message")), "el botón Enviar es alcanzable");
check(!contactOrder.some((s) => s.includes("#website")), "el honeypot nunca recibe el foco");
check(contactOrder.every((s) => !s.includes("SIN INDICADOR")), "indicador de foco en todos los elementos del formulario");

/* ------------------------ MENÚ MÓVIL --------------------------- */
console.log("\n=== MENÚ MÓVIL (/es, 390px) ===");
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mp = await mctx.newPage();
await mp.goto(BASE + "/es", { waitUntil: "networkidle" });
let msteps = 0;
while (msteps < 15) {
  await mp.keyboard.press("Tab");
  msteps += 1;
  if (await mp.evaluate(() => document.activeElement?.getAttribute("aria-controls") === "mobile-menu")) break;
}
const toggle = await describe(mp);
console.log(`Tab ×${msteps} → ${toggle}`);
await mp.keyboard.press("Enter");
await mp.waitForSelector("#mobile-menu", { timeout: 3000 });
console.log(`Enter → menú abierto; foco en ${await describe(mp)}`);
const inMenu = () => mp.evaluate(() => !!document.activeElement?.closest("#mobile-menu"));
check(await inMenu(), "el foco entra al menú al abrir");
for (let i = 0; i < 5; i++) await mp.keyboard.press("Tab");
check(await inMenu(), "Tab ×5 no sale del menú (focus trap)");
console.log(`   foco tras 5 Tab: ${await describe(mp)}`);
await mp.keyboard.press("Escape");
await mp.waitForSelector("#mobile-menu", { state: "detached", timeout: 3000 });
const afterMenuEsc = await describe(mp);
console.log(`Escape → menú cerrado; foco en ${afterMenuEsc}`);
check(afterMenuEsc === toggle, "el foco vuelve al botón hamburguesa");
await mctx.close();

await browser.close();
console.log(`\n${failures === 0 ? "TECLADO OK" : `TECLADO: ${failures} comprobaciones fallidas`}`);
process.exit(failures ? 1 : 0);
