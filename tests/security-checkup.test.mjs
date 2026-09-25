import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, readdir, stat, symlink, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

const ROOT = path.resolve(import.meta.dirname, '..');
const CHECKER = path.join(ROOT, 'scripts', 'security-checkup.mjs');
const SAFE_RENDER = path.join(ROOT, 'scripts', 'lib', 'safe-render-path.mjs');
const MODELO_CHECKER = path.join(ROOT, 'scripts', 'check-modelo.mjs');
const CHILD_ENV = Object.fromEntries(
  Object.entries(process.env).filter(([name]) => name !== 'NODE_V8_COVERAGE'),
);

async function listFilesRecursive(base) {
  const files = [];
  for (const entry of await readdir(base, { withFileTypes: true })) {
    const absolute = path.join(base, entry.name);
    if (entry.isDirectory()) files.push(...await listFilesRecursive(absolute));
    else if (entry.isFile()) files.push(absolute);
  }
  return files;
}

test('distribuição contém baseline, runbooks e skills', async () => {
  for (const relative of [
    'SECURITY.md',
    'AGENTS.md',
    'security/BASELINE.md',
    'security/LGPD-CHECKLIST.md',
    'security/THREAT-MODEL-TEMPLATE.md',
    'security/INCIDENT-RESPONSE.md',
    '.claude/skills/seguranca/SKILL.md',
    '.claude/skills/modelo/SKILL.md',
    'ideias/LEIA.md',
    '.agents/skills/vkos-security-checkup/SKILL.md',
    '.agents/skills/vkos-security-checkup/agents/openai.yaml',
  ]) {
    assert.ok((await readFile(path.join(ROOT, relative), 'utf8')).trim());
  }
});

test('a vitrine promete exatamente os comandos que a distribuição entrega', async () => {
  const skills = (await readdir(path.join(ROOT, '.claude', 'skills'), { withFileTypes: true }))
    .filter((entry) => entry.isDirectory());
  const page = await readFile(path.join(ROOT, 'capacidades.html'), 'utf8');
  const listed = page.match(/class="c">\//g) ?? [];

  assert.equal(listed.length, skills.length, 'a vitrine lista comando a mais ou a menos que existe');
  for (const skill of skills) {
    assert.ok(page.includes(`class="c">/${skill.name}<`), `/${skill.name} não aparece na vitrine`);
  }
  assert.ok(
    page.includes(`${skills.length} comandos`),
    `a vitrine anuncia um número diferente de ${skills.length} comandos`,
  );
});

test('metadados, MCPs e permissões da distribuição são determinísticos', async () => {
  const packageJson = JSON.parse(await readFile(path.join(ROOT, 'package.json'), 'utf8'));
  assert.equal(packageJson.name, 'vkos');
  assert.equal(packageJson.version, '4.1.0');
  assert.match(packageJson.description, /^VKOS:/);
  assert.equal(packageJson.dependencies.playwright, '1.61.1');
  assert.equal(packageJson.devDependencies['@playwright/mcp'], '0.0.79');
  assert.equal(packageJson.devDependencies['@upstash/context7-mcp'], '4.0.2');

  const mcp = await readFile(path.join(ROOT, '.mcp.json'), 'utf8');
  const parsedMcp = JSON.parse(mcp);
  assert.equal(parsedMcp.mcpServers.playwright.command, 'node');
  assert.equal(parsedMcp.mcpServers.context7.command, 'node');
  assert.doesNotMatch(mcp, /@latest|"npx"|"-y"/);

  const settings = await readFile(path.join(ROOT, '.claude', 'settings.json'), 'utf8');
  assert.doesNotMatch(settings, /Stop-Process|Remove-Item|npm install \*|curl[^\n]*\|/i);

  const skill = await readFile(
    path.join(ROOT, '.agents', 'skills', 'vkos-security-checkup', 'SKILL.md'),
    'utf8',
  );
  assert.match(skill, /^---\r?\nname: vkos-security-checkup\r?\ndescription: .+\r?\n---/);
  assert.doesNotMatch(skill, /\[TODO|Structuring This Skill/);
});

test('produto é VKOS, versão 4, e a matriz começa sem estado de negócio', async () => {
  const brain = await readFile(path.join(ROOT, 'cerebro', 'cerebro.md'), 'utf8');
  const design = await readFile(path.join(ROOT, 'identidade', 'design-guide.md'), 'utf8');
  assert.ok((brain.match(/✍️/g) ?? []).length >= 13);
  assert.ok((design.match(/✍️/g) ?? []).length >= 7);

  for (const relative of ['conteudo', 'materiais', 'projetos', 'ideias', 'identidade/logo', 'identidade/inspiracoes']) {
    const files = await listFilesRecursive(path.join(ROOT, relative));
    const stateFiles = files.filter((file) => path.basename(file).toLowerCase() !== 'leia.md');
    assert.deepEqual(stateFiles, [], `${relative} contém estado de instalação: ${stateFiles}`);
  }

  const example = await readFile(path.join(ROOT, 'cerebro', 'exemplo-cerebro.md'), 'utf8');
  assert.match(example, /fictício/i);
  assert.doesNotMatch(example, /VirtuoKingdom|done-for-you|Minas Gerais/i);

  const packageJson = JSON.parse(await readFile(path.join(ROOT, 'package.json'), 'utf8'));
  assert.equal(packageJson.scripts['security:check'], 'node scripts/security-checkup.mjs .');

  const portableInstructions = await Promise.all([
    'AGENTS.md',
    '.agents/skills/vkos-security-checkup/SKILL.md',
    '.claude/skills/seguranca/SKILL.md',
  ].map((relative) => readFile(path.join(ROOT, relative), 'utf8')));
  assert.doesNotMatch(portableInstructions.join('\n'), /OJGVKOS|projetos\/vkos4|raiz pode conter overlay/i);

  for (const relative of ['README.md', 'CLAUDE.md', 'SECURITY.md', 'AGENTS.md']) {
    const source = await readFile(path.join(ROOT, relative), 'utf8');
    assert.doesNotMatch(source, /^# .*VKOS 4/im, `${relative} transformou a versão em nome`);
  }

  const sitePrinciples = await readFile(path.join(ROOT, 'templates', 'site', 'principios-tecnicos.md'), 'utf8');
  assert.doesNotMatch(sitePrinciples, /wa\.me\/\d{10,}/);
});

test('checkup cobre segredos em JS, env, Python e Markdown e redige evidência', async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), 'vkos4-security-'));
  await mkdir(path.join(fixture, 'src'), { recursive: true });
  const fakeSecret = ['sk', 'live', 'DEMOONLY', '1234567890'].join('-');
  const envSecret = ['LIVEVALUE', 'ABCDEFGHIJKLMN'].join('_');
  const pythonSecret = ['PRIVATEVALUE', 'ZYXWVUTSRQPONM'].join('_');
  const markdownToken = ['github', 'pat', 'LIVEONLY123456789012'].join('_');
  await writeFile(path.join(fixture, 'src', 'client.js'), `const apiKey = "${fakeSecret}";\n`);
  await writeFile(path.join(fixture, '.env'), `SERVICE_ROLE_KEY=${envSecret}\n`);
  await writeFile(path.join(fixture, 'src', 'worker.py'), `password = '${pythonSecret}'\n`);
  await writeFile(path.join(fixture, 'notes.md'), `credencial: ${markdownToken}\n`);
  await writeFile(path.join(fixture, '.mcp.json'), '{"args":["pkg@latest"]}\n');
  const result = spawnSync(process.execPath, [CHECKER, fixture, '--format', 'json'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  assert.equal(result.status, 1);
  assert.doesNotMatch(result.stdout, new RegExp(fakeSecret));
  const report = JSON.parse(result.stdout);
  assert.ok(report.findings.some((item) => item.ruleId === 'SEC001'));
  assert.ok(report.findings.some((item) => item.ruleId === 'CFG001'));
  for (const file of ['.env', 'notes.md', 'src/worker.py']) {
    assert.ok(report.findings.some((item) => item.ruleId === 'SEC001' && item.file === file));
  }
  assert.ok(report.findings.every((item) => item.evidence === '[REDACTED]'));
});

test('checkup respeita exclusão explícita e placeholders', async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), 'vkos4-exclude-'));
  await mkdir(path.join(fixture, 'clientes', 'fora'), { recursive: true });
  await writeFile(path.join(fixture, '.env.example'), 'API_KEY=replace-me\n');
  await writeFile(
    path.join(fixture, 'clientes', 'fora', 'secret.js'),
    `const token = "${['ghp', 'EXAMPLE', '12345678901234567890'].join('_')}";\n`,
  );
  const result = spawnSync(
    process.execPath,
    [CHECKER, fixture, '--format', 'json', '--exclude', 'clientes'],
    { cwd: ROOT, encoding: 'utf8' },
  );
  assert.equal(result.status, 0);
  const report = JSON.parse(result.stdout);
  assert.equal(report.summary.total, 0);
  assert.deepEqual(report.scope.excluded, ['clientes']);
});

test('checkup não silencia AWS, Vue, arquivos grandes ou homônimo do scanner', async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), 'vkos4-security-edge-'));
  await mkdir(path.join(fixture, 'nested', 'scripts'), { recursive: true });
  await writeFile(
    path.join(fixture, '.env'),
    `AWS_SECRET_ACCESS_KEY=${['AWSLIVE', 'ABCDEFGHIJKLMN1234567890'].join('_')}\n`,
  );
  await writeFile(
    path.join(fixture, 'component.vue'),
    `<script>const token='${['VUESECRET', 'ABCDEFGHIJKLMN123456'].join('_')}'</script>\n`,
  );
  await writeFile(
    path.join(fixture, 'nested', 'scripts', 'security-checkup.mjs'),
    `const password='${['NESTEDSECRET', 'ABCDEFGHIJKLMN123456'].join('_')}';\n`,
  );
  await writeFile(path.join(fixture, 'large.css'), `/* ${'x'.repeat(2 * 1024 * 1024)} */`);

  const result = spawnSync(process.execPath, [CHECKER, fixture, '--format', 'json'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  assert.equal(result.status, 1);
  const report = JSON.parse(result.stdout);
  for (const file of ['.env', 'component.vue', 'nested/scripts/security-checkup.mjs']) {
    assert.ok(report.findings.some((item) => item.ruleId === 'SEC001' && item.file === file), file);
  }
  assert.ok(report.findings.some((item) => item.ruleId === 'SCAN001' && item.file === 'large.css'));
});

test('gates da distribuição não são autoeditáveis e CI/MCP/site começam restritos', async () => {
  const settings = await readFile(path.join(ROOT, '.claude', 'settings.json'), 'utf8');
  assert.doesNotMatch(settings, /Edit\([^)]*skills/i);

  const workflow = await readFile(path.join(ROOT, '.github', 'workflows', 'security.yml'), 'utf8');
  for (const command of [
    'npm ci --ignore-scripts',
    'npm run test:coverage',
    'npm run security:check',
    'npm audit --audit-level=high',
    'npm sbom --sbom-format cyclonedx',
  ]) assert.match(workflow, new RegExp(command.replaceAll(' ', '\\s+')));

  const mcp = JSON.parse(await readFile(path.join(ROOT, '.mcp.json'), 'utf8'));
  for (const flag of ['--isolated', '--headless', '--block-service-workers', '--allowed-origins']) {
    assert.ok(mcp.mcpServers.playwright.args.includes(flag), `Playwright MCP sem ${flag}`);
  }

  const principles = await readFile(path.join(ROOT, 'templates', 'site', 'principios-tecnicos.md'), 'utf8');
  assert.doesNotMatch(principles, /fonts\.googleapis\.com|wa\.me\/\$\{NUMERO\}\?text/i);
  assert.match(principles, /CSS e JavaScript externos/i);
  assert.match(principles, /aviso de privacidade/i);
});

test('render seguro bloqueia path traversal, junctions e rede externa', async () => {
  const {
    assertRenderableCount,
    installNetworkBlock,
    prepareOutputDirectory,
    prepareOutputFile,
    resolveRenderInput,
    resolveWorkspaceDirectory,
  } = await import(pathToFileURL(SAFE_RENDER).href);
  const fixture = await mkdtemp(path.join(tmpdir(), 'vkos4-render-'));
  const allowed = path.join(fixture, 'conteudo');
  const piece = path.join(allowed, 'ok');
  const outside = path.join(fixture, 'fora');
  await mkdir(piece, { recursive: true });
  await mkdir(outside, { recursive: true });
  await writeFile(path.join(piece, 'stories.html'), '<div class="story"></div>');
  await writeFile(path.join(outside, 'stories.html'), '<div class="story"></div>');

  const safe = await resolveRenderInput({
    workspaceRoot: fixture,
    requestedFolder: path.join('conteudo', 'ok'),
    htmlName: 'stories.html',
    outputName: 'instagram-stories',
  });
  assert.equal(safe.htmlPath, path.join(piece, 'stories.html'));
  await assert.rejects(resolveRenderInput({}), /Configuração de render incompleta/);
  await assert.rejects(
    resolveRenderInput({
      workspaceRoot: fixture,
      requestedFolder: path.join('conteudo', 'inexistente'),
      htmlName: 'stories.html',
      outputName: 'instagram-stories',
    }),
    /pasta informada não existe/i,
  );
  await mkdir(path.join(allowed, 'sem-html'), { recursive: true });
  await assert.rejects(
    resolveRenderInput({
      workspaceRoot: fixture,
      requestedFolder: path.join('conteudo', 'sem-html'),
      htmlName: 'stories.html',
      outputName: 'instagram-stories',
    }),
    /não existe ou aponta para fora/i,
  );
  await mkdir(path.join(allowed, 'html-diretorio', 'stories.html'), { recursive: true });
  await assert.rejects(
    resolveRenderInput({
      workspaceRoot: fixture,
      requestedFolder: path.join('conteudo', 'html-diretorio'),
      htmlName: 'stories.html',
      outputName: 'instagram-stories',
    }),
    /arquivo de até 5 MB/i,
  );
  await assert.rejects(
    resolveRenderInput({
      workspaceRoot: fixture,
      requestedFolder: outside,
      htmlName: 'stories.html',
      outputName: 'instagram-stories',
    }),
    /fora do diretório permitido/i,
  );

  const escapedRoot = await mkdtemp(path.join(tmpdir(), 'vkos4-root-link-'));
  await symlink(outside, path.join(escapedRoot, 'conteudo'), 'junction');
  await assert.rejects(
    resolveRenderInput({
      workspaceRoot: escapedRoot,
      requestedFolder: 'conteudo',
      htmlName: 'stories.html',
      outputName: 'instagram-stories',
    }),
    /conteudo aponta para fora do workspace/i,
  );

  let routeHandler;
  await installNetworkBlock({
    route: async (_pattern, handler) => { routeHandler = handler; },
  }, allowed);
  let safeFileContinued = false;
  await routeHandler({
    request: () => ({ url: () => pathToFileURL(path.join(piece, 'stories.html')).href }),
    continue: async () => { safeFileContinued = true; },
    abort: async () => assert.fail('arquivo permitido não deve ser bloqueado'),
  });
  assert.equal(safeFileContinued, true);
  let dataContinued = false;
  await routeHandler({
    request: () => ({ url: () => 'data:text/plain,ok' }),
    continue: async () => { dataContinued = true; },
    abort: async () => assert.fail('data: não deve ser bloqueado'),
  });
  assert.equal(dataContinued, true);
  let externalBlocked;
  await routeHandler({
    request: () => ({ url: () => 'https://tracker.example/pixel' }),
    continue: async () => assert.fail('rede externa não deve continuar'),
    abort: async (reason) => { externalBlocked = reason; },
  });
  assert.equal(externalBlocked, 'blockedbyclient');

  await symlink(outside, path.join(piece, 'asset-link'), 'junction');
  let linkedAssetBlocked;
  await routeHandler({
    request: () => ({ url: () => pathToFileURL(path.join(piece, 'asset-link', 'stories.html')).href }),
    continue: async () => assert.fail('asset via junction não deve continuar'),
    abort: async (reason) => { linkedAssetBlocked = reason; },
  });
  assert.equal(linkedAssetBlocked, 'blockedbyclient');

  let invalidFileBlocked;
  await routeHandler({
    request: () => ({ url: () => 'file:///%ZZ' }),
    continue: async () => assert.fail('file URL inválida não deve continuar'),
    abort: async (reason) => { invalidFileBlocked = reason; },
  });
  assert.equal(invalidFileBlocked, 'blockedbyclient');
  await assert.rejects(
    installNetworkBlock({ route: async () => {} }),
    /Diretório de arquivos permitidos não informado/,
  );

  assert.equal(await prepareOutputDirectory(piece, 'instagram'), path.join(piece, 'instagram'));
  await assert.rejects(prepareOutputDirectory(piece, '../escape'), /Nome de saída inválido/);
  await symlink(outside, path.join(piece, 'instagram-stories'), 'junction');
  await assert.rejects(
    prepareOutputDirectory(piece, 'instagram-stories'),
    /saída aponta para fora/i,
  );
  await symlink(outside, path.join(piece, 'linked.png'), 'junction');
  await assert.rejects(prepareOutputFile(piece, 'linked.png'), /saída não pode ser link/i);
  assert.equal(await resolveWorkspaceDirectory(fixture, 'conteudo'), allowed);
  await assert.rejects(
    resolveWorkspaceDirectory(escapedRoot, 'conteudo'),
    /diretório solicitado aponta para fora do workspace/i,
  );

  assert.doesNotThrow(() => assertRenderableCount(1, 'slide'));
  assert.throws(() => assertRenderableCount(0, 'slide'), /Nenhum slide/);
  assert.throws(() => assertRenderableCount(51, 'slide'), /Limite excedido/);
});

test('baseline exige autorização, limites, agentes e LGPD', async () => {
  const baseline = await readFile(path.join(ROOT, 'security', 'BASELINE.md'), 'utf8');
  for (const requirement of ['deny-by-default', 'IDOR/BOLA', 'rate limiting', 'RLS', 'kill switch', 'sandbox']) {
    assert.match(baseline, new RegExp(requirement, 'i'));
  }
  const lgpd = await readFile(path.join(ROOT, 'security', 'LGPD-CHECKLIST.md'), 'utf8');
  for (const requirement of ['base legal', 'minimização', 'retenção', 'titular', 'incidente']) {
    assert.match(lgpd, new RegExp(requirement, 'i'));
  }
});

test('renderizadores desabilitam JavaScript e bloqueiam rede', async () => {
  for (const relative of ['templates/stories/render.js', 'templates/carrossel/render.js']) {
    const source = await readFile(path.join(ROOT, relative), 'utf8');
    assert.match(source, /javascriptEnabled:\s*false/);
    assert.match(source, /installNetworkBlock/);
  }
});

test('distribuição limpa gera PNG real sem rede', async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), 'vkos4-render-smoke-'));
  const piece = path.join(fixture, 'conteudo', 'peca');
  await mkdir(piece, { recursive: true });
  await writeFile(
    path.join(piece, 'carrossel.html'),
    '<!doctype html><html><body><section class="slide" style="width:1080px;height:1350px;background:#fff">OK</section></body></html>',
  );
  const result = spawnSync(
    process.execPath,
    [path.join(ROOT, 'templates', 'carrossel', 'render.js'), path.join('conteudo', 'peca')],
    { cwd: fixture, encoding: 'utf8', timeout: 20_000, env: CHILD_ENV },
  );
  assert.equal(result.status, 0, result.stderr);
  const image = await stat(path.join(piece, 'instagram', 'slide-01.png'));
  assert.ok(image.size > 1_000);
});

test('distribuição limpa gera PNG de stories sem rede', async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), 'vkos4-stories-smoke-'));
  const piece = path.join(fixture, 'conteudo', 'peca');
  await mkdir(piece, { recursive: true });
  await writeFile(
    path.join(piece, 'stories.html'),
    '<!doctype html><html><body><section class="story" style="width:1080px;height:1920px;background:#111">OK</section></body></html>',
  );
  const result = spawnSync(
    process.execPath,
    [path.join(ROOT, 'templates', 'stories', 'render.js'), path.join('conteudo', 'peca')],
    { cwd: fixture, encoding: 'utf8', timeout: 20_000, env: CHILD_ENV },
  );
  assert.equal(result.status, 0, result.stderr);
  const image = await stat(path.join(piece, 'instagram-stories', 'story-01.png'));
  assert.ok(image.size > 1_000);
});

test('os modelos que vêm de fábrica passam no verificador', () => {
  const result = spawnSync(process.execPath, [MODELO_CHECKER], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 20_000,
    env: CHILD_ENV,
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /nenhum problema/);
});

test('o verificador reprova modelo com JS, rede ou caminho pra fora da peça', async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), 'vkos4-modelo-check-'));
  const alvo = path.join(fixture, 'modelo-ruim.html');
  await writeFile(
    alvo,
    [
      '<!doctype html><html><head>',
      '<style>@import url(https://fonts.example/x.css);</style>',
      '<link href="https://cdn.example/a.css" rel="stylesheet">',
      '<script>alert(1)</script>',
      '</head><body>',
      '<div class="slide" onclick="alert(2)">',
      '<img src="../../identidade/logo/logo.png" alt="">',
      '<iframe src="about:blank"></iframe>',
      '</div></body></html>',
    ].join(''),
  );
  const result = spawnSync(process.execPath, [MODELO_CHECKER, alvo], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 20_000,
    env: CHILD_ENV,
  });
  assert.equal(result.status, 1);
  for (const esperado of [/<script>/, /evento inline/, /@import/, /<link>/, /internet/, /fora da pasta/, /iframe/]) {
    assert.match(result.stdout, esperado);
  }
});

test('o verificador aceita peça montada e recusa arquivo sem slide', async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), 'vkos4-modelo-peca-'));
  const boa = path.join(fixture, 'carrossel.html');
  const vazia = path.join(fixture, 'stories.html');
  await writeFile(boa, '<!doctype html><html><body><div class="slide"><img src="img/capa.png" alt=""></div></body></html>');
  await writeFile(vazia, '<!doctype html><html><body><div class="cartao">sem slide</div></body></html>');

  const aprovada = spawnSync(process.execPath, [MODELO_CHECKER, boa], { cwd: ROOT, encoding: 'utf8', env: CHILD_ENV });
  assert.equal(aprovada.status, 0, aprovada.stdout);

  const reprovada = spawnSync(process.execPath, [MODELO_CHECKER, vazia], { cwd: ROOT, encoding: 'utf8', env: CHILD_ENV });
  assert.equal(reprovada.status, 1);
  assert.match(reprovada.stdout, /classe slide/);
});

test('renderizador falha fechado quando não recebe a pasta', () => {
  const result = spawnSync(
    process.execPath,
    [path.join(ROOT, 'templates', 'carrossel', 'render.js')],
    { cwd: ROOT, encoding: 'utf8', timeout: 10_000, env: CHILD_ENV },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Falta a pasta/);
});
