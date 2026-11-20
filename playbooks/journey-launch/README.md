# Journey launch

> **Status: v1.0.** The checklist I run before activating a journey or a new version, and the first-24-hours routine after it.

| | |
|---|---|
| **Type** | Playbook (checklist) |
| **Level** | Intermediate |
| **Stack** | Journey Builder, Automation Studio, Content Builder, SQL |
| **Time** | 30–60 min per journey |

Design guidance lives in the [Journey Builder guide](../../journey-builder/). This playbook is about not breaking production.

## 1. Before activation

### Entry
- [ ] Entry source points to the right DE / event / segment, **in the right business unit**
- [ ] Entry schedule (or automation) tested end to end: query → DE → journey
- [ ] "Evaluate new records only" vs "all records" matches the business rule
- [ ] Re-entry setting matches the rule (none / anytime / after exiting)
- [ ] Entry filter tested with one contact that should enter and one that shouldn't
- [ ] API Event: payload fields match the event DE; the calling system has the right event key

### Audience and exclusions
- [ ] Unsubscribed, held and bounced contacts excluded (status and suppression lists)
- [ ] Business exclusions applied: customers, contacts active in competing journeys, do-not-contact lists
- [ ] Frequency rules applied (cap or Einstein Engagement Frequency)
- [ ] Expected volume agreed with the requester and compared with the actual entry count of a dry run

### Flow
- [ ] Every Decision Split has a remainder path, ordered from specific to general
- [ ] Journey Data vs Contact Data chosen on purpose in every split and exit
- [ ] Waits and send windows respect the audience's time zone and quiet hours
- [ ] Exit criteria cover unsubscribed, converted and disqualified contacts
- [ ] Goal configured with the metric the business will judge
- [ ] Einstein STO / Engagement Frequency decided (on or off, and why)

### Content
- [ ] Personalization tested with full, partial and empty data
- [ ] Links, UTMs and aliases checked; CloudPage links signed when they carry identities
- [ ] Sender profile, delivery profile and send classification correct (commercial vs transactional)
- [ ] WhatsApp/SMS templates approved; variables mapped from the right data
- [ ] Rendering checked on desktop, mobile and dark mode

### Governance
- [ ] Names follow the convention (`<BU>_JRN_<OBJECTIVE>_<DETAIL>`) for journey, emails, DEs and automations
- [ ] Owner, purpose and version documented in the journey description
- [ ] Stakeholder approval recorded

## 2. Activation

1. Activate during working hours, when someone can watch the first entries.
2. If the entry is large, start with a restricted entry (filter on a small test segment or a first batch) and widen it after checking.
3. For a new version: decide what happens to contacts in the old version (let it finish, or stop it).

## 3. First 24 hours

| When | Check |
|---|---|
| First entries | Contacts entered match the expected profile (spot-check 5–10 records) |
| First sends | Test addresses seeded in the audience received the right version |
| First hours | Error count in the journey, bounces and unsubscribes in line with similar sends |
| Next day | Entry count vs forecast; [journey KPIs](../../sql/kpis/journey-email-performance.sql) |

## 4. Rollback plan

| Problem | Action |
|---|---|
| Wrong audience entering | Pause the entry source / automation; remove contacts with the [contact exit API](../../apis/rest-reference.md#remove-contacts-from-a-journey) |
| Wrong content | Fix the email (changes apply to future sends); create a new version if the flow is wrong |
| Data issue upstream | Stop the feeding automation; fix; re-run; re-enable entry |

[← All playbooks](../README.md)
