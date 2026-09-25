#!/usr/bin/env node

import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const DEFAULT_EXCLUDES = new Set([
  '.git',
  '.next',
  'build',
  'coverage',
  'dist',
  'instagram',
  'instagram-stories',
  'node_modules',
]);

const MAX_SCAN_BYTES = 2 * 1024 * 1024;

const TEXT_EXTENSIONS = new Set([
  '.cjs', '.css', '.env', '.go', '.html', '.java', '.js', '.json', '.jsx', '.md', '.mjs',
  '.php', '.properties', '.ps1', '.py', '.sh', '.sql', '.svelte', '.toml', '.ts', '.tsx',
  '.vue', '.xml', '.yaml', '.yml',
]);

const PLACEHOLDER_MARKERS = [
  'changeme', 'example', 'fake', 'placeholder', 'replace-me', 'sample', 'test',
  'todo', 'your-', 'xxxxx',
];

const RULES = [
  {
    id: 'SEC001',
    severity: 'critical',
    title: 'Possível segredo hardcoded',
    applies: () => true,
    patterns: [
      /(?:api[_-]?key|aws[_-]?secret[_-]?access[_-]?key|client[_-]?secret|password|private[_-]?key|secret[_-]?access[_-]?key|service[_-]?role(?:[_-]?key)?|token)\s*[:=]\s*["']?([A-Za-z0-9_./+=-]{12,})["']?/gi,
      /\b((?:ghp|github_pat|sk_(?:live|prod)|sk-live|sk-proj|AKIA)[A-Za-z0-9_-]{12,})\b/g,
    ],
    recommendation: 'Revogar/rotacionar a credencial e movê-la para um secret manager no backend.',
    validateMatch: (match, file) => {
      if (isExampleEnv(file)) return false;
      const candidate = String(match[1] ?? match[0]).toLowerCase();
      return !PLACEHOLDER_MARKERS.some((marker) => candidate.includes(marker));
    },
  },
  {
    id: 'CFG001',
    severity: 'high',
    title: 'Dependência executável usa versão mutável',
    applies: (file) => /(?:^|\/)(?:\.mcp\.json|package\.json|.*\.toml)$/i.test(file),
    patterns: [/@latest\b/g],
    recommendation: 'Fixar uma versão exata revisada e manter a atualização em fluxo separado.',
  },
  {
    id: 'CFG002',
    severity: 'critical',
    title: 'Permissão de agente excessiva ou destrutiva',
    applies: (file) => /(?:^|\/)\.claude\/settings(?:\.local)?\.json$/i.test(file),
    patterns: [
      /Stop-Process[^\n]*-Force/gi,
      /Remove-Item[^\n]*-Recurse/gi,
      /npm install \*/gi,
      /(?:python|node)(?:3)?\s+-[ce]\s+['"]?\s*\*/gi,
      /Read\([^)]*\/\*\*\)/gi,
    ],
    recommendation: 'Trocar por allowlist de comandos e caminhos exatos, sem acesso fora do workspace.',
  },
  {
    id: 'WEB001',
    severity: 'high',
    title: 'Estado privilegiado confiado ao cliente',
    applies: isSourceFile,
    patterns: [/localStorage[^\n]*(?:admin|premium|role|subscription|token)/gi],
    recommendation: 'Validar identidade, autorização, plano e quota no backend em toda operação.',
  },
  {
    id: 'WEB002',
    severity: 'high',
    title: 'Sink de execução ou HTML perigoso',
    applies: isSourceFile,
    patterns: [/dangerouslySetInnerHTML|\.innerHTML\s*=|(?<![$\w])eval\s*\(/g],
    recommendation: 'Remover o sink ou aplicar sanitização/encoding contextual com política allowlist.',
  },
];

function isSourceFile(file) {
  return /\.(?:cjs|go|html|java|js|jsx|mjs|php|ps1|py|sh|svelte|ts|tsx|vue)$/i.test(file);
}

function isExampleEnv(file) {
  return /(?:^|\/)\.env(?:\.[^/]+)?\.example$|(?:^|\/)\.env\.example$/i.test(file);
}

function normalizeRelative(value) {
  return value.replaceAll('\\', '/').replace(/^\.\//, '').replace(/\/$/, '');
}

function parseArgs(argv) {
  let target = '.';
  let format = 'markdown';
  const excluded = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--format') {
      format = argv[index + 1];
      index += 1;
    } else if (arg === '--exclude') {
      excluded.push(normalizeRelative(argv[index + 1] ?? ''));
      index += 1;
    } else if (!arg.startsWith('--')) {
      target = arg;
    } else {
      throw new Error(`Argumento desconhecido: ${arg}`);
    }
  }

  if (!['json', 'markdown'].includes(format)) {
    throw new Error('Formato inválido. Use json ou markdown.');
  }
  if (excluded.some((item) => item.length === 0 || item === '.' || item === '..')) {
    throw new Error('Exclusão inválida. Informe um caminho relativo específico.');
  }
  return { target, format, excluded };
}

function isExplicitlyExcluded(relative, excluded) {
  const normalized = normalizeRelative(relative);
  return excluded.some((item) => normalized === item || normalized.startsWith(`${item}/`));
}

function shouldReadFile(relative) {
  const base = path.basename(relative);
  return base.startsWith('.env') || /^(?:Dockerfile|Containerfile)$/i.test(base)
    || TEXT_EXTENSIONS.has(path.extname(base).toLowerCase());
}

async function collectFiles(root, excluded) {
  const files = [];
  const oversized = [];

  async function walk(current, relative = '') {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const childRelative = normalizeRelative(path.join(relative, entry.name));
      if (isExplicitlyExcluded(childRelative, excluded)) continue;
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) {
        if (DEFAULT_EXCLUDES.has(entry.name)) continue;
        await walk(path.join(current, entry.name), childRelative);
      } else if (entry.isFile() && shouldReadFile(childRelative)) {
        const info = await stat(path.join(current, entry.name));
        if (info.size <= MAX_SCAN_BYTES) files.push(childRelative);
        else oversized.push(childRelative);
      }
    }
  }

  await walk(root);
  return {
    files: files.sort((a, b) => a.localeCompare(b)),
    oversized: oversized.sort((a, b) => a.localeCompare(b)),
  };
}

function lineNumberAt(content, offset) {
  return content.slice(0, offset).split('\n').length;
}

function inspectContent(relative, content) {
  const findings = [];
  for (const rule of RULES) {
    if (!rule.applies(relative)) continue;
    for (const pattern of rule.patterns) {
      pattern.lastIndex = 0;
      for (const match of content.matchAll(pattern)) {
        if (rule.validateMatch && !rule.validateMatch(match, relative)) continue;
        findings.push({
          ruleId: rule.id,
          severity: rule.severity,
          title: rule.title,
          file: relative,
          line: lineNumberAt(content, match.index ?? 0),
          evidence: '[REDACTED]',
          recommendation: rule.recommendation,
        });
      }
    }
  }
  return findings;
}

function summarize(findings) {
  const summary = { critical: 0, high: 0, medium: 0, low: 0, total: findings.length };
  for (const finding of findings) summary[finding.severity] += 1;
  return summary;
}

function renderMarkdown(report) {
  const status = report.summary.critical + report.summary.high > 0 ? 'BLOQUEADO' : 'SEM BLOQUEIO AUTOMÁTICO';
  const lines = [
    '# Checkup de segurança VKOS',
    '',
    `- Status: **${status}**`,
    `- Escopo: \`${report.scope.root}\``,
    `- Arquivos analisados: ${report.scope.filesScanned}`,
    `- Achados: ${report.summary.total} (${report.summary.critical} críticos, ${report.summary.high} altos)`,
    '- Limite: análise estática local; não comprova ausência de vulnerabilidades.',
    '',
  ];

  if (report.findings.length === 0) {
    lines.push('Nenhum achado nas regras automáticas. Execute também as etapas manuais da skill `/seguranca`.');
  } else {
    lines.push('## Achados', '');
    for (const finding of report.findings) {
      lines.push(
        `### ${finding.severity.toUpperCase()} · ${finding.ruleId} · ${finding.title}`,
        '',
        `- Evidência: \`${finding.file}:${finding.line}\` (valor redigido)`,
        `- Correção: ${finding.recommendation}`,
        '',
      );
    }
  }
  return `${lines.join('\n')}\n`;
}

export async function runCheckup({ target = '.', excluded = [] } = {}) {
  const root = path.resolve(target);
  const info = await stat(root);
  if (!info.isDirectory()) throw new Error('O alvo do checkup precisa ser um diretório.');

  const { files, oversized } = await collectFiles(root, excluded);
  const findings = oversized.map((relative) => ({
    ruleId: 'SCAN001',
    severity: 'high',
    title: 'Arquivo de texto excede o limite do scanner',
    file: relative,
    line: 1,
    evidence: '[REDACTED]',
    recommendation: `Revisar o arquivo separadamente ou dividi-lo; o limite automático é ${MAX_SCAN_BYTES} bytes.`,
  }));
  const scannerPath = path.resolve(fileURLToPath(import.meta.url));
  for (const relative of files) {
    const absolute = path.resolve(root, relative);
    if (absolute === scannerPath) continue;
    const content = await readFile(absolute, 'utf8');
    findings.push(...inspectContent(relative, content));
  }
  findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.ruleId.localeCompare(b.ruleId));
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    scope: { root, excluded, filesScanned: files.length, filesSkipped: oversized.length },
    summary: summarize(findings),
    findings,
  };
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    const report = await runCheckup({ target: args.target, excluded: args.excluded });
    process.stdout.write(args.format === 'json' ? `${JSON.stringify(report, null, 2)}\n` : renderMarkdown(report));
    process.exitCode = report.summary.critical + report.summary.high > 0 ? 1 : 0;
  } catch (error) {
    process.stderr.write(`security-checkup: ${error.message}\n`);
    process.exitCode = 2;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
