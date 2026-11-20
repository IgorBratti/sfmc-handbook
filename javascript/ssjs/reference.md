# SSJS reference

> **Type:** Reference · The functions and objects used day to day, grouped by job. Signatures show the common form; optional arguments are in `[brackets]`.

[← SSJS](README.md) · Concepts: [fundamentals](fundamentals.md)

**Contents:** [Data extensions (Platform)](#data-extensions-platform) · [Data extensions (Core)](#data-extensions-core) · [Content](#content) · [Request and response](#request-and-response) · [Variables](#variables-ampscript-interop) · [JSON and utilities](#json-and-utilities) · [HTTP](#http) · [WSProxy](#wsproxy) · [Filters](#filter-objects)

---

## Data extensions (Platform)

No `Platform.Load` needed. Names are **DE names** (like AMPscript). Multiple match fields are passed as arrays.

| Function | Returns | Notes |
|---|---|---|
| `Platform.Function.Lookup(de, returnField, matchField, matchValue)` | Value | Arrays allowed for several match fields |
| `Platform.Function.LookupRows(de, matchField, matchValue)` | Array of row objects | Max ~2,000 rows |
| `Platform.Function.LookupOrderedRows(de, count, orderBy, matchField, matchValue)` | Array of row objects | `orderBy` like `"CreatedAt DESC"` |
| `Platform.Function.InsertData(de, [fields], [values])` | Rows inserted | Fails on duplicate primary key |
| `Platform.Function.UpdateData(de, [keyFields], [keyValues], [fields], [values])` | Rows updated | No insert if the key doesn't exist |
| `Platform.Function.UpsertData(de, [keyFields], [keyValues], [fields], [values])` | Rows affected | Insert or update |
| `Platform.Function.DeleteData(de, [fields], [values])` | Rows deleted | Deletes every row that matches |

```js
var rows = Platform.Function.LookupRows("Purchases_DE", ["SubscriberKey"], [sk]);
for (var i = 0; i < rows.length; i++) { var product = rows[i]["ProductName"]; }

Platform.Function.UpsertData("Leads_DE", ["EmailAddress"], [email],
  ["FirstName", "UpdatedAt"], [firstName, Platform.Function.Now()]);
```

## Data extensions (Core)

Requires `Platform.Load("core", "1.1.5")`. `Init` takes the **external key** (CustomerKey), not the name.

| Call | Does |
|---|---|
| `var de = DataExtension.Init(key)` | Reference to a DE |
| `de.Rows.Retrieve([filter])` | Rows matching the filter (single batch; no pagination) |
| `de.Rows.Lookup([fields], [values], [count], [orderBy])` | Rows matching exact values |
| `de.Rows.Add(obj or [obj, …])` | Inserts one or many rows |
| `de.Rows.Update(obj, [keyFields], [keyValues])` | Updates matching rows |
| `de.Rows.Remove([fields], [values])` | Deletes matching rows |
| `de.Fields.Retrieve()` | Field metadata |

```js
Platform.Load("core", "1.1.5");
var log = DataExtension.Init("Error_Log_DE");
log.Rows.Add({ Source: "Nightly_Job", Message: "Started", CreatedAt: Platform.Function.Now() });
```

For more than one batch of rows, use [WSProxy](wsproxy.md).

## Content

| Function | Does |
|---|---|
| `Platform.Function.ContentBlockByKey(key)` | Content Builder block by external key |
| `Platform.Function.ContentBlockByID(id)` | Content Builder block by ID |
| `Platform.Function.TreatAsContent(string)` | Evaluates a string as content (AMPscript included) |

## Request and response

Available on CloudPages and Code Resources.

| Call | Returns / does |
|---|---|
| `Platform.Request.GetQueryStringParameter(name)` | Plain query-string value |
| `Platform.Request.GetFormField(name)` | Form field from a POST |
| `Platform.Request.GetPostData([encoding])` | Raw POST body; pass `"utf-8"` (default is Windows-1252) |
| `Platform.Request.GetRequestHeader(name)` | Request header value |
| `Platform.Request.GetCookieValue(name)` | Cookie value |
| `Platform.Request.Method` | HTTP method (`GET`, `POST`…) |
| `Platform.Request.RequestURL` / `.QueryString` | Full URL / full query string of the request |
| `Platform.Request.IsSSL` | `true` when the request used HTTPS |
| `Platform.Request.ClientIP` / `.UserAgent` / `.ReferrerURL` | Visitor details |
| `Platform.Response.SetResponseHeader(name, value)` | Adds a response header |
| `Platform.Response.ContentType` | Gets/sets the response content type (for example `"application/json"`) |
| `Platform.Response.SetCookie(name, value, [expires], [httpOnly])` | Sets a cookie |
| `Platform.Response.Redirect(url, [permanent])` | Redirects (`false` = 302) |
| `Write(string)` | Writes to the output. **Does not HTML-encode** |

## Variables (AMPscript interop)

| Call | Does |
|---|---|
| `Platform.Variable.SetValue("@name", value)` | Creates/sets an AMPscript variable |
| `Platform.Variable.GetValue("@name")` | Reads an AMPscript variable |

## JSON and utilities

| Call | Does |
|---|---|
| `Stringify(value)` | Object → JSON string (use instead of `JSON.stringify`) |
| `Platform.Function.ParseJSON(string)` | JSON string → object (use instead of `JSON.parse`) |
| `Platform.Function.GUID()` | New GUID |
| `Platform.Function.Now()` | Server date/time (US Central, UTC−6, no DST) |
| `Platform.Function.SystemDateToLocalDate(date)` | Server time → account local time |
| `Platform.Function.Base64Encode(s)` / `Base64Decode(s)` | Base64 |
| `Platform.Function.RaiseError(message, [skipSubscriber])` | Raises an error (in sends, can skip one subscriber) |
| `String(x)`, `Number(x)`, `parseInt(x, 10)` | Conversions. Always pass the radix to `parseInt` |

## HTTP

Ports 80 and 443 only. Requests time out after 30 seconds.

| Call | Use it for |
|---|---|
| `new Script.Util.HttpRequest(url)` | **Recommended.** Any method (GET, POST, PUT, PATCH, DELETE), custom headers, status code and body |
| `Script.Util.HttpGet(url)` | Simple GET with caching options |
| `HTTP.Get(url, [headerNames], [headerValues])` (Core) | Quick GET |
| `HTTP.Post(url, contentType, payload, [headerNames], [headerValues])` (Core) | Quick POST |

```js
var req = new Script.Util.HttpRequest("https://api.example.com/v1/items");
req.emptyContentHandling = 0;
req.retries = 2;
req.continueOnError = true;          // inspect statusCode instead of throwing on 4xx/5xx
req.contentType = "application/json";
req.method = "POST";
req.setHeader("Authorization", "Bearer " + token);
req.postData = Stringify({ id: 123 });

var resp = req.send();
var status = resp.statusCode;
var body = Platform.Function.ParseJSON(String(resp.content));
```

Full patterns in [http-and-apis.md](http-and-apis.md).

## WSProxy

```js
var api = new Script.Util.WSProxy();
```

| Method | Does |
|---|---|
| `api.retrieve(objectType, [cols], [filter], [queryAllAccounts])` | SOAP Retrieve. Returns `{ Status, Results, HasMoreRows, RequestID }` |
| `api.getNextBatch(objectType, requestID)` | Next page of a retrieve |
| `api.createItem(type, obj, [options])` / `api.createBatch(type, [obj…], [options])` | SOAP Create |
| `api.updateItem(type, obj, [options])` / `api.updateBatch(type, [obj…], [options])` | SOAP Update (with `UpdateAdd` = upsert) |
| `api.deleteItem(type, obj)` / `api.deleteBatch(type, [obj…])` | SOAP Delete |
| `api.performItem(type, obj, action)` | SOAP Perform (for example, start a Query Activity) |
| `api.describe(type)` | Object metadata |
| `api.setClientId({ ID: mid })` / `api.resetClientIds()` | Run the next calls in another business unit |

Data extension rows use the object type `DataExtensionObject` (writes) or `DataExtensionObject[ExternalKey]` (retrieves). Details and examples: [wsproxy.md](wsproxy.md).

## Filter objects

Used by WSProxy retrieves and `Rows.Retrieve`.

```js
// Simple
{ Property: "Status", SimpleOperator: "equals", Value: "Active" }

// Complex (nest as deep as needed)
{
  LeftOperand:  { Property: "Status", SimpleOperator: "equals", Value: "Active" },
  LogicalOperator: "AND",
  RightOperand: { Property: "CreatedAt", SimpleOperator: "greaterThan", Value: "2026-01-01" }
}
```

| `SimpleOperator` | Note |
|---|---|
| `equals`, `notEquals` | |
| `greaterThan`, `greaterThanOrEqual`, `lessThan`, `lessThanOrEqual` | Numbers and dates |
| `isNull`, `isNotNull` | No `Value` |
| `IN` | `Value` is an array |
| `between` | `Value` is a two-item array |
| `like` | Supported on some objects only |

[← SSJS](README.md)
