(() => {
  "use strict";

  const CFG = window.CONFIG;
  const FEATS = CFG?.features || {};
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  if (!FEATS.customCursor && !FEATS.tapEffect) return;
  if (prefersReduced) return;

  /* ---------- DESKTOP: BLACK DIAMOND CURSOR ---------- */
  if (!isTouch && FEATS.customCursor) {
    const cursor = document.getElementById("cursor");
    const diamond = cursor?.querySelector(".cursor__diamond");
    const dot = cursor?.querySelector(".cursor__dot");
    const label = cursor?.querySelector(".cursor__label");

    if (!cursor || !diamond) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let curX = mouseX;
    let curY = mouseY;
    let currentLabel = "";
    let rafId = null;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function tick() {
      curX = lerp(curX, mouseX, 0.2);
      curY = lerp(curY, mouseY, 0.2);
      diamond.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%) rotate(45deg)`;
      if (dot) {
        dot.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
      }
      if (label) {
        label.style.transform = `translate(${curX + 18}px, ${curY - 18}px)`;
      }
      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!rafId) tick();
    });

    document.addEventListener("mousedown", () => cursor.classList.add("is-down"));
    document.addEventListener("mouseup", () => cursor.classList.remove("is-down"));

    const HOVER_SELECTOR = "a, button, .repo-card, .commit-bar, .contrib-day, .theme-switch__btn, .contact-card__mail, .contact-card__resume a, .hero__socials a, .footer__socials a";

    document.addEventListener("mouseover", e => {
      const target = e.target.closest(HOVER_SELECTOR);
      if (!target) return;
      cursor.classList.add("is-hover");

      const txt = target.dataset.hover || target.getAttribute("aria-label") ||
                  (target.tagName === "A" ? target.textContent.trim().slice(0, 24) : "");
      if (txt && txt !== currentLabel) {
        currentLabel = txt;
        if (label) label.textContent = txt.toUpperCase();
      }
    });

    document.addEventListener("mouseout", e => {
      if (!e.target.closest(HOVER_SELECTOR)) {
        cursor.classList.remove("is-hover");
      }
    });

    document.addEventListener("mousemove", () => {
      document.body.classList.add("has-cursor");
    }, { once: true });
  }

  /* ---------- MOBILE: TAP BURST ---------- */
  if (isTouch && FEATS.tapEffect) {
    const layer = document.getElementById("tapLayer");
    if (!layer) return;

    function spawnBurst(x, y) {
      const burst = document.createElement("div");
      burst.className = "tap-burst";
      burst.style.left = x + "px";
      burst.style.top = y + "px";
      layer.appendChild(burst);
      burst.addEventListener("animationend", () => burst.remove());
    }

    document.addEventListener("touchstart", e => {
      const t = e.changedTouches[0];
      spawnBurst(t.clientX, t.clientY);
    }, { passive: true });

    document.addEventListener("click", e => {
      if (e.detail === 0) return;
      spawnBurst(e.clientX, e.clientY);
    });
  }
})();
