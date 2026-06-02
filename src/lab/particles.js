// src/lab/particles.js
// 2D Canvas — 2,000 particles pulled toward the cursor with a spring force.
// Click anywhere to add a temporary repulsion impulse.

const TAU = Math.PI * 2;

export function bootParticles(canvas, w0, h0) {
  const ctx = canvas.getContext('2d');
  const N   = 2000;
  const DPR = () => Math.min(window.devicePixelRatio || 1, 2);

  const mouse = { x: w0 / 2, y: h0 / 2, down: false };
  let w = w0, h = h0;

  // Initialize particles
  const p = new Float32Array(N * 4); // x, y, vx, vy
  for (let i = 0; i < N; i++) {
    p[i * 4]     = Math.random() * w;
    p[i * 4 + 1] = Math.random() * h;
    p[i * 4 + 2] = (Math.random() - 0.5) * 0.4;
    p[i * 4 + 3] = (Math.random() - 0.5) * 0.4;
  }

  canvas.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('pointerdown', () => { mouse.down = true;  });
  canvas.addEventListener('pointerup',   () => { mouse.down = false; });
  canvas.addEventListener('pointerleave',() => { mouse.down = false; });

  function frame(t) {
    const dpr = DPR();
    ctx.save();
    ctx.scale(dpr, dpr);
    // Trail fade
    ctx.fillStyle = 'rgba(10, 13, 18, 0.18)';
    ctx.fillRect(0, 0, w, h);

    const SPRING = 0.012;
    const DAMP   = 0.92;
    const REPEL  = 6.5;
    const RADIUS = 220;
    const RADIUS_SQ = RADIUS * RADIUS;

    for (let i = 0; i < N; i++) {
      const ix = i * 4;
      let x = p[ix], y = p[ix + 1];
      let vx = p[ix + 2], vy = p[ix + 3];

      const dx = mouse.x - x;
      const dy = mouse.y - y;
      const dsq = dx * dx + dy * dy;

      if (dsq < RADIUS_SQ) {
        const d = Math.sqrt(dsq) || 0.0001;
        const f = (1 - d / RADIUS) * SPRING;
        vx += (dx / d) * f;
        vy += (dy / d) * f;
        if (mouse.down) {
          vx -= (dx / d) * REPEL;
          vy -= (dy / d) * REPEL;
        }
      }

      vx *= DAMP;
      vy *= DAMP;
      x += vx;
      y += vy;

      // wrap around
      if (x < 0)  x += w;
      if (x > w)  x -= w;
      if (y < 0)  y += h;
      if (y > h)  y -= h;

      p[ix]     = x;
      p[ix + 1] = y;
      p[ix + 2] = vx;
      p[ix + 3] = vy;

      // hue depends on distance to mouse
      const hueT = Math.min(1, Math.sqrt(dsq) / RADIUS);
      const hue = 30 + hueT * 18; // warm gold to peach
      const sat = 70 - hueT * 30;
      const lum = 55 + (1 - hueT) * 18;
      const alpha = 0.85;
      const size = 1.4 + (1 - hueT) * 1.2;

      ctx.fillStyle = `hsla(${hue}, ${sat}%, ${lum}%, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, TAU);
      ctx.fill();
    }

    // soft cursor halo
    if (!mouse._hidden) {
      const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 90);
      g.addColorStop(0, 'rgba(198, 154, 85, 0.18)');
      g.addColorStop(1, 'rgba(198, 154, 85, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 90, 0, TAU);
      ctx.fill();
    }

    ctx.restore();
    raf = requestAnimationFrame(frame);
  }

  let raf = requestAnimationFrame(frame);

  return {
    resize: () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width  = Math.floor(w * DPR());
      canvas.height = Math.floor(h * DPR());
    },
    stop: () => cancelAnimationFrame(raf),
  };
}
