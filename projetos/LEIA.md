# Projetos construídos com VKOS

Cada construção contínua vive em `projetos/<nome>/` e leva `LEIA.md` próprio com objetivo, stack,
como rodar, estado, dados tratados e riscos residuais.

Antes de implementar, classifique o perfil em `security/BASELINE.md`. Backend, autenticação, banco,
pagamento, upload, IA ou integração exigem threat model. Dado pessoal exige a matriz LGPD. Antes de
publicar, rode `/seguranca` e corrija todo bloqueio crítico/alto.
