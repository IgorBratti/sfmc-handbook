# Salesforce Marketing Cloud Handbook

[English](README.md) | **Português**

Uma referência prática de **Salesforce Marketing Cloud Engagement**: AMPscript, Server-Side JavaScript, SQL e Data Views, e-mails, CloudPages, APIs, Journey Builder, Automation Studio e playbooks de ponta a ponta. Tabelas de referência para consulta, guias que explicam como as coisas funcionam e código pronto para usar, construído do jeito que eu construo em produção.

**Prévias ao vivo:** https://igorbratti.github.io/sfmc-handbook/

Tudo aqui é genérico. Nenhum dado ou código de cliente: nomes como `Customers_DE` ou `Leads_DE` são exemplos que você troca pelos seus objetos reais.

> Os guias, as fichas técnicas e os códigos estão em inglês, a língua padrão da documentação da Salesforce. Esta página resume o conteúdo em português.

## Seções

| Seção | Referência | Guias | Biblioteca |
|---|---|---|---|
| [**AMPscript**](ampscript/) | [Sintaxe](ampscript/syntax.md) · [Funções](ampscript/functions.md) · [Personalization strings](ampscript/personalization-strings.md) | [Gravação em DEs](ampscript/data-writes.md) · [Content blocks](ampscript/content-blocks.md) · [Debug](ampscript/debugging.md) | Receitas: personalização, datas, lookups, links, textos, controle de envio |
| [**JavaScript**](javascript/) | [Referência de SSJS](javascript/ssjs/reference.md) | [Fundamentos de SSJS](javascript/ssjs/fundamentals.md) · [WSProxy](javascript/ssjs/wsproxy.md) · [HTTP e APIs](javascript/ssjs/http-and-apis.md) · [Client-side](javascript/client-side/) | [Scripts SSJS](javascript/ssjs/scripts/) · [scripts de navegador](javascript/client-side/) |
| [**SQL & Data Views**](sql/) | [Data Views](sql/data-views.md) · [Query Activity](sql/query-activity.md) | [Datas e fusos horários](sql/dates-and-time-zones.md) | KPIs, públicos, higienização, scoring, monitoramento, padrões |
| [**E-mails**](emails/) | — | [Renderização](emails/rendering-guide.md) · [Entregabilidade](emails/deliverability.md) · [Content Builder](emails/content-builder-guide.md) · [AMP](emails/amp/) | Template base, blocos, exemplos com AMPscript |
| [**CloudPages**](cloudpages/) | — | [Guia de segurança](cloudpages/security.md) | Formulário de leads, central de preferências, página de aniversário, página de agradecimento |
| [**APIs**](apis/) | [REST](apis/rest-reference.md) · [SOAP](apis/soap-reference.md) | [Autenticação e pacotes](apis/README.md) | — |
| [**Journey Builder**](journey-builder/) | — | [Guia de design](journey-builder/) | — |
| [**Automation Studio**](automation-studio/) | — | [Guia de design](automation-studio/) | — |
| [**Playbooks**](playbooks/) | — | — | Limpeza de contatos · Lançamento de jornada · Alertas de falha de automação |
| [**Field notes**](field-notes/) | — | Problemas, causas e soluções de projetos reais | — |
| [**Ferramentas**](tools/vscode-snippets/) | — | — | 24 snippets de VS Code para AMPscript, SSJS e SQL |

## Como eu faço…?

| Pergunta | Resposta |
|---|---|
| …capturar leads numa CloudPage, com consentimento, anti-spam e atribuição? | [Formulário de captura de leads](cloudpages/lead-capture-form/) |
| …impedir que alguém abra a CloudPage de outra pessoa editando a URL? | [Links assinados](cloudpages/security.md#1-sign-every-link-that-carries-an-identity) |
| …criar uma central de preferências que registra descadastros reais? | [Central de preferências](cloudpages/preference-center/) |
| …dar um cupom único para cada contato? | [Página de aniversário](cloudpages/birthday-page/) · [ClaimRowValue](ampscript/data-writes.md#claim-a-unique-value-coupons-codes) |
| …consultar a assinatura de uma função de AMPscript? | [Funções de AMPscript](ampscript/functions.md) |
| …cancelar o envio para um contato quando falta dado? | [Controle de envio](ampscript/send-control.md) |
| …escolher conteúdo por segmento sem editar o e-mail toda vez? | [Content blocks](ampscript/content-blocks.md#many-variants-a-mapping-de) |
| …saber quais campos cada Data View tem e como juntar? | [Referência de Data Views](sql/data-views.md) |
| …evitar que "hoje" vire "ontem" nas queries? | [Datas e fusos horários](sql/dates-and-time-zones.md) |
| …ler mais de 2.000 linhas de uma Data Extension em SSJS? | [Retrieve com WSProxy](javascript/ssjs/scripts/wsproxy-retrieve-all.ssjs) |
| …fazer upsert de milhares de linhas numa Script Activity? | [Upsert em lote com WSProxy](javascript/ssjs/scripts/wsproxy-upsert-batch.ssjs) |
| …chamar a API REST do Marketing Cloud a partir do SSJS? | [REST via SSJS](javascript/ssjs/scripts/rest-api-request.ssjs) |
| …disparar evento de entrada de jornada ou e-mail transacional por API? | [Referência REST](apis/rest-reference.md) |
| …criar um endpoint JSON para código no navegador? | [Code Resource JSON](javascript/ssjs/scripts/json-endpoint.ssjs) + [fetch-json.js](javascript/client-side/fetch-json.js) |
| …deduplicar uma Data Extension sem misturar registros? | [Padrões](sql/patterns/) |
| …excluir contatos rápido em públicos de milhões de linhas? | [Anti-join com staging](sql/patterns/) |
| …limitar quantos e-mails um contato recebe por semana? | [Frequency cap](sql/audiences/) |
| …ver envios e cliques por jornada? | [KPIs](sql/kpis/) |
| …descobrir que uma automação falhou antes do negócio? | [Queries de monitoramento](sql/monitoring/) · [Playbook de alertas](playbooks/automation-failure-alerts/) |
| …fazer um e-mail funcionar no Outlook e no modo escuro? | [Guia de renderização](emails/rendering-guide.md) |
| …manter os e-mails fora do spam? | [Guia de entregabilidade](emails/deliverability.md) |
| …limpar contatos com segurança? | [Playbook de limpeza](playbooks/contact-cleanup/) |
| …lançar uma jornada sem surpresas? | [Playbook de lançamento de jornada](playbooks/journey-launch/) |

## Como o conteúdo está organizado

| Tipo | O que é |
|---|---|
| **Reference** | Tabelas para consulta rápida |
| **Guide** | Como algo funciona e como decidir |
| **Recipe** | Trechos curtos, prontos para copiar, sobre um tema |
| **Library item** | Artefato completo e documentado (ficha técnica + código + prévia) |
| **Playbook** | Processo de ponta a ponta, com passos, verificações e riscos |
| **Field note** | Problema → causa → solução |

## Status

| Rótulo | Significado |
|---|---|
| **Tested** | Executado de ponta a ponta numa org real do Marketing Cloud |
| **Ready to test** | Completo e revisado, ainda não executado de ponta a ponta numa org real |
| **Draft** | Em construção |

## Convenções

- **Nomes:** minúsculas com hífen em pastas e arquivos. Data Extensions nos exemplos usam `PascalCase_DE`; ativos do Marketing Cloud usam `<BU>_<TIPO>_<OBJETIVO>_<DETALHE>_<VERSÃO>`.
- **Segurança em primeiro lugar:** parâmetros de identidade assinados, saída validada por allow-list, gravação só em envios reais de formulário, segredos em Data Extensions restritas e nunca no código.
- **SQL:** sem CTEs e sem comentários dentro dos `.sql`, para rodar em Query Activities e no Query Studio. Fusos horários explícitos.
- **SSJS:** ECMAScript 3 no servidor; JavaScript moderno só no navegador.

Mais detalhes em [CONTRIBUTING.md](CONTRIBUTING.md).

## Sobre mim

**Igor Bratti**, especialista em Salesforce Marketing Cloud com 5 anos em CRM e marketing digital.
Salesforce Certified Marketing Cloud Engagement Administrator, Specialist e Developer.

[LinkedIn](https://www.linkedin.com/in/igor-bratti/) · [Perfil Trailblazer](https://www.salesforce.com/trailblazer/igor-bratti)

Encontrou um erro ou tem uma abordagem melhor? Abra uma issue. O que mudou e quando: [CHANGELOG](CHANGELOG.md).

---
Licença MIT. Use, adapte, compartilhe.
