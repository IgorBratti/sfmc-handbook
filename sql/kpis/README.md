# KPIs

Status of every query in this folder: **Ready to test**.

## monthly-email-kpis.sql

Sends, unique clicks and hard bounces per month (`YYYY-MM`), with click rate and hard-bounce rate in %.

**Target DE:** `Email_KPIs_Monthly` · fields `YearMonth` (Text 7, PK), `Sends`, `UniqueClicks`, `HardBounces` (Number), `ClickRate`, `HardBounceRate` (Decimal 6,2) · action **Overwrite**.

Notes:
- Run it in each business unit: Data Views in a child BU only show that BU's sends.
- Opens are left out on purpose. Apple Mail Privacy Protection inflates them; unique clicks are a more reliable signal.

## journey-email-performance.sql

Email sends, unique clicks and click rate per journey, grouped by `JourneyID` so renamed journeys and new versions stay together.

**Target DE:** `Journey_Email_KPIs` · `JourneyID` (Text 36, PK), `JourneyName` (Text 200), `Sends`, `UniqueClicks` (Number), `ClickRate` (Decimal 6,2) · **Overwrite**.

How it links: `_Sent.TriggererSendDefinitionObjectID` → `_JourneyActivity.JourneyActivityObjectID` → `_JourneyActivity.VersionID` → `_Journey.VersionID`.

## running-journeys.sql

Number of journeys with at least one version in `Running` status. Good for a monitoring dashboard.

## unsubscribe-complaint-rates.sql

Sends, unsubscribes and spam complaints per month, with both rates in % (3 decimals, because healthy rates are small).

**Target DE:** `Email_Health_Monthly` · `YearMonth` (Text 7, PK), `Sends`, `Unsubscribes`, `Complaints` (Number), `UnsubscribeRate`, `ComplaintRate` (Decimal 6,3) · **Overwrite**.

Reference points used by mailbox providers: keep complaints well below 0.1% (Gmail's bulk sender guidelines warn at 0.3%).

## bounces-by-category-domain.sql

Bounces in the last 30 days by category (`Hard bounce`, `Soft bounce`, `Block bounce`, `Technical/Other bounce`, `Unknown bounce`) and recipient domain. A spike of **block bounces on one domain** (for example, only Outlook) usually points to a reputation or authentication problem with that provider, not to bad addresses.

**Target DE:** `Bounces_By_Domain` · `BounceCategory` (Text 50, PK), `Domain` (Text 254, PK), `Bounces`, `Contacts` (Number) · **Overwrite**.

## best-send-time.sql

Unique click rate by weekday and hour of the send, over the last 90 days.

- Data Views store times in US Central Time (UTC−6, no daylight saving). `DATEADD(HOUR, 3, ...)` converts to Brasília time (UTC−3). Change the `3` for other time zones.
- `DATENAME(WEEKDAY, ...)` returns the weekday name in the server language (English).
- It joins `_Sent` and `_Click` on the full send key (`JobID`, `ListID`, `BatchID`, `SubscriberID`), so each click is counted at the hour the email was **sent**, not the hour it was clicked.

**Target DE:** `Best_Send_Time` · `SendWeekday` (Text 10, PK), `SendHour` (Number, PK), `Sends`, `UniqueClicks` (Number), `ClickRate` (Decimal 6,2) · **Overwrite**.

Use the result to choose send windows, or compare it with what Einstein Send Time Optimization is doing.
