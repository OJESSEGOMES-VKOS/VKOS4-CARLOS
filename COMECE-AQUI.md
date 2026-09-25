# 👋 Comece aqui

Bem-vindo ao **VKOS**. Em uns 15 minutos seu sistema de marketing e construção vai estar de pé. Você não
precisa saber nada de computador além de abrir uma pasta e digitar. Vamos com calma.

---

## O que é o VKOS, em uma frase

É um assistente de marketing que **já conhece o seu negócio** e faz o trabalho pesado por você:
conteúdo, perfil, site, Google, anúncios. Ele funciona dentro de um programa gratuito chamado
**Claude Code**. É só isso que você precisa instalar.

Nesta versão do VKOS, todo o visual nasce com uma camada de design própria, projetos livres entram por
`/projeto` e segurança/LGPD acompanham a construção desde o primeiro plano. Antes de publicar um
projeto, use `/seguranca`.

---

## Passo 0: Instale o Git e pegue a pasta do VKOS

O **Git** é um programinha gratuito que baixa (e depois atualiza) a pasta do VKOS certinha,
sem risco de bagunçar nome de pasta.

1. Entre em [git-scm.com/downloads](https://git-scm.com/downloads) e baixe a versão do seu
   sistema (Windows ou Mac). Abra o instalador e clique em **avançar** até o fim, sem mudar
   nada.
2. Escolha onde vai guardar a pasta do VKOS, por exemplo a **Área de Trabalho**. Abra essa
   pasta, clique com o botão direito dentro dela (num espaço vazio) e procure a opção
   **"Git Bash Here"** (ou "Abrir Git Bash aqui"). Isso abre uma janela preta de comando.
3. Cole este comando nela e dê Enter:
   ```bash
   git clone https://github.com/OJESSEGOMES-VKOS/VKOS4-CARLOS.git vkos4
   ```
4. Espere terminar. Vai aparecer uma pasta nova chamada **vkos4** ali, já pronta.

> Se um dia o VKOS receber uma atualização, você não precisa baixar tudo de novo: abra o
> "Git Bash Here" dentro da pasta `vkos4` e rode `git pull`.

---

## Passo 1: Instale o Claude Code

O Claude Code é o "motor" do VKOS. Ele existe em duas formas, escolha a que for mais fácil
pra você:

- **No VS Code (recomendado, mais visual):** instale o [VS Code](https://code.visualstudio.com/)
  (gratuito), abra ele, vá na aba de **Extensões** (o ícone de quadradinhos na lateral),
  procure por **"Claude Code"** e clique em Instalar.
- **No terminal:** se você já usa terminal, siga as instruções em
  [claude.com/claude-code](https://claude.com/claude-code).

Na primeira vez, o Claude Code vai pedir pra você **entrar com sua conta Anthropic**. É ela que
dá "energia" pro sistema. Siga o login que ele mostrar na tela.

> Não tem conta? Ele te leva pra criar na hora. Guarde esse login, é o que mantém o VKOS
> funcionando.

**Sobre o custo, sem rodeio:** o Claude Code funciona com uma conta da Anthropic num plano pago
(a partir do plano básico). Essa assinatura fica na sua conta e é ela que aciona todo o sistema,
é o motor que faz o VKOS trabalhar. Não é cobrança da VirtuoKingdom, é o combustível do Claude
que você contrata direto com a Anthropic.

---

## Passo 2: Instale o Node.js

O Node.js é um programa gratuito que o VKOS usa nos bastidores pra **transformar o texto dos
carrosséis e stories em imagem pronta pra postar**. Sem ele, o sistema escreve, mas não gera as
imagens.

1. Entre em [nodejs.org](https://nodejs.org/).
2. Baixe a versão marcada como **LTS** (é a versão estável, recomendada).
3. Abra o arquivo baixado e instale clicando em **avançar** até o fim. Não precisa mudar nada.

Feito uma vez, não precisa mexer de novo.

---

## Passo 3: Abra a pasta do VKOS

1. Pegue a pasta do VKOS que você deixou guardada no Passo 0 (ex: na Área de Trabalho).
2. No VS Code, vá em **Arquivo → Abrir Pasta...** e escolha a pasta **vkos4**.
3. Abra o Claude Code (o ícone dele na lateral, ou o atalho que a extensão mostra).

⚠️ **Importante:** abra a pasta **vkos4** inteira, não um arquivo solto de dentro dela. É isso
que faz os comandos funcionarem.

---

## Passo 4: Prepare o VKOS

No VS Code, abra **Terminal → Novo Terminal**. Confira se o terminal mostra a pasta `vkos4` e rode,
um por vez:

```bash
npm ci --ignore-scripts
npm run setup
```

O primeiro instala exatamente as versões registradas no arquivo de segurança da distribuição. O
segundo baixa o Chromium compatível usado para gerar e conferir imagens. Não troque por `npx ...`
nem por pacote `@latest`. Esta preparação é feita uma vez e precisa de internet.

## Passo 5: Digite `/instalar`

Na caixa de conversa do Claude Code, digite:

```
/instalar
```

e dê Enter. Ele vai te fazer algumas perguntas simples sobre o seu negócio: o que você vende,
pra quem, como você fala. Responda do seu jeito, sem se preocupar em ficar bonito. No fim, ele
monta o **Cérebro** do seu negócio: o documento que faz todo o resto sair com a sua cara.

Feito isso, **seu VKOS está pronto.**

> **Ainda não sabe o que vender, ou pra quem?** Sem problema, é mais comum do que parece.
> Em vez de `/instalar`, digite **`/ikigai`**. Ele te ajuda, numa conversa, a achar a direção
> (o que oferecer, pra quem, e por que você) antes de montar o Cérebro.

---

## E agora?

Digite `/vkos` a qualquer momento pra ver tudo que dá pra fazer. Um bom primeiro teste:

```
/semana
```

Dê uma ideia e veja o sistema montar uma semana inteira de conteúdo pra você.

---

## Se algo der errado

Não entre em pânico. **Escreva pro Claude Code o que aconteceu** ("não achei o comando",
"deu um erro", "não sei abrir a pasta") e ele responde em português simples e te desencalha.
O VKOS foi feito pra você conseguir, mesmo começando do zero.

---

## Se o carrossel não gerar imagem

Na primeira vez que você cria um carrossel, o sistema precisa baixar um navegador interno pra
montar as imagens. Isso acontece uma vez só e precisa de **internet** na hora. Pode demorar um
pouquinho, é normal.

Se por acaso der algum erro e a imagem não sair, não se preocupe. É só escrever pro Claude Code:
**"o carrossel não renderizou, me ajuda"**. Ele deve conferir `npm ci --ignore-scripts` e rodar
`npm run setup`; esses comandos usam as versões fixadas desta versão do VKOS.
