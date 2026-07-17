# Persona Portfolio

> A kinetic, Persona 5 Royal–inspired developer portfolio template. Config-driven, zero-build, and ready to fork.

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TheMisfitDK/persona-portfolio)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/TheMisfitDK/persona-portfolio)

---

## Features

| Feature | Description |
|---------|-------------|
| **Config-Driven** | One `js/config.js` file — name, GitHub handle, contacts, socials, theme. No code edits needed. |
| **GitHub API Live Data** | Pulls avatar, bio, pinned repos, stars, followers, commit stats, and contribution graph straight from your GitHub profile. Works with or without a token. |
| **P5R Font** | "Persona 5 Menu Font" via CDN for display text (hero name, section titles, glitch) with Oswald + Inter fallbacks. |
| **Wobbly Blob Background** | SVG goo-filter animated blobs that morph and drift behind the hero — organic, smooth, adds depth. |
| **Black Diamond Cursor** | Stylish black diamond with white center dot, glow on hover, action labels — no `mix-blend-mode` jank. |
| **Theme Switcher** | 4 accent palettes (Phantom Red, Velvet Blue, Joker Green, Oracle Orange) via CSS variables — persists in `localStorage`. Smooth cross-theme transitions. |
| **P5R Menu Effects** | Sliding underlines on social links, hover overlays on theme buttons, custom focus-visible diamond outline. |
| **Tap Burst (Mobile)** | Kinetic geometric ripple on every touch — no cursor jank on phones/tablets. |
| **Scroll Reveals** | Staggered, angled entrance animations using `IntersectionObserver`. Respects `prefers-reduced-motion`. |
| **Zero Build Step** | Pure HTML/CSS/JS. Drop on any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages, Surge). |
| **Accessible** | Semantic HTML, ARIA labels, focus styles, reduced-motion support, `::selection` theming, color-contrast aware. |

---

## Quick Start

```bash
# 1. Fork this repo (or click "Use this template")
# 2. Clone your fork
git clone https://github.com/<YOUR-USERNAME>/persona-portfolio.git
cd persona-portfolio

# 3. Edit your config
#    Open js/config.js and change the values (see Config Reference below)

# 4. Deploy — pick one:
#    Vercel:   vercel --prod          (or connect repo in dashboard)
#    Netlify:  netlify deploy --prod  (or connect repo in dashboard)
#    GitHub Pages: enable Pages → source: / (root)
```

That's it. No `npm install`, no build script, no framework.

---

## Config Reference (`js/config.js`)

```js
const CONFIG = {
  // -------- IDENTITY --------
  name: "Deepak Kumar",           // Hero name (falls back to GitHub name)
  githubUsername: "TheMisfitDK",  // REQUIRED — drives all API calls
  tagline: "Phantom Thief of Code // Stealing the spotlight from boring portfolios",
  preferGithubBio: false,         // true = use GitHub bio instead of tagline

  // -------- CONTACT --------
  contact: {
    email: "you@example.com",
    location: "India",
    available: true,              // shows "Available for work" badge in contact card
    resumeUrl: ""                 // optional PDF link
  },

  // -------- SOCIAL LINKS --------
  // Leave empty strings to hide. Rendered in hero + footer.
  social: {
    github: "https://github.com/TheMisfitDK",
    twitter: "",
    linkedin: "",
    instagram: "",
    devto: "",
    website: ""
  },

  // -------- GITHUB API --------
  // Optional: Personal Access Token (classic) with `public_repo` scope.
  // Raises rate limit from 60 → 5,000 req/hr. Safe to commit if public-read only.
  // For private repos, use a fine-grained token and store in host env vars instead.
  githubToken: "",

  // -------- FEATURE FLAGS --------
  features: {
    pinnedRepos: true,        // Pinned repositories grid
    commitStats: true,        // Commit activity chart
    contributionGraph: true,  // GitHub-style contribution heatmap
    customCursor: true,       // Desktop black diamond cursor
    tapEffect: true           // Mobile tap burst
  },

  // -------- THEME --------
  // "phantom-red" | "velvet-blue" | "joker-green" | "oracle-orange"
  defaultTheme: "phantom-red"
};
```

### GitHub Token (optional but recommended)

1. Go to **Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Generate new token → check `public_repo` only
3. Paste into `CONFIG.githubToken`

> **Security note**: This token only reads public data. If you commit it, it's visible in your repo history. For private repos or extra safety, omit the token (60 req/hr is enough for a personal portfolio) or inject it at deploy time via Vercel/Netlify environment variables and read `import.meta.env.GH_TOKEN` in `config.js`.

---

## Project Structure

```
persona-portfolio/
├── index.html          # Semantic HTML: hero, stats, repos, commits, contact, footer
├── css/
│   └── styles.css      # Complete styling: theme tokens, blobs, cursor, cards, animations
├── js/
│   ├── config.js       # USER EDITABLE — single source of truth
│   ├── cursor.js       # Black diamond cursor (desktop) + tap burst (mobile)
│   ├── blobs.js        # Animated wobbly blob background
│   ├── github.js       # GitHub REST + GraphQL fetching (profile, pinned, commits, contributions)
│   └── animations.js   # Scroll reveals, HUD clock, hero fill, repo grid, theme switcher
└── assets/             # (optional) favicon, og-image, fonts
```

---

## Theming

Themes are pure CSS variables on `<html data-theme="...">`:

```css
[data-theme="phantom-red"]  { --accent:#e6362c; --accent-2:#c01f15; }
[data-theme="velvet-blue"]  { --accent:#2b6cb0; --accent-2:#1a4978; }
[data-theme="joker-green"]  { --accent:#3fcf8e; --accent-2:#1f9e6a; }
[data-theme="oracle-orange"]{ --accent:#f08a24; --accent-2:#c66a12; }
```

Add your own by defining a new `[data-theme="my-theme"]` block in `styles.css`. The switcher buttons in `index.html` must match the `data-theme` values.

The selected theme persists in `localStorage` (`persona-theme`) — saved preference always takes priority over the default. Switching themes triggers a smooth 0.35s transition across all colored elements plus a brief full-screen flash.

### P5R Background Blobs

The blob colors automatically inherit the active accent via `var(--accent)` — no extra config needed. They use an SVG goo filter (`feGaussianBlur` + `feColorMatrix`) for organic morphing. Disabled when `prefers-reduced-motion: reduce` is set.

---

## Customization Guide

### Change Fonts

Edit the `<link>` tags in `index.html` and the `--font-p5` variable in `styles.css`:

```css
:root {
  --font-p5: "Persona 5 Menu Font Prototype", "Oswald", sans-serif;
}
```

The hero name, section titles, and glitch text use `--font-p5`. Oswald is used for headings/metadata, Inter for body text. To swap the P5 font, change the CDN link in `index.html` and update `--font-p5`.

### Adjust Angles

Global skew angle: `--angle: -6deg` in `:root`. Change to `-12deg` for more drama, `0` for flat.

### Add a Section

1. Add HTML in `index.html` inside `<body>` (or after `#contact`)
2. Add `.section` + `.reveal` classes for scroll animation
3. Style in `styles.css` following `.section` pattern

### Modify Cursor Behavior

Edit `js/cursor.js`:
- `HOVER_SELECTOR` — which elements trigger the diamond morph + label
- `is-hover` / `is-down` classes for custom states
- Diamond size and glow in `styles.css` under `.cursor__diamond`

### Modify Blob Behavior

Edit `js/blobs.js`:
- `SIZES` array controls blob dimensions and starting positions
- Speed: adjust the `+= 0.004` / `+= 0.006` increments in `animate()`
- Opacity: change `.blob { opacity: 0.06 }` in CSS (higher = more visible)

### Disable Animations Globally

Set `CONFIG.features.customCursor = false`, `tapEffect = false`, or for the blobs, the `@media (prefers-reduced-motion: reduce)` rule already disables them entirely.

---

## Known Bug Fixes (v1.1)

This template includes several bug fixes over the initial release:

| Issue | Fix |
|-------|-----|
| Star/fork counts showed `undefined` | Template now uses correct `stargazers_count` / `forks_count` from GraphQL |
| Commit chart bars had zero height | CSS `height: var(--h)` now consumes the inline `--h` variable |
| Total commits always showed `--` | Reads from contribution calendar's `totalContributions` instead of missing `commits` field |
| Duplicate GraphQL calls for pinned repos | `fetchCommitActivityFallback` accepts pinned data as parameter instead of re-fetching |
| Topic badges used wrong CSS class | Template generates `.repo-card__topic` matching the CSS rule |
| Contribution cells had no color | Template now sets `data-lvl` attribute instead of unused CSS variable |
| Theme preference never loaded from localStorage | Persistence logic now correctly checks localStorage before default |
| "Available for work" badge never rendered | Config's `contact.available` now generates a badge in the contact card |
| Language badge color ignored | CSS now uses `var(--lang-color, var(--accent))` fallback |
| VIEW SOURCE link had no styling | Added `.repo-card__link` with skewX border accent style |
| Button active class mismatch | CSS uses `is-active` class matching JS toggle |

---

## Deployment

### Vercel (Recommended)
```bash
vercel --prod
```
Or import the repo in the Vercel dashboard. Zero config.

### Netlify
```bash
netlify deploy --prod --dir .
```
Or "New site from Git" → pick repo → deploy.

### GitHub Pages
1. Settings → Pages → Source: "Deploy from a branch"
2. Branch: `main` / `/ (root)`
3. Site lives at `https://<username>.github.io/<repo>/`

### Cloudflare Pages
Connect repo → Build command: `exit 0` → Output directory: `.`

### Any Static Host
Upload the folder contents. No build step.

---

## GitHub API Rate Limits

| Auth | Limit | Notes |
|------|-------|-------|
| None | 60 req/hr | Enough for personal portfolio (profile + repos + pinned) |
| `public_repo` token | 5,000 req/hr | Enables GraphQL for pinned repos + contribution graph |

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome 90+ | Full |
| Firefox 88+ | Full |
| Safari 15+ | Full |
| Edge 90+ | Full |
| Mobile Safari/Chrome | Touch burst + tap layer instead of cursor |

---

## Accessibility Checklist

- [x] Semantic HTML5 (`header`, `main`, `section`, `footer`, `nav`)
- [x] ARIA labels on icon-only links
- [x] Focus-visible diamond outline on all interactive elements
- [x] `prefers-reduced-motion` disables all transitions, animations, and blobs
- [x] `::selection` theming with accent color for visual consistency
- [x] Cursor hidden on touch devices automatically
- [x] `lang="en"` on `<html>` (change if needed)

---

## Performance

- **No JS frameworks** — ~18 KB gzipped total (HTML+CSS+JS+blobs)
- **Fonts**: P5 Menu Font (CDN) + Oswald + Inter (Google Fonts), `font-display: swap`
- **Blobs**: Pure CSS + `requestAnimationFrame` — minimal CPU impact (4 divs, SVG filter)
- **Images**: GitHub avatar served from `avatars.githubusercontent.com` (CDN, cached)
- **API**: Parallel `Promise.all` fetches, no duplicate GQL calls
- **Lighthouse**: 100/100/100/100 achievable on static hosts

---

## Contributing

PRs welcome! Especially:
- New theme palettes
- Additional GitHub data (releases, packages, sponsors)
- Performance tweaks
- i18n support for config strings

1. Fork → branch → commit → PR
2. Keep changes focused
3. Update README if you add config options

---

## License

MIT — free for personal and commercial use. Attribution appreciated but not required.

```
MIT License

Copyright (c) 2025 Deepak Kumar (TheMisfitDK)

Permission is hereby granted...
```

---

## Credits

- **Persona 5 Royal** UI/UX inspiration — Atlus / P-Studio
- **Fonts**: P5 Menu Font (CDN), Oswald (headings), Inter (body) via Google Fonts
- **Blob Goo Filter**: SVG `feGaussianBlur` + `feColorMatrix` technique
- **GitHub API** for live profile, repos, and contribution data
- **Vercel / Netlify** for frictionless hosting

---

## Support

If this template helped you, consider:
- ⭐ Starring the repo
- 🐦 Sharing with a link back

### Screenshots
<img width="1332" height="593" alt="image" src="https://github.com/user-attachments/assets/ce126180-934c-41e3-874d-f8bc29402c03" />
<img width="1270" height="386" alt="image" src="https://github.com/user-attachments/assets/a8de6675-645d-49d1-ada7-1bb9255095a7" />
<img width="887" height="564" alt="image" src="https://github.com/user-attachments/assets/589707e4-3171-446d-aae5-597fafe7a70e" />




**Made with 🎭 by [Deepak Kumar](https://github.com/TheMisfitDK) — Steal your face, not your code.**
