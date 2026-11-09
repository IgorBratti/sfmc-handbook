# Lookups and loops

[← AMPscript recipes](README.md)

## One value
```ampscript
%%[ SET @plan = Lookup("Plans_DE", "PlanName", "SubscriberKey", _subscriberkey) ]%%
```

## Last 3 purchases, newest first
```ampscript
%%[
VAR @rows, @count, @i, @row
SET @rows = LookupOrderedRows("Purchases_DE", 3, "PurchaseDate DESC", "SubscriberKey", _subscriberkey)
SET @count = RowCount(@rows)
]%%
%%[ IF @count > 0 THEN ]%%
<ul>
  %%[ FOR @i = 1 TO @count DO
        SET @row = Row(@rows, @i) ]%%
    <li>%%=Field(@row, "ProductName")=%% · %%=FormatDate(Field(@row, "PurchaseDate"), "dd/MM/yyyy")=%%</li>
  %%[ NEXT @i ]%%
</ul>
%%[ ENDIF ]%%
```
Keep the count small. `LookupRows` stops at about 2,000 rows; for large sets use SSJS with WSProxy (see [ssjs](../ssjs/)).

## Build a comma-separated list
```ampscript
%%[
VAR @rows, @count, @i, @list
SET @rows = LookupRows("Interests_DE", "SubscriberKey", _subscriberkey)
SET @count = RowCount(@rows)
SET @list = ""
FOR @i = 1 TO @count DO
  SET @list = IIF(@i == 1, Field(Row(@rows, @i), "Interest"), Concat(@list, ", ", Field(Row(@rows, @i), "Interest")))
NEXT @i
]%%
Your interests: %%=v(@list)=%%
```

## Lookup with two conditions
```ampscript
%%[ SET @price = Lookup("Prices_DE", "Price", "ProductId", @productId, "Region", @region) ]%%
```
