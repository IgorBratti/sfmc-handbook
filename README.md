# Salesforce Marketing Cloud Handbook

**English** | [Português](README.pt-BR.md)

Practical, copy-ready material for **Salesforce Marketing Cloud Engagement**: CloudPages, emails, AMPscript, SSJS, SQL, end-to-end playbooks and the traps I've learned to avoid in day-to-day work.

**Live previews:** https://igorbratti.github.io/sfmc-handbook/

Everything here is generic. No client data, no client code: placeholder names like `Customers_DE` or `Leads_DE` stand in for real objects.

## How do I…?

| Question | Answer |
|---|---|
| …capture leads on a CloudPage, with consent and anti-spam? | [Lead capture form](cloudpages/lead-capture-form/) |
| …build a preference center that logs real unsubscribes? | [Preference center](cloudpages/preference-center/) |
| …give each contact a unique coupon? | [Birthday page](cloudpages/birthday-page/) |
| …pass data to a CloudPage securely? | [Links and CloudPages](ampscript/links-and-cloudpages.md) |
| …skip the send for one contact when data is missing? | [Send control](ampscript/send-control.md) |
| …read more than 2,000 rows of a data extension? | [WSProxy retrieve](ssjs/wsproxy-retrieve-all.ssjs) |
| …log errors from a Script Activity? | [Error logging](ssjs/try-catch-log.ssjs) |
| …deduplicate a data extension without mixing records? | [Patterns](sql/patterns/) |
| …exclude contacts fast on a multi-million-row audience? | [Anti-join with staging](sql/patterns/) |
| …cap how many emails a contact gets per week? | [Frequency cap](sql/audiences/) |
| …find inactive contacts? | [Hygiene queries](sql/hygiene/) |
| …report sends and clicks per journey? | [KPIs](sql/kpis/) |
| …find the best day and hour to send? | [Best send time](sql/kpis/) |
| …track unsubscribe and complaint rates? | [KPIs](sql/kpis/) |
| …make a button that works in Outlook? | [Bulletproof button](emails/blocks/button.html) |
| …clean up contacts safely? | [Contact cleanup playbook](playbooks/contact-cleanup/) |
| …fix a query that fails with `WITH`? | [Field notes: SQL](field-notes/sql.md) |
| …write AMPscript faster in VS Code? | [VS Code snippets](tools/vscode-snippets/) |

## What's inside

| Section | What you'll find | Highlights |
|---|---|---|
| [**CloudPages**](cloudpages/) | Complete pages with technical sheets and live previews | Lead capture form · Preference center with `LogUnsubEvent` · Birthday page with unique coupons · Thank-you page |
| [**Emails**](emails/) | Responsive, Outlook-safe templates and blocks | Base template · Bulletproof button · Compliance footer · AMP emails |
| [**AMPscript**](ampscript/) | Short recipes by theme | Personalization · Dates · Lookups and loops · Links and CloudPages · Strings and numbers · Send control |
| [**SSJS**](ssjs/) | Scripts for CloudPages and Script Activities | WSProxy pagination · Error logging |
| [**SQL**](sql/) | Query library on Data Views and data extensions | Email KPIs · Journey performance · Best send time · Frequency cap · Inactive contacts · Engagement segments |
| [**Playbooks**](playbooks/) | End-to-end processes, step by step | Contact cleanup |
| [**Tools**](tools/vscode-snippets/) | Helpers for day-to-day work | VS Code snippets for AMPscript, SSJS and SQL |
| [**Field notes**](field-notes/) | Problems, causes and fixes from real projects | Query Activity limits · Journey Builder behavior · WhatsApp templates |

## How each item is organized

```
<section>/<item-name>/
  README.md      Technical sheet: use case, how it works, data extensions, setup, key code, tests, security
  src/           Full code, ready to paste into Marketing Cloud
  preview.html   Static preview with sample data (published on GitHub Pages)
```

Smaller topics (AMPscript recipes, field notes) live in a single Markdown file per theme.

## Status labels

Every CloudPage, query, script and playbook shows one of these:

| Label | Meaning |
|---|---|
| **Tested** | Run end to end in a live Marketing Cloud org |
| **Ready to test** | Complete and reviewed, not yet run end to end in a live org |
| **Draft** | Work in progress |

## Conventions

- **Names:** lowercase with hyphens for folders and files (`lead-capture-form`, `monthly-email-kpis.sql`). Data extensions in the examples use `PascalCase_DE`.
- **Security first:** `CloudPagesURL` for parameters, writes only on real form submissions, no credentials in code.
- **SQL:** no CTEs and no comments inside `.sql` files, so every query runs in Query Activities and Query Studio.
- **Language:** English, so anyone can use it.

## About me

**Igor Bratti**, Salesforce Marketing Cloud specialist with 5 years in CRM and digital marketing.
Salesforce Certified Marketing Cloud Engagement Administrator, Specialist and Developer.

[LinkedIn](https://www.linkedin.com/in/igor-bratti/) · [Trailblazer profile](https://www.salesforce.com/trailblazer/igor-bratti)

Found a bug or have a better approach? Open an issue. What changed and when: [CHANGELOG](CHANGELOG.md).

---
MIT License. Use it, adapt it, share it.
