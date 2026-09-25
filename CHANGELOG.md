# Changelog

## 4.1.0 - 2026-08-17

### Adicionado

- Comando `/modelo`: cria um modelo de carrossel novo a partir de um print de referência
  guardado nas inspirações do dono. Lê a estrutura da imagem (grade, hierarquia, tipografia,
  ritmo dos slides), recolore 100% com as cores da marca e gera o modelo renderizável,
  provando com as imagens geradas.
- Pasta `ideias/`: o estacionamento de ideias e tarefas pra depois, uma ideia por arquivo com
  contexto suficiente pra executar com exatidão mais tarde.
- `npm run modelo:check`: verificador que roda em modelo do catálogo e em peça montada. Reprova
  `<script>`, evento inline, `javascript:`, `<link>`, `@import`, endereço da internet, iframe,
  caminho pra fora da pasta da peça e arquivo sem nenhum slide. As regras que antes eram só texto
  de skill agora são conferidas por código, no `/modelo`, no `/carrossel` e no `/stories`.

### Removido

- Saíram da cópia do comprador três arquivos que não serviam nem a ele nem ao sistema: o guia de
  migração da versão 3 (quem instala a 4 nunca teve a 3), o `SBOM.cdx.json` e o
  `RELEASE-MANIFEST.sha256`. Os dois últimos são material de conferência de release, não de uso:
  seguem no histórico do repositório e o SBOM é refeito a qualquer momento com `npm sbom`.

### Corrigido

- **O logo do dono não aparecia na imagem.** O `/carrossel` mandava apontar direto pra
  `identidade/logo/logo.png`, mas o renderizador só serve arquivo de dentro da pasta da peça, por
  segurança. O logo sumia do PNG e o render terminava dizendo "ok". Agora o logo é copiado pra
  `img/logo.png` dentro da peça, no `/carrossel` e no `/stories`, e o verificador pega o caso.
- **Fallback do modelo Produto nunca funcionou.** Ele dependia de um `onerror` em JavaScript, e o
  render roda com JavaScript desligado. Trocado por uma troca manual, sem script.
- Teste de ponta a ponta do render de stories, que só o carrossel tinha. Um modelo quebrado de
  stories chegaria na mão do comprador sem ninguém perceber.
- `package-lock.json` alinhado com a versão do `package.json`. Fora de sincronia, o
  `npm ci --ignore-scripts` do guia de instalação abortava logo no primeiro comando.
- `npm install` e `npx playwright install` trocados por `npm ci --ignore-scripts` e `npm run setup`
  nos quatro lugares que ainda ensinavam o caminho antigo, que instala fora do lockfile e roda
  script de pacote.
- `capacidades.html` atualizado: a vitrine passa de 27 para 35 comandos, com o módulo
  🔨 Construção (`/projeto`, `/revisar-design`, `/refinar`, `/enxuto`, `/enxuto-revisao` e
  `/seguranca`) que faltava, `/cerebro-fable` e `/modelo` listados nos seus módulos, e a
  contagem de comandos e módulos corrigida em todo o documento.

## 4.0.0 - 2026-08-14

O produto continua se chamando **VKOS**; `4.0.0` é a versão desta release. A matriz incorpora
integralmente a versão 3 e a substitui como única versão mantida no workspace.

### Adicionado

- Baseline secure-by-default, checklist LGPD, threat model e resposta a incidentes.
- Skills `/seguranca` e `$vkos-security-checkup` para revisão manual e automática.
- Scanner local com saída Markdown/JSON, redação de evidências e exclusão explícita de escopo.
- `AGENTS.md`, workflow de CI, cobertura mínima, auditoria npm e geração de SBOM.
- Guia de migração e rollback da versão 3 para a versão 4.

### Endurecido

- Renderização isolada ao workspace, sem JavaScript/rede e com proteção contra path traversal,
  symlink/junction, ativos grandes, excesso de peças, timeout e saída externa.
- MCPs locais em versões exatas; Playwright MCP isolado, headless, sem service workers e limitado a
  origens locais por padrão.
- Permissões de agente reduzidas; a skill de segurança não é autoeditável pela allowlist.
- Fontes externas removidas dos templates e orientação trocada por fontes locais/sistema.
- Formulário WhatsApp padrão substituído por CTA sem dados pessoais em query string.

### Compatibilidade

- O Cérebro, os formatos editoriais e os comandos do VKOS 3 continuam disponíveis.
- Instalações personalizadas devem ser migradas como overlay seletivo; não sobrescreva o núcleo.
