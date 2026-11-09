# Personalization

[← AMPscript recipes](README.md)

## Fallback for empty fields
```ampscript
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
`AttributeValue` returns empty instead of raising an error when the field doesn't exist in the sendable data, which makes it safer than `[FirstName]`.

## One-line fallback with IIF
```ampscript
%%[ SET @city = IIF(Empty(AttributeValue("City")), "your city", ProperCase(AttributeValue("City"))) ]%%
```

## Content by segment
```ampscript
%%[
VAR @segment, @headline, @cta
SET @segment = AttributeValue("Segment")

IF @segment == "Champion" THEN
  SET @headline = "Thanks for being with us"
  SET @cta = "See your exclusive offer"
ELSEIF @segment == "At risk" THEN
  SET @headline = "We miss you"
  SET @cta = "Come back with 15% off"
ELSE
  SET @headline = "News picked for you"
  SET @cta = "Read more"
ENDIF
]%%
<h1>%%=v(@headline)=%%</h1>
```
Pair it with the [engagement segments query](../sql/scoring/) to fill `Segment`.

## Hide a block when there is nothing to show
```ampscript
%%[ IF NOT Empty(AttributeValue("CouponCode")) THEN ]%%
  <p>Your coupon: <strong>%%=v(AttributeValue("CouponCode"))=%%</strong></p>
%%[ ENDIF ]%%
```
