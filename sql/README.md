# SQL & Data Views

A library of SQL queries for **Salesforce Marketing Cloud Engagement** Query Activities: email KPIs, journey performance, contact-base hygiene, engagement scoring and the patterns that keep queries fast on multi-million-row data extensions.

All queries run on standard Data Views or on placeholder data extensions (`Source_DE`, `Audience_DE`…). No client data.

## Contents

| Folder | Query | What it returns |
|---|---|---|
| [kpis](kpis/) | `monthly-email-kpis.sql` | Sends, unique clicks, hard bounces and rates per month |
| | `journey-email-performance.sql` | Sends, unique clicks and click rate per journey |
| | `running-journeys.sql` | How many journeys are running right now |
| [hygiene](hygiene/) | `inactive-contacts.sql` | Contacts who received emails but never opened or clicked |
| | `never-sent-contacts.sql` | Subscribers who never received an email |
| [scoring](scoring/) | `engagement-segments.sql` | Champion / Engaged / Passive / At risk segment per contact |
| [patterns](patterns/) | `dedup-row-number.sql` | One row per key without mixing records |
| | `build-exclusion-staging.sql` + `anti-join-staging.sql` | Fast exclusions on large audiences |

Each folder has a README explaining the target data extension, the primary key and how to schedule it.

## Rules these queries follow

- No CTEs (`WITH`): derived tables only, because the Query Activity parser rejects CTEs.
- No `ORDER BY` without `TOP`: Query Activities don't allow it.
- No comments inside the `.sql` files, so they also run in Query Studio. Explanations live in the READMEs.
- Data Views keep about 6 months of tracking, so every "last N days" window stays inside that limit.

## Story behind it

I used the hygiene approach in this repository to remove **4 million inactive contacts** from a Marketing Cloud account, bringing it from ~10M back under its 8M-contact contract limit.

[← Back to the handbook](../README.md)
