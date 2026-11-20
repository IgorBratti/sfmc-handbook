# Journey Builder

> **Type:** Guide · How to design journeys that send the right message to the right contact, survive data changes and can be monitored. Launch checklist: [journey launch playbook](../playbooks/journey-launch/).

[← Back to the handbook](../README.md)

**Contents:** [Entry sources](#1-entry-sources) · [Data in a journey](#2-data-in-a-journey) · [Flow control](#3-flow-control) · [Leaving a journey](#4-leaving-a-journey-exit-criteria-and-goals) · [Re-entry](#5-re-entry) · [Channels](#6-channels-and-send-settings) · [Einstein and testing](#7-einstein-and-testing) · [Versions](#8-versions-and-changes) · [Monitoring](#9-monitoring) · [Design checklist](#design-checklist)

---

## 1. Entry sources

| Source | How contacts enter | Best for | Watch out |
|---|---|---|---|
| **Data Extension** | On a schedule or when an automation finishes | Batch audiences built with SQL | Choose "new records only" vs "all records" on purpose |
| **API Event** | A system calls `POST /interaction/v1/events` ([REST](../apis/rest-reference.md#fire-an-entry-event-api-event-entry-source)) | Real-time triggers (signup, purchase, form) | The event DE grows forever: add a retention policy |
| **Salesforce Data** | Record created/updated in Sales/Service Cloud (MC Connect) | CRM-driven journeys | Entry criteria evaluated on the Salesforce side; test with real record changes |
| **CloudPages Smart Capture** | Form submission | Simple forms without custom code | Less control than a custom CloudPage |
| **Audience (Contact Builder / Data Cloud segments)** | Segment membership | Segments maintained outside SQL | Refresh schedule defines latency |
| **Automation (Fire Event)** | Automation step pushes a DE into the journey | Entry right after a query pipeline | Keep query → entry in the same automation for ordering |

## 2. Data in a journey

| | Journey Data | Contact Data |
|---|---|---|
| What | Snapshot of the entry record | Live value in Contact Builder (attribute groups) |
| Changes during the journey | Never | Yes |
| Use in | Personalization that must match the trigger (order ID, offer at entry) | Splits and exits that depend on current state (purchased, unsubscribed, segment) |

- One-to-many relationships in Contact Data: a split condition is true if **any** related record matches.
- WhatsApp and SMS template variables usually come from Journey Data ([field note](../field-notes/whatsapp.md)).
- Email content reads the sendable data at send time through AMPscript, so `Lookup` in the email always sees current DE values.

## 3. Flow control

| Activity | Use | Tip |
|---|---|---|
| **Wait by duration** | Fixed delays (2 days) | Combine with send windows to avoid night sends |
| **Wait until date / by attribute** | Event-based timing (3 days before renewal) | Attribute must be a Date. Test contacts with empty and past dates: they won't wait the way you expect |
| **Wait until event** | Pause until a system signals something | Set a timeout path |
| **Decision Split** | Rules on Journey or Contact Data | Order paths from most specific to most general; always keep a remainder path |
| **Engagement Split** | Opened / clicked a previous email | Opens are unreliable (privacy features): prefer clicks |
| **Random Split** | Holdouts, simple A/B | Percentages fixed at publish time |
| **Path Optimizer** | A/B/n with automatic winner | Decide the metric and duration first |
| **Join** | Merge paths | Keeps the canvas readable |
| **Update Contact** | Write a value to a DE when the contact passes | Great for logging milestones |

## 4. Leaving a journey: exit criteria and goals

| | Exit criteria | Goal |
|---|---|---|
| Purpose | Remove contacts who no longer qualify | Measure conversion (optionally remove converters) |
| Evaluated | When contacts move between activities, typically after each **wait** | Per goal settings, using Contact Data |
| Typical rule | Unsubscribed, became a customer, no longer in segment | Purchased, activated, signed contract |

Because evaluation happens at waits, put a short wait or a Decision Split right before any send that must respect the latest data.

## 5. Re-entry

| Setting | Behavior | Use for |
|---|---|---|
| No re-entry | A contact enters once | Onboarding, one-off campaigns |
| Re-entry anytime | Can be in the journey several times at once | Transactional-style flows (each order) |
| Re-entry only after exiting | One active instance per contact | Recurring nurtures, reactivation cycles |

With "re-entry anytime", personalize from Journey Data (the order that triggered this instance), not from a lookup that may return another order.

## 6. Channels and send settings

- **Email:** send classification, sender profile and suppression lists set per activity. Respect commercial vs transactional ([Content Builder guide](../emails/content-builder-guide.md#2-profiles-and-classifications)).
- **SMS / WhatsApp:** opt-in rules, approved templates, send windows by local time.
- **Default email/mobile attribute** in journey settings: point it to the field your audience really uses.
- **Send windows:** avoid nights and weekends for commercial messages unless the business says otherwise.

## 7. Einstein and testing

| Feature | Use | Caveat |
|---|---|---|
| Send Time Optimization (STO) | Per-contact send time within a window | Shifts volume across hours; downstream waits start later |
| Engagement Frequency split | Route saturated contacts to fewer messages | Combine with your own frequency cap |
| Engagement Scoring splits | Route by predicted engagement | Needs enough history |
| Path Optimizer | Test content or cadence inside the journey | Statistical significance needs volume |

## 8. Versions and changes

- A running journey can't be edited; you create a **new version**. Contacts already in the old version finish there.
- Changing an entry DE's fields, an email's data dependencies or a split's attribute can break running versions. Test the new version with a copy of the entry source.
- Keep the journey **key** stable and descriptive (`B2C_JRN_ONB_Welcome`). Reports group by `JourneyID`, names change.
- Stop old versions deliberately; "Finishing" versions keep sending until their contacts exit.

## 9. Monitoring

| What | How |
|---|---|
| Entries vs expected | Entry source counts; compare with the DE/automation output |
| Sends and clicks per journey | [journey-email-performance.sql](../sql/kpis/journey-email-performance.sql) |
| Running journeys | [running-journeys.sql](../sql/kpis/running-journeys.sql) |
| Feeding automations | [monitoring queries](../sql/monitoring/) |
| Contact-level history | Journey Builder history (about 30 days); log milestones with Update Contact for longer |

## Design checklist

- [ ] One clear objective and one goal metric
- [ ] Entry source and re-entry setting match the business rule
- [ ] Every split has a remainder path
- [ ] Exit criteria cover unsubscribed, converted and disqualified contacts
- [ ] Journey Data vs Contact Data chosen on purpose for every split and personalization
- [ ] Send windows and time zones checked
- [ ] Naming follows the convention (`<BU>_JRN_<OBJECTIVE>_<DETAIL>`)
- [ ] Launch with the [journey launch playbook](../playbooks/journey-launch/)

[← Back to the handbook](../README.md)
