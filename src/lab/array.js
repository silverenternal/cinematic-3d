// src/lab/array.js
// Three.js — 64 geometries arranged in a 4×4×4 cube, mouse-orbit, scroll waves.

import * as THREE from 'three';

const SIZE = 4;        // 4×4×4 = 64
const SPACING = 1.4;

export function bootArray(canvas, w0, h0) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(w0, h0, false);
  renderer.setClearColor(0x0a0d12, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0d12, 0.06);

  const aspect = w0 / h0;
  const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
  camera.position.set(7, 5, 9);
  camera.lookAt(0, 0, 0);

  // Lights
  scene.add(new THREE.AmbientLight(0x222a35, 0.6));
  const key = new THREE.DirectionalLight(0xfff1d6, 1.4);
  key.position.set(4, 6, 5);
  scene.add(key);
  const rim = new THREE.PointLight(0xc69a55, 1.2, 30, 1.5);
  rim.position.set(-3, 2, -3);
  scene.add(rim);

  // 64 instanced boxes
  const count = SIZE * SIZE * SIZE;
  const geo = new THREE.BoxGeometry(0.55, 0.55, 0.55);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x1a2030,
    metalness: 0.7,
    roughness: 0.3,
    flatShading: true,
  });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  // pre-compute base positions
  const base = new Float32Array(count * 3);
  let idx = 0;
  for (let x = 0; x < SIZE; x++) {
    for (let y = 0; y < SIZE; y++) {
      for (let z = 0; z < SIZE; z++) {
        base[idx * 3]     = (x - (SIZE - 1) / 2) * SPACING;
        base[idx * 3 + 1] = (y - (SIZE - 1) / 2) * SPACING;
        base[idx * 3 + 2] = (z - (SIZE - 1) / 2) * SPACING;
        idx++;
      }
    }
  }
  scene.add(mesh);

  // Mouse / drag orbit
  const target = { yaw: 0.6, pitch: 0.3, scroll: 0 };
  const cur    = { yaw: 0.6, pitch: 0.3, scroll: 0 };
  const drag   = { on: false, lx: 0, ly: 0 };

  canvas.style.cursor = 'grab';
  canvas.addEventListener('pointerdown', (e) => {
    drag.on = true; drag.lx = e.clientX; drag.ly = e.clientY;
    canvas.style.cursor = 'grabbing';
  });
  window.addEventListener('pointermove', (e) => {
    if (!drag.on) return;
    target.yaw   -= (e.clientX - drag.lx) * 0.005;
    target.pitch -= (e.clientY - drag.ly) * 0.005;
    target.pitch = Math.max(-1.0, Math.min(1.0, target.pitch));
    drag.lx = e.clientX; drag.ly = e.clientY;
  });
  window.addEventListener('pointerup', () => {
    drag.on = false; canvas.style.cursor = 'grab';
  });
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    target.scroll += e.deltaY * 0.0015;
  }, { passive: false });

  // Animation
  const dummy = new THREE.Object3D();
  const start = performance.now();

  function frame(now) {
    const t = (now - start) * 0.001;

    // smooth orbit
    cur.yaw   += (target.yaw   - cur.yaw)   * 0.08;
    cur.pitch += (target.pitch - cur.pitch) * 0.08;
    cur.scroll += (target.scroll - cur.scroll) * 0.08;

    // apply orbit
    const radius = 11;
    camera.position.x = Math.cos(cur.yaw) * Math.cos(cur.pitch) * radius;
    camera.position.y = Math.sin(cur.pitch) * radius * 0.6 + 1.5;
    camera.position.z = Math.sin(cur.yaw) * Math.cos(cur.pitch) * radius;
    camera.lookAt(0, 0, 0);

    // update instances with a wave pattern
    for (let i = 0; i < count; i++) {
      const x = base[i * 3];
      const y = base[i * 3 + 1];
      const z = base[i * 3 + 2];

      const d = Math.sqrt(x * x + y * y + z * z);
      const wave =
        Math.sin(d * 0.6 - t * 1.2 + cur.scroll * 6) * 0.5 +
        Math.cos(x * 0.5 + t * 0.6) * 0.25;

      const s = 0.7 + 0.5 * (wave + 0.5);
      dummy.position.set(x, y, z);
      dummy.rotation.set(t * 0.4 + i, t * 0.3, t * 0.2);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;

    // pulse the rim light
    rim.intensity = 1.0 + Math.sin(t * 1.4) * 0.5;

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  let raf = requestAnimationFrame(frame);

  return {
    resize: () => {
      const r = canvas.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
    },
    stop: () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
    },
  };
}
