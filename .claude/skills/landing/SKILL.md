---
name: landing
description: >
  Escreve uma página de captura (landing) focada em UMA oferta e UM objetivo: promessa, prova,
  oferta e formulário/CTA, e constrói a página pronta em HTML se o comprador quiser. Use quando
  o comprador disser /landing, "página pra uma promoção", "página de captura", "quero capturar
  contatos pra X", ou quando /site indicar que é página única.
---

# /landing: página de captura de uma oferta só

Landing tem um único trabalho: converter quem chega em contato/lead pra UMA oferta. Sem menu,
sem distração, um caminho só. E se o comprador quiser, o VKOS constrói a página pronta em HTML
e CSS, direto na pasta da peça (Passo 4, opcional).

## Antes

Leia `cerebro/cerebro.md`. Em branco → `/instalar`. Foque na oferta específica que o comprador
quer promover. Leia também `marca/conversao.md`: abra na dor (teste dos 5 segundos),
especificidade > descrição, CTA que responde as 3 perguntas, e não ancore o preço no zero/grátis.

## Passo 1: a oferta e a ação

Confirme: qual é a oferta única? Qual a ação desejada (deixar WhatsApp, agendar, baixar algo,
comprar)? Qual o público exato dessa página?

## Passo 2: escrever

Estrutura de conversão, na voz do Cérebro:

1. **Headline:** a promessa concreta da oferta. Grande e clara.
2. **Subheadline:** pra quem é + o benefício principal.
3. **A dor:** o problema que essa oferta resolve (rápido, o cliente se reconhece).
4. **A oferta:** o que é, o que inclui, como funciona. Concreto.
5. **Provas:** depoimentos, números, garantia (o que tiver de real).
6. **Quebra de objeção:** responde o "será que é pra mim?" (bloco 7).
7. **CTA (repetido 2-3x):** a ação única, botão claro. Se tiver formulário, diga os campos
   mínimos (quanto menos, mais gente completa).
8. **P.S. / urgência honesta:** se houver prazo/vaga real, use. Sem falsa escassez.

## Passo 3: entregar o texto

Salve em `conteudo/<AAAA-MM-DD>-landing-<oferta>/landing.md`. Diga que é só montar num construtor
de página única, seção por seção.

E ofereça o próximo passo, em uma frase simples: *"Se você quiser, eu mesmo construo a página
pronta, com visual e tudo, aqui na sua pasta. Quer?"* Se ele topar, vá pro Passo 4. Se não,
siga pro "Como colocar no ar".

## Passo 4 (opcional): construir a página

Antes do primeiro arquivo, leia `security/BASELINE.md`. Landing coleta lead: documente finalidade,
base legal, fornecedor, retenção e exclusão com `security/LGPD-CHECKLIST.md`. Se houver login,
backend, banco, pagamento, upload ou IA, use `/projeto`. Antes de publicar, rode `/seguranca`.

Só entre aqui com o texto do Passo 2 **aprovado** pelo comprador. A construção usa o texto
aprovado como conteúdo, não reescreve nada sem avisar.

1. **Leia antes de qualquer código:** `templates/site/principios-visuais.md` INTEIRO (vale
   igual pra landing: cor, tipografia, layout, motion, proibições, teste final e o contrato do
   Studio na seção 6) e `templates/site/principios-tecnicos.md` INTEIRO. Na landing o técnico
   pesa ainda mais que no site: a página inteira existe pra capturar contato, então um
   formulário que não envia transforma a peça em enfeite caro. Leia também
   `templates/design/cartela.md`. Se o `identidade/design-guide.md`
   estiver preenchido, ele manda mais que a cartela: as cores e fontes da marca ocupam os
   papéis, a direção vira só personalidade.
2. **Declare a leitura de design em UMA linha** antes da primeira linha de código:
   *"Lendo isto como: página única para [público], linguagem [vibe], direção [direção da
   cartela]."*
3. **Construa na mesma pasta da peça:** um arquivo só,
   `conteudo/<AAAA-MM-DD>-landing-<oferta>/index.html`. Landing é uma página, então não crie
   outras. E nunca nomeie página de `carrossel.html`: o app usa exatamente esse nome pra
   reconhecer peça de carrossel, e uma página com ele faz a peça inteira ser lida errado.
4. **Imagens em `img/`** dentro da pasta da peça, sempre caminho relativo (`img/oferta.jpg`).
   Só imagem real: de `materiais/`, do `identidade/logo/`, ou que o comprador mandar. Sem foto
   boa disponível, resolva com tipografia, cor e composição, nunca com imagem simulada, stock
   externo ou link pra arquivo que não existe.
5. **O destino do `landing.md`:** com a página construída, mova o `landing.md` pra
   `notas/landing.md` dentro da própria pasta da peça. A regra do contrato é nenhum `.md`
   solto na raiz da pasta; em `notas/` o texto aprovado fica guardado pra edições futuras e o
   app continua lendo a peça como site pelo `.html`.
6. **Siga o contrato do Studio (seção 6 do princípios) na íntegra.** Seções semânticas filhas
   diretas do body, decoração com `aria-hidden`, todo clicável é `<a>`, imagem de conteúdo em
   elemento real, caminhos relativos. Na landing isso importa em dobro: é a página que mais
   recebe ajuste fino de CTA e oferta.
7. **A captura tem que funcionar (seção 1 do técnico), e você testa antes de entregar.** Este é
   o item número um da landing:
   - O caminho padrão é o WhatsApp montado com `encodeURIComponent`, com o número do Cérebro.
     Quer o contato no email? Aí é serviço de formulário, e você diz ao comprador onde ele cria
     a conta e onde cola a chave, em uma linha simples.
   - Menos campo, mais gente completa. Nome e WhatsApp bastam na maioria dos casos. Cada campo
     a mais precisa se justificar.
   - Todo campo com `<label>` ligado pelo `for` e `autocomplete` certo, pra o celular preencher
     sozinho. Telefone com `inputmode="numeric"`.
   - Campo isca contra robô, invisível pra pessoa. Nunca CAPTCHA: ele derruba a conversão e
     afasta justamente o cliente mais velho.
   - Erro em texto ao lado do campo, com `role="alert"`. Nunca só a cor vermelha.
   - Confirmação clara depois do envio. A pessoa precisa saber que chegou.
   - A linha de consentimento ao lado do botão, em português simples, sem juridiquês.
   - **Teste o envio uma vez antes de entregar.** Landing entregue sem teste de envio é landing
     entregue quebrada.
8. **A página precisa ser achada e chegar bonita (seções 2 e 4 do técnico).** `<html lang="pt-BR">`,
   `title`, `description` e principalmente o `og:image`: landing circula colada em conversa de
   WhatsApp e em anúncio, e link sem imagem chega feio justamente onde ele mais aparece.
9. **Rode os dois testes finais antes de entregar:** o visual (seção 5 do princípios visuais),
   com "parece IA?", teste de reflexo, mobile de 390px sem estouro e contraste; e o técnico
   (seção 6 do princípios técnicos). Landing que vai receber anúncio abre no celular: o mobile
   é a tela principal, não a exceção. Só entregue o que passar nos dois.
10. **Entregue simples:** diga onde a página ficou, que dá pra ver abrindo o `index.html` com
   dois cliques, e aponte o caminho de publicação do "Como colocar no ar". Diga também, em uma
   frase, pra onde o contato vai chegar quando alguém preencher. Faltou algo que só o comprador
   tem (uma foto, um preço)? A página sai completa com o que existe e a pendência vai listada
   no seu recado final, nunca como buraco dentro da página.

## Como colocar no ar

O texto está pronto. Agora é escolher onde publicar. Três caminhos, do mais fácil pro mais
completo, todos dá pra começar de graça:

1. **Google Sites** (gratuito, o mais simples). Arrasta e solta, cola cada seção e publica na
   hora.
2. **Wix ou Carrd** (gratuitos no plano básico, visual mais bonito). O Carrd é feito justamente
   pra página única como esta, então costuma ser o encaixe mais natural pra uma landing.
3. **Já tem site em WordPress ou outra plataforma?** É só colar seção por seção no que você já usa.

**Se a página foi construída no Passo 4:** o arquivo pronto está na pasta da peça. Dá pra
publicar de graça em serviços de site estático (o Netlify, por exemplo, aceita arrastar a pasta
inteira e devolve um endereço no ar em um minuto). Página estática assim já nasce leve, o que
ajuda muito quando recebe anúncio.

**Endereço (domínio):** dá pra começar sem comprar nada, o endereço gratuito da plataforma já
funciona. Depois, se quiser algo mais profissional (tipo `seunegocio.com.br`), você registra um
domínio no registro.br por uns R$40 por ano e liga na plataforma.

**Se essa página vai receber anúncio pago:** ela PRECISA já estar no ar e abrindo rápido no
celular antes de você ligar a campanha. Anúncio mandando gente pra uma página fora do ar, ou que
demora pra abrir, é dinheiro jogado fora.

Se você não quiser mexer com isso, a VirtuoKingdom coloca no ar pra você. É só chamar em
virtuokingdom.com.br.

## Princípios

1. **Uma oferta, uma ação.** Zero distração, zero menu.
2. **CTA repetido**, sempre a mesma ação.
3. **Urgência só se for verdade.** Nada de escassez falsa.
4. **Construção sem atalho.** Leitura de design declarada, uma direção executada inteira,
   contrato do Studio respeitado, teste final antes de entregar.
5. **O contato tem que chegar.** Uma landing linda que não captura é a peça mais cara do
   sistema: o dono paga anúncio pra mandar gente numa página que não devolve nada. Testar o
   envio é parte da entrega, não um extra.
