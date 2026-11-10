# Send control

[← AMPscript recipes](README.md)

## Skip the send for one contact with `RaiseError`

When an email depends on data that may be missing (a coupon, a product, a price), it's better **not to send** to that contact than to send a broken email.

```ampscript
%%[
VAR @coupon
SET @coupon = Lookup("Coupons_DE", "CouponCode", "SubscriberKey", _subscriberkey)

IF Empty(@coupon) THEN
  RaiseError("No coupon for this contact", true)
ENDIF
]%%
Your coupon: %%=v(@coupon)=%%
```

- The second argument decides the scope:
  - `true`: skips **only this contact**; the rest of the send continues.
  - `false` (or omitted): stops the **whole send**. Use only for errors that make every email wrong.
- Put the check at the very top of the email, before any content.
- Skipped contacts don't receive the email and don't count as sent. If your account has **Send Logging** enabled, you can record the reason there for later analysis.

## Common cases

| Situation | Check |
|---|---|
| Coupon or code missing | `IF Empty(@coupon) THEN RaiseError("No coupon", true) ENDIF` |
| Product out of stock | `IF @stock < 1 THEN RaiseError("Out of stock", true) ENDIF` |
| Contact opted out of this topic | `IF @offers == "false" THEN RaiseError("Opted out of offers", true) ENDIF` |
| Configuration missing (affects everyone) | `IF Empty(@campaignEndDate) THEN RaiseError("Campaign end date missing", false) ENDIF` |

## Test before sending
- In **Preview and Test**, preview a contact that should be skipped: the preview reports the error for that contact instead of rendering the email.
- Send a test to a small list mixing contacts with and without the data, and confirm only the right ones received it.
