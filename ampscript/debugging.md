# Debugging and testing AMPscript

> **Type:** Guide · How to find out why an email or CloudPage misbehaves, and how to test before it reaches a customer.

[← AMPscript](README.md)

---

## 1. Know where the code is running

Most "bugs" are context differences. Check `_messagecontext` first.

| Context | What's different |
|---|---|
| **Preview (Content Builder / Preview and Test)** | `…DE` write functions don't run; data comes from the chosen preview record |
| **Test send** | Real render, real writes; runs for the test audience only |
| **Live send** | Real data per subscriber, at scale; errors can stop the whole job |
| **View as web page (VAWP)** | Rendered when opened, possibly days later; `Now()` is the open time unless you use `Now(1)` |
| **CloudPage** | Runs on every request, including previews in Web Studio and crawlers |

## 2. Make values visible (safely)

On a private test CloudPage or in a test email, print what the code sees:

```ampscript
%%[
SET @debug = RequestParameter("debug")   /* CloudPage: ?debug=1 on a TEST page only */
]%%
%%[ IF @debug == "1" THEN ]%%
<pre>
sk: %%=v(@sk)=%%
rows: %%=v(RowCount(@rows))=%%
segment: %%=v(@segment)=%%
</pre>
%%[ ENDIF ]%%
```

Remove debug output before publishing. Never leave a debug switch on a public page that prints personal data.

## 3. Catch errors that AMPscript can't catch

AMPscript has no `try/catch`. Wrap the risky part in SSJS and evaluate it with `TreatAsContent`:

```html
<script runat="server">
  Platform.Load("core", "1.1.5");
  try {
    Platform.Function.TreatAsContent('%%[ SET @rows = LookupRows("Orders_DE", "SubscriberKey", @sk) ]%%');
  } catch (e) {
    Platform.Variable.SetValue("@lookupFailed", "true");
    // log Stringify(e) to Error_Log_DE (see javascript/ssjs/scripts/try-catch-log.ssjs)
  }
</script>
%%[ IF @lookupFailed == "true" THEN ]%% <p>We couldn't load your orders right now.</p> %%[ ENDIF ]%%
```

## 4. Common errors and what they mean

| Symptom / message | Usual cause | Fix |
|---|---|---|
| "The data extension … does not exist" | Wrong DE name, DE in another BU, or a shared DE without `ENT.` | Check the name; in child BUs use `ENT.` for shared DEs |
| "Invalid field name" in `Field()` | The DE doesn't have that column | Check spelling; for optional columns read with a guarded lookup |
| Personalization string error at send | `%%Field%%` not in the sendable DE | Use `AttributeValue("Field")` in shared content |
| Preview fine, send fails | `…DE` functions only run in sends; preview record differs from real data | Test send to a small list with real-like data |
| Output shows `"True"`/`"False"` unexpectedly | Boolean fields return strings | Compare with `Lowercase(@x) == "true"` |
| Dates off by hours | `Now()` is US Central (UTC−6) | `SystemDateToLocalDate(Now())` or convert explicitly |
| Loop stops at ~2,000 rows | `LookupRows` limit | Use `LookupOrderedRows` with a count, or SSJS/WSProxy |
| Empty value from `IIF(…, Lookup(…), …)` error | `IIF` evaluates both branches | Use `IF … THEN … ENDIF` |
| Whole send stopped | `RaiseError` without `true`, or an unhandled error in content | Use `RaiseError(msg, true)` to skip only one subscriber |

## 5. Test plan before a send

1. **Preview** with at least three records: complete data, partial data, empty optional fields.
2. **Test send** to an internal list built from real-like data (never real customers), covering every branch of the logic.
3. **Check writes**: if the email writes to a DE, confirm the rows after the test send.
4. **Check links**: every `RedirectTo`, `CloudPagesURL` and UTM opens the right page with the right parameters.
5. **Check skips**: contacts that should be skipped by `RaiseError` don't receive the email.
6. **Small first batch** for high-risk sends (new logic, new data source): send to a few percent, review, then release the rest.

## 6. Keep code debuggable

- Declare variables at the top with `VAR` and set defaults immediately.
- One responsibility per block: data loading, decisions, output.
- Name content blocks and keys consistently ([content-blocks.md](content-blocks.md)).
- Comment the *why*, not the *what*.

[← AMPscript](README.md)
