# Client-side JavaScript for CloudPages

> **Type:** Guide + library · Browser scripts that improve CloudPages without replacing server-side checks.

[← JavaScript](../README.md)

---

## Principles

1. **Progressive enhancement.** Every page must work with JavaScript disabled. Scripts improve the experience (inline errors, no double submits, smoother calls); the server still validates and decides.
2. **No secrets in the browser.** API keys, client secrets, DE names you'd rather not expose and internal URLs don't belong in client code. Anything the browser needs from Marketing Cloud comes from a [JSON Code Resource](../ssjs/scripts/json-endpoint.ssjs) that you control.
3. **No user data in storage longer than needed.** `sessionStorage` for UTMs is fine; emails and phone numbers don't go into `localStorage`.
4. **Modern but safe syntax.** These files use ES2017 (`const`, arrow functions, `async/await`, `fetch`), supported by every current browser. They run in the browser, not in SSJS.

## How to load a script on a CloudPage

| Option | When | How |
|---|---|---|
| Inline | One page, small script | Paste inside `<script>…</script>` before `</body>` |
| Code Resource (JavaScript) | Shared across pages, cacheable | Web Studio → CloudPages → **Code Resource → JavaScript**, publish, then `<script src="https://<your-domain>/<path>/form-enhancements.js" defer></script>` |
| Content Builder block | Shared, versioned with other content | Store as a code snippet and include with `%%=ContentBlockByKey("js_form_enhancements")=%%` inside a `<script>` tag |

Load scripts with `defer` (or at the end of `<body>`) so the form is in the DOM before the script runs.

## Library

| File | What it does | Works with |
|---|---|---|
| [form-enhancements.js](form-enhancements.js) | Inline validation messages, trims values, disables the submit button after the first click | [Lead capture form](../../cloudpages/lead-capture-form/) or any `<form data-enhance>` |
| [utm-persistence.js](utm-persistence.js) | Stores `utm_*` parameters for the session and fills matching hidden fields on any page | Multi-page CloudPage journeys, lead forms |
| [fetch-json.js](fetch-json.js) | `postJson(url, payload)` with timeout, JSON parsing and normalized errors | [json-endpoint.ssjs](../ssjs/scripts/json-endpoint.ssjs) |

## Testing checklist

- [ ] The page works with JavaScript disabled (submit, errors, redirect)
- [ ] No errors in the browser console on load and on submit
- [ ] Keyboard only: every field reachable, errors announced (`role="alert"` / `aria-live`)
- [ ] Mobile Safari and Chrome on Android
- [ ] Network tab: no secrets, no PII in query strings

[← JavaScript](../README.md)
