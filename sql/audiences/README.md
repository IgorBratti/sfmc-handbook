# Audiences

Ready-made audience queries. Status of every query in this folder: **Ready to test**.

## frequency-cap.sql

Removes from an audience everyone who already received **3 or more emails in the last 7 days**. Run it as the last step before a send or journey entry.

**Target DE:** your final audience, same fields as `Audience_DE` · **Overwrite**.

- Change `>= 3` and `-7` to match your frequency policy.
- Run it in the same business unit as the sends you want to count (Data Views are per BU).
- `_Sent` counts **every** email, transactional ones included. If order confirmations or password resets shouldn't count toward the cap, join `_Job` and filter on its send classification, or exclude their `TriggeredSendCustomerKey` values.
- Einstein Engagement Frequency in Journey Builder is the dynamic alternative; this query is the transparent, rule-based one.

## birthdays-today.sql

Contacts whose birthday is today in Brasília time, for a daily birthday journey (pairs with the [birthday page](../../cloudpages/birthday-page/)).

**Target DE:** `Birthdays_Today` · `SubscriberKey` (Text 254, PK), `EmailAddress` (EmailAddress), `FirstName` (Text 100) · **Overwrite**, daily.

- `DATEADD(HOUR, 3, GETDATE())` turns server time (UTC−6) into Brasília time (UTC−3), so the date flips at local midnight. Adjust for your time zone.
- People born on 29 February are included on 28 February in non-leap years.
- Schedule the automation early in the morning, local time, and the journey entry right after it.

[← SQL & Data Views](../README.md)
