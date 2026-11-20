# SOAP API reference

> **Type:** Reference · When you need subscribers, lists, tracking events, sends, definitions or folders, SOAP is still the way. This page has the envelope, the common objects and the Retrieve patterns.

[← APIs](README.md) · From inside Marketing Cloud, use [WSProxy](../javascript/ssjs/wsproxy.md): same objects, no XML.

---

## Endpoint and authentication

```
POST {{soap_instance_url}}Service.asmx
Content-Type: text/xml
SOAPAction: Retrieve            (Create, Update, Delete, Perform, Execute…)
```

`soap_instance_url` comes from the [token response](README.md#authentication-oauth-20-client-credentials). The access token goes in the SOAP header:

```xml
<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope"
            xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing">
  <s:Header>
    <a:Action s:mustUnderstand="1">Retrieve</a:Action>
    <a:To s:mustUnderstand="1">{{soap_instance_url}}Service.asmx</a:To>
    <fueloauth xmlns="http://exacttarget.com">{{access_token}}</fueloauth>
  </s:Header>
  <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
      <RetrieveRequest>
        <ObjectType>Subscriber</ObjectType>
        <Properties>SubscriberKey</Properties>
        <Properties>EmailAddress</Properties>
        <Properties>Status</Properties>
        <Filter xsi:type="SimpleFilterPart">
          <Property>SubscriberKey</Property>
          <SimpleOperator>equals</SimpleOperator>
          <Value>0031x000001</Value>
        </Filter>
      </RetrieveRequest>
    </RetrieveRequestMsg>
  </s:Body>
</s:Envelope>
```

## Retrieve essentials

| Element | Notes |
|---|---|
| `ObjectType` | `Subscriber`, `DataExtensionObject[ExternalKey]`, `SentEvent`… |
| `Properties` | One element per field. Only listed fields come back |
| `Filter` | `SimpleFilterPart` or `ComplexFilterPart` (`LeftOperand`, `LogicalOperator`, `RightOperand`) |
| `ClientIDs` | `<ClientIDs><ID>{{mid}}</ID></ClientIDs>` to read from a specific BU |
| `QueryAllAccounts` | `true` to read across BUs (supported objects only) |

### Pagination

A response with `OverallStatus = MoreDataAvailable` returns a `RequestID`. Ask for the next batch with:

```xml
<RetrieveRequest>
  <ContinueRequest>{{RequestID}}</ContinueRequest>
</RetrieveRequest>
```

Repeat until `OverallStatus = OK`. Each batch holds up to 2,500 objects.

## Common objects

| Object | Typical use | Operations |
|---|---|---|
| `Subscriber` | Status in All Subscribers, email address changes, unsubscribe | Retrieve, Create, Update, Delete |
| `ListSubscriber` | Membership and status in lists / publication lists | Retrieve |
| `DataExtension` / `DataExtensionField` | DE metadata, creating DEs by API | Retrieve, Create, Update, Delete |
| `DataExtensionObject[Key]` | DE rows | Retrieve, Create, Update (UpdateAdd = upsert), Delete |
| `SentEvent`, `OpenEvent`, `ClickEvent`, `BounceEvent`, `UnsubEvent` | Tracking per send | Retrieve (filter by `SendID` and/or `EventDate`) |
| `Send` | Summary of user-initiated sends | Retrieve |
| `TriggeredSendDefinition` | Triggered sends (start, pause, publish changes) | Retrieve, Create, Update, Perform |
| `QueryDefinition` | Query Activities: read SQL, start a query | Retrieve, Create, Update, Perform (`Start`) |
| `ImportDefinition` | Import Activities | Retrieve, Create, Perform (`Start`) |
| `DataFolder` | Folders of any content type | Retrieve, Create |
| `BusinessUnit`, `AccountUser` | Governance and audits | Retrieve |

## Write operations

```xml
<UpdateRequest xmlns="http://exacttarget.com/wsdl/partnerAPI">
  <Options>
    <SaveOptions>
      <SaveOption>
        <PropertyName>*</PropertyName>
        <SaveAction>UpdateAdd</SaveAction>
      </SaveOption>
    </SaveOptions>
  </Options>
  <Objects xsi:type="DataExtensionObject">
    <CustomerKey>Scores_DE</CustomerKey>
    <Properties>
      <Property><Name>SubscriberKey</Name><Value>0031x000001</Value></Property>
      <Property><Name>Score</Name><Value>87</Value></Property>
    </Properties>
  </Objects>
</UpdateRequest>
```

- Several `<Objects>` in one request = batch. Each one gets its own result.
- For large loads, send the batch **asynchronously** (`<RequestType>Asynchronous</RequestType>` in `Options`) and check results later.

## Perform and Execute

| Call | Example |
|---|---|
| `PerformRequest` with `Action = start` | Start a `QueryDefinition`, `ImportDefinition` or `TriggeredSendDefinition` |
| `ExecuteRequest` with `Name = LogUnsubEvent` | Unsubscribe a subscriber and tie it to a send (`SubscriberKey`, `JobID`, `ListID`, `BatchID`, `Reason`) |

`LogUnsubEvent` from AMPscript: [preference center](../cloudpages/preference-center/).

## Results to check

| Field | Meaning |
|---|---|
| `OverallStatus` | `OK`, `MoreDataAvailable`, `Error`, or a partial-success status for batches |
| `Results/StatusCode` | Per object: `OK` or `Error` |
| `Results/StatusMessage`, `ErrorCode` | Why an object failed |
| `RequestID` | Log it: support uses it to trace calls |

[← APIs](README.md)
