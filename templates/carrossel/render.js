// Renderiza um carrossel HTML em imagens PNG 1080x1350 (formato Instagram).
// Uso:  node templates/carrossel/render.js <pasta-do-carrossel>
// Ex:   node templates/carrossel/render.js conteudo/2026-06-30-cinco-erros
//
// Lê <pasta>/carrossel.html, tira um print de cada elemento .slide e salva em
// <pasta>/instagram/slide-01.png, slide-02.png, ...

import { chromium } from 'playwright';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  assertRenderableCount,
  installNetworkBlock,
  prepareOutputDirectory,
  resolveRenderInput,
} from '../../scripts/lib/safe-render-path.mjs';

const folder = process.argv[2];
if (!folder) {
  console.error('Falta a pasta. Uso: node templates/carrossel/render.js <pasta-do-carrossel>');
  process.exit(1);
}

const { folder: safeFolder, htmlPath } = await resolveRenderInput({
  workspaceRoot: process.cwd(),
  requestedFolder: folder,
  htmlName: 'carrossel.html',
  outputName: 'instagram',
});
const outDir = await prepareOutputDirectory(safeFolder, 'instagram');

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1080, height: 1350 },
  deviceScaleFactor: 2,
  javascriptEnabled: false,
});

await installNetworkBlock(page, safeFolder);
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load', timeout: 10_000 });
await page.waitForTimeout(400);

const slides = await page.$$('.slide');
assertRenderableCount(slides.length, 'slide');

for (let i = 0; i < slides.length; i++) {
  const n = String(i + 1).padStart(2, '0');
  await slides[i].screenshot({ path: path.join(outDir, `slide-${n}.png`), timeout: 10_000 });
  console.log(`slide-${n}.png ok`);
}

await browser.close();
console.log(`Render completo: ${slides.length} imagens em ${outDir}`);
