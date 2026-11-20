# Server-Side JavaScript (SSJS)

SSJS is Marketing Cloud's server-side scripting language for CloudPages, Code Resources and Script Activities. It does everything AMPscript does with data, plus loops over large datasets, JSON handling, SOAP calls through WSProxy and HTTP requests with full control.

**Start here:** [fundamentals.md](fundamentals.md) · **Look something up:** [reference.md](reference.md)

| File | Type | Read it when… |
|---|---|---|
| [fundamentals.md](fundamentals.md) | Guide | You're starting a script and want the rules of the runtime |
| [reference.md](reference.md) | Reference | You need a function signature |
| [wsproxy.md](wsproxy.md) | Guide | You read or write data at scale, or call SOAP objects |
| [http-and-apis.md](http-and-apis.md) | Guide | You call an external API or the Marketing Cloud REST API |

## Scripts

| Script | Where to use | What it does | Status |
|---|---|---|---|
| [wsproxy-retrieve-all.ssjs](scripts/wsproxy-retrieve-all.ssjs) | CloudPages, Script Activities | Reads every row of a DE following `HasMoreRows` / `RequestID`; optional per-batch callback to avoid holding everything in memory | Ready to test |
| [wsproxy-upsert-batch.ssjs](scripts/wsproxy-upsert-batch.ssjs) | Script Activities | Upserts an array of rows in chunks (`UpdateAdd`) and collects failures | Ready to test |
| [try-catch-log.ssjs](scripts/try-catch-log.ssjs) | Script Activities | Writes errors to `Error_Log_DE`, then re-throws so the Automation shows the failure | Ready to test |
| [rest-api-request.ssjs](scripts/rest-api-request.ssjs) | Script Activities, CloudPages | OAuth token + REST call with credentials read from a restricted DE | Ready to test |
| [json-endpoint.ssjs](scripts/json-endpoint.ssjs) | Code Resource (JSON) | Parses a POST body, validates it, writes to a DE and answers with JSON | Ready to test |

## Shared data extensions

| DE | Fields | Used by |
|---|---|---|
| `Error_Log_DE` | `Source` (Text 100), `Message` (Text 4000), `CreatedAt` (Date) | try-catch-log, json-endpoint, CloudPages |
| `Config_DE` | `Name` (Text 100, PK), `Value` (Text 500) | rest-api-request (API credentials), CloudPages (link secret) |

Keep both in a folder with restricted permissions. `Config_DE` holds secrets.

Related: [field notes on SSJS](../../field-notes/ssjs.md) (the traps) · [client-side JavaScript](../client-side/)

[← JavaScript](../README.md)
