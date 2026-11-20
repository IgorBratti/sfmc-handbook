# SSJS fundamentals

> **Type:** Guide · Everything you need to know before writing your first line of SSJS, and the habits that keep scripts maintainable.

[← SSJS](README.md)

---

## 1. Where SSJS runs

| Context | How it's created | Output goes to | Typical use |
|---|---|---|---|
| **CloudPage (landing page)** | HTML block / code view | The HTML sent to the browser | Forms, dashboards, data enrichment |
| **Code Resource** | Web Studio → CloudPages → Code Resource (JSON, JavaScript, CSS, Text, RSS…) | The raw response body | JSON endpoints called from the browser |
| **Script Activity** | Automation Studio → Activities → Script | Nowhere (no visible output) | Batch processing, API orchestration, housekeeping |
| **Email** | Inside the email HTML | The email body | Rare. AMPscript is the better fit in emails, and the Core library is not available there |

## 2. Page skeleton

```html
<script runat="server">
  Platform.Load("core", "1.1.5");   // needed for Core objects (DataExtension.Init, HTTP, Subscriber…)

  try {
    // work
  } catch (e) {
    // log, never Write() the raw error on a public page
  }
</script>
```

- `runat="server"` is what makes it server-side. Without it, the code is sent to the browser as plain text, including any secret it contains.
- `Platform.Load` is only needed for the **Core library**. `Platform.Function.*`, `Platform.Request`, `Platform.Response` and `Script.Util.WSProxy` work without it.
- Server-side blocks (AMPscript and SSJS) execute in document order, top to bottom.

## 3. The language: ECMAScript 3

SSJS is an old JavaScript engine. Modern syntax fails, sometimes silently.

| Not available | Use instead |
|---|---|
| `let`, `const` | `var` |
| Arrow functions, template literals, destructuring, spread | `function () {}`, string concatenation |
| `Array.prototype.forEach / map / filter / indexOf` | `for` loops (or a small helper function) |
| `String.prototype.trim` | `str.replace(/^\s+|\s+$/g, "")` |
| `JSON.parse`, `JSON.stringify` | `Platform.Function.ParseJSON(str)`, `Stringify(obj)` |
| `Date.now()` | `new Date().getTime()` |

Helpers worth keeping at the top of long scripts:

```js
function indexOf(arr, value) {
  for (var i = 0; i < arr.length; i++) { if (arr[i] === value) return i; }
  return -1;
}
function trim(s) { return String(s).replace(/^\s+|\s+$/g, ""); }
```

## 4. Platform vs Core

| | Platform (`Platform.Function.*`) | Core (`DataExtension.Init(...)`, `HTTP.*`…) |
|---|---|---|
| Load | Nothing to load | `Platform.Load("core", "1.1.5")` |
| Style | Function calls mirroring AMPscript (`Lookup`, `UpsertData`) | Object-oriented wrappers around SOAP objects |
| Works in emails | Yes | No |
| Best for | Simple reads/writes, content, utilities | Readable DE row operations, quick prototypes |

For anything that touches many rows or SOAP objects, use [WSProxy](wsproxy.md): it is faster than Core and gives you pagination and batch results.

## 5. Talking to AMPscript

```html
<script runat="server">
  var name = "Maria";
  Platform.Variable.SetValue("@firstName", name);  // SSJS → AMPscript
</script>
Hello %%=v(@firstName)=%%

%%[ SET @segment = "Champion" ]%%
<script runat="server">
  var segment = Platform.Variable.GetValue("@segment");  // AMPscript → SSJS
</script>
```

Run an AMPscript snippet from SSJS and catch its errors (AMPscript itself has no `try/catch`):

```js
try {
  Platform.Function.TreatAsContent('%%[ SET @row = LookupRows("My_DE", "Id", "1") ]%%');
} catch (e) {
  // AMPscript error caught here
}
```

## 6. Reading the request (CloudPages and Code Resources)

```js
var sk     = Platform.Request.GetQueryStringParameter("sk");  // plain query string only
var email  = Platform.Request.GetFormField("email");          // POSTed form field
var body   = Platform.Request.GetPostData("utf-8");           // raw POST body (JSON endpoints)
var method = Platform.Request.Method;                         // "GET", "POST"…
```

`GetPostData()` defaults to Windows-1252. Pass `"utf-8"` or accented characters arrive broken.

For values sent with `CloudPagesURL()` (encrypted `qs`), read them with AMPscript `RequestParameter()` and pass them over with `Platform.Variable.GetValue`. The same rule as in AMPscript applies: an encrypted parameter is not a verified parameter. See [signed links](../../cloudpages/security.md#1-sign-every-link-that-carries-an-identity).

## 7. Writing output

| Need | Code |
|---|---|
| HTML on a CloudPage | `Write("<p>" + safeText + "</p>")` |
| JSON from a Code Resource | `Write(Stringify({ ok: true }))` |
| A response header | `Platform.Response.SetResponseHeader("Cache-Control", "no-store")` |
| A redirect | `Platform.Response.Redirect(url, false)` |
| Debug while developing | `Write("<pre>" + Stringify(obj) + "</pre>")` on a **private test page only** |

`Write()` does not encode HTML. Escape or allow-list anything that came from the request before writing it:

```js
function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
                  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
```

## 8. Errors and logging

- An uncaught error on a CloudPage shows a generic error page. In a Script Activity it fails the activity, which fails the Automation and triggers its error notification.
- **Catch to log, then re-throw** in Script Activities. A `catch` that swallows the error makes the Automation look successful while the work didn't happen. See [try-catch-log.ssjs](scripts/try-catch-log.ssjs).
- `Stringify(e)` gives the full error object (message, description, stack-like details). Truncate before writing to a `Text 4000` field.
- On public pages, log the details and show a neutral message. Never `Write(Stringify(e))`.

## 9. Performance and limits

- **Script Activities time out after 30 minutes.** Split large jobs into several activities or runs, and make each run resumable (process only rows not yet marked as done).
- **One API call per row does not scale.** Read in batches (WSProxy retrieve, up to 2,500 rows per batch) and write in batches (`createBatch` / `updateBatch`).
- **Prefer SQL for set operations.** Filtering, joining and deduplicating millions of rows is the job of a Query Activity; SSJS is for what SQL can't do (APIs, per-row logic, JSON).
- **Cache what you reuse.** Read config rows and tokens once per run, not inside loops.

## 10. Security checklist

- [ ] No secrets in code. Read them from a restricted DE (`Config_DE`) at runtime.
- [ ] Every request value is validated before use and escaped before output.
- [ ] Errors are logged to a restricted DE, never written to the page.
- [ ] JSON endpoints validate the payload shape and size, and answer with generic error codes.
- [ ] Test pages that print debug output are unpublished or protected.

[← SSJS](README.md) · Next: [reference](reference.md)
