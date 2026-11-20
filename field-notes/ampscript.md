# AMPscript

> **Type:** Field notes · Problem → why → fix. Full references: [AMPscript section](../ampscript/).

[← Back to contents](README.md)

## 1. `LookupRows` has a row limit

**Problem:** a CloudPage or email that loops over `LookupRows` silently stops at around 2,000 rows.

**Fix:** for small sets, use `LookupOrderedRows` with an explicit count and order. For large sets, move to SSJS and paginate with WSProxy ([SSJS note 1](ssjs.md#1-large-retrieves-stop-after-the-first-batch)).

## 2. Guard every write on a CloudPage

**Problem:** `UpsertData` runs when the page is opened, previewed or crawled, not only when the form is submitted. That creates empty or duplicated rows, and it errors in preview.

**Why:** AMPscript runs on the server every time the page renders, including link scanners and crawlers.

**Fix:** write only when a real submission arrives and the input is valid (`RequestParameter("submitted") == "1"`). Complete example: [lead capture form](../cloudpages/lead-capture-form/src/page.html).

## 3. Encode each URL parameter, not the whole URL

**Problem:** links built with `Concat()` and then encoded break: `?`, `&` and `=` get encoded too and the landing page can't read the parameters.

**Fix:** `URLEncode()` each value on its own, then build the URL ([recipe](../ampscript/links-and-cloudpages.md#encode-each-value-not-the-whole-url)).

## 4. Always plan for empty values

**Problem:** personalization shows "Hi ," or breaks a sentence when the field is empty.

**Fix:** read with `AttributeValue()`, check with `Empty()` and set a fallback before using the value ([recipe](../ampscript/personalization.md)).

## 5. "Encrypted" parameters can be typed by hand

**Problem:** someone opens `…/preferences?sk=another@example.com` and sees another person's data.

**Why:** `RequestParameter()` (and `QueryParameter()`) read the encrypted `qs` from `CloudPagesURL()` **and** plain query-string parameters. Encryption doesn't prove the value came from your email.

**Fix:** sign identity parameters and verify the signature on the page ([signed links](../cloudpages/security.md#1-sign-every-link-that-carries-an-identity)).

## 6. `IIF` runs both branches

**Problem:** `IIF(Empty(@id), "", Lookup("DE", "Field", "Id", @id))` still errors when `@id` is empty.

**Why:** `IIF` evaluates both the "true" and the "false" expressions before choosing.

**Fix:** use `IF … THEN … ENDIF` when one branch can fail.

## 7. Booleans come back as text

**Problem:** `IF @optIn == true` never matches.

**Why:** Boolean fields return the strings `"True"` / `"False"`.

**Fix:** `IF Lowercase(@optIn) == "true" THEN`.

## 8. AMPscript inside HTML comments still runs

**Problem:** an email fails at send time because of a lookup nobody can find in the visible content.

**Why:** AMPscript and personalization strings are processed before the HTML is sent, so `<!-- %%[ … ]%% -->` executes like any other block. HTML comments only hide the output from the reader.

**Fix:** comment code with `/* … */` inside `%%[ ]%%` blocks, and keep `%%` delimiters out of HTML comments entirely.

[← Back to contents](README.md)
