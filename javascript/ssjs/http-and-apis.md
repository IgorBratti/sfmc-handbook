# HTTP requests and APIs from SSJS

> **Type:** Guide · Calling external APIs and the Marketing Cloud REST API from CloudPages and Script Activities.

[← SSJS](README.md) · Full REST reference: [apis/](../../apis/)

---

## 1. Choose the right function

| Need | Use |
|---|---|
| Any method, headers, status code | `Script.Util.HttpRequest` |
| Quick GET of public content | `Script.Util.HttpGet` or Core `HTTP.Get` |
| SOAP objects inside Marketing Cloud | [WSProxy](wsproxy.md) (no token needed) |

Constraints: ports 80/443 only, 30-second timeout per request, and the response encoding follows the `Content-Type` charset (Windows-1252 if none).

## 2. The request pattern

```js
function httpJson(method, url, token, payload) {
  var req = new Script.Util.HttpRequest(url);
  req.emptyContentHandling = 0;
  req.retries = 1;
  req.continueOnError = true;               // don't throw on 4xx/5xx; we check the status
  req.method = method;
  req.contentType = "application/json";
  if (token) req.setHeader("Authorization", "Bearer " + token);
  if (payload) req.postData = Stringify(payload);

  var resp = req.send();
  var text = String(resp.content);
  return {
    status: resp.statusCode,
    body: text ? Platform.Function.ParseJSON(text) : null
  };
}
```

Treat any status outside 200–299 as a failure and log the body (it usually explains the error).

## 3. Calling the Marketing Cloud REST API

### Credentials

1. **Setup → Apps → Installed Packages → New** → add an **API Integration** component, **Server-to-Server**.
2. Grant only the scopes the script needs (for example *Journeys: Execute* to fire entry events, *Data Extensions: Read/Write*).
3. Store the client ID, client secret and the tenant subdomain in `Config_DE` (restricted folder). Never in code.

| `Name` | `Value` |
|---|---|
| `API_CLIENT_ID` | from the package |
| `API_CLIENT_SECRET` | from the package |
| `API_SUBDOMAIN` | the `xxxxxxxx` part of `https://xxxxxxxx.auth.marketingcloudapis.com` |
| `API_ACCOUNT_ID` | MID of the target BU (optional) |

### Token

```js
function getConfig(name) {
  return Platform.Function.Lookup("Config_DE", "Value", "Name", name);
}

function getToken() {
  var sub = getConfig("API_SUBDOMAIN");
  var payload = {
    grant_type: "client_credentials",
    client_id: getConfig("API_CLIENT_ID"),
    client_secret: getConfig("API_CLIENT_SECRET")
  };
  var mid = getConfig("API_ACCOUNT_ID");
  if (mid) payload.account_id = mid;

  var res = httpJson("POST", "https://" + sub + ".auth.marketingcloudapis.com/v2/token", null, payload);
  if (res.status != 200) throw "Token request failed: " + res.status;
  return { token: res.body.access_token, restUrl: res.body.rest_instance_url };
}
```

- Use `rest_instance_url` from the response as the base URL (it ends with `/`).
- The token is valid for less than 20 minutes (`expires_in`, in seconds). Request it once per run, not per row. For long jobs, refresh when the remaining time gets short.

### Example: fire a journey entry event

```js
var auth = getToken();
var res = httpJson("POST", auth.restUrl + "interaction/v1/events", auth.token, {
  ContactKey: "0031x000001",
  EventDefinitionKey: "APIEvent-1a2b3c4d",
  Data: { SubscriberKey: "0031x000001", EmailAddress: "maria@example.com", Segment: "Champion" }
});
```

Full script: [rest-api-request.ssjs](scripts/rest-api-request.ssjs). More endpoints: [REST reference](../../apis/rest-reference.md).

## 4. Calling external APIs

- **Allow-list hosts.** If the URL is built from data, validate the host so a stored value can't redirect the call elsewhere.
- **Send only what's needed.** Every field you send leaves Marketing Cloud; check it against your privacy policy.
- **Handle rate limits.** On `429`, stop, log and let the next run continue. Don't loop retries inside a 30-minute activity.
- **Idempotency.** If the API supports an idempotency key, send one (for example the row's primary key) so a retried run doesn't duplicate records.

## 5. Security

- Secrets live in a restricted DE and are read at runtime.
- Never print tokens, secrets or full responses on a CloudPage.
- A CloudPage that calls APIs with your credentials is a public trigger for those calls. Protect it like any form: signed parameters, validation, rate limiting.

[← SSJS](README.md)
