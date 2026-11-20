# Data Views and data retention

> **Type:** Field notes · The retention windows I plan around. Full reference with fields and joins: [Data Views reference](../sql/data-views.md).

[← Back to contents](README.md)

## How long each source keeps data

These are the windows I work with in practice. Retention can vary by account and contract, so confirm in your own org before you rely on them.

| Source | What it holds | Window |
|---|---|---|
| Journey Builder history (UI/API) | Contact-level journey history | ~30 days |
| Tracking Data Views (`_Sent`, `_Open`, `_Click`, `_Bounce`, `_Unsubscribe`…) | Email events | ~6 months, rolling |
| `_Journey`, `_JourneyActivity` | Journey and activity metadata | Not purged on the 6-month cycle |
| `_AutomationInstance`, `_AutomationActivityInstance` | Automation and activity runs | ~31 days |
| Intelligence Reports | Aggregated reporting | Longer than Data Views (check your contract) |

## Practical consequences

- Anything you need for more than 6 months (for example, last engagement date per contact) must be **copied into your own data extension** on a schedule ([recipe](../sql/data-views.md#last-engagement-date-per-contact-keep-it-beyond-6-months)).
- Journey and activity metadata can be joined with tracking views to report sends per journey ([journey KPIs](../sql/kpis/journey-email-performance.sql)).
- Monitoring queries on automations should run at least daily: older runs disappear after about a month.

[← Back to contents](README.md)
