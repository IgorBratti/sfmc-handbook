# Dates and time zones in SQL

> **Type:** Guide · Why "today" in a query is often yesterday, and the patterns that get dates right.

[← SQL](README.md)

---

## Which clock does each value use?

| Source | Time zone |
|---|---|
| `GETDATE()` | US Central, **UTC−6, no daylight saving** (Windows zone `Central America Standard Time`) |
| `GETUTCDATE()` | UTC |
| Tracking and journey Data Views (`EventDate`, `CreatedDate`…) | Same as `GETDATE()` |
| Automation Data Views (`…_UTC` fields), `_BusinessUnitUnsubscribes.UnsubDateUTC` | UTC |
| AMPscript `Now()` and SSJS `Platform.Function.Now()` writes | Same as `GETDATE()` |
| Imported files and API loads | Whatever the source system sent. Document it per field |

Brasília is UTC−3 (no daylight saving since 2019), so it is **3 hours ahead** of the server clock.

## Convert

**Fixed offset** (simple and fast; fine for Brazil today):

```sql
DATEADD(HOUR, 3, s.EventDate)                    /* server time → Brasília */
```

**`AT TIME ZONE`** (handles daylight saving for zones that have it):

```sql
CAST(s.EventDate AT TIME ZONE 'Central America Standard Time'
                 AT TIME ZONE 'E. South America Standard Time' AS DATETIME)   /* server → Brasília */

CAST(a.AutomationInstanceStartTime_UTC AT TIME ZONE 'UTC'
                 AT TIME ZONE 'E. South America Standard Time' AS DATETIME)   /* UTC → Brasília */
```

The first `AT TIME ZONE` labels the value with its real zone; the second converts it. `CAST(… AS DATETIME)` drops the offset so the result fits a Date field. Other common zones: `UTC`, `Eastern Standard Time`, `GMT Standard Time` (UK), `Central European Standard Time`.

## Patterns

### Local "today" and "yesterday"

```sql
CAST(DATEADD(HOUR, 3, GETDATE()) AS DATE)                    /* today in Brasília */
DATEADD(DAY, -1, CAST(DATEADD(HOUR, 3, GETDATE()) AS DATE))  /* yesterday in Brasília */
```

### Events from "yesterday, local time" without converting every row

Convert the **boundaries** to server time, not the column. The filter stays sargable on large views.

```sql
SELECT s.SubscriberKey, s.EventDate
FROM _Sent s
WHERE s.EventDate >= DATEADD(HOUR, -3, CAST(DATEADD(DAY, -1, CAST(DATEADD(HOUR, 3, GETDATE()) AS DATE)) AS DATETIME))
  AND s.EventDate <  DATEADD(HOUR, -3, CAST(CAST(DATEADD(HOUR, 3, GETDATE()) AS DATE) AS DATETIME))
```

Read it as: local midnight (yesterday / today) shifted back 3 hours into server time.

### Rolling window vs calendar days

| Need | Filter |
|---|---|
| Last 24 hours, whatever the time | `EventDate >= DATEADD(HOUR, -24, GETDATE())` |
| Last 7 full local days | Boundaries as above, with `-7` instead of `-1` |

Automations scheduled early in the morning (local) run late in the evening in server time. Calendar-day logic written with `GETDATE()` alone will be off by one day for part of the day.

### Month buckets in local time

```sql
CONVERT(CHAR(7), DATEADD(HOUR, 3, s.EventDate), 120)   /* 'YYYY-MM' in Brasília time */
```

### Birthdays today (local), with 29 February

```sql
SELECT c.SubscriberKey
FROM [Customers_DE] c
WHERE c.BirthDate IS NOT NULL
  AND (
        (MONTH(c.BirthDate) = MONTH(DATEADD(HOUR, 3, GETDATE()))
         AND DAY(c.BirthDate) = DAY(DATEADD(HOUR, 3, GETDATE())))
     OR (MONTH(c.BirthDate) = 2 AND DAY(c.BirthDate) = 29
         AND MONTH(DATEADD(HOUR, 3, GETDATE())) = 2 AND DAY(DATEADD(HOUR, 3, GETDATE())) = 28
         AND DAY(EOMONTH(DATEADD(HOUR, 3, GETDATE()))) = 28)
      )
```

People born on 29 February are greeted on 28 February in non-leap years.

### Age in full years

`DATEDIFF(YEAR, BirthDate, GETDATE())` counts year boundaries, so someone born in December is "a year older" all year. Correct version:

```sql
DATEDIFF(YEAR, c.BirthDate, GETDATE())
  - CASE WHEN DATEADD(YEAR, DATEDIFF(YEAR, c.BirthDate, GETDATE()), c.BirthDate) > GETDATE() THEN 1 ELSE 0 END AS Age
```

### Text dates from imports

```sql
TRY_CONVERT(DATE, c.BirthDateText, 103)   /* 'dd/mm/yyyy' (Brazilian) → DATE; NULL when invalid */
TRY_CONVERT(DATE, c.BirthDateText, 23)    /* 'yyyy-mm-dd' (ISO) */
```

## Document it

For every Date field in your data model, write down which zone it's in. Most "wrong date" incidents are two fields in different zones compared as if they were the same.

[← SQL](README.md)
