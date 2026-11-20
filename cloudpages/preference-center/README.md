# Preference center

> Lets each contact choose which emails they want, or unsubscribe from everything, with a real unsubscribe logged in Marketing Cloud.

[Open the preview](https://igorbratti.github.io/sfmc-handbook/cloudpages/preference-center/preview.html) · [Source](src/page.html)

| | |
|---|---|
| **Status** | Ready to test |
| **Type** | CloudPage |
| **Level** | Advanced |
| **Stack** | AMPscript (`UpsertData`, `Lookup`, `SHA256`, `LogUnsubEvent` via `InvokeExecute`), HTML/CSS |
| **Setup time** | ~45 min |

## 1. Use case
Instead of losing a contact with a single "unsubscribe" link, offer topics (newsletter, offers, events). People who only want fewer emails stay; people who want out can leave with one click.

## 2. How it works
```mermaid
flowchart LR
  A[Email footer: CloudPagesURL with sk + sig + send IDs] --> B{Signature valid?}
  B -- no --> X[This link is not valid]
  B -- yes --> C[Preference center]
  C -- Save --> D[(Preferences_DE)]
  C -- Unsubscribe from all --> D
  C -- Unsubscribe from all --> E[LogUnsubEvent]
  E -- OK --> F[Confirmation]
  E -- error --> G[(Error_Log_DE) + neutral message]
  D --> H[Audience queries filter by topic]
```
- The footer link carries the subscriber key, its signature and the send identifiers (`jobid`, `listid`, `_JobSubscriberBatchID`), all encrypted by `CloudPagesURL`.
- **Signature check first.** Without it, anyone could open `?sk=<someone's key>&action=unsubscribe_all` and unsubscribe another person. See the [security guide](../security.md#1-sign-every-link-that-carries-an-identity).
- **Save** updates the three topic flags.
- **Unsubscribe from all** clears the flags and calls `LogUnsubEvent`, which unsubscribes the contact and ties the unsubscribe to the email they came from, so it shows up in tracking and in `_Unsubscribe`.
- The status returned by `InvokeExecute` is checked. On failure, the details go to `Error_Log_DE` and the visitor sees a neutral message.

## 3. Prerequisites
| DE | Field | Type | PK |
|---|---|---|---|
| `Preferences_DE` | `SubscriberKey` | Text 254 | ✔ |
| | `Newsletter` | Boolean | |
| | `Offers` | Boolean | |
| | `Events` | Boolean | |
| | `UpdatedAt` | Date | |
| `Config_DE` | `Name` | Text 100 | ✔ |
| | `Value` | Text 500 | |
| `Error_Log_DE` | `Source` | Text 100 | |
| | `Message` | Text 4000 | |
| | `CreatedAt` | Date | |

## 4. Setup
1. Create the data extensions and add the `LINK_SIGNING_SECRET` row to `Config_DE`.
2. Create the CloudPage with [`src/page.html`](src/page.html) and publish it.
3. In the email footer (or in the [footer block](../../emails/blocks/footer.html)):
   ```ampscript
   %%[
   SET @secret = Lookup("Config_DE", "Value", "Name", "LINK_SIGNING_SECRET")
   SET @sig = SHA256(Concat(_subscriberkey, "|", @secret), "UTF-8")
   ]%%
   <a href="%%=RedirectTo(CloudPagesURL(3456, "sk", _subscriberkey, "sig", @sig, "jid", jobid, "lid", listid, "bid", _JobSubscriberBatchID))=%%" alias="footer_preferences">Update preferences</a>
   ```
4. Add the topic filters to the queries that build your audiences, for example `INNER JOIN [Preferences_DE] p ON p.SubscriberKey = a.SubscriberKey AND p.Offers = 1`.
5. Decide how contacts without a row in `Preferences_DE` are treated (opted in by default, or excluded) and document it.

## 5. Key code: logging the unsubscribe
```ampscript
SET @lue = CreateObject("ExecuteRequest")
SetObjectProperty(@lue, "Name", "LogUnsubEvent")

SET @prop = CreateObject("APIProperty")
SetObjectProperty(@prop, "Name", "SubscriberKey")
SetObjectProperty(@prop, "Value", @sk)
AddObjectArrayItem(@lue, "Parameters", @prop)

/* JobID, ListID, BatchID and Reason are added the same way */

SET @statusCode = InvokeExecute(@lue, @statusMsg, @requestId)
IF @statusCode != "OK" THEN
  /* log to Error_Log_DE and show a neutral message */
ENDIF
```

## 6. Testing
- [ ] Open from a test email: current preferences are pre-checked
- [ ] Save: `Preferences_DE` updated, success message shown
- [ ] Unsubscribe from all: flags cleared, subscriber status becomes Unsubscribed, the event appears in the email's tracking
- [ ] Plain `?sk=<key>` or a tampered `sig`: "This link is not valid", nothing written
- [ ] Open without parameters: "This link is not valid"

## 7. Behavior to know
- **Saving topics does not resubscribe.** If the contact was unsubscribed at All Subscribers level, ticking a topic again does not change that status. Resubscription needs explicit consent and a separate flow.
- **System unsubscribe link.** Commercial emails still need an unsubscribe path that Marketing Cloud recognizes. Keep `%%unsub_center_url%%` in the footer, or configure this page as the account's custom profile/subscription center.
- **One-click unsubscribe** from the inbox (List-Unsubscribe header) is handled by Marketing Cloud for commercial sends, not by this page.

## 8. Security and privacy
- Signed identity: nobody can change someone else's preferences by editing the URL.
- Unsubscribes are processed immediately (CAN-SPAM, LGPD, GDPR).
- Test in a sandbox or test BU first: the unsubscribe is real.

[← All CloudPages](../README.md)
