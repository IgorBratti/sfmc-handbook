# Personalization strings

> **Type:** Reference · System values available in emails without any lookup. Print them as `%%string%%`, or read them inside a block as `@x = string` (no `%%`).

[← AMPscript](README.md)

---

## Subscriber and send

| String | Value | Typical use |
|---|---|---|
| `_subscriberkey` | Subscriber key of the recipient | Keys for lookups, links, logs |
| `emailaddr` | Email address the message was sent to | Display, logging |
| `subscriberid` | Internal numeric subscriber ID | Joins with tracking data |
| `jobid` | Job (send) ID | `LogUnsubEvent`, tracking joins |
| `listid` | List ID (All Subscribers for DE sends) | `LogUnsubEvent` |
| `_JobSubscriberBatchID` | Batch ID of this recipient in the job | `LogUnsubEvent`, tracking joins |
| `_emailid` | Email asset ID | Logging which content was sent |
| `emailname_` | Email name | Logging, UTM `utm_content` |
| `_DataSourceName` | Name of the sendable DE or list | Debugging, logs |
| `_messagecontext` | Where the content is being rendered (`PREVIEW`, `SEND`, `VAWP`, `LANDINGPAGE`, `FTAF`…) | Avoid writes in preview, change content in the web version |

```ampscript
%%[
IF _messagecontext == "PREVIEW" THEN
  SET @coupon = "PREVIEW-COUPON"
ELSE
  SET @coupon = ClaimRowValue("Coupons_DE", "Code", "IsClaimed", "", "SubscriberKey", _subscriberkey)
ENDIF
]%%
```

## Compliance and account (sender information)

Filled from the account / sender settings. Commercial emails must show a physical address and an unsubscribe path.

| String | Value |
|---|---|
| `member_busname` | Business name |
| `member_addr` | Street address |
| `member_city`, `member_state`, `member_postalcode`, `member_country` | Rest of the physical address |
| `unsub_center_url` | One-click unsubscribe page (Marketing Cloud) |
| `profile_center_url` | Profile center (Marketing Cloud or your custom page) |
| `subscription_center_url` | Subscription center (publication lists) |
| `view_email_url` | Web version of the email |
| `ftaf_url` | Forward to a friend |

Ready-made footer: [emails/blocks/footer.html](../emails/blocks/footer.html).

## Dates at send time

| String | Example |
|---|---|
| `xtmonth` | `November` |
| `xtmonthnumeric` | `11` |
| `xtday` | `20` |
| `xtdayofweek` | `Friday` |
| `xtyear` | `2026` |
| `xtshortdate` | `11/20/2026` |
| `xtlongdate` | `Friday, November 20, 2026` |

These follow server settings (English, US format). For other languages and formats use `FormatDate(Now(1), "d 'de' MMMM", "", "pt-BR")`.

## Attributes

Any field of the sendable data extension (or profile attribute for list sends) works as a personalization string: `%%FirstName%%`. In shared content prefer `AttributeValue("FirstName")`, which returns empty instead of failing when the field doesn't exist in that send. See [syntax.md](syntax.md#attributes-three-ways-to-read-a-field).

[← AMPscript](README.md)
