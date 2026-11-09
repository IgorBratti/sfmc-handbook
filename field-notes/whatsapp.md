# WhatsApp (Meta) in Marketing Cloud

[← Back to contents](README.md)

## 1. Template variables come from Journey Data

**Problem:** a WhatsApp message shows an outdated value even after the data extension was updated.

**Why:** template variables are filled from Journey Data, the snapshot taken when the contact entered the journey.

**Fix:** make sure the entry source already has the final value when the contact enters. If the value changes later, it needs a new entry (or a different design).

## 2. Keep URL parameters in templates simple

**Problem:** a dynamic URL in a template gets duplicated or concatenated instead of substituted.

**Why:** spaces encoded as `%20` can be turned into `+`, and accented characters cause similar issues.

**Fix:** in values that go into URL parameters, replace spaces with underscores and remove accents before the send.

## 3. Carousel media handles expire

**Problem:** submitting a carousel template fails even though the images were uploaded earlier.

**Why:** the `header_handle` returned by Meta's Resumable Upload API expires.

**Fix:** upload the media again and use a fresh handle right before submitting the template.

## 4. Where WhatsApp tracking lives

**Problem:** WhatsApp sends don't show up in `_SMSMessageTracking`.

**Fix:** use the Chat Messaging data extract for WhatsApp delivery and engagement data.
