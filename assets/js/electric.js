/*
 * Electric aura: lightning that crawls along the outline of a
 * transparent character image. The outline is read from the image's
 * alpha channel, so it works with any cut-out PNG/WebP.
 */
(function () {
  "use strict";

  const PAD = 48; // room around the image for bolts to jump out

  window.electrify = function electrify(img, opts = {}) {
    const glow = opts.glow || "#ffd23f";
    const core = opts.core || "#ffffff";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const canvas = document.createElement("canvas");
    canvas.className = "electric";
    canvas.setAttribute("aria-hidden", "true");
    img.after(canvas);
    const ctx = canvas.getContext("2d");

    let outline = []; // points along the silhouette, in walking order
    let w = 0, h = 0, dpr = 1;
    let runners = [];
    let visible = true;
    let raf = 0;
    let last = 0;

    // ── Read the silhouette ──────────────────────────────────
    function build() {
      w = img.clientWidth;
      h = img.clientHeight;
      if (!w || !h) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = (w + PAD * 2) * dpr;
      canvas.height = (h + PAD * 2) * dpr;
      canvas.style.width = `${w + PAD * 2}px`;
      canvas.style.height = `${h + PAD * 2}px`;
      canvas.style.left = `${-PAD}px`;
      canvas.style.top = `${-PAD}px`;

      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const o = off.getContext("2d", { willReadFrequently: true });
      o.drawImage(img, 0, 0, w, h);
      let data;
      try {
        data = o.getImageData(0, 0, w, h).data;
      } catch (e) {
        outline = []; // cross-origin image: keep just the CSS glow
        return;
      }
      const solid = (x, y) => x >= 0 && y >= 0 && x < w && y < h && data[(y * w + x) * 4 + 3] > 70;

      const pts = [];
      let cx = 0, cy = 0;
      const step = 2;
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          if (!solid(x, y)) continue;
          if (!solid(x - 3, y) || !solid(x + 3, y) || !solid(x, y - 3) || !solid(x, y + 3)) {
            pts.push({ x, y });
            cx += x;
            cy += y;
          }
        }
      }
      if (!pts.length) return;
      cx /= pts.length;
      cy /= pts.length;

      // Walk the edge: start at the top-most point and keep hopping to
      // the nearest unvisited neighbour. Gaps become breaks in the path.
      const left = pts.slice();
      left.sort((a, b) => a.y - b.y);
      const path = [];
      let cur = left.shift();
      path.push(cur);
      while (left.length) {
        let best = 0, bestD = Infinity;
        for (let i = 0; i < left.length; i++) {
          const dx = left[i].x - cur.x, dy = left[i].y - cur.y;
          const d = dx * dx + dy * dy;
          if (d < bestD) { bestD = d; best = i; if (d <= 8) break; }
        }
        cur = left.splice(best, 1)[0];
        cur.gap = bestD > 26 * 26;
        // outward direction, used to push bolts away from the body
        const nx = cur.x - cx, ny = cur.y - cy, len = Math.hypot(nx, ny) || 1;
        cur.nx = nx / len;
        cur.ny = ny / len;
        path.push(cur);
      }
      // thin it out so every point is ~5px apart
      outline = path.filter((p, i) => i % 3 === 0 || p.gap);

      runners = Array.from({ length: 4 }, (_, i) => ({
        at: Math.floor((outline.length / 4) * i),
        speed: 2 + Math.random() * 3,
      }));
    }

    // ── Draw one lightning bolt through a list of points ─────
    function bolt(points, width) {
      if (points.length < 2) return;
      ctx.beginPath();
      points.forEach((p, i) => {
        const j = i === 0 || i === points.length - 1 ? 0 : 1;
        const push = (Math.random() * 10 - 3) * j;
        const x = p.x + PAD + (p.nx || 0) * push + (Math.random() - 0.5) * 6 * j;
        const y = p.y + PAD + (p.ny || 0) * push + (Math.random() - 0.5) * 6 * j;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.shadowColor = glow;
      ctx.shadowBlur = 16;
      ctx.strokeStyle = glow;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = width * 3;
      ctx.stroke();
      ctx.shadowBlur = 6;
      ctx.globalAlpha = 1;
      ctx.strokeStyle = core;
      ctx.lineWidth = width;
      ctx.stroke();
    }

    // A section of the outline, stopping at gaps.
    function segment(start, length) {
      const seg = [];
      for (let k = 0; k < length; k++) {
        const p = outline[(start + k) % outline.length];
        if (k > 0 && p.gap) break;
        if (k % 2 === 0) seg.push(p); // every other point = jagged, not smooth
      }
      return seg;
    }

    // A short fork shooting outwards from the body.
    function fork(p) {
      const len = 18 + Math.random() * 38;
      const pts = [p];
      let x = p.x, y = p.y;
      for (let i = 1; i <= 4; i++) {
        x += (p.nx * len) / 4 + (Math.random() - 0.5) * 14;
        y += (p.ny * len) / 4 + (Math.random() - 0.5) * 14;
        pts.push({ x, y });
      }
      return pts;
    }

    function frame(t) {
      raf = requestAnimationFrame(frame);
      if (t - last < 33) return; // ~30 fps is plenty for lightning
      last = t;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // fade the previous frame instead of wiping it: leaves a short afterglow
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.42)";
      ctx.fillRect(0, 0, w + PAD * 2, h + PAD * 2);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineJoin = "miter";
      ctx.lineCap = "round";

      if (!outline.length) return;
      for (const r of runners) {
        r.at = (r.at + r.speed) % outline.length;
        if (Math.random() < 0.8) bolt(segment(Math.floor(r.at), 14 + Math.floor(Math.random() * 22)), 1.4 + Math.random());
      }
      // occasional burst: a longer arc plus a fork
      if (Math.random() < 0.18) {
        const i = Math.floor(Math.random() * outline.length);
        bolt(segment(i, 40 + Math.floor(Math.random() * 30)), 2);
        bolt(fork(outline[i]), 1.2);
      }
    }

    function start() {
      if (!raf && visible && !document.hidden && !reduced) raf = requestAnimationFrame(frame);
    }
    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    build();
    start();

    new ResizeObserver(() => { build(); }).observe(img);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      visible ? start() : stop();
    }).observe(img);
  };
})();
