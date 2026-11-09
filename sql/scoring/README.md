# Engagement scoring

## engagement-segments.sql

Puts every contact who received an email in the last 90 days into one segment:

| Segment | Rule |
|---|---|
| Champion | Clicked in the last 30 days and has 3+ unique clicks in 90 days |
| Engaged | Clicked in the last 90 days |
| Passive | Opened but didn't click in 90 days |
| At risk | No open and no click in 90 days |

**Target DE:** `Engagement_Segments` · `SubscriberKey` (Text 254, PK), `LastClick` (Date, nullable), `Clicks90`, `Opens90` (Number), `EngagementSegment` (Text 20) · **Overwrite**, daily.

How to use it:
- Decision Splits in Journey Builder (send less to *At risk*, more to *Champion*).
- Suppression for re-engagement campaigns.
- A simple, transparent complement to Einstein Engagement Scoring: anyone in the team can read the rules.

Thresholds are a starting point. Adjust them to your send frequency.
