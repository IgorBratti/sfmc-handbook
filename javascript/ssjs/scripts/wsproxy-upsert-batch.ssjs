<script runat="server">
/*
  wsproxy-upsert-batch.ssjs
  Upserts an array of plain objects into a data extension in chunks, using WSProxy
  updateBatch with SaveAction "UpdateAdd" (update when the primary key exists, insert otherwise).

  Where:   Script Activities
  Status:  Ready to test
  Docs:    ../wsproxy.md#2-create-update-upsert-delete-rows

  Returns { written: n, failed: [{ row, message }] } so the caller can log or retry the failures.
  One bad row does not fail the rest of its chunk.
*/
Platform.Load("core", "1.1.5");

var api = new Script.Util.WSProxy();
var CHUNK_SIZE = 200;

function toDataExtensionObject(deKey, row) {
  var props = [];
  for (var field in row) {
    if (row.hasOwnProperty(field)) {
      props.push({ Name: field, Value: row[field] === null ? "" : String(row[field]) });
    }
  }
  return { CustomerKey: deKey, Properties: props };
}

function upsertRows(deKey, rows) {
  var options = { SaveOptions: [{ PropertyName: "*", SaveAction: "UpdateAdd" }] };
  var written = 0;
  var failed = [];

  for (var start = 0; start < rows.length; start += CHUNK_SIZE) {
    var chunk = [];
    var end = Math.min(start + CHUNK_SIZE, rows.length);
    for (var i = start; i < end; i++) {
      chunk.push(toDataExtensionObject(deKey, rows[i]));
    }

    var res = api.updateBatch("DataExtensionObject", chunk, options);

    for (var r = 0; r < res.Results.length; r++) {
      if (res.Results[r].StatusCode == "OK") {
        written++;
      } else {
        failed.push({ row: rows[start + r], message: res.Results[r].StatusMessage });
      }
    }
  }
  return { written: written, failed: failed };
}

/* ---------- Example ---------- */
var result = upsertRows("Scores_DE", [
  { SubscriberKey: "0031x000001", Score: 87, UpdatedAt: Platform.Function.Now() },
  { SubscriberKey: "0031x000002", Score: 42, UpdatedAt: Platform.Function.Now() }
]);

if (result.failed.length > 0) {
  // Log a summary (see try-catch-log.ssjs) and decide whether the activity should fail.
  throw "Upsert finished with " + result.failed.length + " failed rows. First error: " + result.failed[0].message;
}
</script>
