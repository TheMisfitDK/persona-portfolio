/* ====================================================================
   PERSONA PORTFOLIO — CUSTOM CURSOR & TAP BURST
   ==================================================================== */

(() => {
  "use strict";

  const CFG = window.CONFIG;
  const FEATS = CFG?.features || {};
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  if (!FEATS.customCursor && !FEATS.tapEffect) return;
  if (prefersReduced) return; // respect user motion preference

  /* ---------- DESKTOP: CUSTOM CURSOR ---------- */
  if (!isTouch && FEATS.customCursor) {
    const cursor = document.getElementById("cursor");
    const dot = cursor?.querySelector(".cursor__dot");
    const ring = cursor?.querySelector(".cursor__ring");
    const label = cursor?.querySelector(".cursor__label");

    if (!cursor) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX;
    let dotY = mouseY;
    let ringX = mouseX;
    let ringY = mouseY;
    let isHover = false;
    let isDown = false;
    let currentLabel = "";
    let rafId = null;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function tick() {
      dotX = lerp(dotX, mouseX, 0.35);
      dotY = lerp(dotY, mouseY, 0.35);
      ringX = lerp(ringX, mouseX, 0.18);
      ringY = lerp(ringY, mouseY, 0.18);

      if (dot) {
        dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
      }
      if (ring) {
        ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)${isHover ? " rotate(45deg)" : ""}`;
      }
      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!rafId) tick();
    });

    document.addEventListener("mousedown", () => {
      isDown = true;
      cursor.classList.add("is-down");
    });
    document.addEventListener("mouseup", () => {
      isDown = false;
      cursor.classList.remove("is-down");
    });

    // hover targets
    const HOVER_SELECTOR = "a, button, .repo-card, .commit-bar, .contrib-day, .theme-switch__btn, .contact-card__mail, .contact-card__resume a, .hero__socials a, .footer__socials a";

    let hoverTarget = null;

    document.addEventListener("mouseover", e => {
      const target = e.target.closest(HOVER_SELECTOR);
      if (!target) return;
      hoverTarget = target;
      isHover = true;
      cursor.classList.add("is-hover");

      // label from data-hover or text
      const txt = target.dataset.hover || target.getAttribute("aria-label") ||
                  (target.tagName === "A" ? target.textContent.trim().slice(0, 24) : "");
      if (txt && txt !== currentLabel) {
        currentLabel = txt;
        if (label) label.textContent = txt.toUpperCase();
      }
    });

    document.addEventListener("mouseout", e => {
      if (!e.target.closest(HOVER_SELECTOR)) {
        isHover = false;
        cursor.classList.remove("is-hover");
        hoverTarget = null;
      }
    });

    // reveal cursor after first move
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

    // also on click for desktop users with touch screens
    document.addEventListener("click", e => {
      if (e.detail === 0) return; // programmatic
      spawnBurst(e.clientX, e.clientY);
    });
  }
})();