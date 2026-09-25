# VKOS: VirtuoKingdom Operational System

**O sistema operacional de marketing e construção segura do seu negócio, dentro do seu computador.**

O VKOS transforma uma ideia em conteúdo, arruma seu perfil, escreve seu site e te orienta a
colocar no ar, otimiza seu Google e monta seus anúncios, tudo com a cara do seu negócio, por
comandos simples. Você não precisa saber programar. Você conversa, ele faz.

Esta é a versão 4. Ela mantém o design e a execução do VKOS 3 e adiciona segurança e privacidade
como parte da arquitetura, dos testes e do gate de publicação:

- **O contato chega.** Todo formulário e todo botão de WhatsApp são construídos pra funcionar
  de verdade, e testados antes de você receber. Site bonito que não captura cliente era o
  defeito mais caro que existia, porque ninguém percebe.
- **O Google acha você.** Todo site agora sai com o selo que o Google usa pra te mostrar no
  mapa e na busca da sua cidade, e com a imagem certa pro link chegar bonito no WhatsApp.
- **Todo mundo consegue usar.** As páginas passam a funcionar pra quem enxerga pouco, pra quem
  usa só o teclado e pra quem está no sol com o brilho baixo. Isso é cliente que você deixava
  de atender sem saber.
- **Segurança nasce com o projeto.** Autorização no servidor, segredos fora do cliente, limites de
  abuso/custo, dependências fixas, agentes com menor privilégio e testes negativos por padrão.
- **LGPD vira decisão de produto.** Finalidade, base legal, minimização, fornecedores, retenção e
  direitos do titular entram antes da coleta, não como texto copiado depois.
- **O checkup é repetível.** `/seguranca` combina scanner local, threat model, testes de auth/RLS,
  revisão de agentes/MCP e relatório com evidências; risco crítico/alto bloqueia publicação.
- **Abre rápido no celular da rua**, que é onde seu cliente está.
- **O sistema confere antes de entregar.** Ele abre a página que construiu, olha no tamanho de
  celular e testa, em vez de só achar que ficou bom.

> Feito por quem opera de verdade. É o mesmo sistema que a VirtuoKingdom usa pros clientes,
> montado pra você rodar sozinho.

---

## Instalação rápida (leia isto primeiro)

1. **Instale o [Git](https://git-scm.com/downloads)** (avançar, avançar, concluir).
2. **Baixe a pasta:** abra "Git Bash Here" numa pasta como a Área de Trabalho e rode:
   ```bash
   git clone https://github.com/OJESSEGOMES-VKOS/VKOS4-CARLOS.git vkos4
   ```
3. **Instale o [VS Code](https://code.visualstudio.com/)** e, dentro dele, a extensão **Claude Code**
   (precisa de uma conta Anthropic com plano pago; é ela que faz o sistema funcionar).
4. **Instale o [Node.js LTS](https://nodejs.org/)** (avançar, avançar, concluir).
5. **Abra a pasta `vkos4`** no VS Code (*Arquivo → Abrir Pasta*).
6. **Terminal → Novo Terminal** e rode, um por vez:
   ```bash
   npm ci --ignore-scripts
   npm run setup
   ```
7. **Abra o Claude Code** na lateral e digite `/instalar`. Ele monta o Cérebro do seu negócio em ~10 min.
8. **Pronto.** Digite `/vkos` pra ver tudo que dá pra fazer. Primeiro teste bom: `/semana`.

Passo a passo detalhado, com o que fazer se algo der errado: **[COMECE-AQUI.md](COMECE-AQUI.md)**.

---

## Começar leva 4 passos

1. **Instale o Claude Code** (o motor que faz o VKOS funcionar).
2. **Abra esta pasta** no Claude Code.
3. **Prepare a pasta** com `npm ci --ignore-scripts` e `npm run setup` no terminal dela.
4. **Digite `/instalar`** e responda as perguntas. Pronto, seu sistema está de pé.

👉 O passo a passo com telas está em **[COMECE-AQUI.md](COMECE-AQUI.md)**. Comece por lá.

---

## O que tem dentro

- 🧠 **Núcleo**: o *Cérebro* do seu negócio, que faz tudo sair alinhado.
- 🧭 **Direção**: pra quem chega perdido, `/ikigai` (o que vender e pra quem) e
  `/posicionamento` (seu ângulo único).
- 🎨 **Visual próprio**: `/estilo` define a cara do seu negócio, pra não ficar igual a todo mundo,
  e `/modelo` vira um print que você gostou em modelo de carrossel com as suas cores.
- 📱 **Conteúdo**: de 1 ideia a uma semana inteira (posts, carrossel, stories, legendas).
- 👤 **Perfil & Instagram**: bio, destaques, estratégia de feed.
- 🌐 **Site & Páginas**: texto de site, página de captura, blog.
- 🔎 **Google & Local**: perfil do Google, avaliações, ser achado na sua cidade.
- 📣 **Anúncios**: texto e criativo pra anunciar no Google e nas redes.
- 🔨 **Construção**: revisão e refino de design (`/revisar-design`, `/refinar`) e projetos
  livres com código enxuto (`/projeto`, `/enxuto`). O `/revisar-design` agora também confere
  se a página funciona, protege e é achada, não só se ela é bonita.
- 🛡️ **Segurança e LGPD**: `/seguranca` faz o checkup completo; `security/` guarda baseline,
  matriz LGPD, modelo de ameaças e resposta a incidentes.
- ✍️ **Escrita natural**: o `/humanizer` tira a cara de IA de qualquer texto, sem perder a sua voz.
- 🔌 **Conexões**: o sistema abre o navegador pra conferir o que construiu. O que cada conexão
  faz, e como desligar, está em [CONEXOES.md](CONEXOES.md).

Depois de instalar, digite **`/vkos`** a qualquer momento pra ver tudo que dá pra fazer.

---

## Precisa de ajuda?

Se travar em qualquer parte, é só dizer ao Claude Code o que aconteceu, ele te ajuda em
português simples. E se preferir que a gente faça tudo por você, a VirtuoKingdom opera o seu
negócio inteiro: **virtuokingdom.com.br**.
