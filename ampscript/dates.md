# Dates

> **Type:** Recipes · Time zones, date math, formats by language and the traps around "now".

[← AMPscript](README.md)

## Know your "now"

| Function | Returns |
|---|---|
| `Now()` | Server time: **US Central, UTC−6, no daylight saving**, at the moment of rendering |
| `Now(1)` | The original send time, even when the email is opened later as a web page |
| `SystemDateToLocalDate(Now())` | Server time converted to the time zone configured for the account/user |
| `DateAdd(Now(), 3, "H")` | Explicit conversion to Brasília time (UTC−3, no daylight saving since 2019) |

Use the explicit conversion when the account's time zone setting is not the audience's time zone, or when you want the code to be readable without checking setup.

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
SET @daysLeft = DateDiff(FormatDate(SystemDateToLocalDate(Now()), "yyyy-MM-dd"), FormatDate(@expires, "yyyy-MM-dd"), "D")
]%%
%%[ IF @daysLeft > 0 THEN ]%%
  Only %%=v(@daysLeft)=%% days left!
%%[ ENDIF ]%%
```
`DateDiff(start, end, unit)` returns `end − start`. Units: `Y`, `M`, `D`, `H`, `MI`. Formatting both sides as `yyyy-MM-dd` compares calendar days and ignores the time of day.

## Same date, different languages
```ampscript
%%=FormatDate(@in7, "MMMM d, yyyy", "", "en-US")=%%   → December 8, 2026
%%=FormatDate(@in7, "d 'de' MMMM 'de' yyyy", "", "pt-BR")=%%   → 8 de dezembro de 2026
%%=FormatDate(@in7, "dddd", "", "pt-BR")=%%   → terça-feira
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
Most useful on CloudPages, where the content is generated when the page opens. In emails it reflects the send time, which with Einstein STO can differ per subscriber.

## Parse dates from text
```ampscript
%%[
/* "31/12/2026" (Brazilian format) → date */
SET @raw = "31/12/2026"
SET @date = DateParse(Concat(Substring(@raw, 7, 4), "-", Substring(@raw, 4, 2), "-", Substring(@raw, 1, 2)))
]%%
```
Rebuilding the string as `yyyy-MM-dd` avoids day/month ambiguity regardless of server culture.

## Last day of the current month
```ampscript
%%[
SET @firstOfMonth = DateParse(FormatDate(Now(), "yyyy-MM-01"))
SET @lastOfMonth = DateAdd(DateAdd(@firstOfMonth, 1, "M"), -1, "D")
]%%
```

Related: [SQL dates and time zones](../sql/dates-and-time-zones.md).

[← AMPscript](README.md)
