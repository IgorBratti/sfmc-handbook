# SQL & Data Views

SQL for **Marketing Cloud Engagement** Query Activities: references for Data Views and the query engine, a guide to dates and time zones, and a library of queries for KPIs, hygiene, audiences, scoring, monitoring and performance patterns.

All queries run on standard Data Views or on placeholder data extensions (`Customers_DE`, `Audience_DE`…). No client data.

## Reference and guides

| File | Type | What's inside |
|---|---|---|
| [data-views.md](data-views.md) | Reference | Every Data View you'll use: fields, scope, retention, time zones, join map, recipes |
| [query-activity.md](query-activity.md) | Reference | Supported T-SQL, data actions (Overwrite / Update / Append), limits, type mapping, performance habits |
| [dates-and-time-zones.md](dates-and-time-zones.md) | Guide | Server time vs UTC vs local, conversions, "yesterday local" filters, birthdays, age |

## Query library

| Folder | Query | What it returns |
|---|---|---|
| [kpis](kpis/) | `monthly-email-kpis.sql` | Sends, unique clicks, hard bounces and rates per month |
| | `journey-email-performance.sql` | Sends, unique clicks and click rate per journey |
| | `unsubscribe-complaint-rates.sql` | Unsubscribe and spam complaint rates per month |
| | `bounces-by-category-domain.sql` | Bounces by category and recipient domain |
| | `best-send-time.sql` | Click rate by weekday and hour of send |
| | `running-journeys.sql` | How many journeys are running right now |
| | `sms-monthly-kpis.sql` | SMS sent, delivered, undelivered, opt-outs and delivery rate per month |
| [audiences](audiences/) | `frequency-cap.sql` | Audience minus contacts with 3+ emails in 7 days |
| | `birthdays-today.sql` | Contacts whose birthday is today (local time, 29 Feb handled) |
| [hygiene](hygiene/) | `inactive-contacts.sql` | Contacts who received emails but never opened or clicked |
| | `collect-engaged-keys.sql` | Keys that opened or clicked in any BU (keep-list for multi-BU accounts) |
| | `collect-sent-keys.sql` + `never-sent-contacts.sql` | Subscribers that no business unit has emailed |
| [scoring](scoring/) | `engagement-segments.sql` | Champion / Engaged / Passive / At risk per contact |
| [monitoring](monitoring/) | `automation-failures.sql` | Failed automation runs in the last 24 h, with the failing activity |
| | `automation-skipped-runs.sql` | Scheduled runs that didn't start |
| | `activity-durations.sql` | Average and max duration per activity (find the next timeout) |
| [patterns](patterns/) | `dedup-row-number.sql` | One row per key without mixing records |
| | `build-exclusion-staging.sql` + `anti-join-staging.sql` | Fast exclusions on large audiences |
| | `random-split.sql` | Random control/test groups |

Each folder has a README with the target data extension, primary key, data action and schedule. Status of every query: **Ready to test** (see the [status labels](../README.md#status-labels)).

## Rules these queries follow

- No CTEs (`WITH`): derived tables only, because the Query Activity parser rejects CTEs.
- No `ORDER BY` without `TOP`.
- No comments inside the `.sql` files, so they also run in Query Studio. Explanations live in the READMEs.
- Every column prefixed with its table alias.
- Time windows stay inside the ~6-month Data View retention.
- Dates: server time (UTC−6) unless the query says otherwise. Conversions are explicit.

## Story behind it

I used the hygiene approach in this repository to remove **4 million inactive contacts** from a Marketing Cloud account, bringing it from ~10M back under its 8M-contact contract limit. The full process is in the [contact cleanup playbook](../playbooks/contact-cleanup/).

[← Back to the handbook](../README.md)
