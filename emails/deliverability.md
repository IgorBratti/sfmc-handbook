# Deliverability guide

> **Type:** Guide · What decides whether Marketing Cloud emails reach the inbox, and the checks to run before and after sends.

[← Emails](README.md)

---

## 1. The three layers

| Layer | Question | Where it's controlled |
|---|---|---|
| **Authentication** | Can mailbox providers prove the email is really from you? | DNS (SPF, DKIM, DMARC), Marketing Cloud sender setup |
| **Reputation** | Do recipients want this sender's email? | Engagement, complaints, bounces, spam traps, volume patterns |
| **Content and compliance** | Does each message look legitimate and follow the rules? | Templates, links, unsubscribe handling, consent |

Authentication gets you considered. Reputation gets you into the inbox.

## 2. Authentication in Marketing Cloud

| Item | What it does | Notes |
|---|---|---|
| **SPF** | Lists the servers allowed to send for a domain | Marketing Cloud provides the include/records for your sending domain |
| **DKIM** | Signs each message with your domain's key | Must align with the From domain for DMARC |
| **DMARC** | Tells providers what to do when SPF/DKIM fail, and sends you reports | Start with `p=none` and reports, then move to `quarantine`/`reject` |
| **Sender Authentication Package (SAP)** | Private sending domain, branded links and images, often a dedicated IP | Strongly recommended for any serious volume |
| **Reply Mail Management** | Handles replies and out-of-office messages on your domain | Configure so replies don't bounce |

Use a **subdomain** for marketing (for example `news.example.com`) so its reputation is separate from the corporate domain, and keep transactional mail on its own subdomain or classification when volumes justify it.

## 3. Bulk sender requirements (Gmail, Yahoo, Microsoft)

Large mailbox providers require from bulk senders (thousands of messages per day to their users):

- [ ] SPF **and** DKIM pass, and a DMARC record exists for the From domain (alignment required)
- [ ] **One-click unsubscribe** (RFC 8058 `List-Unsubscribe` + `List-Unsubscribe-Post` headers) on marketing messages, and a visible unsubscribe link in the body
- [ ] Unsubscribes honored within two days
- [ ] Spam complaint rate kept low: below 0.1% as a target, never reaching 0.3%
- [ ] Valid forward and reverse DNS for sending IPs, TLS for transmission

In Marketing Cloud, commercial sends include the `List-Unsubscribe` header. Verify it in the raw source of a real test message (Gmail → *Show original*), and check that the unsubscribe it triggers changes the subscriber status as you expect.

## 4. Reputation: what moves it

| Raises it | Lowers it |
|---|---|
| Opens, clicks, replies, "not spam" | Spam complaints |
| Consistent volume and schedule | Sudden volume spikes (new IP, big blasts) |
| Sending to engaged contacts | Hard bounces from old or bought lists |
| Easy, honored unsubscribes | Spam traps (recycled or fake addresses) |
| Relevant, expected content | Mismatch between signup promise and content |

### IP and domain warming

A new dedicated IP or sending domain has no reputation. Ramp volume gradually over a few weeks, starting with the **most engaged** contacts (recent clickers), and increase only while bounce and complaint rates stay healthy. Marketing Cloud and your account team provide a warming plan; follow it per mailbox provider when volumes are large.

### Engagement-based sending

- Send the most frequent campaigns only to contacts engaged in the last 90–180 days ([engagement segments](../sql/scoring/)).
- Run a re-engagement series for the inactive, then suppress or remove those who don't respond ([contact cleanup playbook](../playbooks/contact-cleanup/)).
- Cap frequency per contact ([frequency cap](../sql/audiences/)).

## 5. Bounces and statuses in Marketing Cloud

| Bounce category | Meaning | Action |
|---|---|---|
| Hard bounce | Address doesn't exist | Stop sending (Marketing Cloud eventually sets the subscriber to Held) |
| Soft bounce | Temporary (mailbox full, server busy) | Retried automatically; repeated soft bounces end up Held too |
| Block bounce | The provider refused the message (reputation, policy, content) | Investigate per domain: this is a sender problem, not a list problem |
| Technical/Other | Configuration, DNS, network | Check setup |

A spike of block bounces at **one** provider is the earliest signal of a reputation problem there. Query: [bounces-by-category-domain.sql](../sql/kpis/bounces-by-category-domain.sql).

## 6. Monitor

| Signal | Source | Watch for |
|---|---|---|
| Delivery, bounces, complaints, unsubscribes | Data Views ([KPIs](../sql/kpis/)), Intelligence Reports | Trends by domain and by campaign |
| Gmail reputation and spam rate | Google Postmaster Tools (verify your sending domain) | Domain reputation dropping, spam rate rising |
| Microsoft reputation | Microsoft SNDS (for dedicated IPs) | Yellow/red IP status |
| DMARC reports | Your DMARC report mailbox or a DMARC tool | Unknown sources sending as your domain |
| Inbox placement | Seed tests (optional) | Spam folder placement by provider |

## 7. Content habits that help

- From name and address recognizable and stable.
- Subject lines that match the content; no misleading `RE:` / `FW:`.
- A balanced text-to-image ratio; never a single image as the whole email.
- Links on your branded tracking domain; avoid public URL shorteners.
- HTML under ~102 KB (Gmail clipping) and valid markup.
- Physical address and unsubscribe in every commercial email ([footer.html](blocks/footer.html)).

## 8. Pre-send checklist

- [ ] Correct sender profile, delivery profile and send classification (commercial vs transactional)
- [ ] Audience excludes Held, Bounced and Unsubscribed contacts and your suppression lists
- [ ] Volume in line with recent sends (no unplanned spike)
- [ ] Unsubscribe link and physical address present
- [ ] Rendering and link test done ([rendering guide](rendering-guide.md#9-testing-before-every-important-send))

[← Emails](README.md)
