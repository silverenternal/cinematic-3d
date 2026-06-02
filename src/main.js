// src/main.js
// Entry point. Boot the world, post-processing, and overlay, then run.

import './style.css';
import { World } from './scene/World.js';
import { Postprocessing } from './scene/Postprocessing.js';
import { Overlay } from './ui/Overlay.js';

const canvas = document.getElementById('stage');
if (!canvas) {
  throw new Error('Stage canvas not found');
}

const world = new World(canvas);
const post  = new Postprocessing(world.renderer, world.scene, world.camera);
const overlay = new Overlay();

// show first chapter immediately
requestAnimationFrame(() => overlay.update(0));
overlay.onJumpToChapter((p) => world.setProgress(p));

// resize
window.addEventListener('resize', () => {
  world.resize();
  post.setSize(window.innerWidth, window.innerHeight);
});

// auto-advance slowly when idle, like a screensaver
let lastInteraction = performance.now();
const markInteraction = () => { lastInteraction = performance.now(); };
['pointerdown', 'pointermove', 'wheel', 'keydown', 'touchstart', 'touchmove']
  .forEach((ev) => window.addEventListener(ev, markInteraction, { passive: true }));

// animation loop
function tick() {
  const now = performance.now();
  // idle auto-advance: nudge progress slightly every frame
  if (now - lastInteraction > 6000) {
    world.targetProgress = Math.min(1, world.targetProgress + 0.0008);
  }

  world.update();
  post.update(world.elapsed);
  post.render();
  overlay.update(world.progress);

  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

// expose for debugging
window.__cinematic = { world, post, overlay };
