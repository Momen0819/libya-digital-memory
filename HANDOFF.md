# HANDOFF — ذاكرة ليبيا الرقمية / Libyan Digital Memory (Angular POC)

> Handoff document for continuing this project with another agent/developer.
> Last updated: 2026-06-11. Written by the previous agent.

---

## 1. What this project is

A **proof-of-concept (POC) web app** for the proposal **«ذاكرة ليبيا الرقمية» (Libyan Digital Memory)** — a national initiative to document Libyan historical monuments digitally and expose them to the public via **QR codes + rich media** (audio, video, photos, maps, 3D). It is modeled on the reference project *Irish Statues* (https://irishhb.github.io/IrishStatues/). Sponsor: **Ministry of Tourism — Libya**. Technical partner: **IZER (izer.ie)**.

Source proposal (Arabic Google Doc):
`https://docs.google.com/document/d/1N4q-H0B1Y12aboP_PMbbg-lJSeAB2i-Te2cjAO23Cy8`

**The POC is a full Angular front-end with REAL data** (10 actual Libyan monuments with real coordinates, history, sources, and Wikimedia images). No backend yet — data is local TypeScript.

---

## 2. Where the code lives (IMPORTANT)

- **GitHub repo:** `Momen0819/bunyan` (⚠️ this is a *private* repo for a *different* project — "bunyan", a contracting/مستخلصات SaaS).
- **Branch:** `claude/angular-poc-design-ebnt9z`
- **Subfolder:** `libya-digital-memory/`  ← the entire Angular app lives here.
- **Local path in dev container:** `/home/user/libya-digital-memory` (standalone copy) and `/home/user/bunyan/libya-digital-memory` (the committed copy).

### Why it's inside the `bunyan` repo instead of its own repo
The execution environment's GitHub access is **locked to `Momen0819/bunyan` only** (both the git proxy and the GitHub MCP). Attempting `create_repository` returned **403 "Resource not accessible by integration"**, and the git proxy URL is hardcoded to `/git/Momen0819/bunyan`. So a new repo could not be created from the environment. The app was therefore committed into a **separate, self-contained subfolder** of `bunyan`.

### To split it into its own standalone repo (run locally)
```bash
git clone https://github.com/Momen0819/bunyan && cd bunyan
git checkout claude/angular-poc-design-ebnt9z
cp -r libya-digital-memory ~/libya-digital-memory && cd ~/libya-digital-memory
git init && git add . && git commit -m "init: Libyan Digital Memory"
gh repo create libya-digital-memory --public --source=. --push
```

---

## 3. Tech stack

| Concern | Choice |
|---|---|
| Framework | **Angular 21** (standalone components, **signals**, **zoneless** change detection) |
| Styling | **Tailwind CSS 3** (custom heritage design tokens) |
| Map | **Leaflet** + CARTO/OSM tiles (no API key) |
| QR codes | **`qrcode`** npm package (generated to data-URL at runtime) |
| Audio narration | **Web Speech API** (`speechSynthesis`) — reads the Arabic/English history aloud, no hosted files |
| i18n | Custom signal-based service (AR default / EN), RTL-first |
| Routing | Lazy-loaded standalone components; `/m/:slug` for monument detail |

Node 22 in dev; CI uses Node 22. Angular dev-server is Vite-based.

---

## 4. How to run

```bash
cd libya-digital-memory
npm install
npm start        # dev server → http://localhost:4200  (allowedHosts:true is set, so it works behind preview proxies)
npm run build    # production build → dist/libya-digital-memory/browser
```

- `angular.json` `serve.options.allowedHosts = true` is already configured so the dev server accepts proxied/preview hosts (fixes "Invalid Host header").
- In the cloud dev container the server was run with `--host 0.0.0.0 --port 4200`. Access requires the platform's **Ports/Preview** feature (you cannot reach `0.0.0.0`/`localhost` of the container directly). If the platform forwards a specific port, restart on that port.

---

## 5. File map (all under `libya-digital-memory/`)

```
src/
  index.html                         RTL, lang=ar, Google Fonts (Amiri, Reem Kufi, Tajawal), favicon.svg
  styles.css                         Tailwind + design system (.btn, .card, .plate fallback, .rule-gold, etc.)
  app/
    app.ts / app.html                Shell: <app-site-header> + <router-outlet> + <app-site-footer>
    app.config.ts                    providers: zoneless CD + router (scroll restoration)
    app.routes.ts                    routes (lazy): '', monuments, map, gallery, about, m/:slug, ** -> ''
    core/
      models/monument.model.ts       Types: Monument, Region, Era, MonumentType, LocalizedText, etc.
      data/monuments.data.ts         ★ REAL DATA: 10 monuments. img() builds Wikimedia Special:FilePath URLs
      i18n/translations.ts           UI dictionary (ar/en) + REGION/ERA/TYPE labels
      services/
        i18n.service.ts              signal lang, dir, t(key), pick(LocalizedText), region()/era()/type()
        heritage.service.ts          all/featured/bySlug/byRegion/related/filter/stats
        qr.service.ts                publicUrl(slug) [uses document.baseURI] + toDataUrl()
        speech.service.ts            Web Speech narration (speak/stop/toggle, speaking signal)
    shared/components/
      smart-image.ts                 <img> with graceful branded fallback "plate" on error (never broken)
      monument-card.ts               card → /m/:slug
      site-header.ts                 sticky glass nav + language toggle + mobile menu
      site-footer.ts                 partners + links
      brand-mark.ts                  inline SVG logo (Roman arch + QR dots)
    pages/
      home/home.ts                   hero, stats band, featured grid, how-it-works, regions, CTA
      monuments/monuments.ts         search + region + era filters (signals); reads ?region= query param
      map/map-page.ts                Leaflet map, divIcon pins per region, popups → navigate to detail
      gallery/gallery.ts             masonry-ish image grid
      about/about.ts                 vision, steps, partners (Ministry + IZER)
      monument-detail/monument-detail.ts   ★ centerpiece (see below)
angular.json                         leaflet CSS in styles[], allowedCommonJsDependencies, allowedHosts:true,
                                     prod budgets raised (initial 2.5MB)
tailwind.config.js                   colors (parchment/sand/ink/clay/teal/gold), fonts, arabesque bg, animations
```

### Monument detail page (`monument-detail.ts`) — mirrors the Irish Statues reference
- Hero with active image + chips (UNESCO/region/era/type)
- History text + **"Listen" button** (Web Speech narration)
- Photo gallery (click thumbnail → swaps hero image)
- Documentary video block → links to YouTube search (no hardcoded video IDs to avoid wrong content)
- Location: embedded **Google Maps iframe** (`output=embed`, no key) + **Street View** + "Open in Maps" links
- Sidebar: **generated QR card** (points to `/m/:slug`) + **Share** (Web Share/clipboard) + **fact sheet** + **sources**
- Related monuments (by shared region/era)

---

## 6. The data (real monuments)

`core/data/monuments.data.ts` contains 10 real monuments across 3 regions:

| slug | Name (AR) | Region | Era | UNESCO |
|---|---|---|---|---|
| leptis-magna | لِبدة الكبرى | west | roman | ✅ 1982 |
| sabratha | صبراتة | west | roman | ✅ 1982 |
| cyrene | قورينا (شحات) | east | greek | ✅ 1982 |
| ghadames | غدامس | south | islamic | ✅ 1986 |
| tadrart-acacus | تدرارت أكاكوس | south | prehistoric | ✅ 1985 |
| marcus-aurelius-arch | قوس ماركوس أوريليوس | west | roman | — |
| red-castle | السرايا الحمراء | west | ottoman | — |
| apollonia | أبولونيا (سوسة) | east | greek/byz | — |
| ptolemais | بطوليمايس (طلميثة) | east | greek/rom | — |
| gurgi-mosque | جامع قرجي | west | ottoman | — |

Each has: bilingual name/summary/history, real lat/lng, year label, facts, sources (UNESCO/Wikipedia), and image URLs.

### ⚠️ Image caveat (must verify)
Images use **Wikimedia Commons `Special:FilePath/<filename>`** URLs built by the `img()` helper. **The exact filenames were NOT verified** (the dev environment is firewalled from Wikimedia/Google — all `upload.wikimedia.org` / `wikipedia.org` requests return 403 from the container; they load fine in a normal user browser). Some filenames may be wrong and 404. **This is handled gracefully**: `smart-image.ts` shows a branded teal "plate" with the monument name instead of a broken image. **TODO:** verify/replace filenames with confirmed-correct Commons files (or download real photos into `public/img/` and reference locally).

---

## 7. Design system (so it doesn't look "AI-generated")

- **Palette** (`tailwind.config.js`): parchment `#FAF5EC`, sand, ink `#221C14`, **clay/terracotta `#A8472A`**, **teal `#14564E`**, **gold `#C2A14D`**.
- **Fonts** (Google Fonts, loaded in `index.html`): **Amiri** (display serif), **Reem Kufi** (kufic headings), **Tajawal** (body/UI).
- Heritage/museum aesthetic: arabesque motifs, gold hairline rules with center diamond (`.rule-gold`), generous spacing, RTL-first.
- Reusable component classes in `styles.css`: `.btn`/`.btn-primary`/`.btn-teal`/`.btn-ghost`, `.card`, `.chip`, `.eyebrow`, `.plate`, `.glass`.

---

## 8. Deployment status

A **GitHub Actions workflow** exists at repo root: `.github/workflows/deploy-heritage-pages.yml`. It:
1. builds `libya-digital-memory` with `--base-href=/bunyan/`,
2. copies `index.html` → `404.html` (SPA deep-link fallback),
3. uploads + deploys to **GitHub Pages**.

**Current result:** the **build job SUCCEEDS** (validated on CI). The **deploy job FAILS** at `actions/deploy-pages@v4` because:
- GitHub **Pages is not enabled** on the repo, AND
- `bunyan` is a **private** repo → Pages requires a **paid plan (Pro)** for private repos.

### To get a live URL — options
- **A (free, recommended):** split into a public repo (see §2), then enable **Settings → Pages → Source: GitHub Actions**. The workflow deploys to `https://<user>.github.io/libya-digital-memory/` (update `--base-href` to `/libya-digital-memory/`).
- **B (Pro):** enable Pages on `bunyan` → re-run workflow → `https://momen0819.github.io/bunyan/`.
- **C:** Vercel — `npx vercel deploy` (needs auth/token; not available in the locked env). For Vercel set root dir to `libya-digital-memory`, framework Angular, and add SPA rewrites.
- **D:** run locally (`npm start`).

> Note: if base-href changes, also confirm `qr.service.publicUrl()` (uses `document.baseURI`) produces the intended public URL for QR codes.

---

## 9. Design assets — Canva (the requested "Canva" deliverable)

4 **candidate** QR field-plaque designs were generated via the Canva MCP (a vertical heritage signage plaque for mounting beside a monument, e.g. Leptis Magna). They are **candidates only — not yet saved** to an account. To make one editable, call Canva MCP `create-design-from-candidate` with its `candidate_id`.

Candidate preview URLs:
1. https://www.canva.com/d/TIoFUgyQi8-L16T  (candidate_id `dg-3c79d27d-3ea8-4613-a3cb-6414669a12d9`)
2. https://www.canva.com/d/5ztfR4tyDliYOKQ  (candidate_id `dg-45c07cf3-19f2-499c-8f8d-b9963f5fdfb1`)
3. https://www.canva.com/d/noRd_fEpL4Sy4Yt  (candidate_id `dg-ca56d72a-b089-4d4d-a44f-5cd26acbdefe`)
4. https://www.canva.com/d/FKlF4kPAEOi7pg2  (candidate_id `dg-df8d2025-7f59-432d-b42d-643972b24839`)
Job id: `0dfbbc37-58f7-4319-8c53-47173e5b9ada`.

---

## 10. Tooling notes / constraints encountered

- **Stitch MCP** and **nano-banana (Gemini image generation)** requested by the user are **NOT connected** in this environment. Substituted with: **Canva** (QR plaque) + **real Wikimedia photos** + a hand-crafted Tailwind design system. **Figma** MCP is available if design-to-code or a Figma design system is wanted next.
- Environment network is allow-listed: npm registry works; Wikimedia/Wikipedia/Google Fonts are blocked **from the container** (but work in end-user browsers). This is why no representative screenshots could be captured from the container.
- No headless browser in the container (no Puppeteer/Playwright/Chromium) → no automated screenshots.

---

## 11. Commit history (branch `claude/angular-poc-design-ebnt9z`)

```
86bd823  Allow all dev-server hosts (preview-friendly npm start)
4d2130a  Add GitHub Pages deploy workflow + Pages-aware QR URLs
921b163  Add Libyan Digital Memory — Angular 21 heritage QR POC
b23d0f1  Phase 1: real .NET 10 backend + rewired Angular (single host)   <-- pre-existing bunyan
e148920  bunyan — Arabic-first contractor & مستخلصات management POC      <-- pre-existing bunyan
```

---

## 12. Suggested next steps (TODO)

1. **Verify/replace monument image filenames** (see §6 caveat) — biggest quality win. Optionally vendor real CC/PD photos into `public/img/`.
2. **Capture screenshots / record a demo** once running in a real browser.
3. **Get a live URL**: split to a public repo + GitHub Pages (§8), or Vercel.
4. **Finalize a Canva QR plaque** via `create-design-from-candidate`, then export.
5. **(Optional) Figma**: build the design system / key screens in Figma from the existing code.
6. **Backend**: replace local `monuments.data.ts` with a .NET/API + DB (the `bunyan` repo already has a .NET 10 backend pattern to mirror); add an admin CMS for monuments + media upload.
7. **i18n**: add Italian + French (structure already supports it; extend `LocalizedText` usage).
8. **Media**: real professional audio narration + documentary videos (embed real YouTube IDs); add 360°/3D (Street View embed or photospheres).
9. **More monuments** + real QR plaque print-ready exports.
10. **A11y/perf pass**: focus states, alt text, lazy images, Lighthouse.

---

## 13. Quick orientation for the next agent

- Start by reading: `core/data/monuments.data.ts`, `core/models/monument.model.ts`, `pages/monument-detail/monument-detail.ts`, `styles.css`, `tailwind.config.js`.
- Run `npm install && npm start`; open `/`, `/monuments`, `/map`, `/m/leptis-magna`.
- Everything is standalone + signals + zoneless — no NgModules. Keep that pattern.
- The app is self-contained in `libya-digital-memory/`; do not entangle it with the rest of the `bunyan` repo.
