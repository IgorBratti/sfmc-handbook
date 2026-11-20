# Salesforce Marketing Cloud Handbook

**English** | [Português](README.pt-BR.md)

A practical reference for **Salesforce Marketing Cloud Engagement**: AMPscript, Server-Side JavaScript, SQL and Data Views, emails, CloudPages, APIs, Journey Builder, Automation Studio and end-to-end playbooks. Reference tables to look things up, guides that explain how things work, and copy-ready code built the way I build it in production.

**Live previews:** https://igorbratti.github.io/sfmc-handbook/

Everything here is generic. No client data, no client code: placeholder names like `Customers_DE` or `Leads_DE` stand in for real objects.

## Sections

| Section | Reference | Guides | Library |
|---|---|---|---|
| [**AMPscript**](ampscript/) | [Syntax](ampscript/syntax.md) · [Functions](ampscript/functions.md) · [Personalization strings](ampscript/personalization-strings.md) | [Data writes](ampscript/data-writes.md) · [Content blocks](ampscript/content-blocks.md) · [Debugging](ampscript/debugging.md) | Recipes: personalization, dates, lookups, links, strings, send control |
| [**JavaScript**](javascript/) | [SSJS reference](javascript/ssjs/reference.md) | [SSJS fundamentals](javascript/ssjs/fundamentals.md) · [WSProxy](javascript/ssjs/wsproxy.md) · [HTTP and APIs](javascript/ssjs/http-and-apis.md) · [Client-side](javascript/client-side/) | [SSJS scripts](javascript/ssjs/scripts/) · [browser scripts](javascript/client-side/) |
| [**SQL & Data Views**](sql/) | [Data Views](sql/data-views.md) · [Query Activity](sql/query-activity.md) | [Dates and time zones](sql/dates-and-time-zones.md) | KPIs, audiences, hygiene, scoring, monitoring, patterns |
| [**Emails**](emails/) | — | [Rendering](emails/rendering-guide.md) · [Deliverability](emails/deliverability.md) · [Content Builder](emails/content-builder-guide.md) · [AMP](emails/amp/) | Base template, blocks, AMPscript examples |
| [**CloudPages**](cloudpages/) | — | [Security guide](cloudpages/security.md) | Lead form, preference center, birthday page, thank-you page |
| [**APIs**](apis/) | [REST](apis/rest-reference.md) · [SOAP](apis/soap-reference.md) | [Authentication and packages](apis/README.md) | — |
| [**Journey Builder**](journey-builder/) | — | [Design guide](journey-builder/) | — |
| [**Automation Studio**](automation-studio/) | — | [Design guide](automation-studio/) | — |
| [**Playbooks**](playbooks/) | — | — | Contact cleanup · Journey launch · Automation failure alerts |
| [**Field notes**](field-notes/) | — | Problems, causes and fixes from real projects | — |
| [**Tools**](tools/vscode-snippets/) | — | — | 24 VS Code snippets for AMPscript, SSJS and SQL |

## How do I…?

| Question | Answer |
|---|---|
| …capture leads on a CloudPage, with consent, anti-spam and attribution? | [Lead capture form](cloudpages/lead-capture-form/) |
| …stop people from opening someone else's CloudPage by editing the URL? | [Signed links](cloudpages/security.md#1-sign-every-link-that-carries-an-identity) |
| …build a preference center that logs real unsubscribes? | [Preference center](cloudpages/preference-center/) |
| …give each contact a unique coupon? | [Birthday page](cloudpages/birthday-page/) · [ClaimRowValue](ampscript/data-writes.md#claim-a-unique-value-coupons-codes) |
| …look up an AMPscript function signature? | [AMPscript functions](ampscript/functions.md) |
| …skip the send for one contact when data is missing? | [Send control](ampscript/send-control.md) |
| …choose content by segment without editing the email every time? | [Content blocks](ampscript/content-blocks.md#many-variants-a-mapping-de) |
| …know which fields each Data View has and how to join them? | [Data Views reference](sql/data-views.md) |
| …stop "today" from being yesterday in my queries? | [Dates and time zones](sql/dates-and-time-zones.md) |
| …read more than 2,000 rows of a data extension in SSJS? | [WSProxy retrieve](javascript/ssjs/scripts/wsproxy-retrieve-all.ssjs) |
| …upsert thousands of rows from a Script Activity? | [WSProxy batch upsert](javascript/ssjs/scripts/wsproxy-upsert-batch.ssjs) |
| …call the Marketing Cloud REST API from SSJS? | [REST from SSJS](javascript/ssjs/scripts/rest-api-request.ssjs) |
| …fire a journey entry event or send a transactional email by API? | [REST reference](apis/rest-reference.md) |
| …build a JSON endpoint for browser code? | [JSON Code Resource](javascript/ssjs/scripts/json-endpoint.ssjs) + [fetch-json.js](javascript/client-side/fetch-json.js) |
| …deduplicate a data extension without mixing records? | [Patterns](sql/patterns/) |
| …exclude contacts fast on a multi-million-row audience? | [Anti-join with staging](sql/patterns/) |
| …cap how many emails a contact gets per week? | [Frequency cap](sql/audiences/) |
| …report sends and clicks per journey? | [KPIs](sql/kpis/) |
| …find out an automation failed before the business does? | [Monitoring queries](sql/monitoring/) · [Alerts playbook](playbooks/automation-failure-alerts/) |
| …make an email render in Outlook and dark mode? | [Rendering guide](emails/rendering-guide.md) |
| …keep emails out of the spam folder? | [Deliverability guide](emails/deliverability.md) |
| …clean up contacts safely? | [Contact cleanup playbook](playbooks/contact-cleanup/) |
| …launch a journey without surprises? | [Journey launch playbook](playbooks/journey-launch/) |

## How content is organized

| Type | What it is | Example |
|---|---|---|
| **Reference** | Tables to look things up | [AMPscript functions](ampscript/functions.md), [Data Views](sql/data-views.md) |
| **Guide** | How something works and how to decide | [WSProxy guide](javascript/ssjs/wsproxy.md), [rendering guide](emails/rendering-guide.md) |
| **Recipe** | Short, copy-ready snippets on one theme | [Dates](ampscript/dates.md) |
| **Library item** | Complete, documented artifact (technical sheet + source + preview) | [Lead capture form](cloudpages/lead-capture-form/) |
| **Playbook** | End-to-end process with steps, checks and risks | [Contact cleanup](playbooks/contact-cleanup/) |
| **Field note** | Problem → why → fix | [SQL notes](field-notes/sql.md) |

Library items follow the same layout:

```
<section>/<item-name>/
  README.md      Technical sheet: use case, flow, data extensions, setup, key code, tests, security
  src/           Full code, ready to paste into Marketing Cloud
  preview.html   Static preview with sample data (published on GitHub Pages)
```

## Status labels

Every CloudPage, query, script and playbook shows one of these:

| Label | Meaning |
|---|---|
| **Tested** | Run end to end in a live Marketing Cloud org |
| **Ready to test** | Complete and reviewed, not yet run end to end in a live org |
| **Draft** | Work in progress |

## Conventions

- **Names:** lowercase with hyphens for folders and files (`lead-capture-form`, `monthly-email-kpis.sql`). Data extensions in the examples use `PascalCase_DE`; Marketing Cloud assets use `<BU>_<TYPE>_<OBJECTIVE>_<DETAIL>_<VERSION>`.
- **Security first:** signed identity parameters, allow-listed output, writes only on real submissions, secrets in restricted data extensions, never in code.
- **SQL:** no CTEs and no comments inside `.sql` files, so every query runs in Query Activities and Query Studio. Time zones are explicit.
- **SSJS:** ECMAScript 3 in server-side scripts; modern JavaScript only in browser scripts.
- **Language:** English, so anyone can use it.

More in [CONTRIBUTING.md](CONTRIBUTING.md).

## About me

**Igor Bratti**, Salesforce Marketing Cloud specialist with 5 years in CRM and digital marketing.
Salesforce Certified Marketing Cloud Engagement Administrator, Specialist and Developer.

[LinkedIn](https://www.linkedin.com/in/igor-bratti/) · [Trailblazer profile](https://www.salesforce.com/trailblazer/igor-bratti)

Found a bug or have a better approach? Open an issue. What changed and when: [CHANGELOG](CHANGELOG.md).

---
MIT License. Use it, adapt it, share it.
