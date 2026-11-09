# AMPscript

[← Back to contents](README.md)

## 1. `LookupRows` has a row limit

**Problem:** a CloudPage or email that loops over `LookupRows` silently stops at around 2,000 rows.

**Fix:** for small sets, use `LookupOrderedRows` with an explicit count and order. For large sets, move to SSJS and paginate with WSProxy (see [SSJS note 1](ssjs.md)).

```
%%[
VAR @rows, @rowCount, @i, @row
SET @rows = LookupOrderedRows("Purchases_DE", 5, "PurchaseDate DESC", "SubscriberKey", _subscriberkey)
SET @rowCount = RowCount(@rows)

IF @rowCount > 0 THEN
  FOR @i = 1 TO @rowCount DO
    SET @row = Row(@rows, @i)
    /* Field(@row, "ProductName") */
  NEXT @i
ENDIF
]%%
```

## 2. Guard every write on a CloudPage

**Problem:** `UpsertData` runs when the page is opened, previewed or crawled, not only when the form is submitted. That creates empty or duplicated rows, and it errors in preview.

**Why:** AMPscript runs on the server every time the page renders.

**Fix:** write only when a real submission arrives and the input is valid.

```
%%[
VAR @submitted, @email, @message
SET @submitted = RequestParameter("submitted")

IF @submitted == "1" THEN
  SET @email = Trim(RequestParameter("email"))

  IF IsEmailAddress(@email) THEN
    UpsertData("Form_Leads_DE", 1, "EmailAddress", @email, "CreatedAt", Now())
    SET @message = "Thanks! We got your details."
  ELSE
    SET @message = "Please enter a valid email address."
  ENDIF
ENDIF
]%%
<form method="post" action="%%=RequestParameter('PAGEURL')=%%">
  <input type="email" name="email" required>
  <input type="hidden" name="submitted" value="1">
  <button type="submit">Send</button>
</form>
<p>%%=v(@message)=%%</p>
```

## 3. Encode each URL parameter, not the whole URL

**Problem:** links built with `Concat()` and then encoded break: `?`, `&` and `=` get encoded too and the landing page can't read the parameters.

**Fix:** encode each value on its own, then build the URL.

```
%%[
VAR @url
SET @url = Concat(
  "https://example.com/offer",
  "?email=", URLEncode(@email, 1, 1),
  "&campaign=", URLEncode(@campaign, 1, 1)
)
]%%
<a href="%%=RedirectTo(@url)=%%">See your offer</a>
```

## 4. Always plan for empty values

**Problem:** personalization shows "Hi ," or breaks a sentence when the field is empty.

**Fix:** check with `Empty()` and set a fallback before using the value.

```
%%[
VAR @firstName
SET @firstName = AttributeValue("FirstName")
IF Empty(@firstName) THEN
  SET @firstName = "there"
ELSE
  SET @firstName = ProperCase(@firstName)
ENDIF
]%%
Hi %%=v(@firstName)=%%,
```
