# Patterns for large data extensions

## dedup-row-number.sql
Keeps the most recent record per `SubscriberKey`. Every column comes from the same record, unlike `GROUP BY` with independent `MAX()` calls, which can mix values from different rows.

## build-exclusion-staging.sql + anti-join-staging.sql
Two Query Activities in the same automation:

1. `build-exclusion-staging.sql` → `Exclusion_Staging_DE` (PK `SubscriberKey`, **Overwrite**).
2. `anti-join-staging.sql` → your final audience DE.

Why: SFMC only indexes primary-key fields. A correlated `NOT EXISTS` on millions of rows can hit the Query Activity time limit; a `LEFT JOIN ... IS NULL` against a keyed staging DE stays fast.
