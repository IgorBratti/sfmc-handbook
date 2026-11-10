# Audiences

Ready-made audience queries. Status of every query in this folder: **Ready to test**.

## frequency-cap.sql

Removes from an audience everyone who already received **3 or more emails in the last 7 days**. Run it as the last step before a send or journey entry.

- Change `>= 3` and `-7` to match your frequency policy.
- Run it in the same business unit as the sends you want to count (Data Views are per BU).

**Target DE:** your final audience, same fields as `Audience_DE` · **Overwrite**.

## birthdays-today.sql

Contacts whose birthday is today, for a daily birthday journey (pairs with the [birthday page](../../cloudpages/birthday-page/)).

- `GETDATE()` returns US Central Time; `DATEADD(HOUR, 3, ...)` uses Brasília time so the date flips at local midnight. Adjust for your time zone.
- Schedule the automation early in the morning, local time.
- People born on February 29 only appear in leap years; add a rule for them if that matters to you.

**Target DE:** `Birthdays_Today` · `SubscriberKey` (Text 254, PK), `EmailAddress` (EmailAddress), `FirstName` (Text 100) · **Overwrite**, daily.

[← SQL & Data Views](../README.md)
