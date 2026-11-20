<script runat="server">
/*
  json-endpoint.ssjs
  A JSON endpoint for browser code: receives a POST with a JSON body, validates it,
  writes to a data extension and answers with JSON.

  Where:   CloudPages > Code Resource > type JSON (the response is sent as application/json)
  Status:  Ready to test
  Docs:    ../fundamentals.md, ../../client-side/fetch-json.js (the caller)

  Request  POST { "email": "maria@example.com", "topic": "offers" }
  Success  200  { "ok": true }
  Failure  200  { "ok": false, "error": "invalid_input" }   (generic codes, no internal details)

  Interest_Signups_DE: EmailAddress (EmailAddress, PK), Topic (Text 20), CreatedAt (Date)

  Security notes
    - Call it from a CloudPage on the same domain. Cross-domain browser calls need CORS headers
      and expose the endpoint to any site: keep the allow-list below tight if you enable them.
    - Validate shape, size and values. Never echo input back.
    - This endpoint writes data: add a honeypot field or a CAPTCHA token if it is public.
*/
Platform.Load("core", "1.1.5");

var ALLOWED_TOPICS = { offers: true, newsletter: true, events: true };
var MAX_BODY = 2000;

function respond(obj) {
  Platform.Response.SetResponseHeader("Cache-Control", "no-store");
  Write(Stringify(obj));
}

function trim(s) { return String(s).replace(/^\s+|\s+$/g, ""); }

try {
  var raw = Platform.Request.Method == "POST" ? Platform.Request.GetPostData("utf-8") : "";

  if (!raw || raw.length > MAX_BODY) {
    respond({ ok: false, error: "invalid_input" });
  } else {
    var data = Platform.Function.ParseJSON(raw);
    var email = data && data.email ? trim(data.email).toLowerCase() : "";
    var topic = data && data.topic ? String(data.topic) : "";
    var honeypot = data && data.website ? String(data.website) : "";

    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;

    if (honeypot) {
      respond({ ok: true });                                   // bot: pretend success, store nothing
    } else if (!emailOk || !ALLOWED_TOPICS.hasOwnProperty(topic)) {
      respond({ ok: false, error: "invalid_input" });
    } else {
      Platform.Function.UpsertData("Interest_Signups_DE", ["EmailAddress"], [email],
        ["Topic", "CreatedAt"], [topic, Platform.Function.Now()]);
      respond({ ok: true });
    }
  }
} catch (e) {
  try {
    DataExtension.Init("Error_Log_DE").Rows.Add({
      Source: "JSON_Endpoint_InterestSignup",
      Message: String(Stringify(e)).substring(0, 3990),
      CreatedAt: Platform.Function.Now()
    });
  } catch (ignore) {}
  respond({ ok: false, error: "server_error" });
}
</script>
