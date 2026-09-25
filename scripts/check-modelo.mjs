#!/usr/bin/env node

// Confere se um modelo (ou uma peça montada) pode ser renderizado com segurança.
// Uso:  node scripts/check-modelo.mjs [arquivo.html ...]
// Sem argumento, confere todos os modelos de templates/carrossel/ e templates/stories/.
// Ex:   node scripts/check-modelo.mjs conteudo/2026-08-17-tema/carrossel.html
//
// O renderizador abre o arquivo com JavaScript desligado e rede bloqueada. O que este script
// procura é justamente o que quebra nesse ambiente ou o que não deveria estar num arquivo que o
// dono também abre no navegador dele.

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const NOME_VALIDO = /^modelo(-[a-z0-9-]+)?\.html$/;

const PROIBIDOS = [
  { teste: /<script\b/i, recado: 'tem <script>, e o render roda com JavaScript desligado' },
  { teste: /\son[a-z]+\s*=\s*["']/i, recado: 'tem evento inline (onclick, onerror e afins), que nunca dispara no render' },
  { teste: /javascript:/i, recado: 'tem link javascript:' },
  { teste: /@import/i, recado: 'tem @import, e o render bloqueia a rede' },
  { teste: /<link\b/i, recado: 'tem <link>, e o CSS precisa ser interno' },
  { teste: /<(iframe|object|embed)\b/i, recado: 'tem iframe, object ou embed' },
  { teste: /\bsrcdoc\s*=/i, recado: 'tem srcdoc' },
  { teste: /(?:src|href)\s*=\s*["']https?:\/\//i, recado: 'aponta pra um endereço da internet, e o render bloqueia a rede' },
  { teste: /url\(\s*["']?https?:\/\//i, recado: 'usa uma imagem ou fonte da internet no CSS, e o render bloqueia a rede' },
  { teste: /(?:src|href)\s*=\s*["'](?:\/|[a-z]:[\\/]|\.\.\/)/i, recado: 'aponta pra fora da pasta da peça (caminho absoluto ou ../)' },
  { teste: /url\(\s*["']?(?:\/|[a-z]:[\\/]|\.\.\/)/i, recado: 'o CSS aponta pra fora da pasta da peça' },
];

function problemasDe(nome, conteudo) {
  const problemas = [];

  // A regra de nome vale pro modelo do catálogo. Peça montada (carrossel.html, stories.html)
  // passa direto pras regras de conteúdo, que são as mesmas.
  if (/^modelo/i.test(nome) && !NOME_VALIDO.test(nome)) {
    problemas.push('o nome do arquivo precisa ser modelo-<slug>.html, só com letras minúsculas, números e hífen');
  }

  for (const { teste, recado } of PROIBIDOS) {
    if (teste.test(conteudo)) problemas.push(recado);
  }

  const temSlide = /class\s*=\s*["'][^"']*\b(slide|story)\b/i.test(conteudo);
  if (!temSlide) {
    problemas.push('nenhum elemento com a classe slide (ou story), então o render não acha o que fotografar');
  }

  return problemas;
}

async function modelosPadrao(raiz) {
  const encontrados = [];
  for (const pasta of ['carrossel', 'stories']) {
    const dir = path.join(raiz, 'templates', pasta);
    let entradas = [];
    try {
      entradas = await readdir(dir);
    } catch {
      continue;
    }
    for (const nome of entradas) {
      if (nome.startsWith('modelo') && nome.endsWith('.html')) encontrados.push(path.join(dir, nome));
    }
  }
  return encontrados.sort();
}

export async function checarModelos(arquivos) {
  const resultados = [];
  for (const arquivo of arquivos) {
    const conteudo = await readFile(arquivo, 'utf8');
    resultados.push({ arquivo, problemas: problemasDe(path.basename(arquivo), conteudo) });
  }
  return resultados;
}

async function main() {
  const raiz = process.cwd();
  const pedidos = process.argv.slice(2);
  const arquivos = pedidos.length > 0 ? pedidos.map((p) => path.resolve(raiz, p)) : await modelosPadrao(raiz);

  if (arquivos.length === 0) {
    process.stderr.write('check-modelo: nenhum modelo encontrado pra conferir.\n');
    process.exitCode = 2;
    return;
  }

  const resultados = await checarModelos(arquivos);
  const comProblema = resultados.filter((r) => r.problemas.length > 0);

  for (const { arquivo, problemas } of comProblema) {
    process.stdout.write(`${path.relative(raiz, arquivo)}\n`);
    for (const problema of problemas) process.stdout.write(`  - ${problema}\n`);
  }

  if (comProblema.length === 0) {
    process.stdout.write(`${arquivos.length} modelo(s) conferido(s), nenhum problema.\n`);
    process.exitCode = 0;
    return;
  }

  process.stdout.write(`\n${comProblema.length} de ${arquivos.length} modelo(s) precisam de conserto antes de virar peça.\n`);
  process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
