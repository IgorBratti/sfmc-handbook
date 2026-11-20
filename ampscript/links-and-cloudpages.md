# Links and CloudPages

> **Type:** Recipes · Tracked links, safe parameters and links to CloudPages that can't be tampered with.

[← AMPscript](README.md)

## Tracked link built with variables
Wrap URLs built in AMPscript with `RedirectTo` so clicks are tracked.
```ampscript
%%[
VAR @url
SET @url = Concat("https://example.com/offer?id=", URLEncode(@customerId, 1, 1), "&utm_source=sfmc&utm_medium=email&utm_campaign=", URLEncode(emailname_, 1, 1))
]%%
<a href="%%=RedirectTo(@url)=%%" alias="offer_cta">See your offer</a>
```
- The `alias` attribute gives the link a readable name in click reports.
- Pass an opaque ID (`@customerId`), never an email address or phone number: URLs end up in browser history, analytics tools and server logs.

## Encode each value, not the whole URL
```ampscript
SET @url = Concat("https://example.com/p?name=", URLEncode(@name, 1, 1), "&city=", URLEncode(@city, 1, 1))
```
Encoding the whole URL would also encode `?`, `&` and `=`.

## Link to a CloudPage with encrypted parameters
```ampscript
<a href="%%=RedirectTo(CloudPagesURL(1234, "campaign", "black_friday", "variant", "B"))=%%">Open the offer</a>
```
On the CloudPage:
```ampscript
%%[
SET @campaign = RequestParameter("campaign")
SET @variant = RequestParameter("variant")
]%%
```
`CloudPagesURL` encrypts everything into a single `qs` parameter, so values are not readable in the URL.

## Sign identity parameters

Encryption hides values; it doesn't prove where they came from. `RequestParameter` also accepts plain query strings, so a page that trusts `RequestParameter("sk")` accepts `?sk=<anyone>`. Send a signature with every identity and verify it on the page.

**Email**
```ampscript
%%[
SET @secret = Lookup("Config_DE", "Value", "Name", "LINK_SIGNING_SECRET")
SET @sig = SHA256(Concat(_subscriberkey, "|", @secret), "UTF-8")
]%%
<a href="%%=RedirectTo(CloudPagesURL(1234, "sk", _subscriberkey, "sig", @sig))=%%" alias="my_account">Open my page</a>
```

**CloudPage**
```ampscript
%%[
SET @sk = RequestParameter("sk")
SET @secret = Lookup("Config_DE", "Value", "Name", "LINK_SIGNING_SECRET")
IF Empty(@sk) OR Empty(@secret) OR RequestParameter("sig") != SHA256(Concat(@sk, "|", @secret), "UTF-8") THEN
  SET @sk = ""   /* not trusted */
ENDIF
]%%
```

Secret storage, rotation and expiring links: [CloudPages security guide](../cloudpages/security.md#1-sign-every-link-that-carries-an-identity).

## Redirect from a CloudPage after processing
```ampscript
%%[ Redirect(CloudPagesURL(5678, "fn", @firstName)) ]%%
```
Values printed on the destination page must be allow-listed there (see [strings-and-numbers.md](strings-and-numbers.md#allow-list-a-value-before-printing-it)).

## UTM convention

A consistent UTM scheme makes Marketing Cloud traffic readable in GA4 and other tools.

| Parameter | Value | Example |
|---|---|---|
| `utm_source` | Platform | `sfmc` |
| `utm_medium` | Channel | `email`, `sms`, `whatsapp` |
| `utm_campaign` | Campaign or journey name | `b2c_onb_welcome` |
| `utm_content` | Email or link variant | `hero_cta`, `footer_link` |

Build it once in a shared code snippet ([content-blocks.md](content-blocks.md#shared-code-snippets)) and append it to every link.

[← AMPscript](README.md)
