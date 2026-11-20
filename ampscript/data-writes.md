# Writing to data extensions

> **Type:** Guide + recipes · Insert, update, upsert, delete and claim rows from emails and CloudPages without duplicates, broken previews or lost history.

[← AMPscript](README.md)

---

## Pick the right function family

| You are in… | Use | Why |
|---|---|---|
| An email | `InsertDE`, `UpdateDE`, `UpsertDE`, `DeleteDE` | They run per subscriber **at send time** and are skipped in Preview |
| A CloudPage, SMS or other non-send context | `InsertData`, `UpdateData`, `UpsertData`, `DeleteData` | They run immediately and return the number of rows affected |

Using the wrong family is the most common reason for "it works in preview but not in the send" (or the opposite).

## Insert, update or upsert?

| Situation | Function |
|---|---|
| Every event is a new row (log, history, click record) | `InsertData` with a unique key (for example `GUID()`) |
| The row must already exist and you only change it | `UpdateData` |
| One row per key, created or refreshed | `UpsertData` |
| One row per key, but some fields must keep their first value (`CreatedAt`, first-touch `Source`) | `Lookup` → `InsertData` or `UpdateData` (below) |

### Keep "first" values

`UpsertData` overwrites every field you pass. When a field must keep its first value, decide explicitly:

```ampscript
%%[
SET @now = Now()
SET @existing = Lookup("Leads_DE", "EmailAddress", "EmailAddress", @email)

IF Empty(@existing) THEN
  InsertData("Leads_DE", "EmailAddress", @email, "Source", @source, "CreatedAt", @now, "UpdatedAt", @now)
ELSE
  UpdateData("Leads_DE", 1, "EmailAddress", @email, "LastSource", @source, "UpdatedAt", @now)
ENDIF
]%%
```

### Composite keys

The second argument of `UpdateData` / `UpsertData` is **how many key pairs** come next.

```ampscript
UpsertData("Enrollments_DE", 2,
  "SubscriberKey", @sk, "CourseId", @courseId,     /* 2 key pairs */
  "Status", "Enrolled", "UpdatedAt", Now())          /* fields to write */
```

## Log every send of an email

```ampscript
%%[
/* In the email. Runs at send time only. Email_Send_Log_DE: LogId (Text 36, PK), SubscriberKey, EmailName, JobId, SentAt */
InsertDE("Email_Send_Log_DE",
  "LogId", GUID(), "SubscriberKey", _subscriberkey,
  "EmailName", emailname_, "JobId", jobid, "SentAt", Now())
]%%
```

Use it only when Data Views are not enough (for example, to keep history beyond six months, or to record values computed at send time such as the offer chosen for the subscriber).

## Claim a unique value (coupons, codes)

```ampscript
%%[
SET @coupon = ClaimRowValue("Coupons_DE", "CouponCode", "IsClaimed", "", "SubscriberKey", _subscriberkey)
IF Empty(@coupon) THEN
  RaiseError("Coupon pool empty", true)   /* email: skip this subscriber instead of sending a broken message */
ENDIF
]%%
```

- The same key always gets the same row back, so re-renders are safe.
- The claim key fields (`SubscriberKey` above) are written to the claimed row.
- Keep the pool bigger than the audience and monitor it.

## Rules for CloudPages

- Write only when the form was submitted and the input is valid (`RequestParameter("submitted") == "1"`). AMPscript also runs on previews, crawlers and link scanners.
- Validate every value before writing it. See the [CloudPages security guide](../cloudpages/security.md).
- Use `@now = Now()` once and reuse it, so every date written by the same request is identical.

## Rules for emails

- Writes at send time multiply by the audience size. A `UpsertDE` in a 2M-row send is 2M writes: prefer Data Views or a post-send query when you can.
- Test with a real send to a small list: Preview doesn't execute the `…DE` functions.
- Guard on `_messagecontext` if the same block is also used on CloudPages.

[← AMPscript](README.md)
