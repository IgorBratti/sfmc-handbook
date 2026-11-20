# Emails

Responsive, Outlook-safe building blocks for **Salesforce Marketing Cloud** Content Builder, AMPscript examples and the guides behind them: rendering, deliverability and how the Content Builder pieces fit together.

**Live preview of the base template:** https://igorbratti.github.io/sfmc-handbook/emails/templates/base-template-preview.html

## Guides

| File | What's inside |
|---|---|
| [rendering-guide.md](rendering-guide.md) | Client landscape, structure, Outlook and Gmail essentials, dark mode, images, accessibility, preheader, test checklist |
| [deliverability.md](deliverability.md) | SPF/DKIM/DMARC and SAP, bulk sender requirements, reputation, IP warming, bounce categories, monitoring |
| [content-builder-guide.md](content-builder-guide.md) | Assets, sender/delivery profiles, send classifications, sending sources, tracking, optimization features, naming |
| [amp/](amp/) | AMP for Email in Marketing Cloud: requirements, structure, use cases |

## Library

```
templates/
  base-template.html            Full responsive template (600px, mobile stacking, Outlook fixes, compliance footer)
  base-template-preview.html    Same template with sample values, for the GitHub Pages preview
blocks/
  button.html                   Bulletproof button (VML for Outlook)
  hero-image.html               Linked hero image with alt text and loading background
  image-text.html               Image + text, side by side on desktop, stacked on mobile
  two-columns.html              Two text columns that stack on mobile
  footer.html                   Web version, preferences (system or custom CloudPage), unsubscribe, address
examples/
  personalized-hero.html        AMPscript: name fallback + tracked link with encoded parameters
  dynamic-content-by-segment.html  Offer chosen from a mapping DE + impression region per segment
  order-items-table.html        Order lines from a DE with totals, skipping the send when there are no items
```

| File | Stack | Status |
|---|---|---|
| `templates/base-template.html` | HTML/CSS, VML | Ready to test |
| `blocks/*` | HTML/CSS, VML | Ready to test |
| `examples/personalized-hero.html` | AMPscript | Ready to test |
| `examples/dynamic-content-by-segment.html` | AMPscript (`LookupRows`, impression regions) | Ready to test |
| `examples/order-items-table.html` | AMPscript (`LookupOrderedRows`, `RaiseError`) | Ready to test |

## Design decisions

- **Tables for layout, inline styles** for consistent rendering across Gmail, Outlook, Apple Mail and mobile clients.
- **600 px container** that becomes full width under 620 px; columns stack with the `.stack` class.
- **Bulletproof buttons:** VML for Outlook desktop, a styled link elsewhere.
- **Hidden preheader with filler**, so the inbox preview shows your text and not the first line of the body.
- **Every link has an `alias`**, so click reports are readable.
- **Footer text contrast** meets WCAG AA (≥ 4.5:1).
- **Compliance footer** with Marketing Cloud personalization strings (`%%unsub_center_url%%`, `%%profile_center_url%%`, `%%Member_Addr%%`…), filled in at send time.

## Using it in Content Builder

1. Create a **Template** from `templates/base-template.html`, or paste it into an HTML email.
2. Save each file in `blocks/` as a **Code Snippet** or **HTML block** with a clear customer key (`blk_button_primary_v1`) and include it with `ContentBlockByKey`.
3. Keep brand colors in one place: search and replace `#0b4f8a` (accent) and `#1c2128` (text).
4. Run the [test checklist](rendering-guide.md#9-testing-before-every-important-send) before every important send.

[← Back to the handbook](../README.md)
