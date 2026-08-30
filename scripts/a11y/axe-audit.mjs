// Requiere playwright y @axe-core/playwright, que NO son dependencias del
// proyecto (el postinstall de playwright descargaría navegadores en cada
// deploy). Con el sitio corriendo (npm run build && npm run start):
//
//   PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npx -y -p playwright -p @axe-core/playwright \
//     node scripts/a11y/axe-audit.mjs        # o keyboard.mjs
//
// Usa el Edge instalado (channel "msedge"); BASE=http://localhost:3000 por defecto.
// Auditoría axe-core (vía Playwright + Edge instalado) sobre las 12 páginas,
// en tema claro y oscuro, más dos estados: visor abierto y menú móvil abierto.
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const PAGES = [
  "/", "/es",
  "/projects", "/es/projects",
  "/contact", "/es/contact",
  "/projects/dma", "/es/projects/dma",
  "/projects/gourmetify", "/es/projects/gourmetify",
  "/projects/nova-sushi", "/es/projects/nova-sushi",
];
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

const browser = await chromium.launch({ channel: "msedge", headless: true });
const rows = [];
let totalViolations = 0;
const incompleteByRule = new Map();

async function audit(page, label) {
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const v = results.violations;
  totalViolations += v.length;
  rows.push({ label, violations: v.length, passes: results.passes.length, incomplete: results.incomplete.length });
  for (const viol of v) {
    console.log(`  VIOLATION ${label} · ${viol.impact} · ${viol.id}: ${viol.help} (${viol.nodes.length} nodos)`);
    for (const n of viol.nodes.slice(0, 3)) console.log(`      → ${n.target.join(" ")}`);
  }
  for (const inc of results.incomplete) {
    const prev = incompleteByRule.get(inc.id) ?? { count: 0, samples: new Set() };
    prev.count += inc.nodes.length;
    for (const n of inc.nodes) {
      const why = n.any?.[0]?.message ?? n.all?.[0]?.message ?? "";
      prev.samples.add(`${n.target.join(" ")} — ${why.slice(0, 90)}`);
    }
    incompleteByRule.set(inc.id, prev);
  }
}

for (const scheme of ["light", "dark"]) {
  const context = await browser.newContext({ colorScheme: scheme, viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  for (const p of PAGES) {
    await page.goto(BASE + p, { waitUntil: "networkidle" });
    const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
    await audit(page, `${scheme === "dark" ? "oscuro" : "claro "} ${p}${scheme === "dark" && !isDark ? " (sin .dark!)" : ""}`);
  }

  // Estado: visor de imágenes abierto
  await page.goto(BASE + "/projects/gourmetify", { waitUntil: "networkidle" });
  await page.locator("button[aria-haspopup=dialog]").first().click();
  await page.waitForSelector("dialog[open]");
  await audit(page, `${scheme === "dark" ? "oscuro" : "claro "} /projects/gourmetify + visor abierto`);
  await context.close();
}

// Estado: menú móvil abierto (viewport móvil, tema claro)
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(BASE + "/es", { waitUntil: "networkidle" });
  await page.locator("button[aria-controls=mobile-menu]").click();
  await page.waitForSelector("#mobile-menu");
  await audit(page, "móvil  /es + menú abierto");
  await context.close();
}

await browser.close();

console.log("\n" + "estado/página".padEnd(48) + "violaciones  reglas OK  incompletas");
for (const r of rows) {
  console.log(`${r.label.padEnd(48)} ${String(r.violations).padStart(11)}  ${String(r.passes).padStart(9)}  ${String(r.incomplete).padStart(11)}`);
}
console.log(`\nTotal violaciones: ${totalViolations} en ${rows.length} auditorías (axe-core, tags: ${TAGS.join(", ")})`);
if (incompleteByRule.size) {
  console.log("Reglas 'incomplete' (axe no pudo decidir; revisión manual):");
  for (const [id, info] of incompleteByRule) {
    console.log(`  - ${id}: ${info.count} nodos; distintos: ${info.samples.size}`);
    for (const s of [...info.samples].slice(0, 12)) console.log(`      · ${s}`);
  }
}
process.exit(totalViolations ? 1 : 0);
