/* ====================================================================
   PERSONA PORTFOLIO — GITHUB API LAYER
   GraphQL for pinned repos + contribution calendar + stats
   REST fallback for commit activity (no auth needed, 60 req/h)
   ==================================================================== */

(() => {
  "use strict";

  const CFG = window.CONFIG || {};
  const TOKEN = CFG.githubToken;
  const USER = CFG.githubUsername;

  const GH_GQL = "https://api.github.com/graphql";
  const GH_REST = "https://api.github.com";

  const HEADERS = {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(TOKEN ? { "Authorization": `Bearer ${TOKEN}` } : {})
  };

  /* ---------- GRAPHQL QUERIES ---------- */

  const USER_PROFILE_QUERY = `
    query($login: String!) {
      user(login: $login) {
        login name avatarUrl bio url
        followers { totalCount }
        following { totalCount }
        repositories { totalCount }
        starredRepositories { totalCount }
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name description url stargazerCount forkCount
              primaryLanguage { name color }
              repositoryTopics(first: 5) { nodes { topic { name } } }
            }
          }
        }
      }
    }
  `;

  const CONTRIBUTION_CALENDAR_QUERY = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  /* ---------- HELPERS ---------- */

  async function gql(query, variables) {
    const res = await fetch(GH_GQL, {
      method: "POST",
      headers: { ...HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables })
    });
    const data = await res.json();
    if (data.errors) throw new Error(data.errors.map(e => e.message).join("; "));
    if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}`);
    return data.data;
  }

  async function rest(path, init = {}) {
    const res = await fetch(`${GH_REST}${path}`, { ...init, headers: HEADERS });
    if (!res.ok) throw new Error(`REST ${res.status} ${path}`);
    return res.json();
  }

  /* ---------- PUBLIC API ---------- */

  async function fetchProfile() {
    const { user } = await gql(USER_PROFILE_QUERY, { login: USER });
    if (!user) throw new Error("User not found");
    return {
      login: user.login,
      name: user.name || user.login,
      avatar_url: user.avatarUrl,
      bio: user.bio || "",
      html_url: user.url,
      public_repos: user.repositories.totalCount,
      followers: user.followers.totalCount,
      following: user.following.totalCount,
      totalStars: user.starredRepositories.totalCount
    };
  }

  async function fetchPinned() {
    const { user } = await gql(USER_PROFILE_QUERY, { login: USER });
    const pinned = user?.pinnedItems?.nodes?.map(r => ({
      name: r.name,
      description: r.description,
      html_url: r.url,
      stargazers_count: r.stargazerCount,
      forks_count: r.forkCount,
      language: r.primaryLanguage?.name || null,
      language_color: r.primaryLanguage?.color || null,
      topics: r.repositoryTopics?.nodes?.map(n => n.topic.name) || []
    })) || [];

    // contributions calendar
    let calendar = null;
    try {
      const { user: u2 } = await gql(CONTRIBUTION_CALENDAR_QUERY, { login: USER });
      calendar = u2?.contributionsCollection?.contributionCalendar || null;
    } catch (e) {
      console.warn("[github] contribution calendar failed:", e.message);
    }

    return { pinned, calendar };
  }

  async function fetchRepos() {
    // fetch first 100 public repos for star counting
    const repos = await rest(`/users/${USER}/repos?per_page=100&sort=pushed`);
    return repos.filter(r => !r.fork);
  }

  function totalStars(repos) {
    return repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
  }

  /* ---------- COMMIT ACTIVITY FALLBACK (REST, no auth) ---------- */
  // Uses /repos/{owner}/{repo}/stats/commit_activity — 60 req/hr unauth.
  // We only fetch for top 6 pinned repos to stay under limit.

  async function fetchCommitActivityFallback(pinnedRepos) {
    const repos = (pinnedRepos || (await fetchPinned()).pinned)?.slice(0, 6) || [];
    const bars = [];

    for (const r of repos) {
      try {
        const stats = await rest(`/repos/${USER}/${r.name}/stats/commit_activity`);
        if (!Array.isArray(stats)) continue;
        const total = stats.reduce((s, w) => s + w.total, 0);
        bars.push({ name: r.name, count: total });
      } catch (e) {
        // rate limited or no access — skip silently
      }
    }

    // sort by commits desc
    bars.sort((a, b) => b.count - a.count);
    return bars;
  }

  /* ---------- EXPOSE ---------- */
  window.GITHUB_API = {
    fetchProfile,
    fetchPinned,
    fetchRepos,
    fetchCommitActivityFallback,
    totalStars
  };
})();