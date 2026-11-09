<script runat="server">
Platform.Load("core", "1.1.1");
var api = new Script.Util.WSProxy();

/* Retrieves every row of a DE, following HasMoreRows / RequestID.
   List in `cols` every field you will read, filter or group by. */
function retrieveAll(deKey, cols, filter) {
  var objectType = "DataExtensionObject[" + deKey + "]";
  var res = filter ? api.retrieve(objectType, cols, filter) : api.retrieve(objectType, cols);
  var rows = [];

  while (true) {
    for (var i = 0; i < res.Results.length; i++) {
      var props = res.Results[i].Properties;
      var row = {};
      for (var p = 0; p < props.length; p++) {
        row[props[p].Name] = props[p].Value;
      }
      rows.push(row);
    }
    if (!res.HasMoreRows) break;
    res = api.getNextBatch(objectType, res.RequestID);
  }
  return rows;
}

var rows = retrieveAll("My_DE", ["SubscriberKey", "Status"], {
  Property: "Status",
  SimpleOperator: "equals",
  Value: "Active"
});
Write(rows.length + " rows");
</script>
