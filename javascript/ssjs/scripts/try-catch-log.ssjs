<script runat="server">
/*
  try-catch-log.ssjs
  Wraps a Script Activity in try/catch, writes the error to a log DE, then re-throws.

  Where:   Script Activities (Automation Studio)
  Status:  Ready to test
  Docs:    ../fundamentals.md#8-errors-and-logging

  Why re-throw: a catch that swallows the error makes the Automation report success
  while the work didn't happen, and nobody gets the error notification.

  Error_Log_DE (external key Error_Log_DE):
    Source    Text 100
    Message   Text 4000
    CreatedAt Date
*/
Platform.Load("core", "1.1.5");

var SOURCE = "Nightly_Script";   // name of this script, used to filter the log

function logError(source, err) {
  var message = Stringify(err);
  if (message.length > 4000) message = message.substring(0, 3990) + " [cut]";
  try {
    DataExtension.Init("Error_Log_DE").Rows.Add({
      Source: source,
      Message: message,
      CreatedAt: Platform.Function.Now()
    });
  } catch (logErr) {
    // The log itself failed (missing DE, wrong field). Nothing else to do here:
    // the original error is re-thrown below and the Automation will show it.
  }
}

try {

  // ---- your work goes here ----

} catch (e) {
  logError(SOURCE, e);
  throw e;   // keep the Automation's failure status and notifications
}
</script>
