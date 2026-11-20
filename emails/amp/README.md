# AMP for Email in Marketing Cloud

> **Type:** Guide · What AMP emails are, what they require in Marketing Cloud, and when they're worth the effort. Templates for this folder are planned; this page covers the setup and design rules first.

[← Emails](../README.md)

---

## What it is

AMP for Email adds a third MIME part (`text/x-amp-html`) to the message. Supporting clients render it instead of the HTML version and let the reader act inside the email: submit a form, reveal a coupon, browse a carousel, update preferences. Every other client shows the regular HTML part.

| Part | Who sees it |
|---|---|
| AMP (`text/x-amp-html`) | Supporting clients, for a limited time after sending (typically 30 days) |
| HTML | Everyone else, and AMP clients after the AMP part expires |
| Text | Plain-text clients |

## Requirements

1. **Sender registration** with each mailbox provider that renders AMP (Google for Gmail, plus others such as Yahoo and Mail.ru). Registration requires a production-quality AMP email, a good sending history and authenticated mail (SPF, DKIM, DMARC).
2. **Valid AMP markup**: the `⚡4email` attribute, the AMP runtime script, the boilerplate style, only allowed components and CSS (no custom JavaScript, `<style amp-custom>` limited in size).
3. **Endpoints for dynamic data** (`amp-list`, `amp-form`): HTTPS endpoints that return JSON and send the CORS headers AMP for Email requires. In Marketing Cloud, a [JSON Code Resource](../../javascript/ssjs/scripts/json-endpoint.ssjs) can play that role, with `Platform.Response.SetResponseHeader` for the headers.
4. **Content Builder support**: create the email in Content Builder and add the AMP content in the AMP for Email section, alongside the HTML and text versions.

## Minimal structure

```html
<!doctype html>
<html ⚡4email data-css-strict>
<head>
  <meta charset="utf-8">
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <style amp4email-boilerplate>body{visibility:hidden}</style>
  <style amp-custom>
    .cta { background:#0b4f8a; color:#fff; padding:12px 20px; border:0; border-radius:6px; }
  </style>
</head>
<body>
  <!-- AMP components here: amp-img, amp-carousel, amp-accordion, amp-form, amp-list, amp-bind… -->
</body>
</html>
```

Validate every version with the AMP validator (the AMP Playground in email mode) before sending.

## Good use cases

| Use case | Components | Data |
|---|---|---|
| Coupon reveal | `amp-bind` | Static (from AMPscript at send time) |
| Preference update inside the email | `amp-form` posting to a JSON endpoint | Writes to a DE through the endpoint |
| Product carousel | `amp-carousel`, `amp-img` | Static or `amp-list` |
| Live stock / price at open time | `amp-list` | JSON endpoint |
| NPS / one-question survey | `amp-form` | Writes to a DE |

## Things to decide before building

- **Fallback parity.** The HTML version must do the same job (usually by linking to a CloudPage). Many recipients will never see the AMP part.
- **Personalization.** AMPscript runs at send time in the AMP part too, but anything rendered at open time comes from your endpoints. Sign identities in endpoint URLs the same way as in [CloudPages](../../cloudpages/security.md).
- **Measurement.** Interactions inside AMP don't always produce normal click tracking. Log form submissions at the endpoint.
- **Effort vs reach.** Registration, validation and two versions of every email are a real cost. Start with one high-value use case.

## Planned templates

| Template | Status |
|---|---|
| Coupon reveal | Planned |
| Preference update inside the email | Planned |
| One-question survey | Planned |

[← Emails](../README.md)
