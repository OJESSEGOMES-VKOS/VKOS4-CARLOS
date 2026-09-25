# Resposta a incidentes

## 1. Parar e preservar

1. Interromper ações automáticas e evitar comandos destrutivos.
2. Preservar logs, horários, IDs e configurações sem copiar segredo/PII para chats ou issues.
3. Registrar quem detectou, quando, ambiente, sistemas e tipos de dado possivelmente afetados.
4. Acionar o dono técnico, responsável de negócio e privacidade.

## 2. Conter

- Revogar e rotacionar credenciais suspeitas; invalidar sessões quando necessário.
- Desabilitar rota, integração, deploy ou agente com kill switch reversível.
- Bloquear exfiltração/abuso mantendo evidência.
- Isolar ambiente comprometido; não “limpar” antes da coleta mínima de evidências.

## 3. Avaliar impacto

- Confirmar vetor, janela, dados/ativos, titulares, tenants e terceiros atingidos.
- Distinguir acesso, alteração, indisponibilidade e exfiltração.
- Avaliar risco/dano relevante, fraude, discriminação, identidade, finanças e saúde.
- Se operador, avisar o controlador imediatamente pelo canal acordado.

## 4. Comunicar

Seguir a regra vigente da ANPD e legislação setorial. Na data de criação deste baseline, a página
oficial da ANPD informa prazo de três dias úteis para comunicação pelo controlador quando o
incidente puder acarretar risco ou dano relevante, ressalvado prazo específico. Verificar a regra
atual antes de agir:
<https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/comunicado-de-incidente-de-seguranca-cis>.

Comunicação ao titular deve ser clara, dizer impacto provável, medidas tomadas, como se proteger e
canal de contato. Não minimizar nem especular.

## 5. Erradicar, recuperar e aprender

- Corrigir causa raiz e variantes; criar teste de regressão.
- Restaurar de fonte íntegra e validar autorização, dados e observabilidade.
- Monitorar recorrência e abuso de credenciais.
- Produzir linha do tempo, decisões, evidências, impacto, correções e responsáveis.
- Atualizar threat model, baseline, skill e runbook sem divulgar dados sensíveis.
