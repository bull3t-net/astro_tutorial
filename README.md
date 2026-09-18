# Cardistry — Astro redesign

A working, multi-page static Astro website, prepared as a design-review build. The live cardistry.co.za website has NOT been changed.

## Quick start

Use Node.js 22.12 or later (verified here with Node 22.22.3).

```sh
npm ci
npm run dev -- --port 8080
```

Open http://localhost:8080. For the production build:

```sh
npm run build
npm run preview -- --port 8080
```

The included `dist/` folder is the generated static website. Upload its **contents**, not the source project, to a static web root. No Node process or database is needed to serve the production build. Serve it over HTTP rather than opening HTML files directly, because links and assets use root-relative URLs. Deploy at the domain root or configure an Astro base path before building.

## Pages

- `/` — home, product showcase and illustrated offline-sharing simulation
- `/pvc-business-cards/` — print-only PVC and live concept preview
- `/nfc-business-cards/` — direct-data NFC, live concept preview and approach comparison
- `/design-support/` — artwork supplied or design brief process
- `/about/` — brand philosophy without invented company history
- `/faq/` — searchable questions and native expandable answers
- `/contact/` — personalised mailto quote builder
- `/articles/` — journal index
- `/articles/offline-nfc-explained/`
- `/articles/nfc-or-qr/`
- `/articles/artwork-checklist/`

## What is functional

- Responsive navigation with Escape dismissal and current-page indicator.
- Pointer-reactive hero card, product hover treatments and reduced-motion handling.
- Tap and QR **simulations** with an internet-state switch, not real NFC access.
- Downloadable sample vCard. Sample data is explicitly fictional.
- Local card-text and colour previews. Text is assigned with `textContent`, not interpreted as HTML.
- Searchable FAQ with zero-result messaging.
- Quote validation, route preselection, prepared email body and copy fallback.
- Static metadata, canonical URLs, robots file and sitemap.

No analytics, cookies, third-party runtime fonts, payment flow, accounts or database have been added. Browsing and demo inputs are not sent to a server by this application's scripts. Hosting providers may still keep standard request logs.

## Quote flow

The destination is `sales@cardistry.co.za`, taken from the existing site. Confirm this before launch.

`Prepare my quote email` creates a visible request preview. The customer then chooses `Open email app` or `Copy request`. A successful form preparation is **not** an email delivery confirmation. There is deliberately no automatic submission, SMTP server or invented success message. Long mailto requests may be limited by the customer's mail client; the plain-text copy fallback remains available.

Supported links:

- `/contact/?item=nfc-card`
- `/contact/?item=non-nfc-card`
- `/contact/?design=support`
- `/contact/?team=yes`

Print route, card technology, optional QR and design service are separate choices. No prices, turnaround promises, testimonials or unsupported partner logos have been invented.

## Design direction and source notes

The existing Cardistry logo was downloaded from the live site and retained on light surfaces. The new forest/sage/ivory palette is a proposed editorial extension of the existing green and charcoal identity, not an assertion that these are official brand guidelines. Product graphics are CSS concept renders, not photographs or guaranteed production finishes.

References reviewed:

- https://cardistry.co.za — existing branding, sales email and single/double-sided PVC routes retained.
- https://tapcard.co.za — hosted-profile positioning helps clarify Cardistry's direct-data distinction. No competitor assets copied.
- https://mecard.co.za — profile-first education and onboarding flow; Cardistry instead uses specification-first quoting. Do not imply every competitor charges monthly.
- https://printex.co.za/product/custom-nfc-smart-business-cards/?srsltid=AU7gw4UCBBRhHt92Sc3jO7Fi8-7y8f6xz1-IFvsx39Y9HW-nxiNwaIQN — product specification clarity; no competitor pricing or material options imported.
- https://www.ricola.com/en-ca/ — immersive storytelling and playful product exploration, translated into a card demonstration and concept previews rather than copying assets or markup.
- https://www.porsche.com/middle-east/_southafrica_/?cs_redirect=1 — large visual-led hero, restrained interface and product-led discovery, translated into an original card-focused composition.

## Important product accuracy

Direct-data contact sharing is based on the supplied business model, not on a physical test of Cardistry hardware. The browser demonstration does not verify a card, write to a chip, produce a QR code, or change network settings.

NFC availability on a phone does not guarantee native support for every NDEF contact record. Apple's background reading handles supported URI records; arbitrary vCard records are not equivalent to website links. Some devices/workflows need a compatible reader application. Direct-data QR support likewise depends on the scanner and contact format. Do not replace the compatibility caveats with an unqualified "works on every phone" or "no app ever needed" claim without hardware testing.

Technical reference:
https://developer.apple.com/documentation/corenfc/adding-support-for-background-tag-reading
https://nfc-forum.org/uploads/specifications/NFCForum-AD-CPUX-1.1.pdf

Rewriting a chip requires it to be writable/unlocked and requires suitable software/hardware. Printed QR data cannot update remotely. Online actions such as visiting a website still need connectivity. Only encode information intended for sharing.

## Editing

The source is modular. There is no all-pages catch-all template.

```text
src/
├── layouts/                 # Shared document shell and article layout
├── components/              # Header, Footer, CardPreview, QuoteForm, FAQ, etc.
│   └── home/                # Small homepage sections
├── pages/                   # A separate Astro file for each main page
│   └── articles/            # Article index + collection-driven article route
├── content/
│   └── articles/            # One Markdown file per article
├── content.config.ts        # Typed article collection schema
├── data/                    # Navigation, page metadata and named FAQ records
├── scripts/                 # Separate TypeScript interaction modules
└── styles/                  # Tokens, base styles, components and responsive rules
scripts/
└── format-deployment.mjs    # Readable output on every build
tests/                      # Browser, content-preservation and structure checks
dist/                       # Readable, deployable HTML/CSS/JavaScript
```

- Edit page copy in the corresponding `src/pages/*.astro` file or the owning component.
- Edit navigation and page titles/descriptions in `src/data/site.ts`.
- Edit questions in `src/data/faqs.ts`.
- Add/edit articles in `src/content/articles/*.md`. Required frontmatter: `title`, `description`, `category`, `order`. The article index, article route and sitemap derive from the collection. The static regression tests intentionally assert the current three-article delivery contract; update those expectations when adding articles.
- Edit colours in `src/styles/tokens.css`. `global.css` is only an ordered import list; preserve the order to retain the cascade.
- Interaction code lives in `src/scripts/`. Components load only their associated feature modules.
- Original brand assets are in `public/assets/`.

### Coding standards and readable deployment output

The project includes a strict TypeScript configuration, `.editorconfig`, a shared Prettier configuration and repeatable check commands:

```sh
npm run format         # Format maintained source
npm run format:check   # Verify source formatting
npm run check          # Astro + TypeScript diagnostics
npm run build          # Build, then format generated HTML, CSS and JavaScript
```

Every normal build disables minification and runs `scripts/format-deployment.mjs`. The packaged `dist/**/index.html` files are indented, multiline HTML, not single-line minified documents. Do not run `astro build` directly if you want the final Prettier pass; use `npm run build`.

`dist/` remains generated output. It is readable for inspection or a static handoff, but lasting edits belong in `src/`, because rebuilding replaces `dist/`. Readability produces larger uncompressed files; configure HTTP gzip/Brotli on production hosting if desired. No CMS or backend is required.

## Verification

With the built site running on port 8080:

```sh
npx playwright install chromium
npm run format:check
npm run check
npm test
npm run test:content
npm run test:structure
npm audit
```

`BASE_URL` can point the tests at a different local origin. The tests check all content routes at desktop, tablet and narrow mobile widths, overflow, one H1 per route, internal links, anchors, JavaScript errors, desktop axe WCAG A/AA checks, mobile menu, simulations, sample vCard, preview input safety, FAQ searching, reduced motion, form validation and mailto payloads.

`qa/report.json` records the browser test run. `qa/structure-report.json` records generated-file formatting checks, line counts and SHA-256 hashes. `qa/content-report.json` records the visible-content regression check against `qa/refactor-baseline.json`. Screenshots are in `qa/`. Automated accessibility checks are not a complete accessibility certification. Safari, Firefox, physical NFC devices, email delivery, print quality and real QR decoding were not tested by this web build.

After completing the checks, `python package_release.py` verifies the build hashes and creates the archive in the parent folder as `cardistry-astro.zip`. It requires Python 3.10+ and Pillow (`python -m pip install Pillow`) for the mobile screenshot crop. The ZIP is verified before atomically replacing the previous archive. A failed packaging check leaves the existing downloadable ZIP intact.

## Before publishing

1. Approve copy and the proposed visual direction.
2. Verify physical NFC/QR behaviour on target devices and confirm writable-chip policy.
3. Confirm the mailbox, artwork approval process, product specifications and design scope.
4. Replace concept card renders with approved photography if desired.
5. Review privacy/legal information against the real operating business and hosting setup.
6. Back up the existing site, map any legacy routes to appropriate redirects, deploy `dist/`, and retest over HTTPS. This package does not alter production DNS or hosting.
