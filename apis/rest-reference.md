# REST API reference

> **Type:** Reference · The REST endpoints used most in Marketing Cloud Engagement projects, with request shapes and the traps behind them. `{{rest}}` is the `rest_instance_url` returned by the [token call](README.md#authentication-oauth-20-client-credentials).

[← APIs](README.md)

**Jump to:** [Journeys](#journeys) · [Transactional Messaging](#transactional-messaging) · [Data extension rows](#data-extension-rows) · [Contacts](#contacts) · [Content Builder assets](#content-builder-assets) · [Automations](#automations) · [Errors](#errors)

All requests: `Authorization: Bearer {{token}}` and `Content-Type: application/json`.

---

## Journeys

### Fire an entry event (API Event entry source)

```http
POST {{rest}}interaction/v1/events

{
  "ContactKey": "0031x000001",
  "EventDefinitionKey": "APIEvent-1a2b3c4d-0000-0000-0000-000000000000",
  "Data": {
    "SubscriberKey": "0031x000001",
    "EmailAddress": "maria@example.com",
    "Segment": "Champion"
  }
}
```

- `EventDefinitionKey` comes from the journey's API Event entry source.
- `Data` must match the fields of the event's data extension; it becomes **Journey Data** (a snapshot).
- The contact enters only if the journey is running and its re-entry settings allow it. A `201` means the event was accepted, not that the contact entered: check entry results in Journey Builder.

### Remove contacts from a journey

```http
POST {{rest}}interaction/v1/interactions/contactexit

[
  { "ContactKey": "0031x000001", "DefinitionKey": "B2C_JRN_XSELL_OfferA" }
]
```

`DefinitionKey` is the journey key. Check the result with `POST {{rest}}interaction/v1/interactions/contactexit/status` and the same body.

### List and read journeys

```http
GET {{rest}}interaction/v1/interactions?status=Running&$page=1&$pageSize=50
GET {{rest}}interaction/v1/interactions/key:{{journeyKey}}
```

## Transactional Messaging

Real-time, single-recipient emails (password resets, order confirmations), sent outside the normal batch queue.

### 1. Create a send definition (once)

```http
POST {{rest}}messaging/v1/email/definitions

{
  "definitionKey": "order-confirmation-v1",
  "name": "Order confirmation v1",
  "status": "Active",
  "content": { "customerKey": "eml_order_confirmation_v1" },
  "subscriptions": {
    "list": "All Subscribers",
    "dataExtension": "TX_Order_Confirmation_Log",
    "autoAddSubscriber": true,
    "updateSubscriber": true
  },
  "options": { "trackLinks": true },
  "classification": "Default Transactional"
}
```

### 2. Send

```http
POST {{rest}}messaging/v1/email/messages/{{messageKey}}

{
  "definitionKey": "order-confirmation-v1",
  "recipient": {
    "contactKey": "0031x000001",
    "to": "maria@example.com",
    "attributes": { "OrderId": "A-10293", "FirstName": "Maria" }
  }
}
```

- `messageKey` is **your** unique ID for this message (a GUID or `order-A-10293`). Reusing it makes retries idempotent and lets you query the status.
- Batch: `POST {{rest}}messaging/v1/email/messages` with `"recipients": [ … ]`, each with its own `messageKey`.
- Status: `GET {{rest}}messaging/v1/email/messages/{{messageKey}}`.
- `attributes` are available in the email as AMPscript attributes (`AttributeValue("OrderId")`).

## Data extension rows

### Upsert rows (synchronous, small batches)

```http
POST {{rest}}hub/v1/dataevents/key:{{deKey}}/rowset

[
  { "keys": { "SubscriberKey": "0031x000001" }, "values": { "Score": "87", "UpdatedAt": "2026-11-20T10:00:00" } },
  { "keys": { "SubscriberKey": "0031x000002" }, "values": { "Score": "42", "UpdatedAt": "2026-11-20T10:00:00" } }
]
```

### Upsert rows (asynchronous, larger batches)

```http
PUT {{rest}}data/v1/async/dataextensions/key:{{deKey}}/rows

{ "items": [ { "SubscriberKey": "0031x000001", "Score": 87 }, { "SubscriberKey": "0031x000002", "Score": 42 } ] }
```

Returns a `requestId`. Check `GET {{rest}}data/v1/async/{{requestId}}/status` and, for failures, `…/{{requestId}}/results`. `POST` on the same path inserts instead of upserting.

### Read rows

```http
GET {{rest}}data/v1/customobjectdata/key/{{deKey}}/rowset?$page=1&$pageSize=2500&$filter=Status%20eq%20'Active'
```

Paginate with `$page` until you've read `count` rows. For full exports, a Data Extract activity to SFTP is faster and cheaper.

## Contacts

### Delete contacts by key

```http
POST {{rest}}contacts/v1/contacts/actions/delete?type=keys

{
  "values": ["0031x000001", "0031x000002"],
  "DeleteOperationType": "ContactAndAttributes"
}
```

- Deletion removes the contact from every channel and from sendable data extensions, after the account's suppression period. It is **irreversible**.
- Send keys in batches and log the `operationID` returned for each request.
- Process and safeguards: [contact cleanup playbook](../playbooks/contact-cleanup/).

## Content Builder assets

```http
GET  {{rest}}asset/v1/content/assets/{{assetId}}
POST {{rest}}asset/v1/content/assets/query
{
  "page": { "page": 1, "pageSize": 50 },
  "query": { "property": "customerKey", "simpleOperator": "equal", "value": "eml_order_confirmation_v1" }
}
```

Useful for content audits, backups and migrations between business units.

## Automations

```http
POST {{rest}}automation/v1/automations/{{automationId}}/actions/runallonce
```

Starts an automation once (for example, after an external system drops a file). Prefer File Drop automations when the trigger is a file arriving on SFTP.

## Errors

| Status | Meaning | What to do |
|---|---|---|
| `400` | Invalid payload | Read the error body: it names the field |
| `401` | Token missing or expired | Request a new token and retry once |
| `403` | Scope or BU access missing | Check the installed package scopes and BU access |
| `404` | Wrong key or endpoint | Check keys (definition, DE, journey) and the tenant URL |
| `429` | Rate limited | Back off and retry with jitter |
| `5xx` | Platform error | Retry with back-off; keep requests idempotent |

[← APIs](README.md)
