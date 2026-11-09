# Server-Side JavaScript (SSJS)

Scripts for CloudPages and Script Activities.

| Script | What it does | Where to use |
|---|---|---|
| [wsproxy-retrieve-all.ssjs](wsproxy-retrieve-all.ssjs) | Reads every row of a data extension, following pagination (`HasMoreRows` / `RequestID`) | CloudPages, Script Activities |
| [try-catch-log.ssjs](try-catch-log.ssjs) | Wraps a script in `try/catch` and writes errors to `Error_Log_DE` | Script Activities |

## Why WSProxy
`DataExtension.Rows.Retrieve()` has no cursor and returns only the first batch. WSProxy gives you `HasMoreRows` and `RequestID`, so you can read large data extensions completely. List in `cols` every field you will read or filter on.

## Error log data extension
| `Error_Log_DE` | Type |
|---|---|
| `Source` | Text 100 |
| `Message` | Text 4000 |
| `CreatedAt` | Date |

More traps and fixes: [field notes on SSJS](../field-notes/ssjs.md).

[← Back to the handbook](../README.md)
