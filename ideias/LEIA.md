# ideias/: o estacionamento de ideias e tarefas

Toda hora surge uma ideia no meio da conversa: "depois eu preciso fazer isso", "seria bom testar
aquilo", "guarda essa pra semana que vem". Esta pasta existe pra isso. Cada ideia vira um
arquivo, e o arquivo guarda contexto suficiente pra você (ou o Claude) executar com exatidão
quando chegar a hora, sem precisar lembrar de cabeça o que era.

**Não confunda com o comando `/ideias`.** O `/ideias` gera pauta de conteúdo (o que postar essa
semana, a partir do seu Cérebro). Esta pasta guarda tarefas e ideias soltas pra fazer depois,
qualquer tipo: um carrossel, um teste, uma mudança no site, uma pesquisa. São coisas diferentes
com o mesmo nome parecido, só isso.

## Como funciona

- **Uma ideia = um arquivo**, nome curto e direto (`carrossel-promocao-natal.md`,
  `testar-anuncio-bairro-novo.md`).
- Cada arquivo tem quatro partes:
  - **O que é**: a ideia em poucas frases, concreta, não um tema vago.
  - **De onde veio**: o contexto que faz ela ser executável depois sem você precisar lembrar
    (uma conversa, um material que chegou, algo que um cliente disse).
  - **O que precisa estar pronto antes**: o que falta pra rodar (uma foto, um preço, um
    depoimento, outro passo que vem primeiro).
  - **Como executar**: qual comando do VKOS resolve (`/carrossel`, `/site`, `/anuncio`...) ou o
    passo a passo, se não for um comando.
- **Executou a ideia? Apague o arquivo.** O resultado já está salvo em `conteudo/` ou
  `projetos/`, então guardar a ideia aqui de novo só vira ruído. Descartou? Também apaga.
- **Você pode jogar uma linha solta aqui a qualquer momento**, sem se preocupar com o formato.
  Só escreve o que veio na cabeça e pede pro Claude arrumar depois no padrão acima.

## Estado

Sem coluna, sem quadro, sem status. Arquivo na pasta é pendente. Arquivo apagado é feito ou
descartado. Simples assim.

## Exemplo

Uma padaria de bairro guardando uma ideia de carrossel pra depois:

```
# Carrossel: "5 coisas que só quem chega cedo na padaria sabe"

## O que é
Carrossel de bastidor mostrando o pão saindo do forno às 6h, o motivo do pão sovado ser melhor
fresco, e um convite pra quem nunca veio de manhã. Ideia de post real, não tema abstrato.

## De onde veio
Cliente comentou no balcão que "não sabia que vocês abriam tão cedo" e comprou 3 pães na hora.
Mostra que tem gente que não sabe do horário. Vira prova de que bastidor de manhã vende.

## O que precisa estar pronto antes
Falta uma foto do forno aberto de manhã, tirada com boa luz (o dono vai tirar na quinta).

## Como executar
`/carrossel` assim que a foto chegar. Ler o Cérebro antes, puxar a voz de lá. Legenda pelo
`/legenda` na sequência.
```

Quando o carrossel sair e for postado, este arquivo é apagado.
