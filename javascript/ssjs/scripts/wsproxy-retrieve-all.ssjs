<script runat="server">
/*
  wsproxy-retrieve-all.ssjs
  Reads every row of a data extension, following HasMoreRows / RequestID.

  Where:   CloudPages, Script Activities
  Status:  Ready to test
  Docs:    ../wsproxy.md

  Two ways to use it:
    1. retrieveAll(key, cols, filter)            -> returns an array with every row (small/medium DEs)
    2. retrieveAll(key, cols, filter, onBatch)   -> calls onBatch(rows) per batch and returns the row count
                                                    (large DEs: nothing is kept in memory)

  List in `cols` every field you will read, filter or group by. Values come back as strings.
*/
Platform.Load("core", "1.1.5");

var api = new Script.Util.WSProxy();

function toRow(result) {
  var row = {};
  var props = result.Properties;
  for (var p = 0; p < props.length; p++) {
    row[props[p].Name] = props[p].Value;
  }
  return row;
}

function retrieveAll(deKey, cols, filter, onBatch) {
  var objectType = "DataExtensionObject[" + deKey + "]";
  var res = filter ? api.retrieve(objectType, cols, filter) : api.retrieve(objectType, cols);
  var all = [];
  var total = 0;

  while (true) {
    if (res.Status != "OK" && res.Status != "MoreDataAvailable") {
      throw "Retrieve failed for " + deKey + ": " + res.Status;
    }

    var batch = [];
    for (var i = 0; i < res.Results.length; i++) {
      batch.push(toRow(res.Results[i]));
    }
    total += batch.length;

    if (onBatch) {
      onBatch(batch);
    } else {
      for (var b = 0; b < batch.length; b++) all.push(batch[b]);
    }

    if (!res.HasMoreRows) break;
    res = api.getNextBatch(objectType, res.RequestID);
  }
  return onBatch ? total : all;
}

/* ---------- Example 1: small DE, everything in memory ---------- */
var activeRows = retrieveAll("My_DE", ["SubscriberKey", "Status"], {
  Property: "Status",
  SimpleOperator: "equals",
  Value: "Active"
});

/* ---------- Example 2: large DE, process batch by batch ---------- */
var processed = retrieveAll("Big_DE", ["SubscriberKey", "Score"], null, function (rows) {
  for (var i = 0; i < rows.length; i++) {
    // per-row logic here (keep it light: no API call per row)
  }
});
</script>
