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

  /* -------- SKILLS -------- */
  // List of skills with proficiency percentage (0-100)
  skills: [
    { name: "JavaScript", level: 90, icon: "⚡" },
    { name: "TypeScript", level: 85, icon: "📘" },
    { name: "React", level: 88, icon: "⚛" },
    { name: "Node.js", level: 82, icon: "🟢" },
    { name: "Python", level: 75, icon: "🐍" },
    { name: "HTML/CSS", level: 95, icon: "🌐" },
    { name: "Git", level: 85, icon: "🔀" },
    { name: "SQL", level: 70, icon: "🗄" }
  ],

  /* -------- EXPERIENCE -------- */
  experience: [
    {
      role: "Senior Software Engineer",
      company: "Tech Corp",
      period: "2022 — Present",
      description: "Leading frontend architecture for a suite of SaaS products. Driving migration from legacy codebase to modern React + TypeScript stack."
    },
    {
      role: "Full Stack Developer",
      company: "StartupXYZ",
      period: "2020 — 2022",
      description: "Built and shipped a real-time collaboration platform serving 50K+ users. Owned the full stack from React frontend to Node.js API and Postgres."
    },
    {
      role: "Junior Developer",
      company: "WebAgency",
      period: "2018 — 2020",
      description: "Developed responsive web applications for diverse clients. Introduced CI/CD pipelines and automated testing."
    }
  ],

  /* -------- FEATURED PROJECTS -------- */
  featuredProjects: [
    {
      name: "Persona Portfolio",
      description: "A kinetic, Persona 5-inspired developer portfolio template with GitHub integration, custom cursor, and animated blobs.",
      url: "https://github.com/TheMisfitDK/persona-portfolio",
      techs: ["JavaScript", "CSS", "GraphQL"]
    },
    {
      name: "Project Phoenix",
      description: "Real-time collaboration tool with WebSocket-based sync and offline-first architecture.",
      url: "#",
      techs: ["React", "Node.js", "WebSocket"]
    },
    {
      name: "DevMetrics",
      description: "Developer productivity dashboard that visualizes GitHub contribution patterns and team velocity.",
      url: "#",
      techs: ["TypeScript", "D3.js", "GraphQL"]
    },
    {
      name: "CloudDeploy CLI",
      description: "Command-line tool for one-click deployment to multiple cloud providers with zero-downtime rollouts.",
      url: "#",
      techs: ["Python", "AWS", "Docker"]
    }
  ],

  /* -------- EDUCATION -------- */
  education: [
    {
      degree: "B.Tech in Computer Science",
      institution: "University of Technology",
      year: "2018"
    },
    {
      degree: "Full Stack Web Development",
      institution: "Online Academy",
      year: "2019"
    }
  ],

  /* -------- TESTIMONIALS -------- */
  testimonials: [
    {
      quote: "Deepak is one of the most talented engineers I've worked with. His ability to take complex problems and ship elegant solutions is remarkable.",
      author: "Jane Doe",
      role: "CTO, Tech Corp"
    },
    {
      quote: "Working with Deepak was a game-changer for our team. He brought structure, clarity, and a relentless focus on quality.",
      author: "John Smith",
      role: "Product Lead, StartupXYZ"
    },
    {
      quote: "Deepak's portfolio template is hands-down the most creative developer portfolio I've ever seen. The Persona 5 aesthetic is incredible.",
      author: "Alex Rivera",
      role: "Open Source Contributor"
    }
  ],

  /* -------- THEME -------- */
  // Default accent on first load. Options: "phantom-red" | "velvet-blue" | "joker-green" | "oracle-orange"
  defaultTheme: "phantom-red"
};

// Expose globally for non-module scripts
window.CONFIG = CONFIG;
