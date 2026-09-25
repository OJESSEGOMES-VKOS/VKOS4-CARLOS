# Modelo de ameaças — template

## Contexto

- Projeto e versão:
- Dono técnico e dono de negócio:
- Ambientes:
- Perfil de risco:
- Data/revisor:

## Ativos e dados

| Ativo/dado | Sensibilidade | Onde fica | Quem precisa acessar | Impacto se exposto/alterado/indisponível |
| --- | --- | --- | --- | --- |
| | | | | |

## Fluxos e fronteiras de confiança

Descrever entrada → validação → serviço → banco/terceiro → saída. Marcar browser, API, webhook,
fila, storage, provedor de IA, MCP e ação humana.

## Atores e cenários

Cobrir: anônimo, usuário A, usuário B, outro tenant, admin comprometido, bot, webhook forjado,
upload malicioso, fornecedor comprometido e prompt injection indireto.

| ID | Cenário de abuso | Pré-condição | Controle preventivo | Detecção | Teste | Risco residual |
| --- | --- | --- | --- | --- | --- | --- |
| TM-01 | | | | | | |

## Decisões e gates

- Riscos aceitos, responsável, motivo e prazo:
- Riscos bloqueantes:
- Testes antes de publicar:
- Plano de rollback/kill switch:

