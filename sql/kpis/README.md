# KPIs

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
