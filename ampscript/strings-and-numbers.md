# Strings and numbers

> **Type:** Recipes · Cleaning, validating, formatting and safely printing text and numbers.

[← AMPscript](README.md)

## Clean an email before saving
```ampscript
%%[ SET @email = Lowercase(Trim(RequestParameter("email"))) ]%%
```

## Allow-list a value before printing it
AMPscript prints raw text, so anything that came from a URL or form must be checked before it goes into the HTML. `RegExMatch` returns the match, or an empty string when the value doesn't fit the pattern.
```ampscript
%%[
/* Codes, UTMs, IDs: letters, numbers, underscore, dot, hyphen */
SET @source = RegExMatch(RequestParameter("utm_source"), "^[A-Za-z0-9_.-]{1,50}$", 0)
IF Empty(@source) THEN SET @source = "direct" ENDIF

/* Names: any Unicode letter, space, apostrophe, hyphen */
SET @firstName = RegExMatch(RequestParameter("fn"), "^[\p{L} '-]{1,50}$", 0)
]%%
```
More in the [CloudPages security guide](../cloudpages/security.md#2-allow-list-every-value-you-print).

## Keep only the first name
```ampscript
%%[
VAR @full, @space, @first
SET @full = Trim(AttributeValue("FullName"))
SET @space = IndexOf(@full, " ")
IF @space > 0 THEN
  SET @first = Substring(@full, 1, Subtract(@space, 1))
ELSE
  SET @first = @full
ENDIF
SET @first = ProperCase(@first)
]%%
```

## Normalize a phone number
```ampscript
%%[
SET @phone = Replace(Replace(Replace(Replace(Trim(@phone), " ", ""), "-", ""), "(", ""), ")", "")
/* Brazilian mobile in E.164: +55 + DDD (2) + 9 digits */
IF Empty(RegExMatch(@phone, "^\+?55[1-9][0-9]9[0-9]{8}$", 0)) THEN
  SET @phoneValid = "false"
ENDIF
]%%
```

## Remove accents (for URLs, codes and WhatsApp template parameters)
```ampscript
%%[
SET @s = "Promoção São João"
SET @s = ReplaceList(@s, "a", "á", "à", "â", "ã")
SET @s = ReplaceList(@s, "e", "é", "ê")
SET @s = ReplaceList(@s, "i", "í")
SET @s = ReplaceList(@s, "o", "ó", "ô", "õ")
SET @s = ReplaceList(@s, "u", "ú", "ü")
SET @s = Replace(@s, "ç", "c")
SET @s = Replace(@s, " ", "_")
]%%
```
`Replace` and `ReplaceList` are case-sensitive: repeat for uppercase letters if your data has them, or run `Lowercase` first.

## Currency and numbers by culture
```ampscript
%%=FormatCurrency(1234.5, "pt-BR")=%%   → R$ 1.234,50
%%=FormatCurrency(1234.5, "en-US")=%%   → $1,234.50
%%=FormatNumber(0.1234, "P1", "en-US")=%%   → 12.3%
%%=FormatNumber(1234567, "N0", "pt-BR")=%%   → 1.234.567
```

## Numbers stored as text with a comma
Values like `"1234,56"` (Brazilian decimal) don't compare as numbers. Normalize before using them:
```ampscript
%%[ SET @amount = Replace(AttributeValue("Amount"), ",", ".") ]%%
%%[ IF Add(@amount, 0) > 100 THEN ]%% … %%[ ENDIF ]%%
```

## Truncate long text
```ampscript
%%[
SET @title = AttributeValue("ProductName")
IF Length(@title) > 40 THEN
  SET @title = Concat(Substring(@title, 1, 37), "...")
ENDIF
]%%
```

## Split a delimited list
```ampscript
%%[
SET @rows = BuildRowsetFromString("email,sms,whatsapp", ",")
FOR @i = 1 TO RowCount(@rows) DO
  SET @channel = Field(Row(@rows, @i), 1)
NEXT @i
]%%
```

[← AMPscript](README.md)
