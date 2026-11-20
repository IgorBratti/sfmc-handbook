# Contributing and style guide

This handbook is maintained by one person, but it follows the rules of a team repository so it stays consistent and safe to share. Suggestions and fixes are welcome through issues.

## Content types

Every file is one of these. The type goes in the first lines of the file (`> **Type:** Guide`).

| Type | Purpose | Shape |
|---|---|---|
| **Reference** | Look something up fast | Tables first, minimal prose, signatures and notes |
| **Guide** | Explain how something works and how to decide | Numbered sections, short paragraphs, decision tables, checklists |
| **Recipe** | Copy-ready snippets on one theme | Heading per task, code block, one or two lines of explanation |
| **Library item** | Complete artifact | Folder with `README.md` (technical sheet), `src/`, `preview.html` when visual |
| **Playbook** | End-to-end process | Status, when to run, flow diagram, steps, data extensions, risks, changelog |
| **Field note** | A trap and its fix | **Problem**, **Why**, **Fix**, link to the full reference |

## Technical sheet template (library items)

```markdown
# <Name>

> One sentence: what it does and who it's for.

[Open the preview](…) · [Source](src/…)

| | |
|---|---|
| **Status** | Tested · Ready to test · Draft |
| **Type** | CloudPage · Script · Email · Query · Journey |
| **Level** | Beginner · Intermediate · Advanced |
| **Stack** | AMPscript (functions used), SSJS, SQL, HTML/CSS |
| **Setup time** | ~30 min |

## 1. Use case
## 2. How it works      (mermaid diagram + bullets)
## 3. Prerequisites     (data extensions: field, type, PK, nullable)
## 4. Setup
## 5. Key code
## 6. Testing           (checkboxes, including invalid and malicious input)
## 7. Security and privacy
```

## Rules for every contribution

**Data and secrets**
- No client data: no real records, exports, screenshots with real numbers, client data extension names or client code.
- No credentials: client IDs, secrets, MIDs, tokens and keys never appear in files. Code reads them from a restricted data extension (`Config_DE`) or a vault.
- Placeholders: `Customers_DE`, `Leads_DE`, `My_DE`, `Audience_DE`, `example.com`, `0031x000001`.

**Code**
- AMPscript: `AttributeValue()` in shared content, `Empty()` checks after lookups, allow-lists before printing request values, signatures on identity parameters.
- SSJS: ECMAScript 3 only, `Platform.Load("core", "1.1.5")` when Core is used, errors logged and re-thrown in Script Activities.
- Client-side JavaScript: modern syntax is fine, no secrets, progressive enhancement.
- SQL: no CTEs, no comments inside `.sql` files, every column prefixed with its table alias, explicit time zones, target DE and data action documented in the folder README.
- HTML email: tables for layout, inline styles, `role="presentation"` on layout tables, `alt` on images, `alias` on links.

**Naming**
- Files and folders: lowercase with hyphens.
- Data extensions in examples: `PascalCase_DE`.
- Marketing Cloud assets: `<BU>_<TYPE>_<OBJECTIVE>_<DETAIL>_<VERSION>` (for example `B2C_JRN_ONB_Welcome_v2`).

**Status**
- New code starts as **Ready to test** (or **Draft**). Only code run end to end in a live org is marked **Tested**.

**Writing**
- English, direct, present tense. Explain *why* when a rule isn't obvious.
- Link to the reference instead of duplicating it.
- Every page ends with a link back to its section.

## Commits

- One topic per commit, message in English, imperative mood: `Add WSProxy batch upsert script`, `Fix time zone in birthdays query`.
- Update [CHANGELOG.md](CHANGELOG.md) for anything a reader would notice.
