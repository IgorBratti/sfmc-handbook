# Field notes

Hard-won notes from building journeys, CloudPages and automations in **Salesforce Marketing Cloud Engagement** every day.

Each note follows the same format: **the problem**, **why it happens** and **the fix**, with code you can copy. Everything here is generic: no client data, no client code.

## Contents

| Area | Notes |
|---|---|
| [SQL (Query Activities)](sql.md) | No CTEs · deduplication with `ROW_NUMBER` · anti-joins instead of `NOT EXISTS` · shared DEs from child BUs · Brazilian decimals · empty strings vs `NULL` |
| [AMPscript](ampscript.md) | `LookupRows` row limit · guarding writes on CloudPages · encoding URL parameters |
| [SSJS](ssjs.md) | Paginating large retrieves with WSProxy · why `Rows.Retrieve()` is not enough · requesting every column you use |
| [Journey Builder](journey-builder.md) | When Exit Criteria is evaluated · Journey Data vs Contact Data · grouping by `JourneyID` |
| [WhatsApp (Meta)](whatsapp.md) | Template variables come from Journey Data · URL parameters in templates · carousel media handles · tracking data |
| [Data Views & retention](data-views.md) | How long each source keeps data · which views are purged |

## How to use

Read the note, copy the snippet, replace the placeholder names (`My_DE`, `Audience_DE`…) with your own. Test in a sandbox or test BU before production.

[← Back to the handbook](../README.md)
