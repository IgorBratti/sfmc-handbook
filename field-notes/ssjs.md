# Server-Side JavaScript (SSJS)

> **Type:** Field notes · Problem → why → fix. Full guides: [SSJS fundamentals](../javascript/ssjs/fundamentals.md) · [WSProxy](../javascript/ssjs/wsproxy.md).

[← Back to contents](README.md)

## 1. Large retrieves stop after the first batch

**Problem:** reading a big data extension returns only part of the rows.

**Why:** retrieves come back in batches of up to 2,500. You have to follow `HasMoreRows` and ask for the next batch with the `RequestID`.

**Fix:** paginate with WSProxy: [wsproxy-retrieve-all.ssjs](../javascript/ssjs/scripts/wsproxy-retrieve-all.ssjs).

## 2. `Rows.Retrieve()` is not a paginator

**Problem:** looping over `DataExtension.Init(...).Rows.Retrieve()` keeps returning the same batch.

**Why:** it has no cursor, so there is no way to ask for "the next page".

**Fix:** use WSProxy whenever the result can exceed one batch.

## 3. A field is always `undefined`

**Problem:** a dashboard filter does nothing, or a value is always `undefined`.

**Why:** WSProxy only returns the columns listed in the `cols` array. A missing field isn't an error; it just isn't there.

**Fix:** list every field you read, filter or group by, in one variable shared by the retrieve and the code that reads it.

## 4. The Automation is green but the work didn't happen

**Problem:** a Script Activity "succeeds" every night, yet the target DE is empty.

**Why:** a `try/catch` that logs and swallows the error tells Automation Studio that everything went fine. No error notification is sent.

**Fix:** log, then re-throw: [try-catch-log.ssjs](../javascript/ssjs/scripts/try-catch-log.ssjs).

## 5. Modern JavaScript fails silently

**Problem:** a script that works in the browser console throws or does nothing in Marketing Cloud.

**Why:** SSJS is ECMAScript 3: no `let`/`const`, arrow functions, template literals, `forEach`/`map`/`filter`, `Array.indexOf`, `String.trim` or `JSON`.

**Fix:** `var`, `for` loops, `Stringify()` and `Platform.Function.ParseJSON()`. Full table in [fundamentals](../javascript/ssjs/fundamentals.md#3-the-language-ecmascript-3).

## 6. Accented characters arrive broken in a JSON endpoint

**Problem:** "João" arrives as "JoÃ£o" in the data extension.

**Why:** `Platform.Request.GetPostData()` reads the body as Windows-1252 unless told otherwise.

**Fix:** `Platform.Request.GetPostData("utf-8")`. Example: [json-endpoint.ssjs](../javascript/ssjs/scripts/json-endpoint.ssjs).

## 7. `DataExtension.Init` can't find the DE

**Problem:** `DataExtension.Init("My DE")` fails although the DE exists.

**Why:** Core's `Init` takes the **external key** (CustomerKey), not the name. Platform functions (`Platform.Function.Lookup`, `UpsertData`) take the **name**.

**Fix:** use the external key with Core, the name with Platform functions, and give your DEs external keys equal to their names to avoid the confusion.

[← Back to contents](README.md)
