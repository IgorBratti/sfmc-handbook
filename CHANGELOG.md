# Changelog

What changed in the handbook, newest first.

## 2026-11-20
### Added
- **JavaScript section** (`javascript/`): SSJS fundamentals, reference, WSProxy guide, HTTP and APIs guide; scripts for batch upsert, REST calls with OAuth and a JSON Code Resource endpoint; client-side scripts for form enhancements, UTM persistence and JSON calls.
- **AMPscript reference and guides:** syntax, functions by category, personalization strings, data writes, content blocks, debugging.
- **SQL references and guides:** Data Views (fields, scope, retention, join map), Query Activity (supported T-SQL, data actions, limits), dates and time zones.
- **SQL queries:** automation failures, skipped runs and activity durations (`monitoring/`), SMS monthly KPIs, random split, multi-BU sent and engaged keys.
- **Email guides:** rendering (Outlook, Gmail, dark mode, accessibility), deliverability (authentication, bulk sender requirements, reputation), Content Builder; AMP for Email guide.
- **Email library:** hero image and image + text blocks, dynamic content by segment and order items examples, static preview of the base template.
- **APIs section:** authentication and installed packages, REST reference (journeys, transactional messaging, DE rows, contacts, assets, automations), SOAP reference.
- **Journey Builder** and **Automation Studio** design guides.
- **Playbooks:** journey launch, automation failure alerts.
- **CloudPages security guide**, `CONTRIBUTING.md`, `.gitignore`, six new VS Code snippets (24 in total).

### Changed
- **CloudPages security:** identity parameters (`sk`) are now signed and verified on the thank-you page, birthday page and preference center; printed values are allow-listed (closes a reflected XSS through `utm_source` and `fn`).
- **Lead capture form:** first-touch `Source` and `CreatedAt` are no longer overwritten on repeat submissions; `LastSource` and `UpdatedAt` added; stricter server-side validation.
- **Preference center:** the `LogUnsubEvent` status is checked and failures are logged.
- **Hygiene:** never-sent selection now covers every business unit; engaged keys from all BUs protect contacts from deletion.
- **SSJS error logging** re-throws after logging, truncates long messages and loads Core 1.1.5.
- **Birthday query** handles 29 February; deduplication query has a tie-breaker.
- **Base template:** preheader filler, link aliases, footer contrast raised to WCAG AA.
- **Contact cleanup playbook** v0.2: multi-BU selection, non-email contacts, REST API deletion option, deletion log.
- Field notes now link to the references instead of duplicating code.

### Moved
- `ssjs/` → `javascript/ssjs/scripts/`.

## 2026-11-09
### Added
- "How do I…?" index in the README, in English and Portuguese.
- Status labels (Tested, Ready to test, Draft) on CloudPages, SQL, SSJS and playbooks.
- `tools/vscode-snippets`: 18 VS Code snippets for AMPscript, SSJS and SQL.
- SQL KPIs: unsubscribe and complaint rates, bounces by category and domain, best send day and hour.
- SQL `audiences` folder: frequency cap and today's birthdays.
- AMPscript recipe: skipping the send for one contact with `RaiseError`.

## 2026-11-08
### Added
- Portuguese README (`README.pt-BR.md`).
- First version of the handbook: CloudPages (thank-you, birthday, lead capture, preference center), email template and blocks, AMPscript recipes, SSJS scripts, SQL library, contact cleanup playbook (draft) and field notes.
