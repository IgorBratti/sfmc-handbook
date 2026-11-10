# VS Code snippets for Marketing Cloud

18 snippets for AMPscript, SSJS and SQL. Type the prefix, press **Tab**, and fill in the highlighted fields (Tab jumps to the next one).

Status: **Ready to test**.

## Install

**Option 1: for every project (recommended)**
1. In VS Code: `Ctrl + Shift + P` → **Snippets: Configure Snippets** → **New Global Snippets file...** → name it `sfmc`.
2. Replace the content with [`sfmc.code-snippets`](sfmc.code-snippets) and save.

**Option 2: only in one project**
Copy `sfmc.code-snippets` into the project's `.vscode/` folder.

## Snippets

| Prefix | Inserts |
|---|---|
| `amp-block` | AMPscript block with `VAR` and `SET` |
| `amp-lookup` | `Lookup` of one value |
| `amp-rows` | `LookupOrderedRows` + loop |
| `amp-fallback` | Fallback for an empty attribute, with proper case |
| `amp-date` | Local date formatted by culture |
| `amp-link` | Tracked link with encoded parameter |
| `amp-cloudpage` | Link to a CloudPage with encrypted parameters |
| `amp-skip` | `RaiseError` that skips the send for one contact |
| `amp-post` | CloudPage form processed only on real submissions |
| `amp-upsert` | `UpsertData` with `UpdatedAt` |
| `amp-claim` | `ClaimRowValue` to assign a coupon |
| `ssjs-block` | SSJS block with `Platform.Load` |
| `ssjs-try` | `try/catch` writing to an error log DE |
| `ssjs-retrieve` | WSProxy retrieve with pagination |
| `sql-dedup` | Deduplication with `ROW_NUMBER` |
| `sql-anti` | Anti-join against a staging DE |
| `sql-freqcap` | Frequency capping on an audience |
| `sql-recent` | Last N days of a tracking Data View |

## Where they work

AMPscript snippets are active in `html` files (and `ampscript`, if you use an AMPscript extension), SSJS in `html` and `javascript`, SQL in `sql`. All of them also work in plain text files.

[← Back to the handbook](../../README.md)
