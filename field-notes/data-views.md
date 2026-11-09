# Data Views and data retention

[← Back to contents](README.md)

## How long each source keeps data

These are the windows I work with in practice. Retention can vary by account and contract, so confirm in your own org before you rely on them.

| Source | What it holds | Window |
|---|---|---|
| Journey History (UI/API) | Contact-level journey history | ~30 days |
| Tracking Data Views (`_Sent`, `_Open`, `_Click`, `_Bounce`, `_Unsubscribe`…) | Email events | ~6 months, rolling |
| `_Journey`, `_JourneyActivity` | Journey and activity metadata | Not purged on the 6-month cycle |
| Intelligence Reports | Aggregated reporting | ~2 years |

## Practical consequences

- Anything you need for more than 6 months (for example, last engagement date per contact) must be **copied into your own data extension** on a schedule.
- Journey and activity metadata can be joined with tracking views to report sends per journey (see [`../sql`](../sql/)).
