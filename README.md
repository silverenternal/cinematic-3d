# Year of Wonder — Cinematic 3D

An interactive, cinematic 3D web experience built with Three.js. Inspired by
the orbital, film-grade feel of [The Year of Greta](https://theyearofgreta.com/).

![preview](./public/favicon.svg)

## What it does

- 12-chapter timeline. The camera glides along a Catmull–Rom spline that
  visits 12 stops, each reframing the central glowing polyhedron from a
  different angle, with a slightly different FOV.
- Cinematic post-processing chain: ACES tone mapping → UnrealBloom → custom
  shader (radial chromatic aberration + film grain + soft vignette + warm
  highlight tint + soft toe).
- A central glowing icosahedron ("the subject") with a pulsing halo, a
  slow-spinning wireframe ring, ~220 floating debris pieces, ~1500
  background stars, and ~800 close-up dust motes drifting in front of the
  camera for atmospheric volume.
- Idle auto-advance — if you stop touching it, the timeline keeps moving,
  like a screensaver.

## Controls

| Input         | Action              |
| ------------- | ------------------- |
| **Drag**      | Orbit the camera    |
| **Scroll**    | Travel the timeline |
| **← / →**     | Step the timeline   |
| **Click rail tick** | Jump to a chapter |
| **Pinch (touch)**   | Travel the timeline |

## Stack

- [Vite](https://vitejs.dev/) — dev server + bundler
- [Three.js](https://threejs.org/) — WebGL renderer
- Plain ESM, no framework, no router
- Custom GLSL for the post-processing pass

## Run locally

```bash
pnpm install
pnpm dev
```

Then open <http://127.0.0.1:5173>.

## Build for production

```bash
pnpm build
pnpm preview
```

Output goes to `dist/`.

## File map

```
src/
├── main.js                  # boot + animation loop
├── style.css                # HUD + cinematic overlays
├── scene/
│   ├── World.js             # 3D world, lights, camera, spline, interaction
│   └── Postprocessing.js    # Bloom + custom cinematic shader
└── ui/
    └── Overlay.js           # chapter title, lede, rail, frame index
```

## Credits

- Inspired by [The Year of Greta](https://theyearofgreta.com/) by
  [MediaMonks](https://www.mediamonks.com/).
- Background typography: Cormorant Garamond / Inter / JetBrains Mono via
  system fallback.
