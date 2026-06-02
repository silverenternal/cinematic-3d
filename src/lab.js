// src/lab.js
// Three independent WebGL/Canvas experiments. Each one boots into its own
// <canvas> and runs its own RAF loop. They never share state.

import './lab.css';

import { bootParticles } from './lab/particles.js';
import { bootShader }    from './lab/shader.js';
import { bootArray }     from './lab/array.js';

const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

function fitCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  canvas.width  = Math.max(1, Math.floor(rect.width  * dpr()));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr()));
  return { w: rect.width, h: rect.height };
}

const handles = [];

window.addEventListener('load', () => {
  // ----- 1) Particle field (2D Canvas) -----
  const cv1 = document.getElementById('cv-particles');
  if (cv1) {
    const { w, h } = fitCanvas(cv1);
    handles.push(bootParticles(cv1, w, h));
  }

  // ----- 2) Reactive shader (WebGL) -----
  const cv2 = document.getElementById('cv-shader');
  if (cv2) {
    const { w, h } = fitCanvas(cv2);
    handles.push(bootShader(cv2, w, h));
  }

  // ----- 3) 3D array (Three.js) -----
  const cv3 = document.getElementById('cv-array');
  if (cv3) {
    const { w, h } = fitCanvas(cv3);
    handles.push(bootArray(cv3, w, h));
  }
});

window.addEventListener('resize', () => {
  for (const h of handles) {
    if (h.resize) h.resize();
  }
});
