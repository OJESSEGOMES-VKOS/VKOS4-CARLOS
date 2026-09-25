# Baseline de segurança secure-by-default

Aplicar proporcionalmente ao risco, sem remover controles críticos por conveniência. Para app com
mais de um perfil, vale a camada mais exigente.

## 1. Fronteiras e arquitetura

- Tratar browser, mobile, cliente API, webhook, upload, documento recuperado e saída de IA como
  não confiáveis.
- Executar autenticação, autorização, cobrança, plano, quotas e regras de negócio no backend.
- Aplicar autorização `deny-by-default` em cada recurso e ação; verificar usuário, proprietário e
  tenant. UUID dificulta enumeração, mas não corrige IDOR/BOLA.
- Separar desenvolvimento, staging e produção, inclusive credenciais, dados, buckets e filas.
- Manter diagrama de fluxo, inventário de ativos e threat model para backend, auth, pagamento,
  dados pessoais, uploads, IA ou integrações.

## 2. Identidade e sessão

- Usar provedor e biblioteca mantidos; não criar criptografia ou protocolo de autenticação próprio.
- Validar OTP, convite, domínio, membership e recuperação no servidor; limitar tentativas e replay.
- Guardar sessão web em cookie `HttpOnly`, `Secure` e `SameSite` compatível com o fluxo.
- Rotacionar sessão após login/elevação, expirar e revogar. Exigir MFA para administradores.
- Respostas de login e recuperação não devem permitir enumeração de conta.

## 3. Autorização e banco

- Centralizar policies e testar negações: anônimo, usuário A, usuário B, outro tenant e admin.
- Proteger rotas invisíveis na UI, jobs, exports, storage, funções e webhooks.
- Bloquear mass assignment; `role`, `plan`, `subscription_status`, saldo, quota e contadores são
  campos controlados apenas pelo servidor.
- Em Supabase/Postgres exposto, habilitar RLS e policies explícitas para `SELECT`, `INSERT`,
  `UPDATE` e `DELETE`. Testar a semântica; policy existente não significa policy correta.
- Manter service role e credenciais administrativas somente no backend, com menor privilégio.
- Paginar e limitar consultas/exportações para reduzir enumeração e extração massiva.

## 4. Entrada, saída e arquivos

- Validar toda fronteira no servidor com schema, tipos, limites, normalização e allowlist.
- Usar queries parametrizadas. Nunca concatenar SQL, shell, template ou caminho de arquivo.
- Aplicar encoding contextual. HTML do usuário exige sanitizador allowlist; CSP não substitui isso.
- Proteger operações com cookie contra CSRF e configurar CORS por origens exatas.
- Em upload, verificar tamanho, quantidade, extensão, MIME real e conteúdo; renomear no servidor,
  armazenar fora da raiz pública, servir como anexo e isolar/quarentenar quando necessário.
- Desabilitar HTML/código customizado por padrão. Se indispensável, executar em sandbox sem
  credenciais, com filesystem/rede/processos limitados, timeout e quota.

## 5. Segredos e supply chain

- Nunca colocar segredo em frontend, bundle, app mobile, source map, log, prompt ou repositório.
- Usar secret manager por ambiente, escopo mínimo, rotação e trilha de acesso.
- Fixar dependências e MCPs em versões exatas revisadas; versionar lockfile e evitar `@latest`.
- Revisar scripts de instalação. Preferir instalação reproduzível e sem scripts quando compatível.
- Rodar secret scan, SCA/dependency audit, SAST e IaC scan no CI; produzir SBOM em release.
- Avaliar proveniência, manutenção, licença e permissões de toda nova dependência/conector.

## 6. APIs, abuso e custo

- Aplicar rate limiting no backend por usuário, IP, tenant e endpoint; limites mais rígidos para
  login, OTP, IA, upload, busca e exportação.
- Usar quotas e contadores atômicos não editáveis pelo cliente.
- Aplicar idempotência e proteção contra replay em pagamentos, jobs e webhooks assinados.
- Definir limites de payload, página, arquivo, concorrência e tempo.
- Configurar budget caps, alertas e `kill switch` para IA, e-mail, SMS, storage e APIs pagas.
- Registrar eventos de custo e abuso sem salvar prompt, token ou dado pessoal desnecessário.

## 7. Browser, transporte e terceiros

- Entregar CSP mínima com `default-src 'self'`, `object-src 'none'`, `base-uri 'self'` e
  `frame-ancestors 'none'`, ampliando somente com justificativa.
- Configurar `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` e HSTS quando HTTPS
  estiver garantido. Não usar `unsafe-inline`/`unsafe-eval` como padrão.
- Preferir recursos locais. Recurso externo inevitável exige domínio aprovado, política de
  privacidade e integridade quando suportada.
- Chamadas privilegiadas a Stripe, e-mail, storage e IA ficam no backend.

## 8. IA, agentes e MCP

- Tratar contexto recuperado e saída do modelo como não confiáveis; separar dados de instruções.
- Validar saída estruturada antes de passá-la a SQL, shell, HTML, ferramentas ou APIs.
- Aplicar allowlist de ferramentas, caminhos, destinos de rede e efeitos.
- Usar dry-run e aprovação humana para publicar, pagar, enviar, excluir, migrar ou tocar produção.
- Não fornecer credencial de produção a agente por padrão.
- Executar código gerado em sandbox com limites de CPU, memória, rede, filesystem e tempo.
- Registrar ação, ator e resultado, redigindo segredos e dados pessoais.

## 9. Dados, logs e resiliência

- Minimizar dados e separar PII de telemetria. Redigir segredos, tokens, documentos, saúde e
  conteúdo de formulário nos logs.
- Criptografar transporte e armazenamento quando aplicável; gerir chaves fora do banco protegido.
- Definir retenção e descarte para banco, logs, backups, arquivos e prompts.
- Criar backup/PITR proporcional ao impacto e testar restauração.
- Monitorar autenticação anômala, mudanças de privilégio, exportações, falhas de webhook, abuso de
  quota e ações administrativas.

## 10. Verificação e gates

Exigir testes unitários e de integração para validação e autorização, testes negativos cross-tenant,
testes de RLS, abuso/rate limiting e regressão de cada achado. Executar DAST somente em ambiente
autorizado.

Bloquear publicação diante de:

- segredo ou chave privilegiada exposta;
- rota sensível sem autenticação/autorização;
- IDOR/BOLA, mass assignment, elevação ou acesso cross-tenant;
- RLS ausente/bypassável;
- cartão em claro ou pagamento sem verificação server-side;
- endpoint caro sem rate limiting, quota e kill switch;
- XSS confirmado ou upload executável;
- agente com acesso destrutivo direto à produção;
- dado sensível sem finalidade, base legal e proteção proporcional;
- teste crítico ausente/falhando.

