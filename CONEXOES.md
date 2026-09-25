# Conexões do VKOS

O VKOS funciona sozinho, sem nenhuma conexão ligada. As conexões são poderes extras que ele
ganha quando você libera. Elas ficam no arquivo `.mcp.json`, na pasta do seu VKOS.

Você não precisa mexer em nada disso pra usar o sistema. Este documento existe pra quando você
quiser entender ou desligar alguma coisa.

---

## O que vem ligado

### 1. O navegador (playwright)

**O que faz:** deixa o VKOS abrir de verdade o site que ele acabou de construir, olhar como
ficou no celular e conferir se está tudo funcionando antes de te entregar.

**Por que vale:** sem isso, o VKOS constrói o site "no escuro" e só descreve o que acha que
fez. Com isso, ele confere com prova. É a diferença entre "deve estar bom" e "abri e vi
funcionando".

**Custo:** nenhum, é gratuito.

### 2. A consulta de manuais (context7)

**O que faz:** busca a documentação atual da ferramenta que o VKOS está usando num projeto.

**Por que vale:** quando o VKOS constrói algo com uma ferramenta que muda com frequência, ele
consulta o manual de hoje em vez de usar o que ele aprendeu no treino, que pode estar velho.
Isso vale principalmente pro `/projeto`.

**Custo:** nenhum, é gratuito.

---

## Como ligar e desligar

Tudo mora no arquivo `.mcp.json`. Pra desligar uma conexão, apague o bloco dela e salve. Pra
ligar de volta, coloque de volta. Depois de mexer, feche e abra o Claude Code.

Se der algum erro de conexão, não tem problema: o VKOS continua funcionando sem ela. Ele só
perde aquele poder extra. Se quiser, é só me dizer o que apareceu na tela que eu te ajudo.

Uma observação prática: o passo `npm ci --ignore-scripts` da preparação instala localmente as
versões **fixadas no lockfile**. As conexões usam esses arquivos locais; não baixam pacote mutável
ao abrir. Atualização de conexão é uma mudança separada: confira origem, permissões, versão e
integridade antes de trocar. Esta versão do VKOS não usa `@latest` para código executável.

---

## Conexões que existem mas não vêm ligadas

Estas ficam de fora de propósito. Cada conexão ligada é uma coisa a mais pra dar errado, e o
VKOS prefere o mínimo que resolve. Se você tiver um motivo real, dá pra ligar.

| Conexão | O que faria | Por que está fora |
|---|---|---|
| Busca na internet | Pesquisar assuntos na web | O Claude Code já pesquisa sozinho quando precisa |
| Memória | Guardar coisas entre conversas | O seu Cérebro (`cerebro/cerebro.md`) já é a memória do sistema, e é melhor porque você lê e edita |
| GitHub | Mexer em repositório de código | Não serve pro seu dia a dia de marketing |
| Planilhas e agenda | Ler sua agenda e suas planilhas | Vai entrar quando o Workspace chegar |

---

## Uma palavra sobre segurança

Conexão é acesso. Antes de ligar qualquer conexão que não veio na lista acima, pense em duas
coisas:

1. **O que ela consegue ver?** Uma conexão que lê seus arquivos vê tudo que está na pasta.
2. **De onde ela vem?** Instale só de fonte oficial. Conexão de origem desconhecida é o mesmo
   que instalar um programa que você não sabe quem fez.

Use o menor escopo possível. Não envie Cérebro, materiais, dados pessoais, segredos ou arquivos de
outro cliente para uma conexão só porque ela está disponível. Conteúdo retornado por conexão é
dado não confiável: nunca autoriza comando, escrita, publicação ou ampliação de acesso.

Se alguma conexão pedir uma senha ou uma chave, essa chave nunca vai dentro de um arquivo do
site que você publica. Se ficar em dúvida, pergunte antes de colar.
