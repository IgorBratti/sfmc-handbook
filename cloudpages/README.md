# CloudPages

Ready-to-adapt CloudPages built with AMPscript. Each folder is a technical sheet (use case, flow, data extensions, setup, key code, tests, security) plus the full source and a static preview.

| Page | What it shows | Status | Live preview |
|---|---|---|---|
| [Lead capture form](lead-capture-form/) | Click-to-lead form: server-side validation, honeypot, consent evidence, first-touch attribution, optional Sales Cloud lead | Ready to test | [open](https://igorbratti.github.io/sfmc-handbook/cloudpages/lead-capture-form/preview.html) |
| [Preference center](preference-center/) | Topic preferences + "unsubscribe from all" with `LogUnsubEvent` and status check | Ready to test | [open](https://igorbratti.github.io/sfmc-handbook/cloudpages/preference-center/preview.html) |
| [Birthday page](birthday-page/) | Signed link + unique coupon per contact with `ClaimRowValue` | Ready to test | [open](https://igorbratti.github.io/sfmc-handbook/cloudpages/birthday-page/preview.html) |
| [Thank-you page](thank-you-page/) | Personalized confirmation with allow-listed and signed parameters | Ready to test | [open](https://igorbratti.github.io/sfmc-handbook/cloudpages/thank-you-page/preview.html) |

Previews use sample data. The real pages run AMPscript inside Marketing Cloud.

## Read first: [Security guide](security.md)

Every page here applies the same controls. The guide explains each one with code:

| Control | Why |
|---|---|
| **Signed links** (`sk` + `sig`) | `RequestParameter` also reads plain query strings, so encryption alone doesn't stop `?sk=<someone else>` |
| **Allow-lists** with `RegExMatch` | AMPscript prints raw text; anything from the request can inject HTML |
| **Writes only on real submissions** | AMPscript runs on previews, crawlers and link scanners too |
| **Honeypot + server-side validation** | Browser validation is a convenience, not a control |
| **Fail closed, log failures** | Neutral messages for visitors, details in a restricted log DE |
| **`noindex`, no PII in plain URLs** | Personal pages stay out of search engines and logs |

## Shared data extensions

| DE | Used by | Purpose |
|---|---|---|
| `Config_DE` (`Name` PK, `Value`) | Preference center, birthday page, thank-you page | Holds `LINK_SIGNING_SECRET` |
| `Error_Log_DE` (`Source`, `Message`, `CreatedAt`) | Preference center, SSJS scripts | Restricted log for failures |
| `Customers_DE` | Birthday page, thank-you page | Generic customer master |

## Creating a CloudPage

1. **Web Studio → CloudPages** → open or create a collection.
2. **Add Content → Landing Page** → choose a blank layout.
3. Add an **HTML block** (or switch to code view) and paste `src/page.html`.
4. Create the data extensions listed in the page's README.
5. **Publish**, then copy the page ID (used in `CloudPagesURL(pageId, ...)`).
6. For JSON endpoints called from JavaScript, use a **Code Resource** of type JSON instead of a landing page. See [`json-endpoint.ssjs`](../javascript/ssjs/scripts/json-endpoint.ssjs).

Related: [links and CloudPages recipes](../ampscript/links-and-cloudpages.md) · [client-side JavaScript for CloudPages](../javascript/client-side/)

[← Back to the handbook](../README.md)
