# Contact-base hygiene

Marketing Cloud contracts are priced by contact count. Inactive contacts cost money, hurt deliverability and slow down every query. This folder is the **selection** side of the [contact cleanup playbook](../../playbooks/contact-cleanup/).

Status of every query: **Ready to test**.

## inactive-contacts.sql

Contacts who received at least 5 emails in the last 180 days and never opened or clicked.

**Target DE:** `Cleanup_Candidates` · `SubscriberKey` (Text 254, PK), `SendsLast180Days` (Number) · **Overwrite**.

- Tune the window (max ~6 months, the Data View limit) and the minimum number of sends.
- **Multi-BU accounts:** a contact inactive in one BU may be engaged in another. Run `collect-engaged-keys.sql` in every BU that sends (target: shared DE `Engaged_Keys_All_BUs`, `SubscriberKey` PK, **Update**) and remove those keys from the candidates in the playbook's protection step.

## collect-sent-keys.sql → never-sent-contacts.sql

Subscribers who joined more than 180 days ago and that **no business unit** has emailed in the Data View window.

`_Sent` only shows the sends of the BU where the query runs, while `ENT._Subscribers` covers the whole enterprise. Joining them directly would flag people who are emailed by another BU. So the selection has two steps:

| Step | Query | Runs in | Target | Action |
|---|---|---|---|---|
| 1 | `collect-sent-keys.sql` | **Every** BU that sends email | Shared DE `Sent_Keys_All_BUs` (`SubscriberKey` Text 254, PK) | **Update** |
| 2 | `never-sent-contacts.sql` | Parent BU (or any BU with access to the shared DE) | `Cleanup_Candidates` | **Update** |

- Run all step-1 activities before step 2 (same automation, earlier steps, or an earlier schedule).
- Give `Sent_Keys_All_BUs` a data retention policy (for example, delete rows older than 6 months) so keys of people nobody emails anymore eventually drop out.
- In the parent BU, the `ENT.` prefix on the shared DE is optional; drop it if validation complains.

## Caveats

- Data Views only cover about 6 months. A contact with no tracking in that window may still have older activity you keep elsewhere.
- Apple Mail Privacy Protection can register opens without a human reading the email, so `inactive-contacts.sql` is conservative: some inactive people look active.
- These queries look at email only. Contacts that exist because of SMS, WhatsApp or push need their own rules (see the playbook).

[← SQL & Data Views](../README.md)
