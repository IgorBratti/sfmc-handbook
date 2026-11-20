# Email rendering guide

> **Type:** Guide · How to build HTML emails that look right in Outlook, Gmail, Apple Mail and mobile apps, in light and dark mode, and that everyone can read.

[← Emails](README.md) · Templates and blocks: [templates/](templates/) · [blocks/](blocks/)

---

## 1. The landscape in one table

| Client family | Rendering engine | What breaks most often |
|---|---|---|
| **Outlook desktop (Windows, classic)** | Microsoft Word | `div` layouts, `max-width`, background images, `border-radius`, `margin`, web fonts |
| **New Outlook / Outlook.com / Outlook apps** | Browser-based | Dark mode color changes, some `<style>` rules |
| **Gmail (web and apps)** | Browser-based, strict CSS sanitizer | Messages over ~102 KB get clipped; `<style>` dropped in some contexts; non-Google accounts in the Gmail app have weaker CSS support |
| **Apple Mail (macOS, iOS)** | WebKit | Very good support; auto-links dates, addresses and phone numbers |
| **Samsung Email, Yahoo, others** | Browser-based | Small differences in media queries and dark mode |

Design for the weakest client you must support (usually classic Outlook), then enhance for the others.

## 2. Structure

- **Tables for layout**, `role="presentation"` on every layout table so screen readers skip them.
- **600 px** container (`width="600"` attribute + `style="width:600px; max-width:600px"`), full width under ~620 px with a media query.
- **Ghost tables** for Outlook around anything that needs a fixed width:
  ```html
  <!--[if mso]><table role="presentation" width="600"><tr><td><![endif]-->
  …fluid content…
  <!--[if mso]></td></tr></table><![endif]-->
  ```
- **Inline styles** for everything that must survive (fonts, colors, padding). Use `<style>` only for media queries, dark mode and resets.
- **Padding on `<td>`**, not margins. Outlook ignores most margins.
- `<p>` and `<h1>` are fine, but always set `margin` explicitly (`margin:0 0 16px 0`).

## 3. Outlook desktop essentials

| Need | Technique |
|---|---|
| Rounded, clickable buttons | VML `v:roundrect` inside `<!--[if mso]>` + styled link elsewhere ([button.html](blocks/button.html)) |
| Correct scaling at 120 DPI | `o:OfficeDocumentSettings` with `PixelsPerInch 96` in the `<head>` (in the base template) |
| Images at the right size | `width` **attribute** on `<img>` (Outlook ignores CSS width on images) |
| Exact line heights | `mso-line-height-rule: exactly; line-height: 24px;` |
| No gaps between tables | `mso-table-lspace:0pt; mso-table-rspace:0pt;` and `border-collapse:collapse` |
| Background images | VML `v:rect` with `v:fill`, or accept a solid fallback color |
| Web fonts | Not supported: always declare a fallback stack (`Arial, Helvetica, sans-serif`) |

## 4. Gmail essentials

- **Clipping at ~102 KB** of HTML: Gmail hides the rest behind "View entire message" (including your footer and the open-tracking pixel). Keep the HTML lean: no comments, no unused CSS, compact AMPscript output.
- Gmail rewrites class names and drops `<style>` blocks it can't parse. Test any CSS selector beyond simple classes.
- Image URLs are proxied by Google, so images are cached; changing an image "in place" may not show.

## 5. Dark mode

Clients handle dark mode in different ways:

| Behavior | Clients (typical) | What you control |
|---|---|---|
| No change | Some webmail | Nothing to do |
| Partial inversion (light backgrounds darkened) | Outlook.com, Outlook apps, Gmail app on Android | Little: choose colors that survive inversion |
| Full inversion | Gmail app on iOS, some Outlook versions | Very little |
| Honors `prefers-color-scheme` | Apple Mail, some Outlook | Full control with a media query |

```html
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<style>
  @media (prefers-color-scheme: dark) {
    .bg-body { background-color:#121417 !important; }
    .text    { color:#e6e8eb !important; }
  }
  /* Outlook.com / Outlook apps */
  [data-ogsc] .text { color:#e6e8eb !important; }
  [data-ogsb] .bg-body { background-color:#121417 !important; }
</style>
```

Practical rules: logos with a transparent background need a light outline or a version for dark backgrounds; avoid pure black text on pure white images; test every send in at least one dark-mode client.

## 6. Images

- Always set `alt`, `width`, `height` (or `height:auto` in CSS), `border="0"` and `style="display:block"` for layout images.
- Many recipients see the email **with images off**: the message must still make sense. Key text and CTAs are live text, not images.
- Use 2× resolution images displayed at 1× width for sharp results on high-density screens; compress them.
- Host in Content Builder (or a CDN). Never hot-link from a site that may change or go offline.

## 7. Accessibility

| Check | Why |
|---|---|
| `lang` on `<html>` (`lang="pt-BR"`) | Screen readers pick the right voice |
| `role="presentation"` on layout tables | Tables aren't announced as data |
| Real headings (`<h1>`, `<h2>`) in order | Navigation for screen-reader users |
| Body text ≥ 14 px (16 px preferred), line height ~1.5 | Readability on mobile |
| Contrast ≥ 4.5:1 for text | WCAG AA |
| Descriptive link text ("See your benefits", not "click here") | Links are often read out of context |
| Meaningful `alt`, empty `alt=""` for decorative images | Images off and screen readers |
| Don't rely on color alone | Color-blind recipients |

## 8. Preheader

The text shown after the subject in the inbox. Put it as the first element in `<body>`, hidden, followed by a filler so the inbox doesn't pull body text into the preview:

```html
<div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
  %%=v(@preheader)=%%
  &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
</div>
```

Repeat the filler group as needed (around 100 characters of preview space in total is a good target).

## 9. Testing before every important send

- [ ] Rendering test (Content Builder Preview and Test → inbox preview, or a tool such as Litmus or Email on Acid) on Outlook desktop, Gmail web, Gmail app, Apple Mail iOS, dark mode
- [ ] Images off
- [ ] Mobile: tap targets ≥ 44 px, no horizontal scroll
- [ ] Every link and its tracking alias
- [ ] HTML size below the Gmail clipping limit
- [ ] Personalization with full, partial and empty data

[← Emails](README.md)
