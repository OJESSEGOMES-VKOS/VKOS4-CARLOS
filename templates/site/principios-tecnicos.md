# Princípios técnicos do site VKOS

> Destilado do ECC (MIT, Affaan Mustafa), das WCAG 2.2 do W3C, do Web Vitals do Google e do schema.org. Reescrito em uma voz só pra sites de negócio dentro de uma instalação VKOS. Crédito completo em `CREDITOS.md`.

Este documento é o par técnico do `principios-visuais.md`. Aquele cuida da cara, este cuida do que a página faz, do que ela protege e de como ela é achada. Leia os dois antes da primeira linha de código.

Regra de escrita que vale pro documento e pro site: português brasileiro, frase curta, e NUNCA travessão nem o caractere de ponto centrado. Vírgula, ponto ou dois-pontos.

A regra que atravessa tudo: **o site é de um negócio real, com clientes reais e dados de gente real.** Bonito e quebrado não serve. Bonito e inseguro é pior que feio e seguro.

---

## 1. O formulário que funciona de verdade

Este é o item que mais separa um site que gera cliente de um site que só enfeita. Um formulário bonito que não envia nada é o defeito mais caro do sistema, porque ninguém percebe. O dono acha que está capturando contato e não está.

**Nunca entregue um `<form>` sem destino.** Se a página tem formulário, ele envia pra algum lugar, e você testa.

### As três saídas, da mais simples pra mais completa

**1. CTA direto para WhatsApp (o padrão sem coleta no site).** Sem servidor, sem cadastro e sem
copiar nome, telefone ou mensagem para uma URL. A pessoa inicia a conversa e fornece os dados já no
canal do WhatsApp:

```html
<a href="[LINK_WHATSAPP_DO_NEGOCIO]"
   target="_blank"
   rel="noopener noreferrer">
  Conversar no WhatsApp
</a>
<p class="privacidade">
  Ao continuar, você falará com [CONTROLADOR] pelo WhatsApp.
  <a href="privacidade.html">Leia o aviso de privacidade</a>.
</p>
```

Não inclua campo livre, telefone ou dado sensível no parâmetro `text` do link: query strings podem
aparecer em histórico, logs e compartilhamentos. Se a campanha exigir mensagem pronta, use somente
texto institucional sem dado da pessoa.

**2. Serviço de formulário (quando ele quer o contato no email).** Formspree, Netlify Forms e
Web3Forms são operadores de dados. Antes de escolher, registre fornecedor, finalidade, local de
tratamento, retenção e exclusão. O `action` aponta pro serviço; a chave pública nunca substitui
autorização no backend. Ao lado do botão, mostre finalidade, canal e link do aviso de privacidade.

**3. Backend próprio.** Só quando o projeto realmente exige (área logada, pagamento, integração). Isso é `/projeto`, não `/site`.

### Anti-spam sem CAPTCHA

CAPTCHA atrapalha cliente de verdade e afasta o idoso, que muitas vezes é o público. Use o campo isca, que é invisível pra pessoa e irresistível pro robô:

```html
<div aria-hidden="true" style="position:absolute; left:-9999px">
  <label for="site-url">Não preencha este campo</label>
  <input id="site-url" name="site-url" type="text" tabindex="-1" autocomplete="off">
</div>
```

Se o campo isca vier preenchido, é robô. Descarte em silêncio, sem mensagem de erro, pra não ensinar o robô a desviar.

### O que o formulário sempre tem

- Todo campo com `<label>` de verdade, ligado pelo `for`. Placeholder não é rótulo: ele some quando a pessoa digita e some pro leitor de tela.
- `autocomplete` certo (`name`, `tel`, `email`, `postal-code`). O celular preenche sozinho e a conversão sobe.
- `inputmode="numeric"` em telefone, pra abrir o teclado numérico no celular.
- Erro em texto, perto do campo, com `role="alert"`. Nunca só cor vermelha: quem não distingue vermelho não vê erro nenhum.
- Confirmação clara depois do envio. A pessoa precisa saber que deu certo.
- Botão que diz o que acontece: "Chamar no WhatsApp", não "Enviar".

---

## 2. Segurança

Estas são as regras mínimas do site estático. Se houver backend, login, banco, pagamento, upload,
IA ou dados sensíveis, aplique também `security/BASELINE.md`, o threat model e `/seguranca`.

### Nunca no código

- **Nenhuma senha, chave de API ou token dentro do HTML ou do JS.** Tudo que vai pro navegador é público, inclusive o que está "escondido" num arquivo `.js`. Se um serviço exige chave secreta, ele não pode ser chamado da página, ponto.
- **Nenhum dado pessoal de cliente** commitado em arquivo. Depoimento com nome completo e telefone é dado pessoal.
- Se o comprador colar uma chave por engano, avise na hora e diga pra ele trocar a chave, não só apagar do arquivo. Chave que já foi exposta está queimada.

### Link externo

Todo link que abre em nova aba leva `rel="noopener"`:

```html
<a href="https://instagram.com/negocio" target="_blank" rel="noopener">Instagram</a>
```

Sem isso, a página aberta ganha acesso à sua via JavaScript. É uma linha e resolve.

### Conteúdo que vem de fora

Se qualquer texto entra na página vindo do usuário, da URL ou de um arquivo, ele vai pro DOM por `textContent`, nunca por `innerHTML`:

```js
alvo.textContent = valorDoUsuario;   // certo, o texto vira texto
alvo.innerHTML  = valorDoUsuario;    // errado, o texto vira código
```

Isso é o buraco clássico de página feita às pressas. Um `<script>` colado num campo de nome vira código rodando na máquina de quem visita.

### HTTPS e cabeçalhos

- O site sempre no ar em HTTPS. Netlify, Vercel, Cloudflare Pages e GitHub Pages dão certificado gratuito e automático. Não existe motivo pra publicar em HTTP em 2026.
- Se a plataforma permitir cabeçalhos, uma política de conteúdo básica corta a maior parte do risco. No Netlify é um arquivo `_headers` na raiz:

```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'
```

Teste a CSP no destino real. Amplie somente os domínios necessários e documente cada exceção; não
use `unsafe-inline` ou `unsafe-eval` por padrão. Em site publicado, mova CSS e JavaScript externos
para arquivos locais servidos por `'self'`. Quando inline for inevitável, gere nonce por resposta
ou hash exato no build e teste a política; não copie a CSP acima sem compatibilizar o HTML. HSTS
entra apenas quando todo o domínio e os subdomínios estiverem prontos para HTTPS permanente.

### LGPD, o mínimo honesto

O negócio coleta nome e telefone. Isso é dado pessoal e a LGPD vale pra ele, mesmo sendo pequeno.

- Ao lado do botão, informar finalidade, canal usado e link do aviso. Não chamar tudo de
  “consentimento”: defina a base legal correta antes da coleta.
- Se há formulário, analytics, pixel, chat, mapa ou outro terceiro, criar `privacidade.html` com
  controlador/canal, dados, finalidade, base, fornecedores, retenção e direitos do titular.
- Coletar o mínimo, limitar retenção e testar exclusão. Não instalar rastreador sem necessidade,
  escolha informada e mecanismo de preferência quando aplicável.
- WhatsApp e serviço de formulário recebem os dados como terceiros; informar isso e não colocar
  dado sensível na URL/mensagem.

---

## 3. Acessibilidade

O público do negócio local é amplo: gente mais velha, gente no sol com a tela no brilho baixo, gente com uma mão só segurando sacola. Acessibilidade aqui não é conformidade, é não perder cliente.

O piso é WCAG 2.2 nível AA. O `principios-visuais.md` já cobre contraste. Isto cobre o resto.

### Estrutura que o leitor de tela entende

- Um `<h1>` por página, e ele diz o que a página é. Hierarquia sem pular nível: h1, depois h2, depois h3.
- Marcos semânticos como filhos diretos do body: `<header>`, `<nav>`, `<main>`, `<footer>`. Um `<main>` só por página.
- Um atalho pro conteúdo, primeira coisa dentro do body:

```html
<a href="#conteudo" class="pular">Pular para o conteúdo</a>
```

```css
.pular{ position:absolute; left:-9999px; }
.pular:focus{ left:8px; top:8px; position:fixed; z-index:100; padding:12px 16px;
              background:var(--acento); color:#fff; border-radius:8px; }
```

- Idioma declarado: `<html lang="pt-BR">`. É o que faz o leitor de tela pronunciar em português.

### Teclado

Tudo que se clica se alcança pelo Tab, na ordem visual, e mostra onde está:

```css
:focus-visible{ outline:3px solid var(--acento); outline-offset:3px; border-radius:4px; }
```

Nunca `outline:none` sem colocar outra coisa no lugar. Tirar o foco é a forma mais rápida de tornar um site inutilizável por teclado.

O que é link usa `<a href>`. O que é ação usa `<button>`. Uma `<div>` com `onclick` não recebe foco, não responde ao Enter e não é anunciada. Se o elemento leva pra algum lugar, é `<a>`; se ele faz algo, é `<button>`.

### Alvo de toque

Mínimo de 44 por 44 pixels em qualquer coisa clicável no celular, com espaço entre os alvos. Botão pequeno demais é o defeito de usabilidade mais comum em site feito no desktop.

### Movimento

Quem tem enxaqueca ou labirintite passa mal com animação. Respeite a escolha do sistema:

```css
@media (prefers-reduced-motion: reduce){
  *, *::before, *::after{
    animation-duration:0.01ms !important;
    animation-iteration-count:1 !important;
    transition-duration:0.01ms !important;
    scroll-behavior:auto !important;
  }
}
```

Nada que pisque mais de três vezes por segundo. Isso pode desencadear convulsão.

### Imagem e ícone

- Imagem que informa tem `alt` descritivo, na voz do negócio.
- Imagem só decorativa tem `alt=""` (vazio, mas presente) e `aria-hidden="true"`. Sem o alt vazio, o leitor de tela lê o nome do arquivo em voz alta.
- Ícone sozinho dentro de botão precisa de nome: `aria-label="Abrir o menu"`.

### O teste de 30 segundos

Abra a página e navegue só pelo Tab, sem mouse. Se você consegue chegar em tudo, ver onde está e acionar com Enter, passou. Se sumiu o foco em algum ponto, achou o defeito.

---

## 4. Ser encontrado no Google

O `/seo-local` cuida da estratégia e das palavras. Isto é o que precisa estar dentro do arquivo pro Google entender a página.

### O cabeçalho mínimo

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Eletricista em Sorocaba, atendimento no mesmo dia | Nome do Negócio</title>
  <meta name="description" content="Instalação e reparo elétrico residencial em Sorocaba. Orçamento sem custo pelo WhatsApp, atendimento no mesmo dia.">
  <link rel="canonical" href="https://www.negocio.com.br/">

  <meta property="og:title" content="Eletricista em Sorocaba, atendimento no mesmo dia">
  <meta property="og:description" content="Orçamento sem custo pelo WhatsApp.">
  <meta property="og:image" content="https://www.negocio.com.br/img/capa.jpg">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://www.negocio.com.br/">
</head>
```

- O `title` tem o serviço mais a cidade, porque é assim que a pessoa procura. Até 60 caracteres.
- A `description` tem até 155 caracteres e termina convidando pra ação. Ela não muda o ranking, mas muda quem clica.
- O `og:image` é o que aparece quando o link é colado no WhatsApp. Sem ele, o link do negócio chega feio na conversa, que é justamente onde ele circula. Use 1200 por 630 pixels.

### O selo do negócio local

Este é o item de maior retorno da seção e o que quase todo site de negócio local esquece. É o bloco que diz ao Google que existe um negócio ali, com endereço, telefone e horário:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Nome do Negócio",
  "image": "https://www.negocio.com.br/img/fachada.jpg",
  "url": "https://www.negocio.com.br/",
  "telephone": "+5511912345678",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua Exemplo, 123",
    "addressLocality": "Sorocaba",
    "addressRegion": "SP",
    "postalCode": "18000-000",
    "addressCountry": "BR"
  },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    "opens": "08:00", "closes": "18:00"
  }],
  "priceRange": "$$"
}
</script>
```

Preencha com os dados reais do Cérebro. **Nunca invente endereço, telefone ou horário.** Faltou o dado, pergunte ao dono ou deixe o campo fora do bloco. Dado errado aqui manda cliente pro lugar errado.

Se o negócio não tem endereço fixo (atende na casa do cliente), troque `LocalBusiness` por `Service` e use `areaServed` com a cidade.

### Os dois arquivos da raiz

`robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://www.negocio.com.br/sitemap.xml
```

`sitemap.xml`, uma linha por página do site:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.negocio.com.br/</loc></url>
  <url><loc>https://www.negocio.com.br/servicos.html</loc></url>
</urlset>
```

E um `favicon.ico` ou `icon.png` na raiz. Sem ele o navegador mostra uma folha em branco na aba, o que faz o site parecer inacabado.

---

## 5. Velocidade

Site lento perde cliente antes de mostrar o serviço. Em celular no 4G da rua, cada segundo conta. Estas regras resolvem quase tudo em HTML puro.

### Imagem, que é 90% do problema

- Nenhuma imagem entra na página com mais de 300 KB. Foto de celular vem com 4 MB: ela precisa ser reduzida antes de entrar em `img/`.
- Largura real igual à largura de exibição. Imagem de 4000 pixels num espaço de 600 é peso jogado fora.
- Formato moderno quando der. WebP costuma pesar metade do JPG na mesma qualidade.
- Toda imagem com dimensão declarada, pra página não pular enquanto carrega:

```html
<img src="img/fachada.webp" alt="Fachada da loja na Rua Exemplo"
     width="1200" height="800" loading="lazy" decoding="async">
```

- **Exceção importante:** a imagem principal do topo NÃO leva `loading="lazy"`. Ela é a primeira coisa que a pessoa vê, e adiar o carregamento dela piora justamente a métrica que mais importa. Use `fetchpriority="high"` nela.

### Fonte

- Prefira a pilha de fontes do sistema: não faz requisição a terceiro, carrega rápido e respeita a
  CSP padrão.
- Se a identidade exigir fonte própria, hospede localmente apenas os formatos e pesos usados,
  registre licença/origem e declare com `@font-face` e `font-display: swap`.
- Não carregue Google Fonts ou outro CDN por padrão. Exceção exige fornecedor aprovado, aviso de
  privacidade compatível, CSP explícita e justificativa registrada.

### O resto

- CSS dentro de um `<style>` no head ou em um arquivo só. Site pequeno não precisa de mais.
- JavaScript no fim do body ou com `defer`. Script bloqueando o topo é atraso puro.
- Nenhuma biblioteca pra fazer o que CSS faz sozinho. jQuery pra abrir um menu é 90 KB pra economizar 5 linhas.
- Nada de fonte de ícone completa pra usar três ícones. Cole os três SVG direto no HTML.

---

## 6. O teste final técnico

Rode antes de entregar, junto com o teste visual do `principios-visuais.md`. Este confere o que a página faz; aquele confere a cara dela.

**Funciona**
- [ ] Todo link clicado leva pra algum lugar que existe. Nenhum `href="#"` esquecido.
- [ ] O formulário envia de verdade e você testou o envio uma vez.
- [ ] O número do WhatsApp abre a conversa certa, com o texto montado sem caractere quebrado.
- [ ] Nenhum erro vermelho no console do navegador.
- [ ] Abre bem em 390 pixels de largura, sem rolagem horizontal.

**Protege**
- [ ] Nenhuma chave, senha ou token dentro dos arquivos.
- [ ] Todo `target="_blank"` tem `rel="noopener"`.
- [ ] Nada de `innerHTML` com texto que veio de fora.
- [ ] A linha de consentimento está ao lado do botão do formulário.

**Todo mundo usa**
- [ ] Dá pra navegar a página inteira só com Tab, e sempre dá pra ver onde o foco está.
- [ ] Todo campo do formulário tem `<label>` ligado pelo `for`.
- [ ] Toda imagem tem `alt` (descritivo ou vazio se for decoração).
- [ ] `<html lang="pt-BR">` está lá.
- [ ] O bloco de `prefers-reduced-motion` está no CSS.
- [ ] Botão e link com pelo menos 44 pixels de altura no celular.

**É achada**
- [ ] `title` com serviço e cidade, e `description` convidando pra ação.
- [ ] Bloco `LocalBusiness` preenchido com dado real, nada inventado.
- [ ] `og:image` presente, pra o link chegar bonito no WhatsApp.
- [ ] `robots.txt`, `sitemap.xml` e favicon na raiz.

**É rápida**
- [ ] Nenhuma imagem acima de 300 KB.
- [ ] Toda imagem com `width` e `height`.
- [ ] A imagem do topo sem `lazy`, o resto com.
- [ ] Fonte com `display=swap` e `preconnect`.

Item que falhou é item que volta pra bancada. Entregar com defeito conhecido é o único erro que este documento não perdoa.

---

## 7. Como conversar sobre isso com o dono

Ele não é técnico e não precisa virar. Nunca despeje termo técnico no recado final. Traduza:

| Em vez de dizer | Diga |
|---|---|
| "Implementei JSON-LD LocalBusiness" | "Coloquei no site as informações que o Google usa pra te mostrar no mapa." |
| "Adicionei honeypot anti-spam" | "Coloquei uma proteção contra robô, invisível pra quem é cliente de verdade." |
| "O site está em conformidade com WCAG AA" | "O site funciona bem pra quem enxerga pouco e pra quem usa só o teclado." |
| "Otimizei o LCP" | "O site abre rápido no celular, inclusive na internet da rua." |
| "Configurei rel=noopener" | (não diga nada, é detalhe interno) |

O que ele precisa saber é o que muda pro negócio dele: aparece no Google, o contato chega, o site abre rápido, e o cliente consegue usar. O resto é bastidor.
