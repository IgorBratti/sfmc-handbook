# Content blocks and dynamic content

> **Type:** Guide + recipes · Reuse content across emails, choose content by data and measure which block drove the click.

[← AMPscript](README.md)

---

## Reference content by key

```ampscript
%%=ContentBlockByKey("footer_br_v2")=%%
```

| Function | Survives folder moves | Survives copy to another BU | Readability |
|---|---|---|---|
| `ContentBlockByKey` | ✔ | ✔ (keep the same key) | ✔ |
| `ContentBlockByID` | ✔ | ✘ IDs change | ✘ |
| `ContentBlockByName` | ✘ breaks on rename/move | ✘ | ✔ |

Set a clear **customer key** on every reusable block (`footer_br_v2`, `hero_xsell_offerA`). Keys are the API of your content library.

### Safe include with a fallback

```ampscript
%%=ContentBlockByKey(@heroKey, "hero", false, "")=%%
```

The third argument (`false`) avoids an error when the key doesn't exist and the fourth is the default content. Useful when the key comes from data.

## Choose content by data

### Small number of variants: IF

```ampscript
%%[
SET @segment = AttributeValue("Segment")
IF @segment == "Champion" THEN
  SET @heroKey = "hero_champion"
ELSEIF @segment == "At risk" THEN
  SET @heroKey = "hero_winback"
ELSE
  SET @heroKey = "hero_default"
ENDIF
]%%
%%=ContentBlockByKey(@heroKey)=%%
```

### Many variants: a mapping DE

When marketing changes offers often, keep the rules in a data extension instead of the code.

| `Offer_Map_DE` | Type | PK |
|---|---|---|
| `Segment` | Text 50 | ✔ |
| `ContentKey` | Text 100 | |

```ampscript
%%[
SET @heroKey = Lookup("Offer_Map_DE", "ContentKey", "Segment", AttributeValue("Segment"))
IF Empty(@heroKey) THEN SET @heroKey = "hero_default" ENDIF
]%%
%%=ContentBlockByKey(@heroKey, "hero", false, ContentBlockByKey("hero_default"))=%%
```

Marketing updates the DE; the email doesn't change.

### Content Builder Dynamic Content block

The drag-and-drop **Dynamic Content** block builds the same IF logic through rules on attributes. Prefer it when non-technical users maintain the rules; prefer AMPscript when the rules need lookups, dates or calculations.

## Measure blocks with impression regions

Impression regions tag the links inside a region so click reports show **which variant** produced the click.

```ampscript
%%=BeginImpressionRegion(Concat("hero_", @segment))=%%
  %%=ContentBlockByKey(@heroKey)=%%
%%=EndImpressionRegion()=%%
```

Compare variants with the impression region data available in tracking extracts and reports. Keep region names short and stable: they are your reporting dimension.

## Content stored in data

When the copy itself lives in a data extension (for example, a personalized paragraph per product), render it with `TreatAsContent` so AMPscript inside the text runs:

```ampscript
%%=TreatAsContent(Lookup("Product_Copy_DE", "Paragraph", "ProductId", @productId))=%%
```

Treat that DE as code: only trusted users write to it, because whatever AMPscript is stored there will run.

## Shared code snippets

Put repeated logic (fallbacks, link signing, UTM building) in a **Code Snippet** block and include it at the top of each email:

```ampscript
%%=ContentBlockByKey("lib_common_vars")=%%
<!-- now @firstName, @sig, @utm are available below -->
```

Variables are global to the message, so everything the snippet sets is visible to the rest of the email. Version the key when you make breaking changes (`lib_common_vars_v2`).

[← AMPscript](README.md)
