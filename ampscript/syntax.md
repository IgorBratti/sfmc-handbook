# AMPscript syntax

> **Type:** Reference · The language rules in one page: delimiters, variables, types, operators, control flow and evaluation order.

[← AMPscript](README.md) · Functions: [functions.md](functions.md)

---

## Delimiters

| Syntax | Use | Example |
|---|---|---|
| `%%[ … ]%%` | Code block: declarations, logic, calls with no output | `%%[ SET @name = "Maria" ]%%` |
| `%%= … =%%` | Inline expression: prints the result of one function | `%%=v(@name)=%%` |
| `%%FieldName%%` | Personalization string: prints an attribute or system value | `%%FirstName%%`, `%%emailaddr%%` |
| `<script runat="server" language="ampscript">` | Code block written as a script tag | Handy in editors that mangle `%%[` |

Inside a block, output is produced with `Output()` or `OutputLine()`:

```ampscript
%%[ IF @isVip THEN Output(Concat("<p>Welcome back, ", @name, "</p>")) ENDIF ]%%
```

## Variables

```ampscript
%%[
VAR @firstName, @count          /* declaration is optional but documents intent */
SET @firstName = "Maria"
SET @count = 3
]%%
```

- Names start with `@`. Keywords, function names and variable names are **case-insensitive** (`@Name` and `@name` are the same variable).
- Variables are global to the message or page: a variable set in a content block is visible in the email that includes it (and the other way around), in evaluation order.
- Undeclared, unset variables print as empty.

## Types and literals

| Type | Literal | Notes |
|---|---|---|
| String | `"text"` or `'text'` | Escape a quote by doubling it: `"She said ""hi"""` |
| Number | `42`, `3.14` | No thousands separator |
| Boolean | `true`, `false` | Fields return `"True"`/`"False"` strings; compare with `Lowercase(@x) == "true"` |
| Date | `"2026-12-31"`, `"2026-12-31 08:00"` | Use ISO-like formats; `DateParse` for others |
| Rowset / row | from `LookupRows`, `Row` | Use `RowCount`, `Row`, `Field` |
| Null | `NULL` (from data) | Test with `Empty()` (covers null and empty string) |

## Operators

| Operator | Meaning |
|---|---|
| `==`, `!=` | Equal, not equal (string comparison is case-insensitive) |
| `<`, `>`, `<=`, `>=` | Numeric/date comparison when both sides are numbers or dates |
| `AND`, `OR`, `NOT` | Logical operators |
| `( )` | Grouping |

There are no arithmetic operators: use `Add`, `Subtract`, `Multiply`, `Divide`, `Mod`.

## Control flow

```ampscript
%%[
IF @segment == "Champion" THEN
  SET @cta = "See your exclusive offer"
ELSEIF @segment == "At risk" AND NOT Empty(@coupon) THEN
  SET @cta = "Come back with 15% off"
ELSE
  SET @cta = "Read more"
ENDIF

FOR @i = 1 TO RowCount(@rows) DO
  SET @row = Row(@rows, @i)
NEXT @i

FOR @i = 10 DOWNTO 1 DO
  /* countdown */
NEXT @i
]%%
```

- `FOR` loops need a counter variable and fixed bounds. There's no `WHILE` and no `BREAK`; use an `IF` flag to skip the rest of the iterations.
- Mixing HTML inside loops is common: close the block, write HTML, reopen the block (`]%% <li>…</li> %%[`).

## Comments

`/* … */` inside `%%[ ]%%` blocks only. HTML comments (`<!-- -->`) outside blocks are sent to the recipient.

## Attributes: three ways to read a field

| Syntax | When the field doesn't exist |
|---|---|
| `%%FirstName%%` | Error at send / validation |
| `[FirstName]` inside a block | Error at send / validation |
| `AttributeValue("FirstName")` | Returns empty, no error. **Preferred in shared content blocks** |

Field names with spaces: `[First Name]`, `%%First Name%%`, `AttributeValue("First Name")`.

## Evaluation order in emails

1. The **HTML body** is processed first, top to bottom, including content blocks in the order they appear.
2. The **text version** is processed next.
3. The **subject line** and **preheader** are processed after the body.

Practical consequence: set `@subject` or `@preheader` in the body and print them with `%%=v(@subject)=%%` in the subject field. Lookups done once in the body don't need to be repeated in the subject.

## Where AMPscript runs

| Context | Notes |
|---|---|
| Emails (HTML, text, subject, preheader) | Runs per subscriber at send time; data writes use the `…DE` functions |
| CloudPages / microsites | Runs on every page render; data writes use the `…Data` functions |
| SMS (MobileConnect), push, WhatsApp content | Supported with limits; test in each channel |
| Content blocks | Run in the context of the message or page that includes them |

See [data-writes.md](data-writes.md) for the `…DE` vs `…Data` rule.

[← AMPscript](README.md)
