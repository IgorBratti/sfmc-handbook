# Server-Side JavaScript (SSJS)

[← Back to contents](README.md)

## 1. Paginate large retrieves with WSProxy

**Problem:** reading a big data extension returns only the first batch of rows.

**Why:** retrieves come back in batches. You have to follow `HasMoreRows` and ask for the next batch with the `RequestID`.

**Fix:**

```js
<script runat="server">
Platform.Load("core", "1.1.1");
var api = new Script.Util.WSProxy();

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

var rows = retrieveAll("My_DE", ["SubscriberKey", "Status", "BusinessUnit"], {
  Property: "Status",
  SimpleOperator: "equals",
  Value: "Active"
});

Write(rows.length + " rows retrieved");
</script>
```

## 2. `Rows.Retrieve()` is not a paginator

**Problem:** looping over `DataExtension.Init(...).Rows.Retrieve()` keeps returning the same batch.

**Why:** it has no cursor, so there is no way to ask for "the next page".

**Fix:** use the WSProxy pattern above whenever the result can exceed one batch.

## 3. Request every column you are going to use

**Problem:** a dashboard filter does nothing, or a value is always `undefined`.

**Why:** WSProxy only returns the columns listed in the `cols` array. If a field is missing from the list, it simply isn't in the result.

**Fix:** list every field you read, filter or group by. Keep the list in one place so the UI and the retrieve can't drift apart.

## 4. Log errors to a data extension

**Problem:** a Script Activity fails at night and nobody knows why.

**Fix:** wrap the work in `try/catch` and write the error to a log DE.

```js
<script runat="server">
Platform.Load("core", "1.1.1");
try {
  // your logic here
} catch (e) {
  DataExtension.Init("Error_Log_DE").Rows.Add({
    Source: "Nightly_Cleanup",
    Message: Stringify(e),
    CreatedAt: Now()
  });
}
</script>
```
