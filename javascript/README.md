# JavaScript in Marketing Cloud

Marketing Cloud runs JavaScript in two very different places. Mixing them up is the most common source of bugs and security issues.

| | Server-Side JavaScript (SSJS) | Client-side JavaScript |
|---|---|---|
| **Runs on** | Marketing Cloud servers, before the page is sent | The visitor's browser, after the page loads |
| **Tag** | `<script runat="server">` | `<script>` |
| **Language level** | ECMAScript 3 (no `let`, arrow functions, `forEach`, `JSON`) | Modern JavaScript, whatever the browser supports |
| **Can access** | Data extensions, SOAP/REST APIs, content, request data | The DOM, browser storage, `fetch` to public endpoints |
| **Use for** | Data reads/writes, API calls, Script Activities, JSON endpoints | Validation UX, interactivity, calling your own JSON endpoints |
| **Secrets** | Allowed (read them from a restricted DE) | **Never.** Everything here is visible to the visitor |

## Sections

### [SSJS](ssjs/)
| File | Type | What you'll find |
|---|---|---|
| [fundamentals.md](ssjs/fundamentals.md) | Guide | Runtime, ES3 limits, Platform vs Core, AMPscript interop, error handling, performance |
| [reference.md](ssjs/reference.md) | Reference | Cheat sheet of `Platform.*`, Core objects, WSProxy and HTTP functions |
| [wsproxy.md](ssjs/wsproxy.md) | Guide | Retrieve, filters, pagination, create/update/upsert/delete, perform, cross-BU |
| [http-and-apis.md](ssjs/http-and-apis.md) | Guide | Calling external APIs and the Marketing Cloud REST API from SSJS |
| [scripts/](ssjs/scripts/) | Library | Ready-to-paste scripts (see below) |

| Script | What it does | Status |
|---|---|---|
| [wsproxy-retrieve-all.ssjs](ssjs/scripts/wsproxy-retrieve-all.ssjs) | Reads a whole DE, batch by batch, with an optional per-batch callback | Ready to test |
| [wsproxy-upsert-batch.ssjs](ssjs/scripts/wsproxy-upsert-batch.ssjs) | Upserts many rows in chunks and reports failed rows | Ready to test |
| [try-catch-log.ssjs](ssjs/scripts/try-catch-log.ssjs) | Logs errors to a DE and re-throws so the Automation still fails | Ready to test |
| [rest-api-request.ssjs](ssjs/scripts/rest-api-request.ssjs) | Gets an OAuth token and calls the REST API (example: fire a journey entry event) | Ready to test |
| [json-endpoint.ssjs](ssjs/scripts/json-endpoint.ssjs) | JSON Code Resource: validates a POST body, writes to a DE, returns JSON | Ready to test |

### [Client-side](client-side/)
| File | What it does | Status |
|---|---|---|
| [README.md](client-side/README.md) | How to load and structure browser scripts on CloudPages | Guide |
| [form-enhancements.js](client-side/form-enhancements.js) | Inline validation messages and double-submit protection | Ready to test |
| [utm-persistence.js](client-side/utm-persistence.js) | Keeps UTM parameters across pages and fills hidden form fields | Ready to test |
| [fetch-json.js](client-side/fetch-json.js) | Calls a JSON Code Resource with timeout and error handling | Ready to test |

## Rule of thumb

Validate in the browser for **user experience**, validate on the server for **correctness and security**. The server-side checks in the [CloudPages](../cloudpages/) are the ones that count.

[← Back to the handbook](../README.md)
