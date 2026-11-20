# Field notes

Hard-won notes from building journeys, CloudPages and automations in **Salesforce Marketing Cloud Engagement** every day.

Each note follows the same format: **the problem**, **why it happens** and **the fix**, with a link to the full reference or the code. Everything here is generic: no client data, no client code.

## Contents

| Area | Notes |
|---|---|
| [SQL (Query Activities)](sql.md) | No CTEs · deduplication with `ROW_NUMBER` · anti-joins instead of `NOT EXISTS` · join fan-out · shared DEs from child BUs · Brazilian decimals · empty strings vs `NULL` · Query Studio comments · "today" across time zones · Data Views per BU |
| [AMPscript](ampscript.md) | `LookupRows` row limit · guarding writes on CloudPages · encoding URL parameters · empty values · typed "encrypted" parameters · `IIF` runs both branches · booleans as text · AMPscript inside HTML comments |
| [SSJS](ssjs.md) | Pagination · `Rows.Retrieve()` · requesting every column · swallowed errors · ES3 · UTF-8 POST bodies · external key vs name |
| [Journey Builder](journey-builder.md) | When Exit Criteria is evaluated · Journey Data vs Contact Data · grouping by `JourneyID` |
| [WhatsApp (Meta)](whatsapp.md) | Template variables come from Journey Data · URL parameters in templates · carousel media handles · tracking data |
| [Data Views & retention](data-views.md) | How long each source keeps data and what it means for reporting |

## How to use

Read the note, follow the link to the full reference or script, replace the placeholder names (`My_DE`, `Audience_DE`…) with your own. Test in a sandbox or test BU before production.

[← Back to the handbook](../README.md)
