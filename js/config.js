/* ====================================================================
   PERSONA PORTFOLIO - CENTRAL CONFIG
   --------------------------------------------------------------------
   Fork this project and edit the values below to make it your own.
   No other files need to be touched for basic customization.
   ==================================================================== */

const CONFIG = {
  /* -------- IDENTITY -------- */
  // Your display name (shown big and bold in the hero). Override or leave to the GitHub value.
  name: "Deepak Kumar",
  // Your GitHub username. The site pulls avatar, bio, pinned repos & stats from here.
  githubUsername: "TheMisfitDK",
  // Optional tagline shown under the hero name. Falls back to GitHub bio if left empty.
  tagline: "Phantom Thief of Code // Stealing the spotlight from boring portfolios",
  // Whether to prefer the GitHub bio over your local tagline (true = use GitHub bio).
  preferGithubBio: false,

  /* -------- CONTACT -------- */
  contact: {
    email: "deepak@example.com",      // Replace with your real email
    location: "India",                  // Free text
    available: true,                   // Toggles the "Available for work" badge
    resumeUrl: ""                      // Optional: link to a hosted PDF resume
  },

  /* -------- SOCIAL LINKS -------- */
  // Show/hide or swap any of these. They render in the hero + footer.
  social: {
    github: "https://github.com/TheMisfitDK",
    twitter: "",     // e.g. "https://twitter.com/yourhandle"
    linkedin: "",    // e.g. "https://linkedin.com/in/yourhandle"
    instagram: "",
    devto: "",
    website: ""      // Personal site if different from this portfolio
  },

  /* -------- GITHUB API -------- */
  // Optional personal access token to raise the rate limit from 60 -> 5000 req/hour.
  // Only needs `public_repo` read scope. For static deploys, leave a public read-only
  // token (or leave blank for 60 req/hour plain). See README for safety notes.
  githubToken: "",

  /* -------- FEATURE FLAGS -------- */
  features: {
    pinnedRepos: true,        // Show pinned repositories grid
    commitStats: true,        // Show commit activity chart
    contributionGraph: true,  // Show contribution heatmap
    customCursor: true,       // Desktop morphing cursor
    tapEffect: true           // Mobile touch burst effect
  },

  /* -------- THEME -------- */
  // Default accent on first load. Options: "phantom-red" | "velvet-blue" | "joker-green" | "oracle-orange"
  defaultTheme: "phantom-red"
};

// Expose globally for non-module scripts
window.CONFIG = CONFIG;
