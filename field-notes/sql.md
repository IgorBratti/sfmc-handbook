# SQL in Query Activities

[← Back to contents](README.md)

## 1. Common Table Expressions (`WITH`) are rejected

**Problem:** a query that uses `WITH cte AS (...)` fails validation in a Query Activity.

**Why:** the SFMC query parser accepts a subset of T-SQL, and CTEs are not part of it.

**Fix:** move the CTE into a derived table (a subquery in the `FROM`).

```sql
SELECT x.SubscriberKey, x.TotalSends
FROM (
    SELECT SubscriberKey, COUNT(*) AS TotalSends
    FROM _Sent
    GROUP BY SubscriberKey
) x
WHERE x.TotalSends >= 5
```

## 2. Deduplicate with `ROW_NUMBER`, not `GROUP BY`

**Problem:** `GROUP BY SubscriberKey` with `MAX(Email)`, `MAX(Phone)`, `MAX(UpdatedAt)` returns rows that never existed: each `MAX` is computed on its own, so the email can come from one record and the phone from another.

**Fix:** rank the records per key and keep the first one. The whole row comes from the same record.

```sql
SELECT x.SubscriberKey, x.EmailAddress, x.Phone, x.UpdatedAt
FROM (
    SELECT SubscriberKey, EmailAddress, Phone, UpdatedAt,
           ROW_NUMBER() OVER (PARTITION BY SubscriberKey ORDER BY UpdatedAt DESC) AS rn
    FROM [Source_DE]
) x
WHERE x.rn = 1
```

## 3. Replace `NOT EXISTS` with a staging DE and an anti-join

**Problem:** a correlated `NOT EXISTS` against a multi-million-row data extension runs until the Query Activity times out.

**Why:** SFMC only indexes the **primary key** fields of a data extension. A correlated subquery on non-key columns scans the table again and again.

**Fix:** split it in two steps.

1. Write the keys to exclude into a staging DE whose **primary key is the join column**.
2. Anti-join against it.

```sql
SELECT SubscriberKey FROM [Unsubscribes_DE]
UNION
SELECT SubscriberKey FROM [Complaints_DE]
```

```sql
SELECT a.SubscriberKey, a.EmailAddress
FROM [Audience_DE] a
LEFT JOIN [Exclusion_Staging_DE] e ON e.SubscriberKey = a.SubscriberKey
WHERE e.SubscriberKey IS NULL
```

## 4. Watch out for JOIN fan-out on partial keys

**Problem:** the target DE ends up with more rows than the audience, or the query fails on duplicate primary keys.

**Why:** joining a relationship table on only part of its key (for example, only the company ID when the real key is company ID + contact ID) multiplies rows.

**Fix:** join on the full composite key, or deduplicate the relationship table first (see note 2).

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
SELECT SubscriberKey,
       TRY_CAST(REPLACE(Amount, ',', '.') AS DECIMAL(18,2)) AS AmountNum
FROM [Orders_DE]
WHERE OrderDate >= DATEADD(DAY, -30, GETDATE())
```

## 7. Empty strings are not `NULL`

**Problem:** a filter like `WHERE Phone IS NULL` misses records that have no phone.

**Why:** imports and AMPscript writes often store an empty string, not `NULL`.

**Fix:** check both.

```sql
SELECT SubscriberKey
FROM [Contacts_DE]
WHERE Phone IS NULL OR Phone = ''
```

## 8. Query Studio and comments

**Problem:** a query that runs in a Query Activity fails in Query Studio.

**Fix:** remove `--` comments before running a query in Query Studio, and keep explanations in documentation instead of inside the query.
