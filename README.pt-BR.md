# Salesforce Marketing Cloud Handbook

[English](README.md) | **Português**

Material prático e pronto para usar de **Salesforce Marketing Cloud Engagement**: CloudPages, e-mails, AMPscript, SSJS, SQL, playbooks de ponta a ponta e as pegadinhas que aprendi a evitar no dia a dia.

**Prévias ao vivo:** https://igorbratti.github.io/sfmc-handbook/

Tudo aqui é genérico. Nenhum dado ou código de cliente: nomes como `Customers_DE` ou `Leads_DE` são exemplos que você troca pelos seus objetos reais.

> As fichas técnicas e os códigos estão em inglês, a língua padrão da documentação da Salesforce. Esta página resume o conteúdo em português.

## O que tem aqui

| Seção | O que você encontra | Destaques |
|---|---|---|
| [**CloudPages**](cloudpages/) | Páginas completas, com ficha técnica e prévia ao vivo | Formulário de captura de leads · Central de preferências com `LogUnsubEvent` · Página de aniversário com cupom único · Página de agradecimento |
| [**E-mails**](emails/) | Templates e blocos responsivos, compatíveis com Outlook | Template-base · Botão à prova de Outlook · Rodapé de compliance · E-mails AMP |
| [**AMPscript**](ampscript/) | Receitas curtas por tema | Personalização · Datas · Lookups e loops · Links e CloudPages · Textos e números |
| [**SSJS**](ssjs/) | Scripts para CloudPages e Script Activities | Paginação com WSProxy · Log de erros |
| [**SQL**](sql/) | Biblioteca de queries sobre Data Views e Data Extensions | KPIs de e-mail · Performance por jornada · Contatos inativos · Segmentos de engajamento |
| [**Playbooks**](playbooks/) | Processos de ponta a ponta, passo a passo | Limpeza de contatos |
| [**Field notes**](field-notes/) | Problemas, causas e soluções de projetos reais | Limites da Query Activity · Comportamento do Journey Builder · Templates de WhatsApp |

## Como cada item é organizado

```
<seção>/<nome-do-item>/
  README.md      Ficha técnica: caso de uso, funcionamento, Data Extensions, configuração, código principal, testes e segurança
  src/           Código completo, pronto para colar no Marketing Cloud
  preview.html   Prévia estática com dados fictícios (publicada no GitHub Pages)
```

Temas menores (receitas de AMPscript, field notes) ficam num único arquivo Markdown por tema.

## Convenções

- **Nomes:** pastas e arquivos em minúsculas, com hífen (`lead-capture-form`, `monthly-email-kpis.sql`). As Data Extensions dos exemplos usam `PascalCase_DE`.
- **Segurança em primeiro lugar:** `CloudPagesURL` para parâmetros, gravação só em envios reais de formulário, nenhuma credencial no código.
- **SQL:** sem CTEs e sem comentários dentro dos arquivos `.sql`, para que toda query rode em Query Activities e no Query Studio.

## Sobre mim

**Igor Bratti**, especialista em Salesforce Marketing Cloud, com 5 anos de experiência em CRM e marketing digital.
Certificado Salesforce Marketing Cloud Engagement Administrator, Specialist e Developer.

[LinkedIn](https://www.linkedin.com/in/igor-bratti/) · [Perfil no Trailblazer](https://www.salesforce.com/trailblazer/igor-bratti)

Encontrou um erro ou tem uma solução melhor? Abra uma issue.

---
Licença MIT. Use, adapte e compartilhe.
