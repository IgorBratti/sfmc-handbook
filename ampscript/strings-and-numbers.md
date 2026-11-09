# Strings and numbers

[← AMPscript recipes](README.md)

## Clean an email before saving
```ampscript
%%[ SET @email = Lowercase(Trim(RequestParameter("email"))) ]%%
```

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
%%[ SET @phone = Replace(Replace(Replace(Replace(Trim(@phone), " ", ""), "-", ""), "(", ""), ")", "") ]%%
```

## Currency and numbers by culture
```ampscript
%%=FormatCurrency(1234.5, "pt-BR")=%%   → R$ 1.234,50
%%=FormatCurrency(1234.5, "en-US")=%%   → $1,234.50
%%=FormatNumber(0.1234, "P1", "en-US")=%%   → 12.3%
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
