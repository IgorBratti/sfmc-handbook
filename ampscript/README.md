# AMPscript

Marketing Cloud's personalization language for emails, CloudPages, SMS and other content. This section has three layers: **reference** to look things up, **guides** to understand how things work, and **recipes** to copy.

## Reference

| File | What's inside |
|---|---|
| [syntax.md](syntax.md) | Delimiters, variables, types, operators, control flow, attribute access, evaluation order |
| [functions.md](functions.md) | Every function used in real projects, grouped by job, with signatures and traps |
| [personalization-strings.md](personalization-strings.md) | System strings: subscriber, send, compliance, dates, `_messagecontext` |

## Guides

| File | What's inside |
|---|---|
| [data-writes.md](data-writes.md) | `…DE` vs `…Data`, insert/update/upsert decisions, composite keys, keeping first values, claiming coupons |
| [content-blocks.md](content-blocks.md) | `ContentBlockByKey`, content chosen by data, mapping DEs, impression regions, shared code snippets |
| [debugging.md](debugging.md) | Contexts, visible debugging, catching errors through SSJS, common errors, test plan |

## Recipes

| File | What's inside |
|---|---|
| [personalization.md](personalization.md) | Fallbacks for empty fields, proper case, content by segment |
| [dates.md](dates.md) | Server vs local time, `Now(1)`, days until a date, formats by language, parsing |
| [lookups-and-loops.md](lookups-and-loops.md) | `Lookup`, `LookupOrderedRows`, loops, building lists |
| [links-and-cloudpages.md](links-and-cloudpages.md) | Tracked links, encoding, `CloudPagesURL`, signed identity parameters, UTM convention |
| [strings-and-numbers.md](strings-and-numbers.md) | Allow-lists, names, phones, accents, currency, Brazilian decimals, splitting lists |
| [send-control.md](send-control.md) | Skipping one subscriber (or the whole send) with `RaiseError` |

## Five rules that prevent most incidents

1. **Read attributes with `AttributeValue()`** in shared content, so a missing field doesn't break the send.
2. **Every lookup can return nothing.** Check `Empty()` / `RowCount()` before using the result.
3. **Use the right write family:** `…DE` in emails, `…Data` on CloudPages.
4. **Never print request values without an allow-list**, and never trust an identity without a signature.
5. **Prefer skipping a subscriber to sending a broken email:** `RaiseError("reason", true)`.

Related: [CloudPages](../cloudpages/) (complete pages) · [field notes on AMPscript](../field-notes/ampscript.md) (the traps) · [VS Code snippets](../tools/vscode-snippets/)

[← Back to the handbook](../README.md)
