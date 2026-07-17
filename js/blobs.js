(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  const blobs = document.querySelectorAll(".blob");
  if (!blobs.length) return;

  const SIZES = [
    { w: 320, h: 280, x: 0.05, y: 0.1 },
    { w: 240, h: 300, x: 0.7, y: 0.15 },
    { w: 280, h: 220, x: 0.1, y: 0.6 },
    { w: 200, h: 260, x: 0.75, y: 0.7 }
  ];

  blobs.forEach((blob, i) => {
    const s = SIZES[i % SIZES.length];
    const startX = window.innerWidth * s.x;
    const startY = window.innerHeight * s.y;
    let x = startX;
    let y = startY;
    let dx = (Math.random() - 0.5) * 0.5;
    let dy = (Math.random() - 0.5) * 0.5;
    let phase = Math.random() * Math.PI * 2;
    let morphPhase = Math.random() * Math.PI * 2;

    blob.style.width = s.w + "px";
    blob.style.height = s.h + "px";

    function animate() {
      phase += 0.004;
      morphPhase += 0.006;

      x += dx + Math.sin(phase) * 0.3;
      y += dy + Math.cos(phase * 0.7) * 0.3;

      const mx = 80;
      if (x < -mx || x > window.innerWidth + mx - s.w) dx *= -1;
      if (y < -mx || y > window.innerHeight + mx - s.h) dy *= -1;

      x = Math.max(-mx, Math.min(window.innerWidth + mx - s.w, x));
      y = Math.max(-mx, Math.min(window.innerHeight + mx - s.h, y));

      const sX = 1 + Math.sin(morphPhase) * 0.1;
      const sY = 1 + Math.cos(morphPhase * 0.8) * 0.1;
      const rot = Math.sin(morphPhase * 0.5) * 6;
      const br1 = 40 + Math.sin(morphPhase) * 15;
      const br2 = 40 + Math.cos(morphPhase * 0.7) * 15;
      const br3 = 40 + Math.sin(morphPhase * 1.3) * 15;
      const br4 = 40 + Math.cos(morphPhase * 0.9) * 15;

      blob.style.transform = `translate(${x}px, ${y}px) scale(${sX}, ${sY}) rotate(${rot}deg)`;
      blob.style.borderRadius = `${br1}% ${br2}% ${br3}% ${br4}% / ${br2}% ${br1}% ${br4}% ${br3}%`;

      requestAnimationFrame(animate);
    }

    animate();
  });
})();
