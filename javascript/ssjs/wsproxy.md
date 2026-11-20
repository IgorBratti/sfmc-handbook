# WSProxy guide

> **Type:** Guide · How to read and write data at scale and call SOAP objects from SSJS without building XML envelopes.

[← SSJS](README.md) · Signatures: [reference](reference.md#wsproxy)

---

## Why WSProxy

`Script.Util.WSProxy` is a thin JSON wrapper around the SOAP API that runs inside Marketing Cloud. Compared with the Core library it is **faster**, it **paginates** (`HasMoreRows` / `RequestID`), it works with **batches**, and it reaches any SOAP object: data extensions, subscribers, sends, tracking events, Query Activities, folders and more. No authentication is needed: calls run as the context's user and business unit.

```js
var api = new Script.Util.WSProxy();
```

## 1. Retrieve

### Data extension rows

```js
var cols = ["SubscriberKey", "Status", "UpdatedAt"];   // list EVERY field you will read or filter on
var filter = { Property: "Status", SimpleOperator: "equals", Value: "Active" };
var res = api.retrieve("DataExtensionObject[My_DE]", cols, filter);   // [ExternalKey]

for (var i = 0; i < res.Results.length; i++) {
  var props = res.Results[i].Properties;               // [{ Name, Value }, …]
  for (var p = 0; p < props.length; p++) {
    // props[p].Name, props[p].Value
  }
}
```

- The object type is `DataExtensionObject[<external key>]`.
- Only the columns in `cols` come back. A missing column is not an error, it's just absent.
- Values come back as strings. Convert numbers and dates yourself.

### Pagination

Each call returns up to 2,500 rows. Keep asking while `HasMoreRows` is true.

```js
var res = api.retrieve(type, cols, filter);
while (true) {
  processBatch(res.Results);
  if (!res.HasMoreRows) break;
  res = api.getNextBatch(type, res.RequestID);
}
```

Ready-to-use version, with an optional callback so you never hold millions of rows in memory: [wsproxy-retrieve-all.ssjs](scripts/wsproxy-retrieve-all.ssjs).

### Metadata and other objects

```js
// Data extensions in a folder
api.retrieve("DataExtension", ["Name", "CustomerKey", "CategoryID"],
  { Property: "CategoryID", SimpleOperator: "equals", Value: 12345 });

// Fields of a data extension
api.retrieve("DataExtensionField", ["Name", "FieldType", "MaxLength", "IsPrimaryKey", "IsRequired"],
  { Property: "DataExtension.CustomerKey", SimpleOperator: "equals", Value: "My_DE" });

// A subscriber's status
api.retrieve("Subscriber", ["SubscriberKey", "EmailAddress", "Status"],
  { Property: "SubscriberKey", SimpleOperator: "equals", Value: sk });

// A Query Activity definition by name
api.retrieve("QueryDefinition", ["Name", "CustomerKey", "ObjectID", "QueryText"],
  { Property: "Name", SimpleOperator: "equals", Value: "B2C_QRY_ONB_WelcomeEntry_v1" });
```

### Complex filters

```js
var filter = {
  LeftOperand:  { Property: "Status", SimpleOperator: "equals", Value: "Active" },
  LogicalOperator: "AND",
  RightOperand: {
    LeftOperand:  { Property: "Country", SimpleOperator: "IN", Value: ["BR", "PT"] },
    LogicalOperator: "OR",
    RightOperand: { Property: "Score", SimpleOperator: "greaterThan", Value: 80 }
  }
};
```

## 2. Create, update, upsert, delete rows

Rows are written as `DataExtensionObject` with the DE's external key and a `Properties` array.

```js
var row = {
  CustomerKey: "My_DE",
  Properties: [
    { Name: "SubscriberKey", Value: "0031x000001" },
    { Name: "Status", Value: "Active" }
  ]
};

api.createItem("DataExtensionObject", row);                    // insert (fails on duplicate PK)
api.updateItem("DataExtensionObject", row);                    // update existing row by PK

// Upsert: update, or insert when the PK doesn't exist
api.updateItem("DataExtensionObject", row, {
  SaveOptions: [{ PropertyName: "*", SaveAction: "UpdateAdd" }]
});

// Delete by primary key
api.deleteItem("DataExtensionObject", {
  CustomerKey: "My_DE",
  Keys: [{ Name: "SubscriberKey", Value: "0031x000001" }]
});
```

### Batches

`createBatch`, `updateBatch` and `deleteBatch` take an array and return one result per item. Send chunks of a few hundred rows and check every result: one bad row does not fail the others.

```js
var res = api.updateBatch("DataExtensionObject", rows, {
  SaveOptions: [{ PropertyName: "*", SaveAction: "UpdateAdd" }]
});
for (var i = 0; i < res.Results.length; i++) {
  if (res.Results[i].StatusCode != "OK") {
    // res.Results[i].StatusMessage tells you why
  }
}
```

Ready-to-use chunked upsert with failure collection: [wsproxy-upsert-batch.ssjs](scripts/wsproxy-upsert-batch.ssjs).

## 3. Perform actions

```js
// Start a Query Activity
var q = api.retrieve("QueryDefinition", ["ObjectID"],
  { Property: "CustomerKey", SimpleOperator: "equals", Value: "B2C_QRY_ONB_WelcomeEntry_v1" });
var res = api.performItem("QueryDefinition", { ObjectID: q.Results[0].ObjectID }, "Start");
```

## 4. Work in another business unit

From the parent BU (or with a user that has access), point the proxy to a child BU, do the work, then reset.

```js
api.setClientId({ ID: 523000123 });   // child MID
var res = api.retrieve("DataExtension", ["Name", "CustomerKey"]);
api.resetClientIds();
```

Retrieving across all BUs at once is possible for some objects with the `queryAllAccounts` argument: `api.retrieve(type, cols, filter, true)`.

## 5. Reading results

| Property | Meaning |
|---|---|
| `res.Status` | `"OK"`, `"MoreDataAvailable"` or an error status for the whole call |
| `res.Results` | Array of results (rows for retrieves, one item per object for writes) |
| `res.Results[i].StatusCode` | `"OK"` or `"Error"` for each written object |
| `res.Results[i].StatusMessage` | Reason for the error |
| `res.HasMoreRows` / `res.RequestID` | Pagination for retrieves |

Always check both levels: the call can succeed while individual rows fail.

## 6. Habits that save hours

- **Log `Stringify(res)` once** when you start with a new object type. The shape of `Results` differs between objects.
- **Keep `cols` in one variable** shared by the retrieve and the code that reads the result.
- **Throttle long jobs.** Combine pagination with the 30-minute Script Activity limit: process N batches per run and store a checkpoint.
- **Prefer SQL for set logic.** WSProxy is for what SQL can't do (APIs, per-row logic, metadata), not a replacement for Query Activities.

[← SSJS](README.md)
