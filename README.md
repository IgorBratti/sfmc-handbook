# Salesforce Marketing Cloud Handbook

**English** | [Português](README.pt-BR.md)

Practical, copy-ready material for **Salesforce Marketing Cloud Engagement**: CloudPages, emails, AMPscript, SSJS, SQL, end-to-end playbooks and the traps I've learned to avoid in day-to-day work.

**Live previews:** https://igorbratti.github.io/sfmc-handbook/

Everything here is generic. No client data, no client code: placeholder names like `Customers_DE` or `Leads_DE` stand in for real objects.

## What's inside

| Section | What you'll find | Highlights |
|---|---|---|
| [**CloudPages**](cloudpages/) | Complete pages with technical sheets and live previews | Lead capture form · Preference center with `LogUnsubEvent` · Birthday page with unique coupons · Thank-you page |
| [**Emails**](emails/) | Responsive, Outlook-safe templates and blocks | Base template · Bulletproof button · Compliance footer · AMP emails |
| [**AMPscript**](ampscript/) | Short recipes by theme | Personalization · Dates · Lookups and loops · Links and CloudPages · Strings and numbers |
| [**SSJS**](ssjs/) | Scripts for CloudPages and Script Activities | WSProxy pagination · Error logging |
| [**SQL**](sql/) | Query library on Data Views and data extensions | Email KPIs · Journey performance · Inactive contacts · Engagement segments |
| [**Playbooks**](playbooks/) | End-to-end processes, step by step | Contact cleanup |
| [**Field notes**](field-notes/) | Problems, causes and fixes from real projects | Query Activity limits · Journey Builder behavior · WhatsApp templates |

## How each item is organized

```
<section>/<item-name>/
  README.md      Technical sheet: use case, how it works, data extensions, setup, key code, tests, security
  src/           Full code, ready to paste into Marketing Cloud
  preview.html   Static preview with sample data (published on GitHub Pages)
```

Smaller topics (AMPscript recipes, field notes) live in a single Markdown file per theme.

## Conventions

- **Names:** lowercase with hyphens for folders and files (`lead-capture-form`, `monthly-email-kpis.sql`). Data extensions in the examples use `PascalCase_DE`.
- **Security first:** `CloudPagesURL` for parameters, writes only on real form submissions, no credentials in code.
- **SQL:** no CTEs and no comments inside `.sql` files, so every query runs in Query Activities and Query Studio.
- **Language:** English, so anyone can use it.

## About me

**Igor Bratti**, Salesforce Marketing Cloud specialist with 5 years in CRM and digital marketing.
Salesforce Certified Marketing Cloud Engagement Administrator, Specialist and Developer.

[LinkedIn](https://www.linkedin.com/in/igor-bratti/) · [Trailblazer profile](https://www.salesforce.com/trailblazer/igor-bratti)

Found a bug or have a better approach? Open an issue.

---
MIT License. Use it, adapt it, share it.
