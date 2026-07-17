# Persona Portfolio

> A kinetic, Persona 5–inspired developer portfolio template. Config-driven, zero-build, and ready to fork.

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TheMisfitDK/persona-portfolio)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/TheMisfitDK/persona-portfolio)

---

## Features

| Feature | Description |
|---------|-------------|
| **Config-Driven** | One `js/config.js` file — name, GitHub handle, contacts, socials, theme. No code edits needed. |
| **GitHub API Live Data** | Pulls avatar, bio, pinned repos, stars, followers, commit stats, and contribution graph straight from your GitHub profile. Works with or without a token. |
| **Persona 5 Aesthetic** | Slanted typography (Slant + Oswald), angled cards, glitch hero text, stark contrast, offset shadows. |
| **Theme Switcher** | 4 accent palettes (Phantom Red, Velvet Blue, Joker Green, Oracle Orange) via CSS variables — persists in `localStorage`. |
| **Custom Cursor (Desktop)** | Morphing ring that snaps/expands on interactive elements, shows action labels. |
| **Tap Burst (Mobile)** | Kinetic geometric ripple on every touch — no cursor jank on phones/tablets. |
| **Scroll Reveals** | Staggered, angled entrance animations using `IntersectionObserver`. Respects `prefers-reduced-motion`. |
| **Zero Build Step** | Pure HTML/CSS/JS. Drop on any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages, Surge). |
| **Accessible** | Semantic HTML, ARIA labels, focus styles, reduced-motion support, color-contrast aware. |

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
    available: true,              // shows "Available for work" badge
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
    customCursor: true,       // Desktop morphing cursor
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
├── index.html          # Semantic HTML, all sections
├── css/
│   └── styles.css      # Complete styling: themes, cursor, animations, layout
├── js/
│   ├── config.js       # USER EDITABLE — single source of truth
│   ├── cursor.js       # Desktop cursor + mobile tap burst
│   ├── github.js       # GitHub REST + GraphQL fetching
│   ├── animations.js   # Scroll reveals, HUD clock, hero fill
│   └── main.js         # Bootstraps everything, renders sections
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

The selected theme persists in `localStorage` (`persona-theme`).

---

## Customization Guide

### Change Fonts
Edit the Google Fonts `<link>` in `index.html` and the `--font-*` variables in `styles.css`:
```css
:root {
  --font-display: "Slant", "Oswald", sans-serif;
  --font-heading: "Oswald", sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
}
```

### Adjust Angles
Global skew angle: `--angle: -6deg` in `:root`. Change to `-12deg` for more drama, `0` for flat.

### Add a Section
1. Add HTML in `index.html` inside `<main>` (or after `#contact`)
2. Add `.section` + `.reveal` classes for scroll animation
3. Style in `styles.css` following `.section` pattern

### Modify Cursor Behavior
Edit `js/cursor.js`:
- `hoverSelector` — which elements trigger the morph
- `is-hover` / `is-down` classes for custom states
- `tapBurst` styling in `styles.css` (`.tap-burst`)

### Disable Animations Globally
Set `CONFIG.features.customCursor = false` and/or `tapEffect = false`. For full no-motion, the CSS `@media (prefers-reduced-motion: reduce)` already disables transitions.

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

Without a token, the fallback fetches public repos and sorts by stars/pushed date to guess "pinned". Contribution graph and exact pinned items require GraphQL (token).

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome 90+ | Full |
| Firefox 88+ | Full |
| Safari 15+ | Full (cursor blend mode fallback) |
| Edge 90+ | Full |
| Mobile Safari/Chrome | Touch burst instead of cursor |

---

## Accessibility Checklist

- [x] Semantic HTML5 (`header`, `main`, `section`, `footer`, `nav`)
- [x] ARIA labels on icon-only links
- [x] Focus-visible outlines on all interactive elements
- [x] `prefers-reduced-motion` disables all transitions/animations
- [x] Color contrast ≥ 4.5:1 on all themes (tested)
- [x] Cursor hidden on touch devices automatically
- [x] `lang="en"` on `<html>` (change if needed)

---

## Performance

- **No JS frameworks** — ~15 KB gzipped total (HTML+CSS+JS)
- **Fonts**: 3 Google Fonts subsets (latin only), `font-display: swap`
- **Images**: GitHub avatar served from `avatars.githubusercontent.com` (CDN, cached)
- **API**: Parallel `Promise.all` fetches, cached in browser for session
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

- **Persona 5** UI/UX inspiration — Atlus / P-Studio
- **Fonts**: Slant (display), Oswald (headings), Inter (body) via Google Fonts
- **GitHub API** for live data
- **Vercel / Netlify** for frictionless hosting

---

## Support

If this template helped you, consider:
- ⭐ Starring the repo
- 🐦 Sharing with a link back
- ☕ [Buying me a coffee](https://buymeacoffee.com/TheMisfitDK) (optional)

---

**Made with 🎭 by [Deepak Kumar](https://github.com/TheMisfitDK) — Steal your face, not your code.**