# Checklist LGPD e privacy-by-design

Este material orienta engenharia; não substitui análise jurídica. Confirmar normas e orientações
atuais da ANPD para cada operação.

## Mapa obrigatório por categoria de dado

| Campo | Evidência a registrar |
| --- | --- |
| Dado/categoria | O que é coletado, incluindo inferências e metadados |
| Titular | Cliente, lead, funcionário, criança/adolescente ou terceiro |
| Finalidade | Propósito específico, explícito e informado |
| Necessidade | Por que cada campo é o mínimo necessário |
| Base legal | Hipótese aplicável; não presumir consentimento |
| Origem | Formulário, importação, parceiro, dispositivo ou inferência |
| Acesso | Papéis, serviço e pessoas autorizadas |
| Operadores | Hosting, analytics, IA, e-mail, pagamento e suboperadores |
| Transferência | Países, garantias e mecanismo aplicável |
| Retenção | Prazo/evento de descarte para produção, log e backup |
| Direitos | Acesso, correção, informação, portabilidade, oposição e eliminação aplicáveis |
| Proteção | Minimização, segregação, criptografia, auditoria e backup |

## Gate de produto

- Definir controlador, operador, suboperadores, responsável e canal do titular.
- Coletar só depois de documentar finalidade, necessidade e base legal.
- Tornar aviso de privacidade claro no ponto de coleta; separar marketing opcional do serviço.
- Registrar consentimento quando ele for a base, com versão do aviso e revogação tão simples quanto
  a concessão.
- Implementar busca, exportação, correção, bloqueio e exclusão verificável conforme aplicabilidade.
- Não usar produção em desenvolvimento nem enviar PII real a LLM/ferramenta sem avaliação e
  contrato apropriados.
- Definir retenção para banco, arquivos, analytics, logs, prompts e backups; automatizar descarte.
- Avaliar RIPD para alto risco, monitoramento, decisão automatizada, grande escala ou dado sensível.
- Avaliar especificamente documentos, endereço, saúde, finanças, crianças e possível biometria.
  Foto/selfie só é biometria quando tratada para identificar autenticamente uma pessoa.
- Tokenizar pagamentos em provedor adequado; nunca armazenar PAN/CVV em claro.
- Registrar fornecedores, localização, finalidade, dados recebidos, retenção e exclusão contratual.
- Manter processo de incidente, preservação de evidência e comunicação ao controlador/titular/ANPD
  quando aplicável.

## Testes mínimos

- Usuário não acessa dado de outro titular/tenant por ID, busca, export, storage ou cache.
- Exclusão remove ou anonimiza cópias ativas e deixa trilha sem PII excessiva.
- Retenção expira automaticamente e é verificável.
- Logs, analytics, erros e prompts não contêm dado além do necessário.
- Preferências de consentimento são honradas no backend e em terceiros.
- Download/exportação exige reautenticação quando o risco justificar.

Referências oficiais: [Lei 13.709/2018 compilada no Planalto](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm)
e [materiais educativos da ANPD](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes).
