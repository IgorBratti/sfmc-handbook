# AMPscript functions

> **Type:** Reference · The functions used in real projects, grouped by job, with the signature, what they return and the trap to remember. Optional arguments are in `[brackets]`.

[← AMPscript](README.md) · Language rules: [syntax.md](syntax.md)

**Jump to:** [Data extensions: read](#data-extensions-read) · [Data extensions: write](#data-extensions-write) · [Strings](#strings) · [Numbers and math](#numbers-and-math) · [Dates](#dates) · [Logic and validation](#logic-and-validation) · [Content](#content) · [Links and pages](#links-and-pages) · [HTTP](#http) · [Encoding and security](#encoding-and-security) · [Salesforce (MC Connect)](#salesforce-mc-connect) · [SOAP objects](#soap-objects-from-ampscript) · [Utilities](#utilities)

---

## Data extensions: read

| Function | Returns | Notes |
|---|---|---|
| `Lookup(de, returnField, matchField1, matchValue1, …)` | Value of the first match | Empty when nothing matches. Order of "first" is not guaranteed |
| `LookupRows(de, matchField1, matchValue1, …)` | Rowset | Up to ~2,000 rows, no order |
| `LookupOrderedRows(de, count, "Field DESC", matchField1, matchValue1, …)` | Rowset | `count` limits rows; use it whenever you only need a few |
| `LookupRowsCS(…)` / `LookupOrderedRowsCS(…)` | Rowset | Case-sensitive match |
| `RowCount(rowset)` | Number | Always check before looping |
| `Row(rowset, index)` | Row | 1-based index |
| `Field(row, fieldName)` | Value | Errors if the field doesn't exist in the DE |
| `DataExtensionRowCount(de)` | Number | Total rows in the DE |
| `BuildRowsetFromString(string, delimiter)` | Rowset | Each item is in field `1`: `Field(Row(@rs, 1), 1)` |
| `BuildRowsetFromJSON(json, jsonPath, [returnEmptyOnError])` | Rowset | Read arrays from JSON strings stored in a field |

```ampscript
%%[
SET @rows = LookupOrderedRows("Orders_DE", 3, "OrderDate DESC", "SubscriberKey", _subscriberkey)
IF RowCount(@rows) > 0 THEN
  SET @lastOrder = Field(Row(@rows, 1), "OrderId")
ENDIF
]%%
```

## Data extensions: write

| Context | Insert | Update | Upsert | Delete |
|---|---|---|---|---|
| Emails (send time) | `InsertDE` | `UpdateDE` | `UpsertDE` | `DeleteDE` |
| CloudPages, SMS, other non-send contexts | `InsertData` | `UpdateData` | `UpsertData` | `DeleteData` |

| Function | Returns | Notes |
|---|---|---|
| `InsertData(de, field1, value1, …)` | Rows inserted | Error on duplicate primary key |
| `UpdateData(de, keyCount, key1, keyValue1, …, field1, value1, …)` | Rows updated | `keyCount` = number of key/value pairs that identify the row |
| `UpsertData(de, keyCount, key1, keyValue1, …, field1, value1, …)` | Rows affected | Insert or update |
| `DeleteData(de, field1, value1, …)` | Rows deleted | Deletes every matching row |
| `ClaimRow(de, isClaimedField, keyField1, keyValue1, …)` | Row | Reserves one unclaimed row for the key (coupons) |
| `ClaimRowValue(de, returnField, isClaimedField, [default], keyField1, keyValue1, …)` | Value | Same, returning one field; `default` avoids an error when the pool is empty |

`…DE` functions don't run in Preview; they run at send time. Full guide: [data-writes.md](data-writes.md).

## Strings

| Function | Returns | Notes |
|---|---|---|
| `Concat(s1, s2, …)` | String | |
| `Length(s)` | Number | |
| `Substring(s, start, [length])` | String | 1-based |
| `IndexOf(s, search)` | Number | 1-based, `0` when not found |
| `Replace(s, find, replaceWith)` | String | Case-sensitive, all occurrences |
| `ReplaceList(s, replaceWith, find1, find2, …)` | String | Replaces several values with the same text |
| `Trim(s)` | String | Leading and trailing spaces |
| `Lowercase(s)` / `Uppercase(s)` / `ProperCase(s)` | String | `ProperCase("ANA MARIA")` → `Ana Maria` |
| `RegExMatch(s, pattern, groupOrdinal, [options])` | String | .NET regex; `0` = whole match, empty when no match. Options such as `"IgnoreCase"` |
| `Char(asciiCode, [repeat])` | String | `Char(13)` carriage return, `Char(10)` line feed |
| `StringToHex(s)` | String | |
| `Format(value, formatString, [type], [culture])` | String | .NET formatting: `Format(@n, "N2")`, `Format(@d, "yyyy-MM-dd")` |

## Numbers and math

| Function | Returns | Notes |
|---|---|---|
| `Add(a, b)`, `Subtract(a, b)`, `Multiply(a, b)`, `Divide(a, b)`, `Mod(a, b)` | Number | There are no `+ - * /` operators |
| `Random(min, max)` | Number | Integer between `min` and `max` inclusive |
| `FormatNumber(n, format, [culture])` | String | `FormatNumber(0.123, "P1", "pt-BR")` → `12,3%` |
| `FormatCurrency(n, culture, [decimals], [symbol])` | String | `FormatCurrency(1234.5, "pt-BR")` → `R$ 1.234,50` |

## Dates

All "now" functions return server time: **US Central, UTC−6, no daylight saving**.

| Function | Returns | Notes |
|---|---|---|
| `Now([preserveSendTime])` | Date | `Now(1)` keeps the original send time when the email is viewed later (web version, forwards) |
| `GetSendTime([preserveSendTime])` | Date | Time the send started |
| `SystemDateToLocalDate(date)` | Date | Server → account local time zone |
| `LocalDateToSystemDate(date)` | Date | Local → server |
| `DateAdd(date, n, unit)` | Date | Units: `Y`, `M`, `D`, `H`, `MI` |
| `DateDiff(start, end, unit)` | Number | Returns `end − start` |
| `DatePart(date, part)` | Number/String | Parts: `year`, `month`, `day`, `hour`, `minute` (or `Y`, `M`, `D`, `H`, `MI`) |
| `DateParse(string, [returnUTC])` | Date | Parses most formats |
| `StringToDate(string)` | Date | Strict conversion |
| `FormatDate(date, dateFormat, [timeFormat], [culture])` | String | `FormatDate(@d, "dd/MM/yyyy", "", "pt-BR")`; `"iso"` for ISO 8601 |

Recipes: [dates.md](dates.md).

## Logic and validation

| Function | Returns | Notes |
|---|---|---|
| `IIF(condition, ifTrue, ifFalse)` | Value | Both branches are evaluated. Don't put a failing call in the unused branch |
| `Empty(value)` | Boolean | True for null and empty string |
| `IsNull(value)` | Boolean | True for null only |
| `IsEmailAddress(s)` | Boolean | Syntax check, not deliverability |
| `IsPhoneNumber(s)` | Boolean | US-centric; for other countries prefer `RegExMatch` |
| `Domain(email)` | String | Part after `@` |

## Content

| Function | Returns | Notes |
|---|---|---|
| `ContentBlockByKey(key, [impressionRegion], [errorIfNotFound], [defaultContent])` | Content | **Preferred**: keys survive folder moves and copies between BUs |
| `ContentBlockByID(id, …)` | Content | IDs change between BUs |
| `ContentBlockByName(path, …)` | Content | Breaks when someone renames or moves the block |
| `TreatAsContent(string)` | Content | Evaluates AMPscript stored in a field or variable |
| `ContentImageByKey(key, [defaultKey])` | `<img>` tag | Image from Content Builder |
| `BeginImpressionRegion(name)` / `EndImpressionRegion([closeAll])` | — | Tracks which content block produced each click |

Guide: [content-blocks.md](content-blocks.md).

## Links and pages

| Function | Returns | Notes |
|---|---|---|
| `RedirectTo(url)` | URL | Wrap URLs built in AMPscript so clicks are tracked |
| `CloudPagesURL(pageId, name1, value1, …)` | URL | Parameters encrypted in `qs`. Encrypted ≠ verified: see [signed links](links-and-cloudpages.md#sign-identity-parameters) |
| `MicrositeURL(pageId, name1, value1, …)` | URL | Classic microsites |
| `RequestParameter(name)` / `QueryParameter(name)` | String | Read form fields, plain query strings **and** the encrypted `qs` |
| `Redirect(url, [permanent])` | — | Redirects the visitor (CloudPages) |
| `URLEncode(s, [convertSpaces], [encodeNonAscii])` | String | Encode each parameter value, never the whole URL |
| `WrapLongURL(url)` | URL | Keeps very long URLs working in old Outlook versions |

## HTTP

| Function | Returns | Notes |
|---|---|---|
| `HTTPGet(url, [continueOnError], [emptyContentHandling], [@status])` | Content | Content is cached per send in emails |
| `HTTPPost(url, contentType, payload, @response, [headerName, headerValue, …])` | Status | Ports 80/443 only |
| `HTTPPost2(url, contentType, payload, continueOnError, @response, @responseHeaders, [headerName, headerValue, …])` | Status | Use when you need the status without failing on 4xx/5xx |

For anything beyond a simple call (JSON parsing, retries, PUT/PATCH), use [SSJS](../javascript/ssjs/http-and-apis.md).

## Encoding and security

| Function | Returns | Notes |
|---|---|---|
| `SHA256(s, [charset])`, `SHA512(…)`, `SHA1(…)`, `MD5(…)` | Hex string | `SHA256` with a secret = signed links |
| `EncryptSymmetric(s, algorithm, keyExtKey, keyValue, saltExtKey, salt, ivExtKey, iv)` | String | Use Key Management keys (pass `@null` for the literal you don't use) |
| `DecryptSymmetric(…)` | String | Same signature |
| `Base64Encode(s, [charset])` / `Base64Decode(s, [charset])` | String | Encoding, **not** encryption |
| `GUID()` | String | Unique ID for tokens, keys, idempotency |

## Salesforce (MC Connect)

| Function | Returns | Notes |
|---|---|---|
| `RetrieveSalesforceObjects(object, fields, filterField, operator, value, …)` | Rowset | One API call per execution: avoid in large sends |
| `CreateSalesforceObject(object, fieldCount, field1, value1, …)` | Record ID | |
| `UpdateSingleSalesforceObject(object, id, field1, value1, …)` | `1` on success | |
| `LongSFID(id15)` | 18-char ID | |

## SOAP objects from AMPscript

`CreateObject`, `SetObjectProperty`, `AddObjectArrayItem` build API objects; `InvokeCreate`, `InvokeUpdate`, `InvokeDelete`, `InvokeRetrieve`, `InvokePerform` and `InvokeExecute` call them. Used for things AMPscript has no function for, such as `LogUnsubEvent` (see the [preference center](../cloudpages/preference-center/)). For heavier SOAP work, [WSProxy in SSJS](../javascript/ssjs/wsproxy.md) is simpler.

## Utilities

| Function | Returns | Notes |
|---|---|---|
| `v(@var)` | Value | Prints a variable: `%%=v(@name)=%%`. No HTML encoding |
| `Output(value)` / `OutputLine(value)` | — | Print from inside a code block |
| `AttributeValue(name)` | Value | Empty instead of an error when the attribute doesn't exist |
| `RaiseError(message, [skipSubscriber], [errorCode], [errorNumber])` | — | `true` skips one subscriber; `false` stops the send. See [send-control.md](send-control.md) |

[← AMPscript](README.md)
