// src/scene/Postprocessing.js
// Cinematic post-processing chain:
//   1. Bloom (UnrealBloomPass) — the glow
//   2. Custom cinematic shader — chromatic aberration + film grain + vignette + slight contrast lift
// We use EffectComposer from three/examples (vendored by three module).

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

// Custom cinematic shader — chromatic aberration + grain + vignette + tone shaping.
const CinematicShader = {
  uniforms: {
    tDiffuse:    { value: null },
    uTime:       { value: 0 },
    uAberration: { value: 0.0028 },   // chromatic aberration strength
    uGrain:      { value: 0.07 },     // film grain
    uVignette:   { value: 1.15 },     // vignette intensity
    uContrast:   { value: 1.08 },     // contrast lift
    uTint:       { value: new THREE.Color(0xfff1d6) }, // warm highlight tint
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uAberration;
    uniform float uGrain;
    uniform float uVignette;
    uniform float uContrast;
    uniform vec3  uTint;
    varying vec2 vUv;

    // hash-based grain
    float rand(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv;
      vec2 center = vec2(0.5);
      vec2 dir = uv - center;
      float dist = length(dir);

      // ---- chromatic aberration (radial) ----
      vec2 ca = dir * uAberration;
      float r = texture2D(tDiffuse, uv - ca).r;
      float g = texture2D(tDiffuse, uv).g;
      float b = texture2D(tDiffuse, uv + ca).b;
      vec3 col = vec3(r, g, b);

      // ---- contrast + slight tint ----
      col = (col - 0.5) * uContrast + 0.5;
      col = mix(col, col * uTint, 0.12);

      // ---- vignette (soft + film black) ----
      float vig = smoothstep(0.85, 0.25, dist);
      col *= mix(1.0 - 0.65 / uVignette, 1.0, vig);

      // ---- film grain ----
      float n = rand(uv * vec2(1920.0, 1080.0) + uTime * 13.0);
      col += (n - 0.5) * uGrain;

      // ---- soft toe (lift shadows toward warm) ----
      col = pow(col, vec3(0.95, 0.97, 1.02));

      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

export class Postprocessing {
  constructor(renderer, scene, camera) {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.composer = new EffectComposer(renderer);
    this.composer.setSize(w, h);
    this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const renderPass = new RenderPass(scene, camera);
    this.composer.addPass(renderPass);

    const bloom = new UnrealBloomPass(
      new THREE.Vector2(w, h),
      0.85,   // strength
      0.6,    // radius
      0.55,   // threshold (only bright things bloom)
    );
    this.bloom = bloom;
    this.composer.addPass(bloom);

    this.cinematicPass = new ShaderPass(CinematicShader);
    this.composer.addPass(this.cinematicPass);

    const output = new OutputPass();
    this.composer.addPass(output);
  }

  setSize(w, h) {
    this.composer.setSize(w, h);
    this.bloom.setSize(w, h);
  }

  update(time) {
    this.cinematicPass.uniforms.uTime.value = time;
  }

  render() {
    this.composer.render();
  }
}
