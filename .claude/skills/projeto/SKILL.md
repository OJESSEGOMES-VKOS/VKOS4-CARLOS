---
name: projeto
description: >
  Constrói qualquer projeto livre dentro do VKOS: um app, uma ferramenta, uma automação, um
  site que não é do negócio, um experimento. Brief de uma linha, plano enxuto de meia
  página, construção por etapas com entregável completo em cada passo, e a camada visual
  inteira quando houver interface. Use quando o comprador disser /projeto, "constrói um app
  pra mim", "quero uma ferramenta que...", "automatiza isso", ou pedir qualquer coisa além
  do marketing.
---

# /projeto: construir qualquer coisa

O VKOS não é só marketing: é o sistema de construção do dono. Este comando guia qualquer
projeto do começo ao "roda assim". O ritmo é sempre o mesmo: entender em uma linha, planejar
enxuto, construir por etapas completas, e caprichar na cara quando houver uma.

## Antes

Leia `cerebro/cerebro.md` se estiver preenchido: ele diz quem é o dono, como ele fala e pra
quem ele trabalha, e isso melhora qualquer projeto. Projeto livre **não exige** Cérebro: se
estiver em branco e o projeto não depender do negócio, siga sem ele.

## Passo 1: o brief de uma linha

Antes de qualquer código, declare a leitura do pedido em UMA linha:

> Lendo isto como: [tipo de projeto] para [quem usa], com [restrição principal].

Exemplos:

> Lendo isto como: calculadora de orçamento em página única para os clientes do dono, com a
> restrição de funcionar offline no celular.

> Lendo isto como: script que renomeia as fotos da pasta por data, para o próprio dono, com
> a restrição de não depender de nada instalado além do Node.

Se algo **essencial** estiver ambíguo (pra quem é, ou a restrição que muda a arquitetura),
faça UMA pergunta. Uma só. O resto se decide e se declara.

## Passo 2: onde o projeto vive

Declare no início, antes de criar qualquer arquivo:

- Padrão: `projetos/<nome-do-projeto>/`. Sem data no nome, porque projeto não é peça de um
  dia: ele continua sendo mexido.
- Ou a pasta que o dono indicar.

**A pasta em `projetos/` só nasce quando o dono sinalizar que aquilo é um projeto.** Chamar
`/projeto` já é sinal. Um pedido solto que você achou que daria um bom projeto não é. Na
dúvida, faça a pergunta antes de criar a pasta: é projeto ou é peça?

Não é projeto? O trabalho vai pra `conteudo/AAAA-MM-DD-<tema-curto>/` como peça normal. Site
do negócio, landing e material de marketing continuam sendo peça, mesmo quando dão trabalho
de projeto.

Todo projeto ganha um `LEIA.md` na raiz da pasta dele, com o que é, como rodar e o estado
atual. É o que faz o dono (e você) reencontrar o fio meses depois. Ele nasce no passo 7.

Aviso prático: dentro de `conteudo/`, nunca nomeie um arquivo como `carrossel.html`. Esse
nome é reservado pra classificação de peças do app.

## Passo 3: o plano enxuto

Planeje com a escada do `/enxuto` aplicada a arquitetura e dependências: isso precisa
existir? o que já existe no projeto resolve? a biblioteca padrão faz? o nativo da plataforma
cobre? uma dependência já instalada resolve? cabe numa linha? Só então o mínimo que
funciona.

O plano cabe em **meia página, no máximo**: o que vai existir (arquivos e papéis), em que
ordem nasce, e com o quê (stack e dependências, cada dependência justificada em meia linha).
Apresente e confirme antes de codar. Plano que precisa de mais de meia página é sinal de
projeto que precisa ser fatiado.

Antes de fechar o plano, classifique o risco conforme `security/BASELINE.md`. Se houver backend,
auth, banco, pagamento, upload, IA ou integração, copie e preencha
`security/THREAT-MODEL-TEMPLATE.md` na documentação do projeto. Se houver dado pessoal, preencha
também a matriz de `security/LGPD-CHECKLIST.md`. Segurança, testes e observabilidade fazem parte do
menor produto correto; não são uma fase opcional depois do código.

## Passo 4: construir por etapas, cada uma completa

- Cada etapa termina em algo **completo e rodável**, não num esqueleto.
- Anti-placeholder, sem exceção: nada de "aqui você coloca X", nada de "// resto do código",
  nada de seção esboçada, nada de descrever o que o código faria em vez de escrever o
  código.
- Faltou informação que só o dono tem (uma senha, uma foto, um preço)? Pergunte antes, ou
  entregue completo com o que existe e liste a pendência FORA da entrega, no recado final.
- Mostre o que ficou pronto a cada etapa. Não despeje tudo no final.
- O código nasce na postura do `/enxuto`: menor diff, causa raiz, deleção sobre adição,
  respeitando as exceções invioláveis de lá (validação de fronteira, erro que evita perda
  de dado, segurança, acessibilidade).

## Passo 5: tem interface? A camada visual inteira

Se o projeto tem qualquer coisa com cara (uma tela, uma página, um painel):

1. Leia `templates/design/cartela.md`, `templates/design/estilos/indice.md` (a biblioteca de
   estilos) e o `templates/<formato>/principios-visuais.md` do formato mais próximo (pra
   interface web, o de site). Leia também `identidade/design-guide.md` se o projeto é do
   negócio do dono.
2. Escolha UMA direção da cartela e UM estilo do índice que casem com o projeto, leia o
   arquivo do estilo INTEIRO (`templates/design/estilos/<nome>.md`) e declare a leitura de
   design em uma linha, com direção mais estilo. Execute o sistema do estilo inteiro (cores,
   escala tipográfica, spacing, motion). Nunca cite a marca de origem do estilo. Com
   design-guide preenchido, as cores da marca ocupam os papéis e o estilo entra como sistema
   de execução.
3. Se a interface roda no navegador, leia também `templates/site/principios-tecnicos.md` e
   aplique o que couber ao projeto: campo com `<label>` ligado, foco visível, `lang="pt-BR"`,
   `prefers-reduced-motion`, alvo de toque de 44px, nada de `innerHTML` com texto de fora, e
   nenhuma chave dentro do arquivo. Painel e ferramenta interna também são usados por gente,
   às vezes só pelo teclado.
4. Rode o teste "parece IA?" e o checklist do formato antes de entregar.

Economia e capricho não brigam: o enxuto vale pro código e pra estrutura; a interface é
capricho por definição.

## Passo 6: conferir com prova antes de dizer pronto

Dizer "pronto" sem ter rodado é o erro que mais custa confiança. Antes de fechar:

- **Rode o que dá pra rodar.** O script roda? A página abre? O comando termina sem erro?
  Se você não consegue executar, diga isso com todas as letras em vez de supor que funciona.
- **Console limpo.** Projeto com interface não entrega com erro vermelho no console.
- **Teste o caminho principal uma vez.** Aquilo que o dono vai fazer no primeiro minuto:
  o botão que ele vai clicar, o campo que ele vai preencher, o arquivo que ele vai gerar.
- **As exceções invioláveis do `/enxuto` valem sempre**, mesmo no projeto mais simples:
  validação de fronteira, erro que evita perda de dado, segurança e acessibilidade nunca
  entram na conta do "mínimo que resolve".
- **Rode `/seguranca`** antes de publicar e após mudança em auth, API, banco, pagamento, upload,
  IA, dependência ou dados pessoais. Crítico/alto bloqueia entrega. Teste autorização com anônimo,
  usuário A, usuário B, outro tenant e admin quando esses atores existirem.
- Achou defeito? Conserte antes de entregar. Não entregue com defeito conhecido e um aviso.

## Passo 7: fechar com o mapa e o "roda assim"

Todo projeto termina com:

- **O `LEIA.md` do projeto**, escrito ou atualizado na raiz da pasta dele: o que é, como
  rodar, o que já existe e o que falta. É a memória do projeto entre uma sessão e outra.
- **O que existe:** a lista curta de arquivos e o que cada um faz.
- **Onde está:** o caminho da pasta.
- **Como rodar:** o comando exato, explicado em linguagem simples. Se tem passo manual
  (instalar algo, abrir um arquivo, dar dois cliques), explique como pra quem nunca fez.
- **O que você conferiu:** uma linha dizendo o que você rodou e o que viu funcionando. Se
  não deu pra testar algo, diga qual parte e por quê.
- **Segurança e privacidade:** perfil de risco, resultado do `/seguranca`, riscos residuais,
  retenção/base legal quando houver dado pessoal e decisão humana ainda pendente.
- As pendências que dependem do dono, se houver, listadas fora da entrega.

## Princípios

1. **Uma linha antes de mil.** O brief declarado guia tudo; mudou o entendimento, muda o
   brief primeiro.
2. **A escada decide a arquitetura.** A dependência que não se justifica em meia linha não
   entra.
3. **Completo em cada passo.** Entregável esboçado não é entregável.
4. **Termina rodando.** Projeto sem "como rodar" é projeto entregue pela metade.
5. **Prova antes de "pronto".** Você rodou e viu funcionando, ou você diz que não rodou.
   Nunca a terceira opção, que é supor e chamar de entregue.

---

Plano enxuto destilado do ponytail (MIT, DietrichGebert); regra de entregável completo
destilada da output-skill do taste-skill (MIT, Leonxlnx). Crédito completo em `CREDITOS.md`.
