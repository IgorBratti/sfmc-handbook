# Dates

[← AMPscript recipes](README.md)

`Now()` returns the server time (US Central Time). Convert it before showing dates to people.

## Local "today" and "in 7 days"
```ampscript
%%[
VAR @today, @in7
SET @today = SystemDateToLocalDate(Now())
SET @in7 = DateAdd(@today, 7, "D")
]%%
Offer valid until %%=FormatDate(@in7, "dd/MM/yyyy", "", "pt-BR")=%%.
```

## Days until a date
```ampscript
%%[
VAR @expires, @daysLeft
SET @expires = AttributeValue("ExpiresAt")
SET @daysLeft = DateDiff(SystemDateToLocalDate(Now()), @expires, "D")
]%%
%%[ IF @daysLeft > 0 THEN ]%%
  Only %%=v(@daysLeft)=%% days left!
%%[ ENDIF ]%%
```
`DateDiff(start, end, unit)` returns `end − start`. Units: `Y`, `M`, `D`, `H`, `MI`.

## Same date, different languages
```ampscript
%%=FormatDate(@in7, "MMMM d, yyyy", "", "en-US")=%%   → December 8, 2026
%%=FormatDate(@in7, "d 'de' MMMM 'de' yyyy", "", "pt-BR")=%%   → 8 de dezembro de 2026
```

## Greeting by time of day
```ampscript
%%[
VAR @hour, @greeting
SET @hour = DatePart(SystemDateToLocalDate(Now()), "H")
IF @hour < 12 THEN
  SET @greeting = "Good morning"
ELSEIF @hour < 18 THEN
  SET @greeting = "Good afternoon"
ELSE
  SET @greeting = "Good evening"
ENDIF
]%%
```
Most useful on CloudPages, where the content is generated when the page opens. In emails it reflects the send time.
