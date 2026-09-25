// Renderiza um conjunto de stories HTML em imagens PNG 1080x1920 (formato Story do Instagram).
// Uso:  node templates/stories/render.js <pasta-dos-stories>
// Ex:   node templates/stories/render.js conteudo/2026-06-30-cinco-erros
//
// Lê <pasta>/stories.html, tira um print de cada elemento .story e salva em
// <pasta>/instagram-stories/story-01.png, story-02.png, ...
// Antes de printar, remove as guias de área segura (.safe-guide): elas só existem pra você
// enxergar o limite enquanto monta, e NÃO devem sair na imagem final.

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
  console.error('Falta a pasta. Uso: node templates/stories/render.js <pasta-dos-stories>');
  process.exit(1);
}

const { folder: safeFolder, htmlPath } = await resolveRenderInput({
  workspaceRoot: process.cwd(),
  requestedFolder: folder,
  htmlName: 'stories.html',
  outputName: 'instagram-stories',
});
const outDir = await prepareOutputDirectory(safeFolder, 'instagram-stories');

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1080, height: 1920 },
  deviceScaleFactor: 2,
  javascriptEnabled: false,
});

await installNetworkBlock(page, safeFolder);
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load', timeout: 10_000 });
await page.waitForTimeout(400);

// Remove as guias de área segura antes de printar (são só pra montar, não saem na arte).
await page.$$eval('.safe-guide', (els) => els.forEach((e) => e.remove()));

const stories = await page.$$('.story');
assertRenderableCount(stories.length, 'story');

for (let i = 0; i < stories.length; i++) {
  const n = String(i + 1).padStart(2, '0');
  await stories[i].screenshot({ path: path.join(outDir, `story-${n}.png`), timeout: 10_000 });
  console.log(`story-${n}.png ok`);
}

await browser.close();
console.log(`Render completo: ${stories.length} imagens em ${outDir}`);
