# Email components

Responsive, Outlook-safe email building blocks for **Salesforce Marketing Cloud** Content Builder, plus interactive AMP email templates.

**Live preview:** https://igorbratti.github.io/sfmc-handbook/emails/templates/base-template.html

## What's inside

```
templates/
  base-template.html      Full responsive template (600px, mobile stacking, Outlook fixes)
blocks/
  button.html             Bulletproof button (VML for Outlook)
  two-columns.html        Two columns that stack on mobile
  footer.html             Footer with view-in-browser, preferences, unsubscribe and address strings
examples/
  personalized-hero.html  AMPscript: name fallback + tracked link with encoded parameters
amp/
  ...                     Interactive AMP for Email templates
```

## Design decisions

- **Tables for layout, inline styles** for consistent rendering across Gmail, Outlook, Apple Mail and mobile clients.
- **600px container** that becomes full width under 620px; columns stack with the `.stack` class.
- **Bulletproof buttons**: VML for Outlook desktop, a styled link elsewhere, so the button never turns into a plain link.
- **Hidden preheader** to control the inbox preview text.
- **Compliance footer** using Marketing Cloud personalization strings (`%%unsub_center_url%%`, `%%profile_center_url%%`, `%%Member_Addr%%`…), filled in at send time.

## Using it in Content Builder

1. Create a **Template** from `templates/base-template.html`, or paste it into an HTML email.
2. Save each file in `blocks/` as a **Code Snippet** or **HTML block** to reuse across emails.
3. Keep brand colors in one place: search and replace `#0b4f8a` (accent) and `#1c2128` (text).
4. Always run **Preview and Test** and a rendering test before sending.

[← Back to the handbook](../README.md)
