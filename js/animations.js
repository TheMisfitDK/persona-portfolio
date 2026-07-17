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
    if (c.available) {
      const badge = document.createElement("span");
      badge.className = "contact-card__badge";
      badge.textContent = "AVAILABLE // FOR WORK";
      document.getElementById("contactCard").appendChild(badge);
    }
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
          ${r.topics?.slice(0, 3).map(t => `<span class="repo-card__topic">${t}</span>`).join("") || ""}
          <span class="repo-card__stars" data-hover="★ ${r.stargazers_count}">★ ${r.stargazers_count}</span>
          <span class="repo-card__forks" data-hover="⑂ ${r.forks_count}">⑂ ${r.forks_count}</span>
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
              <div class="contrib-day reveal" data-lvl="${Math.min(4, Math.ceil((d.contributionCount/max)*4))}" data-date="${d.date}" data-count="${d.contributionCount}" data-hover="${d.contributionCount} contributions on ${d.date}"></div>
            `).join("")}
          </div>
        `).join("")}
      </div>
    `;
    wrap.querySelectorAll(".contrib-day").forEach((el, i) => {
      const col = Math.floor(i / 7);
      const row = i % 7;
      el.style.transitionDelay = `${row * 0.02 + col * 0.003}s`;
      revealObserver.observe(el);
    });
    document.getElementById("contrib").hidden = false;
  }

  /* ---------- SKILLS ---------- */
  function renderSkills() {
    const grid = document.getElementById("skillsGrid");
    const skills = CFG?.skills;
    if (!grid || !skills?.length) return;
    grid.innerHTML = skills.map(s => `
      <article class="skill-card reveal" tabindex="0">
        <div class="skill-card__inner">
          <div class="skill-card__head">
            <span class="skill-card__icon">${s.icon || "▸"}</span>
            <span class="skill-card__name">${s.name}</span>
          </div>
          <div class="skill-card__bar">
            <div class="skill-card__bar-fill" style="--level:${s.level}%"></div>
          </div>
          <span class="skill-card__lvl">${s.level}%</span>
        </div>
      </article>
    `).join("");
    grid.querySelectorAll(".skill-card").forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.05}s`;
      revealObserver.observe(el);
    });
  }

  /* ---------- EXPERIENCE / TIMELINE ---------- */
  function renderExperience() {
    const wrap = document.getElementById("timeline");
    const exp = CFG?.experience;
    if (!wrap || !exp?.length) return;
    wrap.innerHTML = exp.map((e, i) => `
      <article class="timeline__item reveal" tabindex="0" style="transition-delay:${i * 0.1}s">
        <div class="timeline__dot"></div>
        <div class="timeline__role">${e.role}</div>
        <div class="timeline__meta">
          <span class="timeline__company">${e.company}</span>
          <span class="timeline__period">${e.period}</span>
        </div>
        <p class="timeline__desc">${e.description}</p>
      </article>
    `).join("");
    wrap.querySelectorAll(".timeline__item").forEach(el => revealObserver.observe(el));
  }

  /* ---------- FEATURED PROJECTS ---------- */
  function renderProjects() {
    const grid = document.getElementById("projectsGrid");
    const projects = CFG?.featuredProjects;
    if (!grid || !projects?.length) return;
    grid.innerHTML = projects.map((p, i) => `
      <article class="project-card reveal" tabindex="0" style="transition-delay:${i * 0.06}s">
        <div class="project-card__inner">
          <h3 class="project-card__name">${p.name}</h3>
          <p class="project-card__desc">${p.description}</p>
          ${p.techs?.length ? `<div class="project-card__techs">${p.techs.map(t => `<span class="project-card__tech">${t}</span>`).join("")}</div>` : ""}
          <a class="project-card__link" href="${p.url}" target="_blank" rel="noopener noreferrer">VIEW ▸</a>
        </div>
      </article>
    `).join("");
    grid.querySelectorAll(".project-card").forEach(el => revealObserver.observe(el));
  }

  /* ---------- EDUCATION ---------- */
  function renderEducation() {
    const grid = document.getElementById("eduGrid");
    const edu = CFG?.education;
    if (!grid || !edu?.length) return;
    grid.innerHTML = edu.map((e, i) => `
      <article class="edu-card reveal" tabindex="0" style="transition-delay:${i * 0.08}s">
        <div class="edu-card__inner">
          <h3 class="edu-card__degree">${e.degree}</h3>
          <p class="edu-card__institution">${e.institution}</p>
          <p class="edu-card__year">${e.year}</p>
        </div>
      </article>
    `).join("");
    grid.querySelectorAll(".edu-card").forEach(el => revealObserver.observe(el));
  }

  /* ---------- TESTIMONIALS ---------- */
  function renderTestimonials() {
    const grid = document.getElementById("testimonialsGrid");
    const testimonials = CFG?.testimonials;
    if (!grid || !testimonials?.length) return;
    grid.innerHTML = testimonials.map((t, i) => `
      <article class="testimonial-card reveal" tabindex="0" style="transition-delay:${i * 0.07}s">
        <div class="testimonial-card__inner">
          <p class="testimonial-card__text">${t.quote}</p>
          <p class="testimonial-card__author">${t.author}</p>
          <p class="testimonial-card__role">${t.role}</p>
        </div>
      </article>
    `).join("");
    grid.querySelectorAll(".testimonial-card").forEach(el => revealObserver.observe(el));
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
      document.body.classList.remove("theme-flash");
      requestAnimationFrame(() => document.body.classList.add("theme-flash"));
    }));

    // persist — localStorage always wins over default
    const saved = localStorage.getItem("persona-theme");
    if (saved) {
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
      profile.totalCommits = pinnedData?.calendar?.totalContributions || null;

      fillHero(profile);

      if (FEATS.pinnedRepos && pinnedData?.pinned) renderRepos(pinnedData.pinned);
      if (FEATS.commitStats) {
        const bars = await window.GITHUB_API.fetchCommitActivityFallback(pinnedData?.pinned);
        renderCommitChart(bars);
      }
      if (FEATS.contributionGraph && pinnedData?.calendar) renderContribGraph(pinnedData.calendar);

      renderSkills();
      renderExperience();
      renderProjects();
      renderEducation();
      renderTestimonials();

    } catch (e) {
      console.error("[persona-portfolio] GitHub fetch failed:", e);
      // graceful fallback: still show hero with config name
      fillHero({ login: CFG.githubUsername, name: CFG.name, avatar_url: "", bio: "", public_repos: "--", followers: "--", following: "--" });
      document.getElementById("repoGrid").innerHTML = `<p class="repo-grid__error">Could not fetch GitHub data. Set CONFIG.githubToken for higher rate limit.</p>`;
      // local sections still render
      renderSkills();
      renderExperience();
      renderProjects();
      renderEducation();
      renderTestimonials();
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();