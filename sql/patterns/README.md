# Patterns for large data extensions

Status of every query in this folder: **Ready to test**.

## dedup-row-number.sql

Keeps the most recent record per `SubscriberKey`. Every column comes from the same record, unlike `GROUP BY` with independent `MAX()` calls, which can mix values from different rows. The second `ORDER BY` column is a tie-breaker, so two rows with the same `UpdatedAt` always resolve the same way.

**Target DE:** same fields as `Source_DE`, PK `SubscriberKey` · **Overwrite**.

## build-exclusion-staging.sql + anti-join-staging.sql

Two Query Activities in the same automation:

1. `build-exclusion-staging.sql` → `Exclusion_Staging_DE` (PK `SubscriberKey`, **Overwrite**).
2. `anti-join-staging.sql` → your final audience DE.

Why: Marketing Cloud indexes primary-key fields. A correlated `NOT EXISTS` on millions of rows can hit the 30-minute limit; a `LEFT JOIN … IS NULL` against a keyed staging DE stays fast. `UNION` (not `UNION ALL`) removes duplicate keys, which the PK of the staging DE requires.

## random-split.sql

Assigns each contact to `Control` or `Test` at random, for holdout groups and A/B tests outside Journey Builder.

**Target DE:** `Audience_Split_DE` · `SubscriberKey` (Text 254, PK), `EmailAddress`, `TestGroup` (Text 10) · **Overwrite**.

- `ABS(CHECKSUM(NEWID())) % 2` gives a roughly 50/50 split. Use `% 10` and `CASE … WHEN 0 THEN 'Control'` for a 10% holdout.
- The split changes on every run. Run it **once** per campaign (or write with Update and only for new contacts) so people don't switch groups.
- Journey Builder's Random Split and Path Optimizer are the in-journey alternatives.

[← SQL & Data Views](../README.md)
