# Remote Work Union — Claude Context

Static HTML site at `/Users/dylanrhodes/Documents/remoteworkunion/`. No framework, no build step. Live at `https://www.remoteworkunion.com/`. Backend is one serverless function, `api/airtable.js`, fronting an Airtable base ("Newsletter Subscribers" table).

---

> **ALWAYS PUSH AFTER EVERY CHANGE. No exceptions. A local edit that isn't deployed is an incomplete task.**

---

## Critical rules (read first)

1. **Always deploy after every change.** Vercel auto-deploys on push to `main`. Never stop at a local edit. Do not report a task as done until the push succeeds.
   ```
   git add <files> && git commit -m "..." && git push origin main
   ```
2. **New root-level static assets must be whitelisted in `vercel.json`.** `vercel.json` uses an explicit `builds` array. Any new file in the project *root* that must be publicly served (images, SVGs, fonts) **must** get its own entry or Vercel silently 404s it. Files under `blog/` are already covered by the `blog/**` glob.
   ```json
   { "src": "logo.svg", "use": "@vercel/static" }
   ```
3. **When articles are ready in `/Users/dylanrhodes/Downloads/`, publish ALL of them at once.** Never publish just one when multiple are present. Inspect all article folders first, then build all HTML files and images in parallel (spawn parallel subagents or process simultaneously), do a single commit+push for the batch, then delete all processed source folders and zips from Downloads.

   **Finding article packages — always use this command first:**
   ```
   ls -d /Users/dylanrhodes/Downloads/*/
   ```
   This lists ALL subdirectories regardless of naming convention. Article packages may be named `article_NNN_*`, `rwu_article_NNN_*`, or anything else. Never rely on grep patterns — any subdirectory in Downloads could be an article package. Before starting any publish work, run the above command and inspect every directory.

## Constants

| Key | Value |
|-----|-------|
| Google Analytics | `G-J84MSTXMXF` |
| Twitter | `@RemoteWorkUnion` |
| Canonical base | `https://www.remoteworkunion.com/blog/[slug]` |
| OG fallback image | `https://www.remoteworkunion.com/og.png` |
| Published ISO date | `2026-06-04T00:00:00Z` (use today's date) |
| Display date | `June 4, 2026` |

---

## Adding a new article — do exactly 4 things

1. Create `/blog/[slug].html`. Template reference: article 46, `how-to-get-accepted-for-remote-ai-training-jobs-faster.html`.
2. Add an article card to `/blog/index.html`, inserted **before** the previous newest-article comment.
3. Add the URL to `/sitemap.xml` and bump the blog `<lastmod>` date.
4. Delete **both** the source package folder(s) **and** the zip file(s) from `/Users/dylanrhodes/Downloads/`. Always delete both — the zip is not automatically removed when the folder is extracted.
   ```
   rm -rf /Users/dylanrhodes/Downloads/article_NNN_* && rm -f /Users/dylanrhodes/Downloads/article_NNN_*.zip
   ```

### Article page structure
- **`<head>`** — title, meta description, keywords, canonical, OG tags, Twitter tags, GA script, 3× JSON-LD schemas (BlogPosting, BreadcrumbList, FAQPage), fonts, `article-styles.css`, inline `<style>` block.
- **`<body>`** — read-progress bar, nav, `<article>`, breadcrumb, hero img, tag + h1 + subtitle + meta + divider, top CTA, body div, bottom CTA block, share row, related-articles grid, footer, scroll-progress script.
- Inline `<style>` classes every article needs (copy the full block from article 33 or 34): `#read-progress`, `.breadcrumb`, `.article-cta-top`, `.cta-btn-sm`, `.tip-box`, `.pull-quote`, `.article-img-full`, `.share-row`, `.share-btn`, `.related-grid`, `.related-card`, `.related-card-tag/.title/.cta`, `.faq-item`, `.toc`, `.mid-cta`, `.positioning-example`.

### Article card HTML (for `/blog/index.html`)
```html
<!-- ARTICLE NN -->
<a class="article-card" href="/blog/[slug]" onclick="gtag('event','article_opened',{article_slug:'[slug]'})">
  <img class="article-card-img"
    src="/blog/images/article[NN]_main_1200x630.png"
    alt="[descriptive alt text] — Remote Work Union Article NN"
    width="1200" height="630" loading="lazy"
    style="width:100%;height:auto;object-fit:contain;">
  <div class="article-card-body">
    <p class="article-card-tag">[Category]</p>
    <h2 class="article-card-title">[Title]</h2>
    <p class="article-card-desc">[2-sentence description]</p>
    <p class="article-card-meta">[Display Date] &middot; [N] min read</p>
    <span class="article-card-cta">Read More →</span>
  </div>
</a>
```

### Sitemap entry
```xml
<url>
  <loc>https://www.remoteworkunion.com/blog/[slug]</loc>
  <lastmod>2026-06-04</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

### Images
- Destination `/blog/images/`. Source usually `/Users/dylanrhodes/Downloads/RemoteWorkUnion_Article[NN]_*/`.
- Naming: `article[NN]_main_1200x630.png`, `article[NN]_[descriptor]_1200x630.png`. All 1200×630.
- **OG/Twitter dimensions must match the actual file.** Always set all four tags (`og:image:width/height`, `twitter:image:width/height`). Don't assume 1200×630 — verify with `sips -g pixelWidth -g pixelHeight <file>`.

### Cross-linking targets (platforms referenced across articles)
- Mercor → `/blog/how-to-get-a-mercor-remote-job`
- Outlier AI → `/blog/how-outlier-ai-works-remote-ai-training-jobs-pay-application-tips`
- Handshake AI → `/blog/how-handshake-ai-works-ai-fellowships-referrals-remote-work`
- Platform comparison → `/blog/best-remote-work-sites-ai-training-expert-review-ai-research`
- Resume guide → `/blog/remote-work-resume-guide`

---

## Article Review Rules

> **Scope:** These rules govern a **periodic, on-request content review/update pass** (the kind run manually, in batches, when explicitly asked). They are **not** part of the publish workflow. Do **not** apply or scan for them when publishing new articles — the "Adding a new article — do exactly 4 things" flow above is unchanged and stays fast. This review is run periodically by request; publishing should never trigger it.

Standing rules for a blog content review/update pass. Apply consistently across sessions when doing such a pass.

**Core platforms (dashboard/journey context):** The required steps for 100% completion are **Handshake, Mercor, and micro1 — in that order**. This is the "core three" for onboarding/journey-specific framing (e.g. "how to get started," "steps to reach 100%"). Outlier AI and RentAHuman are separate bonus opportunities in this specific context.

**General platform-list mentions:** Outside of the dashboard/journey context — e.g. "platforms worth checking," "apply to these platforms," keyword lists, "where to find this work" — list all **four** platforms naturally together: **Handshake, Mercor, micro1, and Outlier AI**. Do NOT add caveats like "(with Outlier as a bonus)," "(Outlier is secondary)," or similar demotions in these general contexts. Outlier AI gets included normally, no special treatment. RentAHuman can remain framed as a genuine bonus/secondary option since that's accurate.

**Audience framing:** RWU's audience is primarily business, marketing, sales, finance, customer service, social media, creative/writing, and general/entry-level professionals — not just technical/medical/legal/coding backgrounds. Content should **prioritize relatable business/generalist examples as the lead/default framing** for high-pay or expert-tier roles. This does NOT mean removing or excluding doctors, lawyers, engineers, or other technical/professional examples — keep them in the mix, just don't let them be the default or only framing.

**Pay anchors:** **$50–$200/hr** for expert-tier work; **$20+/hr** general floor. Keep pay claims consistent with these figures across articles.

**Outlier-specific articles:** Articles whose premise is specifically about Outlier AI (e.g. "Is Outlier AI Legit?", "Outlier AI Review", three-way platform comparisons) should keep their Outlier-focused framing intact — these rules don't mean rewriting their core premise.

**Consistency check:** Any article review pass should check alignment with the current FAQ (`work.html`), the resume guide (`blog/remote-work-resume-guide.html`), and `work.html`'s "Top Platforms to Apply" section, since these are the canonical sources of current positioning.

---

## Dynamic nav buttons

- **Blog pages (`blog/*.html`)** — top-right nav anchor `id="blog-nav-home-btn"`, label in a `<span>`. An inline `<script>` right after the `</a>` (inside `<nav class="blog-nav">`) sets the span to `Join Free` when `localStorage.rwu_email` is falsy. Href always `https://www.remoteworkunion.com/`. Logo + label in both states. Exact markup in `blog/article-template.html`.
- **`work.html`** — Join Free link `id="nav-cta-btn"`. Inline `<script>` right after `</nav>` checks `localStorage.rwu_email`; if present, swaps href to the homepage, injects `logo.svg + "Dashboard →"`, sets `display:inline-flex`.

## Referral share button (blog articles)

Every article has `<div id="rwu-ref-share"></div>` (just above `<span class="article-tag">`, below the hero image) and `<script src="/blog/referral-share.js"></script>` before `</body>`. At runtime the script reads `localStorage.rwu_email` and `localStorage.rwu_ref_code`:
- **Signed in** → ghost pill that copies `https://www.remoteworkunion.com/blog/[slug]?ref=THEIRCODE`.
- **Signed out** → "Join to get your referral link" button → homepage.

`rwu_ref_code` is set in `index.html` wherever `rwuRefCode` is assigned (`atCreate`, `atFetch`). Styles: `.rwu-ref-share-btn` in `blog/article-styles.css`.

---

## Dashboard (`index.html`)

### Main flow — 4 tracked steps
**Join → Handshake → Mercor → micro1.** These four drive the progress bar. **Outlier AI and RentAHuman are bonus cards** in the "More Opportunities" dropdown — not part of the journey.

DOM order inside `#hs-card`: `#hs-apply` (Handshake) → `#ot-apply` (Outlier, bonus) → `#mc-apply` (Mercor) → `#m1-apply` (micro1) → `#rh-apply` (RentAHuman, bonus) → `#rg-teaser` → `#hs-progress` (dashboard).

`rwu_step` numbering: newsletter `1`, handshake `2`, mercor `3`, outlier `4`, rentahuman `5`, micro1 `6`.

### Step-dot indicators (4-dot journey)
- Handshake: 1 filled (`done`), animation on dot 2 (`current`), 2 empty.
- Mercor — all 3 dot sets (`#mc-main`, `#africa-intro`, `#english-intro`): 2 filled, animation on dot 3, 1 empty.
- micro1 (`#m1-apply`): 3 filled, animation on dot 4.
- Outlier & RentAHuman (bonus): unchanged 2-dot setup.

### micro1 card (`#m1-apply`)
Modeled exactly on Mercor's `#mc-main` (no flag intro slides). Title "Apply to micro1 AI", "✓ Now Hiring" tag, Earn $50–$200/hr, "View Process" toggle (`#m1-process`), same already-applied / undo / skip / hide controls. **Brand token "micro1" is always lowercase.** Referral CTA → `https://refer.micro1.ai/referral/jobs?referralCode=31448f90-0533-4e10-a122-5be8bae5855d&utm_source=referral&utm_medium=share&utm_campaign=job_referral`. Uses `rwu_step` `6`; applied state under key `micro1` in `rwu_applied`; persisted to Airtable boolean field **`micro1 Applied`** (mirrors `Mercor Applied`).

### Progress / 100% logic
`updateProgressBar()` uses `stepMap = [handshake, mercor, micro1]`; `total = active.length + 1` (the +1 is the newsletter). Each active main step is worth a proportional share (25% each when none skipped/hidden). **100% requires Join + Handshake + Mercor + micro1.** Skipped/hidden steps are excluded from the denominator. The resume-optimizer nudge fires at `pct === 100`.

### Flow routing
- Mercor confirm/already → `showmicro1` (non-dash) or `goToDashboard` (from dashboard).
- micro1 confirm/already → `showProgress` (non-dash) or `goToDashboard`.
- `showProgress(fromEl)` fades `fromEl || m1Apply` into the dashboard.
- Flag banners (Africa/English) route into the **Mercor** card intro slides only — micro1 has no flag.

### localStorage keys
`rwu_email`, `rwu_step`, `rwu_applied` (comma-joined keys), `rwu_skipped`, `rwu_hidden`, `rwu_record_id`, `rwu_ref_code`, `rwu_ref`, `rwu_flag_dismissed_[id]`.

---

## Referral system

### Airtable fields
- `Referral Code` (text) — unique 8-char uppercase alphanumeric, generated on signup or backfilled on an existing user's first dashboard load.
- `Referred By` (text) — referral code of whoever referred this user; set on create when `?ref=` was in the URL.
- `Referral Count` (number) — `+1` each time someone signs up via this user's link.

### `?ref=` flow
- Any page load captures `?ref=VALUE` into `localStorage.rwu_ref`.
- On signup (`atCreate`), if `rwu_ref` is set and differs from the new user's own code, store `Referred By`, clear `rwu_ref`, and increment the referrer's count server-side via `incrementReferral`. Self-referral blocked (`refBy !== refCode`).

### API action `incrementReferral`
`POST /api/airtable` `{ action: 'incrementReferral', referralCode: '<code>' }`. Finds the record with matching `Referral Code`, patches `Referral Count += 1`. Does **not** touch `Last Activity Date` (fires for the referrer, not the current user).

### Dashboard invite UI
"Invite a Friend" ghost pill in the dashboard (`hs-progress`), below "View Latest Opportunities on X", shown only when signed in with a referral code. Expands to the personal link, a copy button, the referral count, and a "Rewards coming soon" note.

### `api/airtable.js` actions (reference)
`search`, `create`, `patch`, `appendField`, `incrementReferral`, plus GET (`?email=` lookup, `?count=true[&today=...]`). `patch`/`create` spread `fields` generically, so any field name passes through — **Airtable silently rejects writes to fields that don't exist**, so field-name casing must match the schema exactly.

---

## Dashboard flag banners (targeted geo push)

Hardcoded in `index.html` as the `DASHBOARD_FLAGS` array (no Airtable table). On each dashboard render, `evaluateAndShowFlag()` (called from `updateProgressBar()`) matches `rwuUserCountry` (from the Airtable `Country` field via `atFetch`) against each flag's `countries` with `.toLowerCase()`. First non-dismissed match renders a banner above the progress list (`#active-flag-banner`) with an "Apply Now →" button and ✕ dismiss. Clicking the banner or button triggers the flag action; dismiss sets `localStorage.rwu_flag_dismissed_[id]` (persistent).

Flag object: `id` (unique slug + dismiss key), `countries` (**lowercase** full names *and* ISO codes, e.g. `['nigeria','ng']`), `message`, `color` (`'orange'` default / `'blue'` / `'green'`).

### Add a simple flag (banner only)
1. Add an object to `DASHBOARD_FLAGS`:
   ```js
   { id: 'platform-country-jul8', countries: ['india','in'], message: 'India: New roles on Handshake AI →', color: 'orange' }
   ```
2. Wire its click handler in the flag banner block (pattern: search `openAfricaSlide`), e.g. `const openFlagAction = () => goToCard(hsApply);`
3. Deploy.

### Add a flag with a custom intro slide (Africa/Mercor pattern)
The Africa flag embeds `#africa-intro` inside `#mc-apply`, toggled by an `africa-mode` class. To replicate on another card:
1. **CSS** (beside the `africa-mode` rules):
   ```css
   #[card]-apply.[flag]-mode #[card]-main { display: none; }
   #[flag]-intro { display: none; flex-direction: column; align-items: center; width: 100%; }
   #[card]-apply.[flag]-mode #[flag]-intro { display: flex; }
   ```
2. **HTML** inside `#[card]-apply`, after `#[card]-skipped-banner`: a `#[flag]-intro` div with `.step-dots`, `.hs-tag`, `.hs-headline`, an `<ol class="card-process-steps">`, and a `#[flag]-intro-cta` button.
3. **Wrap** regular card content in `<div id="[card]-main">…</div>`.
4. **JS**: CTA removes the mode class (`[card]Apply.classList.remove('[flag]-mode')`); flag click adds the class then `goToCard([card]Apply)`.
5. **Cleanup**: add `[card]Apply.classList.remove('[flag]-mode')` at the top of `goToDashboard()`.
6. Deploy.

### Targeting & lifecycle notes
- `countries` matched via `.toLowerCase()` — always lowercase; include both full names and ISO codes.
- Target **all countries**: change `evaluateAndShowFlag` to `f.countries.length === 0 || f.countries.includes(uc)`.
- Target by step: read `rwu_step` inside the flag handler after the banner shows.
- **Deactivate**: remove/comment the object and deploy.
- **Re-broadcast a dismissed flag**: change its `id` (e.g. `mercor-africa-jun8` → `mercor-africa-jul1`) — this resets the dismiss key for everyone.

### Current active flags
| id | Target | Description |
|----|--------|-------------|
| `mercor-africa-jun8` | Nigeria & 50+ African countries | Africa intro slide inside the Mercor card — Voice AI Research $10–$20/hr. Uses `africa-mode` on `#mc-apply` / `#africa-intro`. |

---

## Article index (slug → title)

> Reference only — keep entries unique when adding articles. Numbering has gaps (57–63 are out of order); the slug is the source of truth.

### Articles 1–15 (published May 29, 2026)
| # | Slug | Title |
|---|------|-------|
| 1 | remote-workers-making-50-200-ai-training-from-home | How Remote Workers Are Making Up to $50-$200/hr Training AI From Home |
| 2 | best-remote-work-from-home-jobs-not-customer-support-sales | The Best Remote Work From Home Jobs That Aren't Customer Support or Sales |
| 3 | how-to-find-online-jobs-from-home-that-pay-well | How to Find Online Jobs From Home That Actually Pay Well |
| 4 | what-ai-training-jobs-actually-are-and-how-remote-workers-get-paid | What AI Training Jobs Actually Are and How Remote Workers Get Paid |
| 5 | how-to-get-paid-to-train-ai-for-companies-like-openai-anthropic-google-and-meta | How to Get Paid to Train AI for Companies Like OpenAI, Anthropic, Google, and Meta |
| 6 | the-best-remote-ai-jobs-for-writers-marketers-lawyers-finance-pros-and-engineers | The Best Remote AI Jobs for Writers, Marketers, Lawyers, Finance Pros, and Engineers |
| 7 | how-to-turn-your-existing-work-experience-into-a-remote-ai-training-job | How to Turn Your Existing Work Experience Into a Remote AI Training Job |
| 8 | remote-work-jobs-that-pay-more-than-surveys-data-entry-and-gig-apps | Remote Work Jobs That Pay More Than Surveys, Data Entry, and Gig Apps |
| 9 | how-to-start-working-online-from-home-without-a-tech-background | How to Start Working Online From Home Without a Tech Background |
| 10 | what-remote-ai-research-jobs-are-and-how-to-find-them | What Remote AI Research Jobs Are and How to Find Them |
| 11 | the-best-online-jobs-from-home-for-people-with-real-world-expertise | The Best Online Jobs From Home for People With Real-World Expertise |
| 12 | how-to-apply-for-remote-ai-training-jobs-and-avoid-low-paying-platforms | How to Apply for Remote AI Training Jobs and Avoid Low-Paying Platforms |
| 13 | remote-ai-training-application-stand-out | What Makes a Remote AI Training Application Stand Out? |
| 14 | how-to-prepare-ai-trainer-interview-no-ai-experience | How to Prepare for an AI Trainer Interview With No AI Experience |
| 15 | best-remote-work-sites-ai-training-expert-review-ai-research | The Best Remote Work Sites for AI Training, Expert Review, and AI Research |
| — | remote-work-resume-guide | Remote Work Resume Guide (FEATURED — pinned, not numbered) |

### Articles 16–33 (published May 29–30, 2026)
| # | Slug | Title |
|---|------|-------|
| 16 | remote-ai-jobs-pay-100-hour | What Remote AI Jobs Pay $100+/hr? |
| 17 | why-ai-companies-need-human-reviewers | Why AI Companies Still Need Humans to Review, Rank, and Improve Model Answers |
| 18 | how-to-get-a-mercor-remote-job | How to Get a Mercor Remote Job: Application, Interview, and Referral Guide |
| 19 | is-mercor-legit | Is Mercor Legit? What Remote Workers Should Know Before Applying |
| 20 | how-to-pass-mercor-ai-interview-remote-work | How to Pass the Mercor AI Interview and Get Matched With Remote Work |
| 21 | mercor-vs-outlier-vs-handshake-ai | Mercor vs Outlier vs Handshake AI: Which Remote AI Platform Should You Try First? |
| 22 | is-outlier-ai-legit | Is Outlier AI Legit? What Remote Workers Should Know Before Applying |
| 23 | how-outlier-ai-works-remote-ai-training-jobs-pay-application-tips | How Outlier AI Works: Remote AI Training Jobs, Pay, and Application Tips |
| 24 | is-handshake-ai-legit | Is Handshake AI Legit? What Remote Workers Should Know Before Applying |
| 25 | how-handshake-ai-works-ai-fellowships-referrals-remote-work | How Handshake AI Works: AI Fellowships, Referrals, and Remote Work |
| 26 | how-to-find-remote-work-jobs-that-pay-50-200-hr-from-home | How to Find Remote Work Jobs That Pay $50-$200/hr From Home |
| 27 | best-work-from-home-jobs-no-coding-experience | The Best Work From Home Jobs for Smart People With No Coding Experience |
| 28 | how-to-get-paid-online-ai-training-research-expert-review | How to Get Paid Online for AI Training, Research, and Expert Review |
| 29 | remote-jobs-from-home-real-opportunities-vs-scams | Remote Jobs From Home: Real Opportunities vs. Scams |
| 30 | make-money-online-ai-skills-no-coding | How to Make Money Online With AI Skills Even If You're Not a Developer |
| 31 | best-online-jobs-writing-law-finance-medicine-coding | The Best Online Jobs for People Who Know Writing, Law, Finance, Medicine, or Coding |
| 32 | how-to-find-remote-ai-jobs-real-world-experience | How to Find Remote AI Jobs That Use Your Real-World Experience |
| 33 | why-ai-training-is-one-of-the-best-remote-work-opportunities | Why AI Training Is Becoming One of the Best Remote Work Opportunities |

### Articles 34–86 (published June 2026)
| # | Slug | Title |
|---|------|-------|
| 34 | how-to-get-paid-to-review-ai-answers-from-home | How to Get Paid to Review AI Answers From Home |
| 35 | remote-ai-training-jobs-explained | Remote AI Training Jobs Explained: Pay, Tasks, Interviews, and How to Apply |
| 36 | how-to-find-high-paying-online-jobs-without-500-applications | How to Find High-Paying Online Jobs Without Applying to 500 Remote Listings |
| 37 | best-remote-work-jobs-for-writers-ai-training-research | The Best Remote Work Jobs for Writers in AI Training & AI Research |
| 38 | best-remote-work-jobs-finance-legal-medical-experts | The Best Remote Work Jobs for Finance, Legal, and Medical Experts |
| 39 | how-to-get-paid-to-improve-chatgpt-claude-gemini-grok-llama | How to Get Paid to Improve ChatGPT, Claude, Gemini, Grok, and Llama |
| 40 | how-ai-companies-use-remote-workers-to-train-better-models | How AI Companies Use Remote Workers to Train Better Models |
| 41 | what-skills-do-you-need-for-remote-ai-training-jobs | What Skills Do You Need for Remote AI Training Jobs? |
| 42 | build-remote-work-profile-ai-jobs | How to Build a Remote Work Profile That Gets Matched With Better AI Jobs |
| 43 | best-remote-side-hustles-real-online-income | The Best Remote Side Hustles That Can Turn Into Real Online Income |
| 44 | how-to-find-flexible-remote-jobs-own-schedule | How to Find Flexible Remote Jobs You Can Do on Your Own Schedule |
| 45 | remote-work-for-beginners-best-online-jobs | Remote Work for Beginners: The Best Online Jobs to Start With |
| 46 | how-to-get-accepted-for-remote-ai-training-jobs-faster | How to Get Accepted for Remote AI Training Jobs Faster |
| 47 | outlier-ai-jobs-remote-ai-training-work | Outlier AI Jobs Explained: How Remote AI Training Work Actually Works |
| 48 | is-outlier-ai-worth-it | Is Outlier AI Worth It? What Remote Workers Should Know Before Applying |
| 49 | handshake-ai-jobs-explained-remote-work-fellowships | Handshake AI Jobs Explained: Remote Work, AI Fellowships, and Expert Projects |
| 50 | mercor-outlier-handshake-ai-remote-work | Mercor, Outlier, and Handshake AI: How to Use Multiple Platforms to Find Better Remote Work |
| 51 | best-remote-ai-training-jobs-for-beginners-who-can-write-clearly | Best Remote AI Training Jobs for Beginners Who Can Write Clearly |
| 52 | best-remote-ai-jobs-without-coding-experience | Best Remote AI Jobs You Can Do Without Coding Experience |
| 53 | ai-data-annotation-jobs-explained | AI Data Annotation Jobs Explained: What They Are and How to Get Started |
| 54 | best-ai-model-evaluation-jobs | Best AI Model Evaluation Jobs for Writers, Researchers, and Domain Experts |
| 55 | how-to-use-ai-skills-for-remote-work | How to Use AI Skills to Find Better Remote Work and Online Income |
| 56 | best-ai-side-hustles-remote-workers | Best AI Side Hustles for Remote Workers |
| 57 | best-remote-jobs-that-pay-for-judgment-instead-of-phone-calls | Best Remote Jobs That Pay for Judgment Instead of Phone Calls |
| 58 | best-online-jobs-strong-writers-work-from-home | Best Online Jobs for Strong Writers Who Want to Work From Home |
| 59 | best-remote-jobs-lawyers-paralegals-legal-researchers-ai | Best Remote AI Jobs for Lawyers, Paralegals, and Legal Researchers |
| 60 | best-remote-ai-jobs-finance-accounting-business-analysts | Best Remote AI Jobs for Finance, Accounting, and Business Analysts |
| 61 | best-remote-ai-jobs-teachers-tutors-education-experts | Best Remote AI Jobs for Teachers, Tutors, and Education Experts |
| 62 | best-remote-ai-jobs-nurses-medical-writers-healthcare-experts | Best Remote AI Jobs for Nurses, Medical Writers, and Healthcare Experts |
| 63 | best-remote-ai-jobs-coders-not-full-time-software-role | Best Remote AI Jobs for Coders Who Do Not Want a Full-Time Software Role |
| 64 | best-ai-training-platforms-generalists-specialists-students | Best AI Training Platforms for Generalists, Specialists, and Students |
| 65 | best-alternatives-to-data-entry-jobs-remote-workers | Best Alternatives to Data Entry Jobs for Remote Workers |
| 66 | best-remote-jobs-fact-checking-research | Best Remote Jobs for People Who Like Fact-Checking and Research |
| 67 | best-work-from-home-jobs-with-no-phone-calls | Best Work From Home Jobs With No Phone Calls |
| 68 | best-ai-evaluation-jobs-notice-mistakes-fast | Best AI Evaluation Jobs for People Who Notice Mistakes Fast |
| 69 | best-remote-jobs-college-students-recent-graduates-ai | Best Remote Jobs for College Students and Recent Graduates Interested in AI |
| 70 | best-remote-ai-jobs-bilingual-workers-language-experts | Best Remote AI Jobs for Bilingual Workers and Language Experts |
| 71 | remote-ai-evaluator-jobs-explained | Remote AI Evaluator Jobs Explained: Tasks, Skills, Pay, and Application Tips |
| 72 | ai-model-trainer-jobs-apply-from-home | AI Model Trainer Jobs: What They Are and How to Apply From Home |
| 73 | prompt-evaluation-jobs | Prompt Evaluation Jobs: How Remote Workers Get Paid to Test AI Answers |
| 74 | ai-rater-jobs-review-chatbot-responses | AI Rater Jobs: How to Review Chatbot Responses for Accuracy and Quality |
| 75 | ai-response-reviewer-jobs | AI Response Reviewer Jobs: How to Get Paid Reviewing Model Answers |
| 76 | data-annotation-jobs-from-home-vs-ai-training-jobs | Data Annotation Jobs From Home: How They Compare to AI Training Jobs |
| 77 | rlhf-jobs-explained-human-feedback-work | RLHF Jobs Explained: What Human Feedback Work Actually Looks Like |
| 78 | human-feedback-jobs-in-ai-remote-workers-improve-chatbots | Human Feedback Jobs in AI: How Remote Workers Improve Chatbots |
| 79 | paid-ai-research-jobs-from-home | Paid AI Research Jobs From Home: What Counts as Real Research Work? |
| 80 | expert-review-jobs-from-home | Expert Review Jobs From Home: How Professionals Can Turn Knowledge Into Remote Work |
| 81 | work-in-ai-from-home | Work in AI From Home: The Practical Guide for Non-Technical Remote Workers |
| 82 | how-ai-training-works-human-feedback-jobs | How AI Training Works: The Human Feedback Jobs Behind Modern AI Models |
| 83 | ai-training-jobs-near-me-vs-remote-ai-training-jobs | AI Training Jobs Near Me vs Remote AI Training Jobs: Which Searches Actually Work? |
| 84 | google-ai-training-jobs | Google AI Training Jobs: What Remote Job Seekers Should Know Before Applying |
| 85 | microsoft-ai-training-jobs | Microsoft AI Training Jobs: How to Search for Remote AI Evaluation Roles |
| 86 | claude-ai-training-jobs-human-reviewers-improve-ai-answers | Claude AI Training Jobs: How Human Reviewers Help Improve AI Answers |

### Articles 87–100 (published June 6, 2026)
| # | Slug | Title |
|---|------|-------|
| 87 | gemini-ai-training-jobs | Gemini AI Training Jobs: How to Find Remote Roles Around Google's AI Ecosystem |
| 88 | ai-mode-jobs-remote-workers | AI Mode Jobs: What Search, Assistants, and AI Browsers Mean for Remote Workers |
| 89 | ask-ai-jobs-improve-ai-answer-quality | Ask AI Jobs: How People Are Getting Paid to Improve AI Answer Quality |
| 90 | how-ai-detectors-work-human-review | How AI Detectors Work and Why Human Review Still Matters |
| 91 | ai-humanizer-jobs | AI Humanizer Jobs: What This Search Trend Means for Writers and Reviewers |
| 92 | ai-model-training-jobs-compare-generalist-expert-coding-projects | AI Model Training Jobs: How to Compare Generalist, Expert, and Coding Projects |
| 93 | free-ai-training-vs-paid-ai-training-work | Free AI Training vs Paid AI Training Work: What Job Seekers Should Understand |
| 94 | corporate-ai-training-programs-vs-remote-ai-training-jobs | Corporate AI Training Programs vs Remote AI Training Jobs: What's the Difference? |
| 95 | mercor-ai-jobs-how-to-search-apply-avoid-generic-applications | Mercor AI Jobs: How to Search, Apply, and Avoid Generic Applications |
| 96 | mercor-careers-vs-mercor-contract-projects | Mercor Careers vs Mercor Contract Projects: What Applicants Should Know |
| 97 | mercor-reddit-reviews | Mercor Reddit Reviews: How to Read Platform Feedback Without Getting Misled |
| 98 | mercor-founders-company-legitimacy-job-seeker-guide | Mercor Founders, Company, and Legitimacy: A Job Seeker's Research Guide |
| 99 | surge-ai-jobs | Surge AI Jobs: What Remote AI Training Applicants Should Know |
| 100 | micro1-ai-jobs-expert-ai-training-opportunities | micro1 AI Jobs: How Expert AI Training Opportunities Work |

### Articles 101–110 (published June 6, 2026)
| # | Slug | Title |
|---|------|-------|
| 101 | stellar-ai-jobs | Stellar AI Jobs: How to Evaluate New AI Work Platforms Before Applying |
| 102 | handshake-jobs-vs-handshake-ai | Handshake Jobs vs Handshake AI: Which Search Result Are You Actually Looking For? |
| 103 | handshake-ai-fellowship-application-guide | Handshake AI Fellowship: Who It Fits and How to Prepare Your Application |
| 104 | linkedin-ai-jobs-remote-ai-training-roles | LinkedIn AI Jobs: How to Find Remote AI Training Roles Without Wasting Time |
| 105 | linkedin-profile-tips-remote-ai-training-jobs | LinkedIn Profile Tips for Remote AI Training Jobs |
| 106 | remote-part-time-jobs-from-home-flexible-ai-work-search-terms | Remote Part-Time Jobs From Home: The Best Search Terms for Flexible AI Work |
| 107 | remote-jobs-near-me-vs-work-from-anywhere | Remote Jobs Near Me vs Work From Anywhere Jobs: How to Search Smarter |
| 108 | work-online-and-get-paid-real-remote-jobs | Work Online and Get Paid: How to Separate Real Remote Jobs From Fast-Money Claims |
| 109 | data-entry-remote-jobs-vs-ai-data-annotation-jobs | Data Entry Remote Jobs vs AI Data Annotation Jobs: What's the Difference? |
| 110 | upwork-usajobs-robert-half-job-boards-remote-ai-work | Upwork, USAJobs, Robert Half, and Job Boards: Where Remote AI Work Actually Appears |

### Articles 111–125 (published June 2026 — geo/country targeting)
| # | Slug | Title |
|---|------|-------|
| 111 | us-based-ai-training-jobs | US-Based AI Training Jobs: How to Find Remote Work Reviewing AI Models |
| 112 | best-work-from-home-ai-jobs-americans-strong-writing-skills | Best Work From Home AI Jobs for Americans With Strong Writing Skills |
| 113 | how-to-find-ai-model-evaluation-work-united-states | How to Find AI Model Evaluation Work in the United States |
| 114 | which-remote-ai-jobs-are-actually-us-only | Which Remote AI Jobs Are Actually US-Only? |
| 115 | remote-contract-work-ai-college-educated-us-applicants | Remote Contract Work in AI for College-Educated US Applicants |
| 116 | canada-ai-training-jobs-legit-remote-ai-work | Canada AI Training Jobs: How to Find Legit Remote AI Work |
| 117 | best-ai-evaluation-jobs-canadian-writers-researchers-specialists | Best AI Evaluation Jobs for Canadian Writers, Researchers, and Specialists |
| 118 | how-canadians-can-apply-for-global-ai-training-projects | How Canadians Can Apply for Global AI Training Projects |
| 119 | uk-ai-training-jobs-remote-work-writers-researchers-experts | UK AI Training Jobs: Remote Work for Writers, Researchers, and Experts |
| 120 | australia-ai-data-annotation-jobs | Australia AI Data Annotation Jobs: What Skilled Applicants Should Know |
| 121 | best-english-language-ai-training-jobs-native-speakers | Best English-Language AI Training Jobs for Native Speakers |
| 122 | ai-evaluation-jobs-us-canada-uk-australia | AI Evaluation Jobs for US, Canadian, UK, and Australian Applicants |
| 123 | why-ai-training-jobs-require-country-location | Why Some AI Training Jobs Require Your Country or Location |
| 124 | why-ai-training-jobs-pay-more-us-canada | Why AI Training Jobs Often Pay More in the US and Canada |
| 125 | how-to-search-high-paying-ai-training-jobs-by-country | How to Search for High-Paying AI Training Jobs by Country |

### Articles 126–140 (published June 2026 — professional/expert niches)
| # | Slug | Title |
|---|------|-------|
| 126 | ai-training-jobs-consultants-mbas-business-analysts | AI Training Jobs for Consultants, MBAs, and Business Analysts |
| 127 | how-consultants-can-get-paid-reviewing-ai-business-answers | How Consultants Can Get Paid Reviewing AI Business Answers |
| 128 | ai-evaluation-work-lawyers-law-students-legal-researchers | AI Evaluation Work for Lawyers, Law Students, and Legal Researchers |
| 129 | healthcare-ai-training-jobs-doctors-nurses-medical-writers | Healthcare AI Training Jobs for Doctors, Nurses, and Medical Writers |
| 130 | how-finance-experts-can-get-paid-training-ai-models | How Finance Experts Can Get Paid Training AI Models |
| 131 | ai-code-evaluation-jobs-software-engineers-technical-reviewers | AI Code Evaluation Jobs for Software Engineers and Technical Reviewers |
| 132 | remote-ai-work-data-analysts-excel-experts-quantitative-thinkers | Remote AI Work for Data Analysts, Excel Experts, and Quantitative Thinkers |
| 133 | ai-model-evaluation-jobs-teachers-professors-tutors | AI Model Evaluation Jobs for Teachers, Professors, and Tutors |
| 134 | how-journalists-and-editors-can-get-paid-reviewing-ai-writing | How Journalists and Editors Can Get Paid Reviewing AI Writing |
| 135 | ai-training-jobs-phd-students-researchers-academics | AI Training Jobs for PhD Students, Researchers, and Academics |
| 136 | remote-ai-jobs-product-managers-startup-operators-strategy | Remote AI Jobs for Product Managers, Startup Operators, and Strategy People |
| 137 | best-ai-review-jobs-advanced-degrees | Best AI Review Jobs for People With Advanced Degrees |
| 138 | subject-matter-experts-remote-ai-work | How Subject Matter Experts Can Turn Their Knowledge Into Remote AI Work |
| 139 | ai-training-side-hustles-educated-professionals | AI Training Side Hustles for Educated Professionals |
| 140 | remote-jobs-that-pay-for-expertise-instead-of-customer-support | Remote Jobs That Pay for Expertise Instead of Customer Support |

### Articles 141–180 (published June 2026 — platform comparisons, troubleshooting, workflow)
| # | Slug | Title |
|---|------|-------|
| 141 | mercor-vs-outlier-vs-handshake-ai-platform-comparison | Mercor vs Outlier vs Handshake AI: Which Platform Fits You Best? |
| 142 | is-mercor-better-for-experts-or-beginners | Is Mercor Better for Experts or Beginners? |
| 143 | improve-mercor-profile-before-applying-again | How to Improve Your Mercor Profile Before Applying Again |
| 144 | outlier-ai-projects-explained | Outlier AI Projects Explained |
| 145 | handshake-ai-fellowship-who-it-fits-how-to-prepare | Handshake AI Fellowship: Who It Fits and How to Prepare |
| 146 | surge-ai-jobs-remote-ai-applicants | Surge AI Jobs: What Remote AI Applicants Should Know |
| 147 | micro1-ai-jobs-expert-training-guide | micro1 AI Jobs: How Expert AI Training Opportunities Work |
| 148 | stellar-ai-jobs-evaluate-ai-work-platforms | Stellar AI Jobs: How to Evaluate New AI Work Platforms Before Applying |
| 149 | linkedin-ai-jobs-find-real-remote-ai-training-roles | LinkedIn AI Jobs: How to Find Real Remote AI Training Roles |
| 150 | google-ai-training-jobs-what-job-seekers-mean | Google AI Training Jobs: What Job Seekers Mean by That Search |
| 151 | gemini-ai-jobs-human-reviewers-improve-ai-answers | Gemini AI Jobs: How Human Reviewers Help Improve AI Answers |
| 152 | claude-ai-training-jobs-remote-anthropic-style-evaluation | Claude AI Training Jobs: Remote Work Around Anthropic-Style AI Evaluation |
| 153 | microsoft-ai-training-jobs-remote-ai-evaluation-work | Microsoft AI Training Jobs: How to Search for Remote AI Evaluation Work |
| 154 | ask-ai-jobs-improve-ai-answer-quality | Ask AI Jobs: How People Get Paid to Improve AI Answer Quality |
| 155 | ai-mode-jobs | AI Mode Jobs: What AI Search Means for Remote Workers |
| 156 | outlier-ai-not-getting-tasks | Outlier AI Not Getting Tasks: What It Means and What to Do Next |
| 157 | outlier-ai-no-projects-available | Outlier AI No Projects Available: Why It Happens and How to Improve Your Chances |
| 158 | outlier-ai-application-rejected-can-you-reapply-or-try-again | Outlier AI Application Rejected: Can You Reapply or Try Again? |
| 159 | outlier-ai-assessment-failed-next-test | Outlier AI Assessment Failed: What to Do Before Your Next Test |
| 160 | why-passed-outlier-ai-test-still-have-no-work | Why You Passed the Outlier AI Test but Still Have No Work |
| 161 | mercor-interview-failed-reapply-another-chance | Mercor Interview Failed: Can You Reapply or Get Another Chance? |
| 162 | mercor-application-under-review | Mercor Application Under Review: What It Means and How Long to Wait |
| 163 | mercor-no-response-after-applying | Mercor No Response After Applying: What Remote AI Applicants Should Know |
| 164 | mercor-interview-questions-ai-training-expert-roles | Mercor Interview Questions: How to Prepare for AI Training and Expert Roles |
| 165 | how-long-does-mercor-take-to-hire | How Long Does Mercor Take to Hire? Application Timelines Explained |
| 166 | how-much-can-you-realistically-make-on-mercor-per-month | How Much Can You Realistically Make on Mercor Per Month? |
| 167 | handshake-ai-no-response-after-apply | Handshake AI No Response: What It Means After You Apply |
| 168 | handshake-ai-application-under-review | Handshake AI Application Under Review: What It Means and What to Do |
| 169 | handshake-ai-rejection-apply-again-improve-profile | Handshake AI Rejection: Can You Apply Again or Improve Your Profile? |
| 170 | how-long-does-handshake-ai-take-to-respond | How Long Does Handshake AI Take to Respond? |
| 171 | how-quickly-can-you-start-working-on-outlier-ai | How Quickly Can You Start Working on Outlier AI? |
| 172 | why-remote-ai-job-applications-get-rejected | Why Remote AI Job Applications Get Rejected |
| 173 | how-to-follow-up-after-applying-for-ai-training-jobs | How to Follow Up After Applying for AI Training Jobs |
| 174 | how-many-ai-training-platforms-should-you-apply-to | How Many AI Training Platforms Should You Apply To at Once? |
| 175 | what-to-do-when-ai-training-work-slows-down | What to Do When AI Training Work Slows Down |
| 176 | how-to-write-clear-ai-evaluation-answers | How to Write Clear AI Evaluation Answers |
| 177 | how-to-rank-ai-answers-correctly-model-evaluation-work | How to Rank AI Answers Correctly in Model Evaluation Work |
| 178 | what-makes-a-good-rlhf-rating-beginners-guide | What Makes a Good RLHF Rating? A Beginner's Guide |
| 179 | how-to-compare-two-ai-responses-like-a-professional-evaluator | How to Compare Two AI Responses Like a Professional Evaluator |
| 180 | how-to-fact-check-ai-answers | How to Fact-Check AI Answers for Remote Evaluation Work |

### Articles 181–190 (published June 14, 2026 — evaluation skills, workflow, role comparisons)
| # | Slug | Title |
|---|------|-------|
| 181 | how-to-explain-why-one-ai-answer-is-better-than-another | How to Explain Why One AI Answer Is Better Than Another |
| 182 | how-to-write-clear-feedback-ai-model-training-tasks | How to Write Clear Feedback for AI Model Training Tasks |
| 183 | how-to-spot-hallucinations-in-ai-answers | How to Spot Hallucinations in AI Answers |
| 184 | how-to-evaluate-ai-responses-helpfulness-accuracy-safety | How to Evaluate AI Responses for Helpfulness, Accuracy, and Safety |
| 185 | how-to-review-chatbot-answers-without-overthinking-the-task | How to Review Chatbot Answers Without Overthinking the Task |
| — | (186 published in next batch — see Articles 186 and 191–200 section below) | — |
| 187 | ai-safety-evaluation-jobs | AI Safety Evaluation Jobs: What Remote Workers Do and How to Apply |
| 188 | ai-writing-evaluator-jobs | AI Writing Evaluator Jobs: How Writers and Editors Can Get Paid Reviewing AI Content |
| 189 | search-quality-rater-vs-ai-evaluator | Search Quality Rater vs AI Evaluator: What's the Difference? |
| 190 | data-labeling-vs-ai-model-evaluation | Data Labeling vs AI Model Evaluation: Which Remote Job Is Better? |

### Articles 186 and 191–200 (published June 14, 2026 — income strategy, scam avoidance, search strategy, resume)
| # | Slug | Title |
|---|------|-------|
| 186 | ai-fact-checking-jobs-remote-workers-verify-model-outputs | AI Fact-Checking Jobs: How Remote Workers Verify Model Outputs |
| 191 | can-ai-training-replace-full-time-job | Can AI Training Replace Your Full-Time Job? What Remote Workers Should Know |
| 192 | how-many-hours-can-you-work-remote-ai-training-jobs | How Many Hours Can You Actually Work in Remote AI Training Jobs? |
| 193 | why-ai-training-income-can-be-inconsistent-from-month-to-month | Why AI Training Income Can Be Inconsistent From Month to Month |
| 194 | how-to-stack-multiple-ai-training-platforms-without-burning-out | How to Stack Multiple AI Training Platforms Without Burning Out |
| 195 | work-online-get-paid-separate-real-remote-jobs-from-scams | Work Online and Get Paid: How to Separate Real Remote Jobs From Scams |
| 196 | best-remote-part-time-jobs-from-home-flexible-ai-work | The Best Remote Part-Time Jobs From Home for Flexible AI Work |
| 197 | remote-jobs-near-me-vs-work-from-anywhere-jobs | Remote Jobs Near Me vs Work From Anywhere Jobs: How to Search Smarter |
| 198 | ai-detector-jobs-ai-humanizer-trends-writers | AI Detector Jobs and AI Humanizer Trends: What They Mean for Writers |
| 199 | upwork-linkedin-usajobs-robert-half-remote-ai-work | Upwork, LinkedIn, USAJobs, and Robert Half: Where Remote AI Work Actually Appears |
| 200 | simple-resume-ai-training-model-evaluation-jobs | How to Build a Simple Resume for AI Training and Model Evaluation Jobs |

### Articles 211–230 (published June 15, 2026 — professional niches, micro1, VA, designers, pay guides)
| # | Slug | Title |
|---|------|-------|
| 211 | best-work-from-home-jobs-for-project-managers | The Best Work From Home Jobs for Project Managers |
| 212 | micro1-vs-mercor-which-should-you-apply-to-first | micro1 vs Mercor: Which Should You Apply to First? |
| 213 | remote-work-jobs-with-no-experience-that-actually-pay-well | Remote Work Jobs With No Experience That Actually Pay Well |
| 214 | best-remote-work-jobs-hr-professionals-recruiters | Best Remote Work Jobs for HR Professionals and Recruiters |
| 215 | how-remote-workers-get-paid-to-train-ai-without-coding | How Remote Workers Get Paid to Train AI Without Coding |
| 216 | work-from-home-jobs-no-degree-no-phone-calls | Work From Home Jobs With No Degree and No Phone Calls |
| 217 | how-much-can-you-make-on-micro1-per-month | How Much Can You Make on micro1 Per Month? |
| 218 | best-remote-work-jobs-real-estate-agents | Best Remote Work Jobs for Real Estate Agents |
| 219 | remote-work-jobs-that-pay-100-an-hour-from-home | Remote Work Jobs That Pay $100 an Hour From Home |
| 220 | best-work-from-home-jobs-for-virtual-assistants | Best Work From Home Jobs for Virtual Assistants |
| 221 | how-long-does-micro1-take-to-respond-after-you-apply | How Long Does micro1 Take to Respond After You Apply? |
| 222 | best-remote-work-jobs-copywriters-content-writers | Best Remote Work Jobs for Copywriters and Content Writers |
| 223 | how-to-get-your-first-remote-ai-job-with-no-background | How to Get Your First Remote AI Job With No Background |
| 224 | best-remote-work-jobs-graphic-visual-designers | Best Remote Work Jobs for Graphic and Visual Designers |
| 225 | why-some-remote-ai-jobs-pay-200-an-hour | Why Some Remote AI Jobs Pay $200 an Hour and Most Don't |
| 226 | micro1-reviews-remote-workers-2026 | micro1 Reviews: What Remote Workers Say in 2026 |
| 227 | best-work-from-home-jobs-accountants-bookkeepers | Best Work From Home Jobs for Accountants and Bookkeepers |
| 228 | remote-work-for-beginners-no-experience | Remote Work for Beginners: How to Start With No Experience |
| 229 | best-remote-work-jobs-paralegals-legal-assistants | Best Remote Work Jobs for Paralegals and Legal Assistants |
| 230 | how-ai-training-platforms-pay-you | How and When AI Training Platforms Actually Pay You |

### Articles 231–250 (published June 18, 2026 — translators, editors, surveys, micro1, UX, operations, data annotation, consultants, pay rates, Nigeria, customer service, AI hiring, career changers, profile guide, Philippines, parents, scam safety)
| # | Slug | Title |
|---|------|-------|
| 231 | best-remote-work-jobs-translators-interpreters | Best Remote Work Jobs for Translators and Interpreters |
| 232 | best-remote-work-jobs-editors-proofreaders | Best Remote Work Jobs for Editors and Proofreaders |
| 233 | best-remote-work-jobs-survey-researchers-ux-researchers | Best Remote Work Jobs for Survey Researchers and UX Researchers |
| 234 | micro1-application-tips-get-accepted-faster | micro1 Application Tips: How to Get Accepted Faster |
| 235 | micro1-vs-outlier-ai-which-platform-should-you-try-first | micro1 vs Outlier AI: Which Platform Should You Try First? |
| 236 | best-remote-work-jobs-ux-product-designers | Best Remote Work Jobs for UX and Product Designers |
| 237 | best-remote-work-jobs-operations-managers | Best Remote Work Jobs for Operations Managers |
| 238 | best-remote-work-jobs-data-scientists-ml-engineers | Best Remote Work Jobs for Data Scientists and ML Engineers |
| 239 | is-micro1-legit | Is micro1 Legit? What Remote Workers Should Know Before Applying |
| 240 | best-remote-work-jobs-data-annotation-specialists | Best Remote Work Jobs for Data Annotation Specialists |
| 241 | best-work-from-home-jobs-consultants-business-strategists | Best Work From Home Jobs for Consultants and Business Strategists |
| 242 | how-to-increase-your-pay-rate-on-ai-training-platforms | How to Increase Your Pay Rate on AI Training Platforms |
| 243 | remote-work-jobs-in-nigeria | Remote Work Jobs in Nigeria: How to Apply and Get Paid From Home |
| 244 | best-remote-work-jobs-customer-service-reps-leaving-the-phones | The Best Remote Work Jobs for Customer Service Reps Leaving the Phones |
| 245 | remote-ai-jobs-hiring-most-right-now | Remote AI Jobs That Are Hiring Most Right Now |
| 246 | best-remote-work-jobs-career-changers-over-40 | Best Remote Work Jobs for Career Changers Over 40 |
| 247 | how-to-build-a-remote-work-profile-that-gets-you-matched-faster | How to Build a Remote Work Profile That Gets You Matched Faster |
| 248 | remote-work-jobs-philippines-apply-from-home | Remote Work Jobs in the Philippines: Where to Apply From Home |
| 249 | best-work-from-home-jobs-stay-at-home-parents | The Best Work From Home Jobs for Stay-at-Home Parents |
| 250 | how-to-spot-remote-work-scams-before-you-apply | How to Spot Remote Work Scams Before You Apply |

### Articles 251–260 (published June 19, 2026 — judgment work, prompt writing, follow-up strategy, India, beginner AI jobs, platform stacking, mistake-spotters, scam avoidance, full-time + side work, micro1 application)
| # | Slug | Title |
|---|------|-------|
| 251 | remote-work-judgment-ai-cant-replace | Remote Work That Pays You for the Judgment AI Can't Replace |
| 252 | best-remote-ai-jobs-prompt-writer-without-coding | Best Remote AI Jobs You Can Do as a Prompt Writer Without Coding |
| 253 | how-to-follow-up-after-applying-handshake-ai-mercor-micro1 | How to Follow Up After Applying to Handshake AI, Mercor, or micro1 |
| 254 | remote-work-jobs-india-apply-get-paid-from-home | Remote Work Jobs in India: How to Apply and Get Paid From Home |
| 255 | easiest-remote-ai-jobs-to-get-started-with | The Easiest Remote AI Jobs to Get Started With |
| 256 | how-to-use-handshake-ai-mercor-and-micro1-together-for-steady-work | How to Use Handshake AI, Mercor, and micro1 Together for Steady Work |
| 257 | best-remote-work-jobs-people-who-notice-mistakes-fast | Best Remote Work Jobs for People Who Notice Mistakes Fast |
| 258 | why-real-remote-work-platforms-never-charge-you-to-start | Why Real Remote Work Platforms Never Charge You to Start |
| 259 | remote-work-jobs-around-full-time-job | Remote Work Jobs You Can Build Around a Full-Time Job |
| 260 | how-micro1-application-process-works-start-to-finish | How micro1's Application Process Works, Start to Finish |

### Articles 261–270 (published June 19–20, 2026 — recent grads, research, AI applications, Kenya, writers, reviewer work, PR/comms, schedule flexibility, beginner-to-expert, general knowledge)
| # | Slug | Title |
|---|------|-------|
| 261 | best-work-from-home-jobs-recent-graduates | The Best Work From Home Jobs for Recent Graduates |
| 262 | remote-ai-jobs-good-at-research | Remote AI Jobs for People Who Are Good at Research |
| 263 | how-to-write-remote-ai-application-gets-response | How to Write a Remote AI Application That Gets a Response |
| 264 | remote-work-jobs-in-kenya-legit-online-work | Remote Work Jobs in Kenya: How to Find Legit Online Work |
| 265 | best-remote-work-jobs-for-writers-flexible-hours | Best Remote Work Jobs for Writers Who Want Flexible Hours |
| 266 | how-ai-companies-decide-who-gets-remote-reviewer-work | How AI Companies Decide Who Gets Remote Reviewer Work |
| 267 | best-remote-work-jobs-communications-pr-professionals | The Best Remote Work Jobs for Communications and PR Professionals |
| 268 | remote-work-that-lets-you-set-your-own-schedule | Remote Work That Lets You Set Your Own Schedule |
| 269 | how-to-go-from-beginner-tasks-to-expert-tier-remote-pay | How to Go From Beginner Tasks to Expert-Tier Remote Pay |
| 270 | remote-ai-jobs-strong-general-knowledge | Remote AI Jobs for People With Strong General Knowledge |

### Articles 271–280 (published June 20–21, 2026 — Indonesia, Ghana, writing skills, platform comparison, subject matter experts, procurement, office-to-remote, AI qualification, first 30 days, customer research)
| # | Slug | Title |
|---|------|-------|
| 271 | remote-work-jobs-indonesia-apply-get-paid | Remote Work Jobs in Indonesia: How to Apply and Get Paid |
| 272 | remote-work-jobs-in-ghana | Remote Work Jobs in Ghana: How to Apply From Home |
| 273 | best-work-from-home-jobs-writing-skills | The Best Work From Home Jobs That Use Writing Skills |
| 274 | how-handshake-ai-mercor-micro1-differ-new-applicants | How Handshake AI, Mercor, and micro1 Differ for New Applicants |
| 275 | best-remote-work-jobs-subject-matter-experts | The Best Remote Work Jobs for Subject Matter Experts |
| 276 | best-remote-work-jobs-procurement-supply-chain-pros | Best Remote Work Jobs for Procurement and Supply Chain Pros |
| 277 | remote-work-for-people-leaving-a-9-to-5-office-job | Remote Work for People Leaving a 9-to-5 Office Job |
| 278 | how-to-know-if-you-qualify-for-remote-ai-training-work | How to Know If You Qualify for Remote AI Training Work |
| 279 | what-to-expect-first-30-days-remote-ai-work | What to Expect in Your First 30 Days of Remote AI Work |
| 280 | best-work-from-home-jobs-customer-research-insights-roles | Best Work From Home Jobs for Customer Research and Insights Roles |

### Articles 281–290 (published June 23, 2026 — multi-platform income, detail-oriented, non-technical AI jobs, event/hospitality, account recovery, no cold calling, data-minded, AI tasks stopped, curiosity/fact-checking, mid-career)
| # | Slug | Title |
|---|------|-------|
| 281 | how-to-turn-one-platform-into-a-multi-platform-remote-income | How to Turn One Platform Into a Multi-Platform Remote Income |
| 282 | best-remote-work-jobs-eye-for-detail | Best Remote Work Jobs for People With an Eye for Detail |
| 283 | remote-ai-jobs-for-non-technical-professionals | Remote AI Jobs for Non-Technical Professionals Explained |
| 284 | best-remote-work-jobs-event-hospitality-professionals | The Best Remote Work Jobs for Event and Hospitality Professionals |
| 285 | recover-stalled-paused-ai-training-account | How to Recover a Stalled or Paused AI Training Account |
| 286 | remote-work-jobs-for-people-who-hate-cold-calling | Remote Work Jobs for People Who Hate Cold Calling |
| 287 | best-work-from-home-jobs-data-minded-professionals | Best Work From Home Jobs for Data-Minded Professionals |
| 288 | why-ai-training-tasks-suddenly-stopped-how-to-restart | Why Your AI Training Tasks Suddenly Stopped and How to Restart |
| 289 | remote-work-jobs-curiosity-fact-checking | Remote Work Jobs That Reward Curiosity and Fact-Checking |
| 290 | best-remote-work-jobs-mid-career-professionals | The Best Remote Work Jobs for Mid-Career Professionals |
