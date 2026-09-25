import { lstat, mkdir, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_HTML_BYTES = 5 * 1024 * 1024;
const MAX_ASSET_BYTES = 10 * 1024 * 1024;
const MAX_TOTAL_ASSET_BYTES = 50 * 1024 * 1024;

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

export async function resolveRenderInput({
  workspaceRoot,
  requestedFolder,
  htmlName,
  outputName,
}) {
  if (!workspaceRoot || !requestedFolder || !htmlName || !outputName) {
    throw new Error('Configuração de render incompleta.');
  }

  const root = await realpath(path.resolve(workspaceRoot));
  const allowedRoot = await realpath(path.join(root, 'conteudo'));
  if (!isInside(root, allowedRoot)) {
    throw new Error('O diretório conteudo aponta para fora do workspace.');
  }
  const requested = path.resolve(root, requestedFolder);
  let folder;
  try {
    folder = await realpath(requested);
  } catch {
    throw new Error('A pasta informada não existe.');
  }

  if (!isInside(allowedRoot, folder)) {
    throw new Error('Pasta fora do diretório permitido: use uma subpasta de conteudo/.');
  }

  const htmlPath = await realpath(path.join(folder, htmlName)).catch(() => null);
  if (!htmlPath || !isInside(folder, htmlPath)) {
    throw new Error(`${htmlName} não existe ou aponta para fora da pasta permitida.`);
  }

  const htmlStat = await stat(htmlPath);
  if (!htmlStat.isFile() || htmlStat.size > MAX_HTML_BYTES) {
    throw new Error(`${htmlName} precisa ser um arquivo de até 5 MB.`);
  }

  return {
    folder,
    htmlPath,
    outputDir: path.join(folder, outputName),
  };
}

export async function prepareOutputDirectory(folder, outputName) {
  if (!outputName || path.basename(outputName) !== outputName) {
    throw new Error('Nome de saída inválido.');
  }
  const safeFolder = await realpath(folder);
  const requested = path.join(safeFolder, outputName);
  await mkdir(requested, { recursive: true });
  const outputDir = await realpath(requested);
  if (!isInside(safeFolder, outputDir)) {
    throw new Error('Diretório de saída aponta para fora da pasta permitida.');
  }
  return outputDir;
}

export async function resolveWorkspaceDirectory(workspaceRoot, relativeDirectory) {
  const root = await realpath(path.resolve(workspaceRoot));
  const directory = await realpath(path.resolve(root, relativeDirectory));
  if (!isInside(root, directory)) {
    throw new Error('O diretório solicitado aponta para fora do workspace.');
  }
  return directory;
}

export async function prepareOutputFile(folder, outputName) {
  if (!outputName || path.basename(outputName) !== outputName) {
    throw new Error('Nome de arquivo de saída inválido.');
  }
  const safeFolder = await realpath(folder);
  const outputPath = path.join(safeFolder, outputName);
  const existing = await lstat(outputPath).catch(() => null);
  if (existing?.isSymbolicLink()) {
    throw new Error('Arquivo de saída não pode ser link simbólico/junction.');
  }
  return outputPath;
}

export async function installNetworkBlock(
  page,
  allowedFileRoot,
  { maxAssetBytes = MAX_ASSET_BYTES, maxTotalAssetBytes = MAX_TOTAL_ASSET_BYTES } = {},
) {
  if (!allowedFileRoot) throw new Error('Diretório de arquivos permitidos não informado.');
  const allowedRoot = await realpath(path.resolve(allowedFileRoot));
  let servedBytes = 0;
  await page.route('**/*', async (route) => {
    const url = route.request().url();
    if (/^(?:about:|blob:|data:)/i.test(url)) {
      await route.continue();
      return;
    }
    if (/^file:/i.test(url)) {
      try {
        const filePath = await realpath(fileURLToPath(url));
        const fileStat = await stat(filePath);
        const nextTotal = servedBytes + fileStat.size;
        if (
          isInside(allowedRoot, filePath)
          && fileStat.isFile()
          && fileStat.size <= maxAssetBytes
          && nextTotal <= maxTotalAssetBytes
        ) {
          servedBytes = nextTotal;
          await route.continue();
          return;
        }
      } catch {
        // URL de arquivo inválida segue para bloqueio.
      }
    }
    await route.abort('blockedbyclient');
  });
}

export function assertRenderableCount(count, label, max = 20) {
  if (count < 1) throw new Error(`Nenhum ${label} encontrado no HTML.`);
  if (count > max) throw new Error(`Limite excedido: no máximo ${max} ${label} por render.`);
}
