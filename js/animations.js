/* ====================================================================
   ANIMATIONS & SCROLL REVEALS
   - Kinetic, angled reveals
   - Staggered hero load
   - Commit chart & contribution graph renderers
   ==================================================================== */
(function () {
  const CFG = window.CONFIG;
  const FEATS = CFG?.features || {};

  /* ---------- SCROLL REVEAL ---------- */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -10% 0px" });

  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  /* ---------- HUD CLOCK ---------- */
  function startClock() {
    const el = document.getElementById("hudClock");
    if (!el) return;
    const tick = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      el.textContent = `${hh}:${mm}:${ss}`;
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- HERO FILL ---------- */
  function fillHero(profile) {
    document.getElementById("heroName").textContent = CFG.name || profile.name || profile.login;
    document.getElementById("heroAvatar").src = profile.avatar_url || "";
    document.getElementById("heroAvatar").alt = `${CFG.name || profile.login}'s avatar`;

    const taglineEl = document.getElementById("heroTagline");
    const bioEl = document.getElementById("heroBio");
    if (CFG.preferGithubBio && profile.bio) {
      bioEl.textContent = profile.bio;
    } else {
      taglineEl.textContent = CFG.tagline || "";
      bioEl.textContent = profile.bio || "";
    }

    // socials
    const wrap = document.getElementById("heroSocials");
    wrap.innerHTML = "";
    Object.entries(CFG.social || {}).forEach(([k, v]) => {
      if (!v) return;
      const a = document.createElement("a");
      a.href = v;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = `hero__social hero__social--${k}`;
      a.setAttribute("aria-label", k);
      a.textContent = k.toUpperCase();
      a.dataset.hover = k.toUpperCase();
      wrap.appendChild(a);
    });

    // stats strip
    document.getElementById("statRepos").textContent = profile.public_repos || "--";
    document.getElementById("statFollowers").textContent = profile.followers || "--";
    document.getElementById("statFollowing").textContent = profile.following || "--";
    document.getElementById("statStars").textContent = profile.totalStars ?? "--";
    if (FEATS.commitStats && profile.totalCommits) {
      document.getElementById("statCommitsWrap").hidden = false;
      document.getElementById("statCommits").textContent = profile.totalCommits.toLocaleString();
    }

    // footer
    document.getElementById("year").textContent = new Date().getFullYear();
    document.getElementById("footerName").textContent = CFG.name || profile.login;
    const fwrap = document.getElementById("footerSocials");
    fwrap.innerHTML = "";
    Object.entries(CFG.social || {}).forEach(([k, v]) => {
      if (!v) return;
      const a = document.createElement("a");
      a.href = v; a.target = "_blank"; a.rel = "noopener noreferrer";
      a.className = `footer__social footer__social--${k}`;
      a.textContent = k.toUpperCase();
      fwrap.appendChild(a);
    });

    // contact
    const c = CFG.contact || {};
    document.getElementById("contactEmail").href = `mailto:${c.email}`;
    document.getElementById("contactEmail").textContent = c.email;
    document.getElementById("contactLoc").textContent = c.location || "";
    if (c.resumeUrl) {
      document.getElementById("contactResume").href = c.resumeUrl;
      document.getElementById("contactResume").hidden = false;
    }
  }

  /* ---------- REPO GRID ---------- */
  function renderRepos(repos) {
    const grid = document.getElementById("repoGrid");
    if (!grid) return;
    if (!repos?.length) {
      grid.innerHTML = `<p class="repo-grid__empty">No loot pinned yet.</p>`;
      return;
    }
    grid.innerHTML = repos.map(r => `
      <article class="repo-card reveal" data-hover="VIEW" tabindex="0">
        <div class="repo-card__head">
          <span class="repo-card__name">${r.name}</span>
          ${r.language ? `<span class="repo-card__lang" style="--lang-color:${langColor(r.language)}">${r.language}</span>` : ""}
        </div>
        <p class="repo-card__desc">${r.description || "No description."}</p>
        <div class="repo-card__meta">
          ${r.topics?.slice(0, 3).map(t => `<span class="repo-card__tag">${t}</span>`).join("") || ""}
          <span class="repo-card__stars" data-hover="★ ${r.stars}">★ ${r.stars}</span>
          <span class="repo-card__forks" data-hover="⑂ ${r.forks}">⑂ ${r.forks}</span>
        </div>
        <a class="repo-card__link" href="${r.url}" target="_blank" rel="noopener noreferrer">VIEW SOURCE ▸</a>
      </article>
    `).join("");

    grid.querySelectorAll(".repo-card").forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.06}s`;
      revealObserver.observe(el);
    });
  }

  function langColor(lang) {
    const map = { JavaScript:"#f1e05a", TypeScript:"#3178c6", Python:"#3572A5", Rust:"#dea584", Go:"#00ADD8", Java:"#b07219", C:"#555555", "C++":"#f34b7d", CSharp:"#178600", HTML:"#e34c26", CSS:"#563d7c", Vue:"#42b883", Svelte:"#ff3e00", Shell:"#89e051" };
    return map[lang] || "#888";
  }

  /* ---------- COMMIT ACTIVITY CHART ---------- */
  function renderCommitChart(bars) {
    const wrap = document.getElementById("commitChart");
    if (!wrap || !bars?.length) return;
    const max = Math.max(...bars.map(b => b.count), 1);
    wrap.innerHTML = bars.map(b => `
      <div class="commit-bar reveal" style="--h:${(b.count/max)*100}%" data-hover="${b.name}: ${b.count} commits">
        <span class="commit-bar__name">${b.name.slice(0,12)}</span>
        <span class="commit-bar__val">${b.count}</span>
      </div>
    `).join("");
    wrap.querySelectorAll(".commit-bar").forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.04}s`;
      revealObserver.observe(el);
    });
    document.getElementById("commits").hidden = false;
  }

  /* ---------- CONTRIBUTION GRAPH ---------- */
  function renderContribGraph(calendar) {
    const wrap = document.getElementById("contribGraph");
    if (!wrap || !calendar) return;
    const weeks = calendar.weeks || [];
    const total = calendar.totalContributions || 0;
    const max = Math.max(...weeks.flatMap(w => w.contributionDays.map(d => d.contributionCount)), 1);

    wrap.innerHTML = `
      <div class="contrib-graph__header">
        <span>${total} contributions in the last year</span>
      </div>
      <div class="contrib-graph__grid">
        ${weeks.map(w => `
          <div class="contrib-graph__col">
            ${w.contributionDays.map(d => `
              <div class="contrib-day reveal" style="--lvl:${Math.min(4, Math.ceil((d.contributionCount/max)*4))}" data-date="${d.date}" data-count="${d.contributionCount}" data-hover="${d.contributionCount} contributions on ${d.date}"></div>
            `).join("")}
          </div>
        `).join("")}
      </div>
    `;
    wrap.querySelectorAll(".contrib-day").forEach((el, i) => {
      el.style.transitionDelay = `${(i % 52) * 0.005}s`;
      revealObserver.observe(el);
    });
    document.getElementById("contrib").hidden = false;
  }

  /* ---------- THEME SWITCHER ---------- */
  function initThemeSwitcher() {
    const btns = document.querySelectorAll(".theme-switch__btn");
    const html = document.documentElement;
    const initial = CFG?.defaultTheme || "phantom-red";
    html.dataset.theme = initial;
    btns.forEach(b => b.classList.toggle("is-active", b.dataset.theme === initial));

    btns.forEach(btn => btn.addEventListener("click", () => {
      html.dataset.theme = btn.dataset.theme;
      btns.forEach(b => b.classList.toggle("is-active", b === btn));
      localStorage.setItem("persona-theme", btn.dataset.theme);
    }));

    // persist
    const saved = localStorage.getItem("persona-theme");
    if (saved && !CFG?.defaultTheme) {
      html.dataset.theme = saved;
      btns.forEach(b => b.classList.toggle("is-active", b.dataset.theme === saved));
    }
  }

  /* ---------- BOOT ---------- */
  async function init() {
    startClock();
    initThemeSwitcher();

    try {
      const [profile, pinnedData] = await Promise.all([
        window.GITHUB_API.fetchProfile(),
        window.GITHUB_API.fetchPinned()
      ]);

      // augment profile with stars + commits
      const repos = await window.GITHUB_API.fetchRepos();
      profile.totalStars = window.GITHUB_API.totalStars(repos);
      profile.totalCommits = pinnedData?.commits || null;

      fillHero(profile);

      if (FEATS.pinnedRepos && pinnedData?.pinned) renderRepos(pinnedData.pinned);
      if (FEATS.commitStats && !pinnedData?.commits) {
        const bars = await window.GITHUB_API.fetchCommitActivityFallback();
        renderCommitChart(bars);
      }
      if (FEATS.contributionGraph && pinnedData?.calendar) renderContribGraph(pinnedData.calendar);

    } catch (e) {
      console.error("[persona-portfolio] GitHub fetch failed:", e);
      // graceful fallback: still show hero with config name
      fillHero({ login: CFG.githubUsername, name: CFG.name, avatar_url: "", bio: "", public_repos: "--", followers: "--", following: "--" });
      document.getElementById("repoGrid").innerHTML = `<p class="repo-grid__error">Could not fetch GitHub data. Set CONFIG.githubToken for higher rate limit.</p>`;
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();