# Query Activity reference

> **Type:** Reference · What Marketing Cloud SQL accepts, how the data actions behave, the limits that cause failures and the habits that keep large queries fast.

[← SQL](README.md) · Data Views: [data-views.md](data-views.md)

---

## How a Query Activity works

A Query Activity runs one `SELECT` and writes the result into a **target data extension** using a **data action**. There is no `INSERT`, `UPDATE` or `DELETE` statement: the data action decides what happens to the target.

| Data action | What it does | Requirements and traps |
|---|---|---|
| **Overwrite** | Empties the target, then inserts the result | Result must not contain duplicate primary keys |
| **Update** | Updates rows whose primary key exists, inserts the others | Target **must** have a primary key. Rows not in the result stay untouched |
| **Append** | Inserts the result | A primary-key collision fails the run |

Column mapping is **by name**: every selected column must exist in the target with a compatible type and length. Target columns you don't select are left empty (or get their default).

## Language: a subset of T-SQL

Marketing Cloud SQL is based on SQL Server T-SQL, restricted to a single `SELECT`.

### Works

| Area | Examples |
|---|---|
| Clauses | `SELECT`, `FROM`, `JOIN` (inner, left, right, full, cross), `WHERE`, `GROUP BY`, `HAVING`, `UNION` / `UNION ALL`, derived tables (subqueries in `FROM`), `EXISTS` / `IN` subqueries, `TOP` |
| Strings | `LEFT`, `RIGHT`, `SUBSTRING`, `LEN`, `CHARINDEX`, `PATINDEX`, `REPLACE`, `LTRIM`, `RTRIM`, `UPPER`, `LOWER`, `CONCAT`, `STUFF` |
| Conversion | `CAST`, `CONVERT`, `TRY_CAST`, `TRY_CONVERT` |
| Dates | `GETDATE`, `GETUTCDATE`, `DATEADD`, `DATEDIFF`, `DATEPART`, `DATENAME`, `EOMONTH`, `DATEFROMPARTS`, `AT TIME ZONE` |
| Logic | `CASE`, `IIF`, `COALESCE`, `ISNULL`, `NULLIF` |
| Aggregates | `COUNT`, `COUNT(DISTINCT …)`, `SUM`, `MIN`, `MAX`, `AVG` |
| Window functions | `ROW_NUMBER`, `RANK`, `DENSE_RANK`, `NTILE` with `OVER (PARTITION BY … ORDER BY …)` |
| Other | `NEWID()`, `CHECKSUM`, `ABS` |

### Doesn't work (or isn't reliable)

| Not available | Use instead |
|---|---|
| CTEs (`WITH … AS`) | Derived tables: `FROM (SELECT …) x` |
| Variables (`DECLARE @x`), temp tables, cursors, procedures | Staging data extensions and several Query Activities in sequence |
| `INSERT`, `UPDATE`, `DELETE`, `MERGE` | The data action of the activity |
| `ORDER BY` without `TOP` | Order only with `TOP n`, or inside `ROW_NUMBER() OVER (…)` |
| `SELECT *` into a target | List columns explicitly (it also documents the mapping) |
| `--` comments in Query Studio | Keep explanations in documentation; `/* */` is safer if you must comment |

Newer T-SQL functions (`STRING_AGG`, `STRING_SPLIT`, `TRIM`, `LAG` / `LEAD`) may or may not be accepted by the parser. Test them in Query Studio before relying on them.

## Limits that cause failures

| Limit | Effect | Mitigation |
|---|---|---|
| **30-minute timeout** | The activity fails; check the target before anything downstream uses it | Index-friendly joins, staging DEs, split the work into steps |
| **Field length** | "String or binary data would be truncated" | `LEFT(field, n)` to the target length, or widen the target field |
| **Primary-key duplicates** | Overwrite/Append fail | Deduplicate with `ROW_NUMBER` ([pattern](patterns/dedup-row-number.sql)) |
| **Type mismatch** | Conversion errors on text dates or numbers | `TRY_CAST` / `TRY_CONVERT` and filter out the `NULL`s |
| **Ambiguous column names** | Validation error | Prefix every column with its table alias |

## Type mapping

| Data extension type | SQL type | Notes |
|---|---|---|
| Text (n) | `NVARCHAR(n)` | Unicode |
| Number | `INT` | Whole numbers only |
| Decimal (p, s) | `DECIMAL(p, s)` | |
| Date | `DATETIME` | No time zone: decide and document it |
| Boolean | `BIT` | Compare with `= 1` / `= 0` |
| EmailAddress | `NVARCHAR(254)` | |
| Phone | `NVARCHAR(50)` | |
| Locale | `NVARCHAR(5)` | |

## Naming and scope

- Data extensions with spaces or special characters need brackets: `[My DE]`. Brackets everywhere are a good habit.
- Shared data extensions from a child BU: `ENT.[Shared_DE]`.
- Data Views don't need brackets: `_Sent`, `ENT._Subscribers`.
- The query runs as the BU where the activity lives: Data Views return that BU's data.

## Performance habits

1. **Join on primary keys.** Marketing Cloud indexes primary-key fields. Make the join column the PK of staging DEs.
2. **Keep filters sargable.** `WHERE EventDate >= DATEADD(DAY, -30, GETDATE())` uses the column as is; `WHERE CONVERT(DATE, EventDate) = …` converts every row first.
3. **Filter early, in derived tables,** before joining large sets.
4. **Avoid correlated `NOT EXISTS` on millions of rows.** Use a keyed staging DE and a `LEFT JOIN … IS NULL` ([pattern](patterns/)).
5. **Aggregate before joining** when you only need counts or the latest date.
6. **Split complex logic into steps** writing to staging DEs (with a data retention policy so they don't grow forever). Each step is easier to test and less likely to time out.
7. **Watch `OR` across different columns**; a `UNION` of two simple queries is often faster.

## Before you activate

- [ ] Run the `SELECT` in Query Studio and check the row count
- [ ] Target DE: PK matches the action (Update needs one; Overwrite needs unique keys in the result)
- [ ] Every selected column exists in the target with a compatible type and length
- [ ] Time windows stay inside the Data View retention (~6 months)
- [ ] The query is documented (purpose, target, action, schedule) in the DE description or your docs

[← SQL](README.md)
