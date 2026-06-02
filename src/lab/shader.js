// src/lab/shader.js
// WebGL — full-screen fragment shader, mouse-driven.

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;     // 0..1
uniform float uMouseActive;

#define PI 3.14159265359

// hash
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i),          hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  vec2 m  = uMouse;

  // aspect-corrected uv
  vec2 p = (gl_FragCoord.xy / uRes.xy) * 2.0 - 1.0;
  p.x *= uRes.x / uRes.y;

  // mouse warp
  vec2 d = p - (m * 2.0 - 1.0) * vec2(uRes.x / uRes.y, 1.0);
  float dist = length(d);
  float warp = 1.0 / (1.0 + dist * 4.0) * uMouseActive * 0.5;

  // domain warp via fbm
  vec2 q = uv * 3.0 + uTime * 0.05;
  float n = fbm(q + fbm(q + uTime * 0.1));
  vec2 colUv = uv + (n - 0.5) * 0.4 + d * warp * 0.6;

  // soft circles field
  float field = 0.0;
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    vec2 c = vec2(
      0.5 + 0.35 * sin(uTime * 0.2 + fi * 1.3),
      0.5 + 0.35 * cos(uTime * 0.17 + fi * 0.7)
    );
    float r = 0.18 + 0.05 * sin(uTime * 0.4 + fi);
    float cd = length(colUv - c);
    field += smoothstep(r, r * 0.4, cd) * (0.5 + 0.5 * sin(uTime + fi));
  }
  field = clamp(field, 0.0, 1.4);

  // base gradient
  vec3 ink  = vec3(0.91, 0.84, 0.64);   // #e8d6a3
  vec3 gold = vec3(0.78, 0.60, 0.33);   // #c69a55
  vec3 deep = vec3(0.04, 0.05, 0.07);   // #0a0d12

  vec3 col = mix(deep, gold * 0.6, field * 0.7);
  col = mix(col, ink, smoothstep(0.5, 0.9, field));

  // grain
  float g = hash(gl_FragCoord.xy + uTime) - 0.5;
  col += g * 0.03;

  // vignette
  float v = smoothstep(1.2, 0.3, length(p));
  col *= mix(0.6, 1.0, v);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh));
    throw new Error('shader compile failed');
  }
  return sh;
}

export function bootShader(canvas, w0, h0) {
  const gl = canvas.getContext('webgl', { antialias: true, premultipliedAlpha: false });
  if (!gl) {
    canvas.getContext('2d').fillText('WebGL not available', 20, 30);
    return { stop() {}, resize() {} };
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prog));
    throw new Error('link failed');
  }
  gl.useProgram(prog);

  // full-screen triangle
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,  3, -1,  -1,  3,
  ]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes   = gl.getUniformLocation(prog, 'uRes');
  const uTime  = gl.getUniformLocation(prog, 'uTime');
  const uMouse = gl.getUniformLocation(prog, 'uMouse');
  const uAct   = gl.getUniformLocation(prog, 'uMouseActive');

  let w = w0, h = h0, t0 = performance.now();
  const mouse = { x: 0.5, y: 0.5, act: 0 };

  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - r.left) / r.width;
    mouse.y = 1 - (e.clientY - r.top) / r.height;
    mouse.act = 1;
  });
  canvas.addEventListener('pointerleave', () => { mouse.act = 0; });

  function frame(now) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now - t0) * 0.001);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.uniform1f(uAct, mouse.act);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // ease mouse activity down
    mouse.act *= 0.985;

    raf = requestAnimationFrame(frame);
  }
  let raf = requestAnimationFrame(frame);

  return {
    resize: () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    },
    stop: () => cancelAnimationFrame(raf),
  };
}
