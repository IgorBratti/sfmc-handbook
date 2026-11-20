# CloudPages security guide

> **Type:** Guide · **Applies to:** every CloudPage that reads parameters, shows personal data or writes to a data extension.

A CloudPage is a public URL. Anyone can open it, edit its query string, replay a form or point a bot at it. This guide lists the controls every page in this handbook applies, why each one exists and the code that implements it.

[← CloudPages](README.md)

---

## Threat model in one table

| Threat | Example | Control |
|---|---|---|
| **Identity tampering** | Opening `?sk=someone@example.com` to see or change another person's data | [Signed links](#1-sign-every-link-that-carries-an-identity) |
| **Reflected XSS** | `?utm_source="><script>…</script>` echoed into the HTML | [Allow-list every value you print](#2-allow-list-every-value-you-print) |
| **Phantom writes** | Previews, crawlers and link scanners triggering `UpsertData` | [Write only on real submissions](#3-write-only-on-real-submissions) |
| **Bots and spam** | Automated form posts filling a lead DE | [Honeypot + server-side validation](#4-validate-on-the-server-filter-bots-cheaply) |
| **Information leakage** | Error messages exposing DE names or stack traces | [Fixed error messages and a log DE](#5-fail-closed-and-log) |
| **Indexing** | Personal pages appearing in search results | [`noindex` and no PII in URLs](#6-keep-personal-pages-out-of-search-and-out-of-urls) |

---

## 1. Sign every link that carries an identity

**The trap.** `CloudPagesURL()` encrypts the parameters it receives, but the receiving page cannot tell an encrypted value from a plain one. `RequestParameter()` and `QueryParameter()` read form fields, plain query-string parameters **and** the encrypted `qs` string. If a page trusts `RequestParameter("sk")`, anyone can type `?sk=<any key>` and the page will accept it. When subscriber keys are email addresses or sequential IDs, they are easy to guess.

**The control.** Send a signature together with the key and verify it on the page. The signature is a SHA-256 hash of the key plus a secret that only lives inside Marketing Cloud. Without the secret, nobody can produce a valid signature for another key.

**Secret storage.** Keep the secret in a restricted data extension (`Config_DE`, PK `Name`) or in a Content Builder code snippet with restricted folder permissions. Never hard-code it in an email that other users can copy, and never send it to the browser.

| `Config_DE` | Type | PK |
|---|---|---|
| `Name` | Text 100 | ✔ |
| `Value` | Text 500 | |

Row: `Name = LINK_SIGNING_SECRET`, `Value = <long random string, e.g. two GUIDs concatenated>`.

**In the email**

```ampscript
%%[
VAR @secret, @sig
SET @secret = Lookup("Config_DE", "Value", "Name", "LINK_SIGNING_SECRET")
SET @sig = SHA256(Concat(_subscriberkey, "|", @secret), "UTF-8")
]%%
<a href="%%=RedirectTo(CloudPagesURL(3456, "sk", _subscriberkey, "sig", @sig))=%%">Manage my preferences</a>
```

**On the CloudPage**

```ampscript
%%[
VAR @sk, @sig, @secret
SET @sk = RequestParameter("sk")
SET @sig = RequestParameter("sig")
SET @secret = Lookup("Config_DE", "Value", "Name", "LINK_SIGNING_SECRET")

IF Empty(@sk) OR Empty(@secret) OR @sig != SHA256(Concat(@sk, "|", @secret), "UTF-8") THEN
  SET @sk = ""   /* invalid or tampered link: treat the visitor as anonymous */
ENDIF
]%%
```

Notes:
- `Empty(@secret)` matters: if the lookup fails, the expected signature would be the hash of `key|`, which anyone can compute.
- **Rotation:** change the secret and every old link stops working. Plan rotations around live campaigns, or keep a `LINK_SIGNING_SECRET_PREVIOUS` row and accept both for a transition period.
- **Expiry (optional):** sign `Concat(@sk, "|", @expiresAt, "|", @secret)` and reject the link when `@expiresAt` is in the past. Useful for one-time offers.
- Sending a Lookup per subscriber has a cost on very large sends. For those, read the secret once in a code snippet referenced with `ContentBlockByKey`.

## 2. Allow-list every value you print

**The trap.** `v()` and `%%=@var=%%` print raw text. AMPscript has no HTML-encoding function, so anything that came from the request and is printed back (a name, a UTM, a search term) can inject HTML or JavaScript.

**The control.** Accept only the characters you expect, and fall back to a safe default otherwise. `RegExMatch` returns the matched text, or an empty string when nothing matches.

```ampscript
%%[
/* Tracking values: letters, numbers, underscore, dot, hyphen. Max 50 chars. */
SET @source = RegExMatch(RequestParameter("utm_source"), "^[A-Za-z0-9_.-]{1,50}$", 0)
IF Empty(@source) THEN SET @source = "direct" ENDIF

/* Person names: any Unicode letter, space, apostrophe, hyphen. Max 50 chars. */
SET @firstName = RegExMatch(RequestParameter("fn"), "^[\p{L} '-]{1,50}$", 0)

/* Closed lists: compare against the options you offer. */
SET @interest = RequestParameter("interest")
IF @interest != "Product A" AND @interest != "Product B" THEN SET @interest = "Other" ENDIF
]%%
```

Rules of thumb:
- **Values you only store** still need validation: a stored payload can be printed later by another page or a report.
- **Error messages are fixed text.** Never build a message from user input ("`@email` is not valid").
- **Values from your own data extensions** are safer, but the data may have come from an import or a form. Allow-list anything that ends up inside an HTML attribute or a `<script>`.

## 3. Write only on real submissions

AMPscript runs every time the page renders: a normal visit, a preview in Content Builder, a search crawler, a corporate link scanner (Microsoft Defender Safe Links, Mimecast and similar open links before the person does). Writes must depend on an explicit signal.

```ampscript
%%[
IF RequestParameter("submitted") == "1" THEN
  /* validate, then write */
ENDIF
]%%
<form method="post" action="%%=RequestParameter('PAGEURL')=%%">
  <input type="hidden" name="submitted" value="1">
</form>
```

- `RequestParameter('PAGEURL')` posts back to the same URL, so the encrypted `qs` travels with the form.
- Actions that happen on page open (for example `ClaimRowValue` on a coupon page) will also run for link scanners. Make them idempotent: the same key must always get the same result.

## 4. Validate on the server, filter bots cheaply

- HTML attributes such as `required` and `type="email"` are a convenience for humans, not a control. Repeat every rule in AMPscript (`IsEmailAddress`, `Empty`, length checks, allow-lists).
- A **honeypot** field (hidden with CSS, `tabindex="-1"`, `autocomplete="off"`) stops simple bots without hurting real users. When it is filled, show the normal success page and store nothing, so the bot learns nothing.
- For high-traffic forms that attract targeted spam, add a CAPTCHA (for example reCAPTCHA verified server-side with `HTTPPost2`) or rate limiting by email in the target DE.

## 5. Fail closed and log

- If a signature, a lookup or an API call fails, show a neutral message ("This link is not valid") and do nothing else.
- Check the status of API calls such as `InvokeExecute`. Do not show "Done!" when the platform said otherwise.
- Write failures to a log DE that only your team can read (see [`Error_Log_DE`](../javascript/ssjs/scripts/try-catch-log.ssjs)). Show the visitor fixed text, never the raw error.
- For SSJS pages, wrap the logic in `try/catch` and never `Write()` the exception.

## 6. Keep personal pages out of search and out of URLs

- Add `<meta name="robots" content="noindex">` to every page that shows personal data.
- Never put email addresses, phone numbers or names in plain query strings. They end up in browser history, proxy logs and analytics tools.
- Use HTTPS only (CloudPages served from an SSL-enabled domain).

---

## Checklist before publishing a CloudPage

- [ ] Every identity parameter is signed and verified
- [ ] Every printed value is allow-listed or comes from a trusted source
- [ ] Writes happen only when `submitted == "1"` and the input is valid
- [ ] Honeypot in public forms
- [ ] Fixed error messages; failures logged to a restricted DE
- [ ] `noindex` on personal pages; no PII in plain URLs
- [ ] Tested with: no parameters, plain `?sk=`, tampered `sig`, HTML in every text field

[← CloudPages](README.md)
