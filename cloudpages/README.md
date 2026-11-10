# CloudPages

Ready-to-adapt CloudPages built with AMPscript. Each folder is a small technical sheet: what the page does, the data extensions it needs, how to set it up and the full code.

| Page | What it shows | Status | Live preview |
|---|---|---|---|
| [Thank-you page](thank-you-page/) | Personalized confirmation using encrypted parameters | Ready to test | [open](https://igorbratti.github.io/sfmc-handbook/cloudpages/thank-you-page/preview.html) |
| [Birthday page](birthday-page/) | Personalized birthday message with a unique coupon (`ClaimRowValue`) | Ready to test | [open](https://igorbratti.github.io/sfmc-handbook/cloudpages/birthday-page/preview.html) |
| [Lead capture form](lead-capture-form/) | Click-to-lead form: validation, honeypot, consent, UTM source, optional Sales Cloud lead | Ready to test | [open](https://igorbratti.github.io/sfmc-handbook/cloudpages/lead-capture-form/preview.html) |
| [Preference center](preference-center/) | Topic preferences + "unsubscribe from all" with `LogUnsubEvent` | Ready to test | [open](https://igorbratti.github.io/sfmc-handbook/cloudpages/preference-center/preview.html) |

Previews use sample data. The real pages run AMPscript inside Marketing Cloud.

## Conventions used in every page

- **Encrypted parameters.** Links use `CloudPagesURL()`, so values like the subscriber key travel encrypted. Never pass a subscriber key in plain text: anyone could change it and see or edit someone else's data.
- **Writes only on real submissions.** AMPscript runs on every render (open, preview, crawler). Data is written only when the form's hidden `submitted` field arrives and the input is valid.
- **No user input echoed back.** Error messages are fixed text, to avoid injecting what the user typed into the page.
- **`noindex`** on pages that show personal data.

## Creating a CloudPage

1. **Web Studio → CloudPages** → open or create a collection.
2. **Add Content → Landing Page** → choose a blank layout.
3. Add an **HTML block** (or switch to code view) and paste `src/page.html`.
4. Create the data extensions listed in the page's README.
5. **Publish**, then copy the page ID (used in `CloudPagesURL(pageId, ...)`).

[← Back to the handbook](../README.md)
