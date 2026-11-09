# Links and CloudPages

[← AMPscript recipes](README.md)

## Tracked link built with variables
Wrap URLs built in AMPscript with `RedirectTo` so clicks are tracked.
```ampscript
%%[
VAR @url
SET @url = Concat("https://example.com/offer?id=", URLEncode(_subscriberkey, 1, 1), "&utm_source=sfmc&utm_medium=email")
]%%
<a href="%%=RedirectTo(@url)=%%" alias="offer_cta">See your offer</a>
```
The `alias` attribute gives the link a readable name in click reports.

## Encode each value, not the whole URL
```ampscript
SET @url = Concat("https://example.com/p?name=", URLEncode(@name, 1, 1), "&city=", URLEncode(@city, 1, 1))
```
Encoding the whole URL would also encode `?`, `&` and `=`.

## Link to a CloudPage with encrypted parameters
```ampscript
<a href="%%=RedirectTo(CloudPagesURL(1234, "sk", _subscriberkey, "campaign", "black_friday"))=%%">Open my page</a>
```
On the CloudPage:
```ampscript
%%[
SET @sk = RequestParameter("sk")
SET @campaign = RequestParameter("campaign")
]%%
```
`CloudPagesURL` encrypts everything into a single `qs` parameter. Use it instead of `?sk=...` in plain text.

## Redirect from a CloudPage after processing
```ampscript
%%[ Redirect(CloudPagesURL(5678, "fn", @firstName)) ]%%
```
