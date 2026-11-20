# SQL in Query Activities

> **Type:** Field notes · Problem → why → fix. Full references: [Query Activity](../sql/query-activity.md) · [Data Views](../sql/data-views.md) · [dates and time zones](../sql/dates-and-time-zones.md).

[← Back to contents](README.md)

## 1. Common Table Expressions (`WITH`) are rejected

**Problem:** a query that uses `WITH cte AS (...)` fails validation in a Query Activity.

**Why:** the Marketing Cloud query parser accepts a subset of T-SQL, and CTEs are not part of it.

**Fix:** move the CTE into a derived table (a subquery in the `FROM`).

```sql
SELECT x.SubscriberKey, x.TotalSends
FROM (
    SELECT s.SubscriberKey, COUNT(*) AS TotalSends
    FROM _Sent s
    GROUP BY s.SubscriberKey
) x
WHERE x.TotalSends >= 5
```

## 2. Deduplicate with `ROW_NUMBER`, not `GROUP BY`

**Problem:** `GROUP BY SubscriberKey` with `MAX(Email)`, `MAX(Phone)`, `MAX(UpdatedAt)` returns rows that never existed: each `MAX` is computed on its own, so the email can come from one record and the phone from another.

**Fix:** rank the records per key and keep the first one, with a tie-breaker. Query: [dedup-row-number.sql](../sql/patterns/dedup-row-number.sql).

## 3. Replace `NOT EXISTS` with a staging DE and an anti-join

**Problem:** a correlated `NOT EXISTS` against a multi-million-row data extension runs until the Query Activity times out (30 minutes).

**Why:** Marketing Cloud indexes **primary key** fields. A correlated subquery on non-key columns scans the table again and again.

**Fix:** write the keys to exclude into a staging DE whose primary key is the join column, then `LEFT JOIN … WHERE e.Key IS NULL`. Queries: [patterns](../sql/patterns/).

## 4. Watch out for JOIN fan-out on partial keys

**Problem:** the target DE ends up with more rows than the audience, or the query fails on duplicate primary keys.

**Why:** joining a relationship table on only part of its key (for example, only the company ID when the real key is company ID + contact ID) multiplies rows. The same happens when joining tracking views on `SubscriberKey` alone.

**Fix:** join on the full composite key (for tracking: `JobID`, `ListID`, `BatchID`, `SubscriberID`), or deduplicate the relationship table first (note 2).

## 5. Shared data extensions from a child BU need `ENT.`

**Problem:** a query in a child business unit can't find a data extension that lives in Shared Data Extensions.

**Fix:** prefix it with `ENT.`

```sql
SELECT s.SubscriberKey, s.Segment
FROM ENT.[Shared_Segments_DE] s
```

## 6. Brazilian decimals and sargable filters

**Problem:** values stored as text with a comma (`"1234,56"`) break numeric comparisons, and wrapping a date column in `CONVERT()` inside the `WHERE` makes large queries crawl.

**Fix:** convert the value safely, and compare dates against a computed value instead of converting the column.

```sql
SELECT o.SubscriberKey,
       TRY_CAST(REPLACE(o.Amount, ',', '.') AS DECIMAL(18,2)) AS AmountNum
FROM [Orders_DE] o
WHERE o.OrderDate >= DATEADD(DAY, -30, GETDATE())
```

## 7. Empty strings are not `NULL`

**Problem:** a filter like `WHERE Phone IS NULL` misses records that have no phone.

**Why:** imports and AMPscript writes often store an empty string, not `NULL`.

**Fix:** check both: `WHERE c.Phone IS NULL OR c.Phone = ''` (or `NULLIF(c.Phone, '') IS NULL`).

## 8. Query Studio and comments

**Problem:** a query that runs in a Query Activity fails in Query Studio.

**Fix:** remove `--` comments before running a query in Query Studio, and keep explanations in documentation instead of inside the query.

## 9. "Today" is yesterday until 3 AM

**Problem:** a daily query scheduled just after midnight (Brasília) selects yesterday's records.

**Why:** `GETDATE()` returns US Central time (UTC−6), three hours behind Brasília.

**Fix:** convert explicitly: `CAST(DATEADD(HOUR, 3, GETDATE()) AS DATE)` for "today in Brasília". Patterns in [dates and time zones](../sql/dates-and-time-zones.md).

## 10. Data Views only see one business unit

**Problem:** a "never emailed" or "inactive" list includes people who are emailed every week.

**Why:** `_Sent`, `_Open` and `_Click` return the data of the BU where the query runs. `ENT._Subscribers` covers the whole enterprise.

**Fix:** collect keys from every sending BU into a shared DE first, then compare. See [hygiene](../sql/hygiene/).

[← Back to contents](README.md)
