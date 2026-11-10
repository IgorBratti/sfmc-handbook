# Salesforce Marketing Cloud Handbook

[English](README.md) | **Português**

Material prático e pronto para usar de **Salesforce Marketing Cloud Engagement**: CloudPages, e-mails, AMPscript, SSJS, SQL, playbooks de ponta a ponta e as pegadinhas que aprendi a evitar no dia a dia.

**Prévias ao vivo:** https://igorbratti.github.io/sfmc-handbook/

Tudo aqui é genérico. Nenhum dado ou código de cliente: nomes como `Customers_DE` ou `Leads_DE` são exemplos que você troca pelos seus objetos reais.

> As fichas técnicas e os códigos estão em inglês, a língua padrão da documentação da Salesforce. Esta página resume o conteúdo em português.

## Como eu faço…?

| Pergunta | Resposta |
|---|---|
| …capturar leads numa CloudPage, com consentimento e anti-spam? | [Formulário de captura de leads](cloudpages/lead-capture-form/) |
| …criar uma central de preferências que registra descadastros reais? | [Central de preferências](cloudpages/preference-center/) |
| …dar um cupom único para cada contato? | [Página de aniversário](cloudpages/birthday-page/) |
| …passar dados para uma CloudPage com segurança? | [Links e CloudPages](ampscript/links-and-cloudpages.md) |
| …cancelar o envio para um contato quando falta dado? | [Controle de envio](ampscript/send-control.md) |
| …ler mais de 2.000 linhas de uma Data Extension? | [Retrieve com WSProxy](ssjs/wsproxy-retrieve-all.ssjs) |
| …registrar erros de uma Script Activity? | [Log de erros](ssjs/try-catch-log.ssjs) |
| …deduplicar uma Data Extension sem misturar registros? | [Padrões](sql/patterns/) |
| …excluir contatos rápido em públicos de milhões de linhas? | [Anti-join com staging](sql/patterns/) |
| …limitar quantos e-mails um contato recebe por semana? | [Frequency cap](sql/audiences/) |
| …encontrar contatos inativos? | [Queries de higienização](sql/hygiene/) |
| …ver envios e cliques por jornada? | [KPIs](sql/kpis/) |
| …descobrir o melhor dia e horário de envio? | [Melhor horário](sql/kpis/) |
| …acompanhar taxas de descadastro e reclamação? | [KPIs](sql/kpis/) |
| …fazer um botão que funciona no Outlook? | [Botão à prova de Outlook](emails/blocks/button.html) |
| …limpar contatos com segurança? | [Playbook de limpeza](playbooks/contact-cleanup/) |
| …corrigir uma query que falha com `WITH`? | [Field notes: SQL](field-notes/sql.md) |
| …escrever AMPscript mais rápido no VS Code? | [Snippets para VS Code](tools/vscode-snippets/) |

## O que tem aqui

| Seção | O que você encontra | Destaques |
|---|---|---|
| [**CloudPages**](cloudpages/) | Páginas completas, com ficha técnica e prévia ao vivo | Formulário de captura de leads · Central de preferências com `LogUnsubEvent` · Página de aniversário com cupom único · Página de agradecimento |
| [**E-mails**](emails/) | Templates e blocos responsivos, compatíveis com Outlook | Template-base · Botão à prova de Outlook · Rodapé de compliance · E-mails AMP |
| [**AMPscript**](ampscript/) | Receitas curtas por tema | Personalização · Datas · Lookups e loops · Links e CloudPages · Textos e números · Controle de envio |
| [**SSJS**](ssjs/) | Scripts para CloudPages e Script Activities | Paginação com WSProxy · Log de erros |
| [**SQL**](sql/) | Biblioteca de queries sobre Data Views e Data Extensions | KPIs de e-mail · Performance por jornada · Melhor horário · Frequency cap · Contatos inativos · Segmentos de engajamento |
| [**Playbooks**](playbooks/) | Processos de ponta a ponta, passo a passo | Limpeza de contatos |
| [**Tools**](tools/vscode-snippets/) | Ferramentas para o dia a dia | Snippets de AMPscript, SSJS e SQL para VS Code |
| [**Field notes**](field-notes/) | Problemas, causas e soluções de projetos reais | Limites da Query Activity · Comportamento do Journey Builder · Templates de WhatsApp |

## Como cada item é organizado

```
<seção>/<nome-do-item>/
  README.md      Ficha técnica: caso de uso, funcionamento, Data Extensions, configuração, código principal, testes e segurança
  src/           Código completo, pronto para colar no Marketing Cloud
  preview.html   Prévia estática com dados fictícios (publicada no GitHub Pages)
```

Temas menores (receitas de AMPscript, field notes) ficam num único arquivo Markdown por tema.

## Selos de status

Cada CloudPage, query, script e playbook mostra um destes selos:

| Selo | Significado |
|---|---|
| **Tested** | Testado de ponta a ponta numa org real do Marketing Cloud |
| **Ready to test** | Completo e revisado, ainda não testado de ponta a ponta numa org real |
| **Draft** | Em construção |

## Convenções

- **Nomes:** pastas e arquivos em minúsculas, com hífen (`lead-capture-form`, `monthly-email-kpis.sql`). As Data Extensions dos exemplos usam `PascalCase_DE`.
- **Segurança em primeiro lugar:** `CloudPagesURL` para parâmetros, gravação só em envios reais de formulário, nenhuma credencial no código.
- **SQL:** sem CTEs e sem comentários dentro dos arquivos `.sql`, para que toda query rode em Query Activities e no Query Studio.

## Sobre mim

**Igor Bratti**, especialista em Salesforce Marketing Cloud, com 5 anos de experiência em CRM e marketing digital.
Certificado Salesforce Marketing Cloud Engagement Administrator, Specialist e Developer.

[LinkedIn](https://www.linkedin.com/in/igor-bratti/) · [Perfil no Trailblazer](https://www.salesforce.com/trailblazer/igor-bratti)

Encontrou um erro ou tem uma solução melhor? Abra uma issue. O que mudou e quando: [CHANGELOG](CHANGELOG.md).

---
Licença MIT. Use, adapte e compartilhe.
