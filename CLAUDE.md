# Remote Work Union — Claude Context

Static HTML site at `/Users/dylanrhodes/Documents/remoteworkunion/`. No framework, no build step. Live at `https://www.remoteworkunion.com/`. Backend is one serverless function, `api/airtable.js`, fronting an Airtable base ("Newsletter Subscribers" table).

---

## Critical rules (read first)

1. **Always deploy after every change.** Vercel auto-deploys on push to `main`. Never stop at a local edit:
   ```
   git add <files> && git commit -m "..." && git push origin main
   ```
2. **New root-level static assets must be whitelisted in `vercel.json`.** `vercel.json` uses an explicit `builds` array. Any new file in the project *root* that must be publicly served (images, SVGs, fonts) **must** get its own entry or Vercel silently 404s it. Files under `blog/` are already covered by the `blog/**` glob.
   ```json
   { "src": "logo.svg", "use": "@vercel/static" }
   ```

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
4. Delete the source package folder(s) and zip(s) from `/Users/dylanrhodes/Downloads/`.

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
