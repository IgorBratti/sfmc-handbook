# VS Code snippets for Marketing Cloud

24 snippets for AMPscript, SSJS and SQL. Type the prefix, press **Tab**, and fill in the highlighted fields (Tab jumps to the next one).

Status: **Ready to test**.

## Install

**Option 1: for every project (recommended)**
1. In VS Code: `Ctrl + Shift + P` → **Snippets: Configure Snippets** → **New Global Snippets file...** → name it `sfmc`.
2. Replace the content with [`sfmc.code-snippets`](sfmc.code-snippets) and save.

**Option 2: only in one project**
Copy `sfmc.code-snippets` into the project's `.vscode/` folder.

## Snippets

### AMPscript

| Prefix | Inserts |
|---|---|
| `amp-block` | AMPscript block with `VAR` and `SET` |
| `amp-lookup` | `Lookup` of one value |
| `amp-rows` | `LookupOrderedRows` + loop |
| `amp-fallback` | Fallback for an empty attribute, with proper case |
| `amp-date` | Local date formatted by culture |
| `amp-link` | Tracked link with encoded parameter |
| `amp-cloudpage` | Link to a CloudPage with encrypted (non-identity) parameters |
| `amp-signed-link` | Link to a CloudPage with subscriber key + signature |
| `amp-verify-sig` | CloudPage: accept `sk` only with a valid signature |
| `amp-allow` | Allow-list a request value with `RegExMatch` |
| `amp-skip` | `RaiseError` that skips the send for one contact |
| `amp-post` | CloudPage form processed only on real submissions |
| `amp-upsert` | `UpsertData` with `UpdatedAt` |
| `amp-claim` | `ClaimRowValue` to assign a coupon |

### SSJS

| Prefix | Inserts |
|---|---|
| `ssjs-block` | SSJS block with `Platform.Load("core", "1.1.5")` |
| `ssjs-try` | `try/catch` that logs to an error DE and re-throws |
| `ssjs-retrieve` | WSProxy retrieve with pagination |
| `ssjs-http` | `Script.Util.HttpRequest` with JSON body and status check |

### SQL

| Prefix | Inserts |
|---|---|
| `sql-dedup` | Deduplication with `ROW_NUMBER` |
| `sql-anti` | Anti-join against a staging DE |
| `sql-freqcap` | Frequency capping on an audience |
| `sql-recent` | Last N days of a tracking Data View |
| `sql-today-local` | Today's date in Brasília time |
| `sql-journey-join` | Tracking Data View joined to its journey |

## Where they work

AMPscript snippets are active in `html` files (and `ampscript`, if you use an AMPscript extension), SSJS in `html` and `javascript`, SQL in `sql`. All of them also work in plain text files.

[← Back to the handbook](../../README.md)
