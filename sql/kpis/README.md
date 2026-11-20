# KPIs

Status of every query in this folder: **Ready to test**. Run each one in the business unit whose sends you want to measure: Data Views only show that BU's data.

## monthly-email-kpis.sql

Sends, unique clicks and hard bounces per month (`YYYY-MM`), with click rate and hard-bounce rate in %.

**Target DE:** `Email_KPIs_Monthly` · `YearMonth` (Text 7, PK), `Sends`, `UniqueClicks`, `HardBounces` (Number), `ClickRate`, `HardBounceRate` (Decimal 6,2) · **Overwrite**.

- Opens are left out on purpose: Apple Mail Privacy Protection inflates them; unique clicks are a more reliable signal.
- Months use server time (UTC−6). For local months, see [dates-and-time-zones.md](../dates-and-time-zones.md#month-buckets-in-local-time).
- The oldest month is partial because of the ~6-month retention.

## journey-email-performance.sql

Email sends, unique clicks and click rate per journey, grouped by `JourneyID` so renamed journeys and new versions stay together.

**Target DE:** `Journey_Email_KPIs` · `JourneyID` (Text 36, PK), `JourneyName` (Text 200), `Sends`, `UniqueClicks` (Number), `ClickRate` (Decimal 6,2) · **Overwrite**.

How it links: `_Sent.TriggererSendDefinitionObjectID` → `_JourneyActivity.JourneyActivityObjectID` → `_JourneyActivity.VersionID` → `_Journey.VersionID`.

## unsubscribe-complaint-rates.sql

Sends, unsubscribes and spam complaints per month, with both rates in % (3 decimals, because healthy rates are small).

**Target DE:** `Email_Health_Monthly` · `YearMonth` (Text 7, PK), `Sends`, `Unsubscribes`, `Complaints` (Number), `UnsubscribeRate`, `ComplaintRate` (Decimal 6,3) · **Overwrite**.

Reference points: keep complaints well below 0.1%; Gmail's bulk sender guidelines treat 0.3% as the limit. Events are counted in the month they happened, not the month of the send.

## bounces-by-category-domain.sql

Bounces in the last 30 days by category and recipient domain. A spike of **block bounces on one domain** (for example, only Outlook) usually points to a reputation or authentication problem with that provider, not to bad addresses.

**Target DE:** `Bounces_By_Domain` · `BounceCategory` (Text 50, PK), `Domain` (Text 254, PK), `Bounces`, `Contacts` (Number) · **Overwrite**.

## best-send-time.sql

Unique click rate by weekday and hour of the send, over the last 90 days.

- `DATEADD(HOUR, 3, …)` converts server time (UTC−6) to Brasília time (UTC−3). Change the `3` for other zones.
- `DATENAME(WEEKDAY, …)` returns the weekday name in the server language (English).
- It joins `_Sent` and `_Click` on the full send key (`JobID`, `ListID`, `BatchID`, `SubscriberID`), so each click is counted at the hour the email was **sent**.

**Target DE:** `Best_Send_Time` · `SendWeekday` (Text 10, PK), `SendHour` (Number, PK), `Sends`, `UniqueClicks` (Number), `ClickRate` (Decimal 6,2) · **Overwrite**.

Compare the result with what Einstein Send Time Optimization is doing before changing send windows.

## running-journeys.sql

Number of journeys with at least one version in `Running` status. Good for a monitoring dashboard.

**Target DE:** `Running_Journeys` · `RunningJourneys` (Number) · **Overwrite**.

## sms-monthly-kpis.sql

SMS sent, delivered and undelivered (outbound messages), opt-outs (any direction) and delivery rate per month, from `_SMSMessageTracking`.

**Target DE:** `SMS_KPIs_Monthly` · `YearMonth` (Text 7, PK), `Sent`, `Delivered`, `Undelivered`, `OptOuts` (Number), `DeliveryRate` (Decimal 6,2) · **Overwrite**.

Delivery receipts depend on the carrier and country; a "sent but neither delivered nor undelivered" message usually means no receipt came back.

[← SQL & Data Views](../README.md)
