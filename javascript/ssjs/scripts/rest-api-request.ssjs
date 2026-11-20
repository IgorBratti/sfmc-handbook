<script runat="server">
/*
  rest-api-request.ssjs
  Gets an OAuth 2.0 token (client credentials) and calls the Marketing Cloud REST API.
  Example call: fire a Journey Builder API Event for each row of a small DE.

  Where:   Script Activities (preferred) or protected CloudPages
  Status:  Ready to test
  Docs:    ../http-and-apis.md, ../../../apis/

  Prerequisites
    - Installed Package with a Server-to-Server API Integration and only the scopes you need
      (here: Journeys > Execute, Data Extensions > Read).
    - Config_DE (restricted folder), Name PK / Value:
        API_SUBDOMAIN, API_CLIENT_ID, API_CLIENT_SECRET, API_ACCOUNT_ID (optional, target MID)
    - A journey with an API Event entry source; its event definition key goes in EVENT_KEY.
    - SOURCE_DE with SubscriberKey (PK), EmailAddress, Segment, Processed (Boolean), ProcessedAt (Date).

  Volume: LookupRows returns up to ~2,000 rows, so each run handles one queue batch.
  Rows are marked as processed only after a 2xx response, which makes the script safe to re-run.
  For high volumes, prefer a Data Extension entry source or the Journey API's batch events.
*/
Platform.Load("core", "1.1.5");

var EVENT_KEY = "APIEvent-00000000-0000-0000-0000-000000000000";
var SOURCE_DE = "Journey_Entry_Queue_DE";   // DE name with SubscriberKey, EmailAddress, Segment

function getConfig(name) {
  return Platform.Function.Lookup("Config_DE", "Value", "Name", name);
}

function httpJson(method, url, token, payload) {
  var req = new Script.Util.HttpRequest(url);
  req.emptyContentHandling = 0;
  req.retries = 1;
  req.continueOnError = true;
  req.method = method;
  req.contentType = "application/json";
  if (token) req.setHeader("Authorization", "Bearer " + token);
  if (payload) req.postData = Stringify(payload);

  var resp = req.send();
  var text = String(resp.content);
  var body = null;
  try { body = text ? Platform.Function.ParseJSON(text) : null; } catch (e) { body = text; }
  return { status: Number(resp.statusCode), body: body };
}

function getToken() {
  var payload = {
    grant_type: "client_credentials",
    client_id: getConfig("API_CLIENT_ID"),
    client_secret: getConfig("API_CLIENT_SECRET")
  };
  var mid = getConfig("API_ACCOUNT_ID");
  if (mid) payload.account_id = mid;

  var url = "https://" + getConfig("API_SUBDOMAIN") + ".auth.marketingcloudapis.com/v2/token";
  var res = httpJson("POST", url, null, payload);
  if (res.status != 200 || !res.body || !res.body.access_token) {
    throw "Token request failed with status " + res.status;   // never log the secret or the full payload
  }
  return { token: res.body.access_token, restUrl: res.body.rest_instance_url };
}

try {
  var auth = getToken();
  var rows = Platform.Function.LookupRows(SOURCE_DE, "Processed", "false");
  var failures = 0;

  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    var res = httpJson("POST", auth.restUrl + "interaction/v1/events", auth.token, {
      ContactKey: r.SubscriberKey,
      EventDefinitionKey: EVENT_KEY,
      Data: { SubscriberKey: r.SubscriberKey, EmailAddress: r.EmailAddress, Segment: r.Segment }
    });

    if (res.status >= 200 && res.status < 300) {
      Platform.Function.UpdateData(SOURCE_DE, ["SubscriberKey"], [r.SubscriberKey],
        ["Processed", "ProcessedAt"], ["true", Platform.Function.Now()]);
    } else {
      failures++;
    }
  }

  if (failures > 0) throw failures + " entry events failed. Rows stay Processed = false for the next run.";

} catch (e) {
  // Log with try-catch-log.ssjs, then:
  throw e;
}
</script>
