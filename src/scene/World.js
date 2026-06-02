// src/scene/World.js
// The 3D world — orbiting camera, central glowing polyhedron,
// floating debris, particles, fog, and a 12-stop timeline spline.

import * as THREE from 'three';

const PI2 = Math.PI * 2;

export class World {
  constructor(canvas) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();
    this.elapsed = 0;

    this._initRenderer();
    this._initScene();
    this._initCamera();
    this._initLights();
    this._initWorldObjects();
    this._initSpline();
    this._initInteraction();
  }

  // --------------------------------------------------------------
  // Renderer
  // --------------------------------------------------------------
  _initRenderer() {
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setClearColor(0x0a0d12, 1);
    this.renderer = renderer;
  }

  // --------------------------------------------------------------
  // Scene & atmosphere
  // --------------------------------------------------------------
  _initScene() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0d12, 0.022);
    scene.background = new THREE.Color(0x0a0d12);
    this.scene = scene;
  }

  // --------------------------------------------------------------
  // Camera
  // --------------------------------------------------------------
  _initCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 200);
    camera.position.set(0, 1.2, 12);
    camera.lookAt(0, 0, 0);
    this.camera = camera;
  }

  // --------------------------------------------------------------
  // Lights — key + rim + cool fill, like a real film set
  // --------------------------------------------------------------
  _initLights() {
    const ambient = new THREE.AmbientLight(0x223344, 0.35);
    this.scene.add(ambient);

    const key = new THREE.DirectionalLight(0xfff1d6, 1.6);
    key.position.set(4, 6, 5);
    this.scene.add(key);

    const rim = new THREE.DirectionalLight(0x6fa0c8, 1.1);
    rim.position.set(-5, 2, -4);
    this.scene.add(rim);

    const fill = new THREE.PointLight(0xc69a55, 1.4, 30, 1.6);
    fill.position.set(0, 0, 0);
    this.scene.add(fill);

    this.fillLight = fill;
  }

  // --------------------------------------------------------------
  // World objects
  // --------------------------------------------------------------
  _initWorldObjects() {
    // ---- central glowing polyhedron (the "subject") ----
    const subjectGeo = new THREE.IcosahedronGeometry(1.05, 1);
    const subjectMat = new THREE.MeshStandardMaterial({
      color: 0x0a0d12,
      metalness: 0.95,
      roughness: 0.18,
      emissive: 0xc69a55,
      emissiveIntensity: 0.45,
      flatShading: true,
    });
    const subject = new THREE.Mesh(subjectGeo, subjectMat);
    this.scene.add(subject);
    this.subject = subject;

    // ---- inner glow halo (additive sprite-like mesh) ----
    const haloGeo = new THREE.SphereGeometry(1.55, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xe8d6a3,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    this.scene.add(halo);
    this.halo = halo;

    // ---- orbiting wireframe ring ----
    const ringGeo = new THREE.TorusGeometry(2.4, 0.012, 16, 200);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xe8d6a3,
      transparent: true,
      opacity: 0.35,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.2;
    this.scene.add(ring);
    this.ring = ring;

    // ---- floating debris (instanced for perf) ----
    const debrisGroup = new THREE.Group();
    this.scene.add(debrisGroup);
    this.debrisGroup = debrisGroup;

    const debrisCount = 220;
    const dummy = new THREE.Object3D();
    const debrisData = [];

    const debrisGeos = [
      new THREE.TetrahedronGeometry(0.07, 0),
      new THREE.OctahedronGeometry(0.06, 0),
      new THREE.BoxGeometry(0.08, 0.08, 0.08),
    ];
    const debrisMat = new THREE.MeshStandardMaterial({
      color: 0x4a5a6a,
      metalness: 0.6,
      roughness: 0.4,
      flatShading: true,
    });

    for (let i = 0; i < debrisCount; i++) {
      const geo = debrisGeos[i % debrisGeos.length];
      const mesh = new THREE.Mesh(geo, debrisMat);
      const theta = Math.random() * PI2;
      const radius = 4 + Math.random() * 22;
      const y = (Math.random() - 0.5) * 14;
      mesh.position.set(Math.cos(theta) * radius, y, Math.sin(theta) * radius);
      mesh.rotation.set(Math.random() * PI2, Math.random() * PI2, Math.random() * PI2);
      const scale = 0.5 + Math.random() * 1.2;
      mesh.scale.setScalar(scale);
      mesh.userData = {
        spin: new THREE.Vector3(
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4,
        ),
        bob: 0.4 + Math.random() * 0.8,
        phase: Math.random() * PI2,
        baseY: y,
      };
      debrisGroup.add(mesh);
      debrisData.push(mesh);
    }
    this.debris = debrisData;

    // ---- starfield ----
    const starCount = 1500;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 60 + Math.random() * 40;
      const t = Math.random() * PI2;
      const p = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3]     = r * Math.sin(p) * Math.cos(t);
      starPositions[i * 3 + 1] = r * Math.cos(p);
      starPositions[i * 3 + 2] = r * Math.sin(p) * Math.sin(t);
      const tone = 0.5 + Math.random() * 0.5;
      starColors[i * 3]     = tone * 0.9;
      starColors[i * 3 + 1] = tone * 0.85;
      starColors[i * 3 + 2] = tone * 0.7;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color',    new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    this.scene.add(stars);
    this.stars = stars;

    // ---- volumetric-ish dust (closer to camera) ----
    const dustCount = 800;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3]     = (Math.random() - 0.5) * 40;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xe8d6a3,
      size: 0.04,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    this.scene.add(dust);
    this.dust = dust;
  }

  // --------------------------------------------------------------
  // 12-stop camera spline
  // --------------------------------------------------------------
  _initSpline() {
    // Each stop: position (3) + lookAt (3) + fov adjustment
    const stops = [
      { p: [ 0.0,  1.2, 12.0], l: [0, 0, 0],  fov: 38 }, // 01 Awakening
      { p: [ 3.5,  2.0,  9.0], l: [0, 0, 0],  fov: 42 }, // 02 Drift
      { p: [ 6.0,  0.5,  4.0], l: [0, 0, 0],  fov: 50 }, // 03 Approach
      { p: [ 4.0, -0.8, -2.0], l: [0, 0, 0],  fov: 55 }, // 04 Undertow
      { p: [ 0.0, -1.5, -6.0], l: [0, 0, 0],  fov: 48 }, // 05 Descent
      { p: [-3.0, -0.5, -4.0], l: [0, 0, 0],  fov: 52 }, // 06 Turn
      { p: [-5.0,  0.4,  0.0], l: [0, 0, 0],  fov: 45 }, // 07 Cross
      { p: [-3.5,  1.5,  4.0], l: [0, 0, 0],  fov: 42 }, // 08 Ascent
      { p: [ 0.0,  2.5,  5.0], l: [0, 0, 0],  fov: 38 }, // 09 Bloom
      { p: [ 2.5,  1.5,  2.0], l: [0, 0, 0],  fov: 44 }, // 10 Hush
      { p: [ 1.0,  0.3, -1.0], l: [0, 0, 0],  fov: 50 }, // 11 Echo
      { p: [ 0.0,  1.2,  6.0], l: [0, 0, 0],  fov: 36 }, // 12 Return
    ];

    const posCurve = new THREE.CatmullRomCurve3(
      stops.map((s) => new THREE.Vector3(...s.p)),
      false,
      'catmullrom',
      0.5,
    );
    const lookCurve = new THREE.CatmullRomCurve3(
      stops.map((s) => new THREE.Vector3(...s.l)),
      false,
      'catmullrom',
      0.5,
    );

    this.stops = stops;
    this.posCurve = posCurve;
    this.lookCurve = lookCurve;
  }

  // --------------------------------------------------------------
  // Pointer / wheel interaction
  // --------------------------------------------------------------
  _initInteraction() {
    // timeline progress 0..1
    this.progress = 0;        // current
    this.targetProgress = 0;  // target
    this.dragging = false;
    this.lastX = 0;
    this.lastY = 0;
    this.orbitYaw = 0;        // user-controlled offset (yaw)
    this.orbitPitch = 0;      // user-controlled offset (pitch)
    this.targetYaw = 0;
    this.targetPitch = 0;

    const onPointerDown = (e) => {
      this.dragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      document.body.classList.add('dragging');
    };
    const onPointerMove = (e) => {
      if (!this.dragging) return;
      const dx = e.clientX - this.lastX;
      const dy = e.clientY - this.lastY;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      this.targetYaw   -= dx * 0.004;
      this.targetPitch -= dy * 0.003;
      this.targetPitch = Math.max(-0.6, Math.min(0.6, this.targetPitch));
    };
    const onPointerUp = () => {
      this.dragging = false;
      document.body.classList.remove('dragging');
    };

    this.canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    const onWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY;
      this.targetProgress = Math.max(
        0,
        Math.min(1, this.targetProgress + delta * 0.00045),
      );
    };
    this.canvas.addEventListener('wheel', onWheel, { passive: false });

    // touch (treat as drag for orbit; 2-finger pinch = progress)
    let pinchStart = null;
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) onPointerDown(e.touches[0]);
      else if (e.touches.length === 2) {
        pinchStart = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
      }
    }, { passive: true });
    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) onPointerMove(e.touches[0]);
      else if (e.touches.length === 2 && pinchStart != null) {
        const d = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        const delta = pinchStart - d;
        pinchStart = d;
        this.targetProgress = Math.max(
          0,
          Math.min(1, this.targetProgress + delta * 0.0008),
        );
      }
    }, { passive: true });
    this.canvas.addEventListener('touchend', (e) => {
      if (e.touches.length === 0) {
        onPointerUp();
        pinchStart = null;
      }
    });

    // keyboard
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.targetProgress = Math.min(1, this.targetProgress + 0.05);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.targetProgress = Math.max(0, this.targetProgress - 0.05);
      }
    });
  }

  setProgress(p) {
    this.targetProgress = Math.max(0, Math.min(1, p));
  }

  getChapter() {
    // 12 chapters, 0..1 progress → 0..11
    const idx = Math.min(11, Math.floor(this.progress * 11.999));
    return idx;
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  // --------------------------------------------------------------
  // Update loop
  // --------------------------------------------------------------
  update() {
    const dt = this.clock.getDelta();
    this.elapsed += dt;

    // smooth progress & orbit
    this.progress    += (this.targetProgress - this.progress) * Math.min(1, dt * 4);
    this.orbitYaw    += (this.targetYaw     - this.orbitYaw)     * Math.min(1, dt * 6);
    this.orbitPitch  += (this.targetPitch   - this.orbitPitch)   * Math.min(1, dt * 6);

    // sample camera path
    const t = this.progress;
    const camPos = this.posCurve.getPoint(t).clone();
    const lookAt = this.lookCurve.getPoint(t).clone();

    // apply user orbit on top of base path
    camPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.orbitYaw);
    camPos.y += this.orbitPitch * 2;
    this.camera.position.copy(camPos);
    this.camera.lookAt(lookAt);

    // fov breathing — interpolate between nearest stops
    const seg = t * (this.stops.length - 1);
    const i = Math.floor(seg);
    const f = seg - i;
    const a = this.stops[Math.min(i,     this.stops.length - 1)].fov;
    const b = this.stops[Math.min(i + 1, this.stops.length - 1)].fov;
    const targetFov = a + (b - a) * f;
    this.camera.fov += (targetFov - this.camera.fov) * Math.min(1, dt * 3);
    this.camera.updateProjectionMatrix();

    // animate subject — slow spin + pulse
    this.subject.rotation.y += dt * 0.25;
    this.subject.rotation.x += dt * 0.1;
    const pulse = 0.95 + Math.sin(this.elapsed * 1.3) * 0.05;
    this.subject.scale.setScalar(pulse);
    this.subject.material.emissiveIntensity = 0.4 + Math.sin(this.elapsed * 0.9) * 0.15;

    // halo follows
    this.halo.scale.setScalar(1.0 + Math.sin(this.elapsed * 0.8) * 0.05);
    this.halo.material.opacity = 0.05 + Math.sin(this.elapsed * 0.6) * 0.02;

    // ring
    this.ring.rotation.z += dt * 0.15;
    this.ring.rotation.y += dt * 0.05;

    // fill light follows progress (changes mood)
    this.fillLight.color.setHSL(0.08, 0.6, 0.5);
    this.fillLight.intensity = 1.0 + Math.sin(this.elapsed * 0.7) * 0.4;

    // stars slow drift
    this.stars.rotation.y += dt * 0.005;

    // dust drift
    this.dust.rotation.y += dt * 0.02;
    this.dust.position.y = Math.sin(this.elapsed * 0.3) * 0.4;

    // debris — spin + bob
    for (const d of this.debris) {
      d.rotation.x += d.userData.spin.x * dt;
      d.rotation.y += d.userData.spin.y * dt;
      d.rotation.z += d.userData.spin.z * dt;
      d.position.y = d.userData.baseY + Math.sin(this.elapsed * d.userData.bob + d.userData.phase) * 0.4;
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
