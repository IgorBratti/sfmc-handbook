# Building emails in Content Builder

> **Type:** Guide · How the Marketing Cloud pieces fit together when you build an email: assets, templates, blocks, profiles, classifications, tracking and testing.

[← Emails](README.md)

---

## 1. Assets and when to use each

| Asset | What it is | Use it for |
|---|---|---|
| **Template** | Locked layout with editable slots | Brand-controlled emails edited by non-developers |
| **Template-based email** | Email built from a template | Day-to-day campaigns |
| **HTML paste email** | Full HTML you own end to end | Developer-built emails, complex AMPscript |
| **Content block** (HTML, Free Form, Text, Image, Button…) | Reusable piece of content | Headers, footers, legal text, offers |
| **Code Snippet** | Block for code (AMPscript, HTML) without a WYSIWYG editor | Shared logic, variables, tracking snippets |
| **Dynamic Content block** | Block with rule-based variations | Segment content maintained by marketers |
| **Layout / Smart Capture / others** | Specialized blocks | Forms on CloudPages, layout grids |

Reference reusable blocks by **customer key** with `ContentBlockByKey`, not by name or ID ([content-blocks.md](../ampscript/content-blocks.md)).

## 2. Profiles and classifications

| Setting | Controls | Tip |
|---|---|---|
| **Sender Profile** | From name and From address (can be dynamic with AMPscript) | One profile per brand/purpose; reply address configured |
| **Delivery Profile** | IP address, header and footer content blocks | Keep legal footers here when every email must carry them |
| **Send Classification** | Sender profile + delivery profile + **Commercial** or **Transactional** type | Commercial = marketing (unsubscribe rules apply). Transactional = operational messages only (order confirmations, password resets) |

Using a transactional classification for marketing content is a compliance problem. Keep the two clearly separated.

## 3. Sending sources

| Source | Notes |
|---|---|
| **Sendable data extension** | Needs a **send relationship** (DE field ↔ Subscriber Key) and an email field. Standard for most sends |
| **Lists / publication lists** | Publication lists let people unsubscribe from one topic instead of everything |
| **Journey Builder** | Emails are triggered per contact; data comes from Journey Data and Contact Data |
| **Triggered Sends / Transactional Messaging API** | Real-time sends from systems ([apis/](../apis/rest-reference.md#transactional-messaging)) |

## 4. Tracking

| Feature | How |
|---|---|
| Click tracking | Automatic on `<a href>`; wrap AMPscript-built URLs with `RedirectTo()` |
| Link names in reports | `alias="hero_cta"` on each link (consistent naming across emails) |
| Variant reporting | Impression regions around content blocks ([content-blocks.md](../ampscript/content-blocks.md#measure-blocks-with-impression-regions)) |
| Web analytics | Web Analytics Connector or your own UTM convention ([links-and-cloudpages.md](../ampscript/links-and-cloudpages.md#utm-convention)) |
| Opens | Tracking pixel added automatically; inflated by privacy features, don't optimize on opens alone |

## 5. Optimization features

| Feature | Use for | Caveat |
|---|---|---|
| **A/B test** (Email Studio) | Subject, from name, content, send time on a one-off send | Test on a sample, then send the winner |
| **Path Optimizer** (Journey Builder) | Compare up to ten paths inside a journey | Define the winner metric before starting |
| **Einstein Send Time Optimization** | Per-contact send time within a window | Needs engagement history; changes hourly volume patterns |
| **Einstein Engagement Frequency** | Saturation insights per contact | Use with your own frequency rules |
| **Einstein Content Selection / Copy Insights** | Content and subject-line recommendations | Requires setup and data volume |

## 6. Preview and Test

1. **Preview** against a data extension with test records (full, partial, empty data).
2. **Inbox preview / rendering** for the main clients and dark mode ([rendering guide](rendering-guide.md)).
3. **Test send** to an internal list built from real-like data. Test sends execute AMPscript writes (`…DE` functions), Preview does not.
4. **Link check**: every link resolves and carries the right alias and parameters.
5. **Approvals** where the account uses them.

## 7. Naming conventions

Consistent names make assets searchable and reports readable. One pattern for every asset type:

```
<BU>_<TYPE>_<OBJECTIVE>_<DETAIL>_<VERSION>
B2C_EML_ONB_Welcome_v2          email
B2C_CB_FOOTER_Legal_v3          content block
B2C_SNIP_LIB_CommonVars_v1      code snippet (key: lib_common_vars_v1)
```

Folder structure mirrors the pattern (brand → objective → asset type). Never reuse a name for something different: create a new version.

[← Emails](README.md)
