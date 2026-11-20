# Marketing Cloud APIs

How external systems (and your own scripts) talk to Marketing Cloud Engagement: authentication, the REST endpoints used most, and the SOAP API for everything REST doesn't cover.

| File | Type | What's inside |
|---|---|---|
| [README.md](README.md) | Guide | Choosing REST or SOAP, installed packages, authentication, base URLs, good practices |
| [rest-reference.md](rest-reference.md) | Reference | Journeys (entry events, exits), Transactional Messaging, data extension rows, contacts, assets, automations |
| [soap-reference.md](soap-reference.md) | Reference | Envelope, authentication header, Retrieve with filters and pagination, common objects, Perform and Execute |

From inside Marketing Cloud (CloudPages, Script Activities), see [SSJS HTTP](../javascript/ssjs/http-and-apis.md) and [WSProxy](../javascript/ssjs/wsproxy.md).

---

## REST or SOAP?

| Need | API |
|---|---|
| Fire journey entry events, transactional emails/SMS, contacts, assets (Content Builder), journeys | **REST** |
| Data extension rows (small volumes) | REST (`/hub/v1/dataevents`, `/data/v1/async`) |
| Subscribers and lists, tracking events, sends, Query/Import definitions, folders, BU-level objects | **SOAP** |
| Bulk data loads | Import via file (SFTP + Import Activity) beats both APIs |

## Installed package and permissions

1. **Setup → Platform Tools → Apps → Installed Packages → New.**
2. **Add Component → API Integration → Server-to-Server.**
3. Select **only** the scopes the integration needs (least privilege). Examples:

| Integration | Scopes |
|---|---|
| Fire journey entry events | Journeys: Execute |
| Send transactional emails | Email: Send; Journeys: Execute/Read (for definitions) |
| Read/write DE rows | Data Extensions: Read/Write |
| Delete contacts | List and Subscribers: Read/Write; Contacts: Delete (as applicable) |

4. Under **Access**, grant the package to the business units it should reach.
5. Store the client ID and secret in a vault (or a restricted DE when the caller is Marketing Cloud itself). Rotate the secret when people leave or when it may have leaked.

## Authentication (OAuth 2.0 client credentials)

```http
POST https://{{subdomain}}.auth.marketingcloudapis.com/v2/token
Content-Type: application/json

{
  "grant_type": "client_credentials",
  "client_id": "{{client_id}}",
  "client_secret": "{{client_secret}}",
  "account_id": "{{mid}}"
}
```

| Response field | Use |
|---|---|
| `access_token` | `Authorization: Bearer <token>` on every call |
| `expires_in` | Seconds until it expires (under 20 minutes). Cache and reuse; refresh shortly before expiry |
| `rest_instance_url` | Base URL for REST calls (ends with `/`) |
| `soap_instance_url` | Base URL for SOAP calls (append `Service.asmx`) |
| `scope` | Scopes actually granted, check when a call returns 403 |

- `account_id` (MID) selects the business unit. Leave it out to use the package's default BU.
- `scope` can be sent in the request to ask for fewer scopes than the package allows.
- **Tenant-specific endpoints**: always use the subdomain of your tenant (`{{subdomain}}.auth…`, `{{subdomain}}.rest…`, `{{subdomain}}.soap…`), never generic hosts.

```bash
curl -s -X POST "https://$SUBDOMAIN.auth.marketingcloudapis.com/v2/token" \
  -H "Content-Type: application/json" \
  -d "{\"grant_type\":\"client_credentials\",\"client_id\":\"$CLIENT_ID\",\"client_secret\":\"$CLIENT_SECRET\",\"account_id\":\"$MID\"}"
```

## Good practices

| Practice | Why |
|---|---|
| Reuse tokens until they're about to expire | Requesting a token per call is slow and can be throttled |
| Batch where the endpoint allows it | Fewer calls, better throughput (`/hub/v1/dataevents/…/rowset`, transactional batch sends) |
| Handle `401` (refresh token), `429` / `5xx` (back off and retry with jitter) | Transient errors are normal at scale |
| Make writes idempotent (upserts, stable message keys) | Safe retries |
| Log request IDs and status, never tokens or secrets | Traceability without leaking credentials |
| Separate packages per integration | Revoke one integration without breaking the others |

[← Back to the handbook](../README.md)
