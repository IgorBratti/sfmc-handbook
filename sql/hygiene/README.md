# Contact-base hygiene

Marketing Cloud contracts are priced by contact count. Inactive contacts cost money, hurt deliverability and slow down every query. This folder is the selection side of a hygiene process.

## The process

1. **Select** candidates with the queries below into a review DE (`Hygiene_Candidates`, PK `SubscriberKey`).
2. **Exclude** anyone you must keep: active customers, contacts in running journeys, records synced from Sales/Service Cloud, legal or business holds. Use the anti-join pattern in [`../patterns`](../patterns/).
3. **Back up** the final list (keys and the attributes you may need later) in a separate DE before deleting anything.
4. **Delete** with Contact Delete in Contact Builder or through the Contacts REST API, in batches. Deletion is permanent; test with a small batch first and respect the suppression period your account uses.
5. **Repeat** on a schedule, so the base doesn't grow back.

## Queries

### inactive-contacts.sql
Contacts who received at least 5 emails in the last 180 days and never opened or clicked.
Tune the window (max ~6 months, the Data Views limit) and the minimum number of sends.

**Target DE:** `Hygiene_Candidates` · `SubscriberKey` (Text 254, PK), `SendsLast180Days` (Number).

### never-sent-contacts.sql
Subscribers who joined more than 180 days ago and have no send in the Data Views window.
Uses `ENT._Subscribers`, the enterprise-level view of All Subscribers, so it works from a child BU.

## Caveats

- Data Views only cover about 6 months. A contact with no tracking in that window may still have older activity you keep elsewhere.
- Apple Mail Privacy Protection can register opens without a human reading the email, so this selection is conservative: some inactive people will look active.
