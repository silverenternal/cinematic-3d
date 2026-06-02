// src/lib/readme-gen.js
// Generate a self-contained, design-forward GitHub profile README.
// No third-party widget cards — every badge is a shields.io URL,
// every layout uses Markdown table / HTML for full control.

/**
 * @typedef {Object} FormState
 * @property {string} username
 * @property {string} greeting
 * @property {string} emoji
 * @property {string} tagline
 * @property {string} visitorLabel
 * @property {{working:string, learning:string, collab:string, ask:string, fun:string}} about
 * @property {string[]} tech
 * @property {{stats:boolean, streak:boolean, trophies:boolean, activity:boolean, visitor:boolean}} widgets
 * @property {string[]} pinned
 * @property {{email:string, blog:string, twitter:string, linkedin:string, zhihu:string, bilibili:string}} socials
 */

const SHIELDS = (label, message, color, logo = '') => {
  const base = `https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(message)}-${color}`;
  const params = new URLSearchParams();
  params.set('style', 'for-the-badge');
  if (logo) params.set('logo', logo);
  return `${base}?${params.toString()}`;
};

const SOCIALS = (s) => {
  const list = [];
  if (s.email)    list.push(`<a href="mailto:${s.email}"><img src="${SHIELDS('Email', s.email, 'D14836', 'gmail')}" alt="Email" /></a>`);
  if (s.blog)     list.push(`<a href="${s.blog}"><img src="${SHIELDS('Blog', cleanURL(s.blog), 'FF5722', 'blogger')}" alt="Blog" /></a>`);
  if (s.twitter)  list.push(`<a href="https://twitter.com/${s.twitter}"><img src="${SHIELDS('Twitter', '@' + s.twitter, '1DA1F2', 'twitter')}" alt="Twitter" /></a>`);
  if (s.linkedin) list.push(`<a href="https://linkedin.com/in/${s.linkedin}"><img src="${SHIELDS('LinkedIn', s.linkedin, '0A66C2', 'linkedin')}" alt="LinkedIn" /></a>`);
  if (s.zhihu)    list.push(`<a href="https://www.zhihu.com/people/${s.zhihu}"><img src="${SHIELDS('Zhihu', s.zhihu, '0084FF', 'zhihu')}" alt="Zhihu" /></a>`);
  if (s.bilibili) list.push(`<a href="https://space.bilibili.com/${s.bilibili}"><img src="${SHIELDS('Bilibili', s.bilibili, '00A1D6', 'bilibili')}" alt="Bilibili" /></a>`);
  return list;
};

// Tech icons → shields.io logo + color.
// Falls back to a name-only badge for unknown tech.
const TECH_BADGES = {
  // languages
  javascript:  { logo: 'javascript',           color: 'F7DF1E', text: 'black' },
  typescript:  { logo: 'typescript',           color: '3178C6', text: 'white' },
  python:      { logo: 'python',               color: '3776AB', text: 'white' },
  java:        { logo: 'openjdk',              color: 'ED8B00', text: 'white' },
  c:           { logo: 'c',                    color: 'A8B9CC', text: 'black' },
  cpp:         { logo: 'c%2B%2B',              color: '00599C', text: 'white' },
  'c--':       { logo: 'c%23',                 color: '239120', text: 'white' },
  go:          { logo: 'go',                   color: '00ADD8', text: 'white' },
  rust:        { logo: 'rust',                 color: '000000', text: 'white' },
  swift:       { logo: 'swift',                color: 'F05138', text: 'white' },
  kotlin:      { logo: 'kotlin',               color: '7F52FF', text: 'white' },

  // web
  html:        { logo: 'html5',                color: 'E34F26', text: 'white' },
  css:         { logo: 'css3',                 color: '1572B6', text: 'white' },
  sass:        { logo: 'sass',                 color: 'CC6699', text: 'white' },
  tailwind:    { logo: 'tailwindcss',          color: '06B6D4', text: 'white' },
  bootstrap:   { logo: 'bootstrap',            color: '7952B3', text: 'white' },
  react:       { logo: 'react',                color: '20232A', text: '61DAFB' },
  vue:         { logo: 'vuedotjs',             color: '35495E', text: '41B883' },
  angular:     { logo: 'angular',              color: 'DD0031', text: 'white' },
  svelte:      { logo: 'svelte',               color: 'FF3E00', text: 'white' },
  nextjs:      { logo: 'nextdotjs',            color: '000000', text: 'white' },
  nuxtjs:      { logo: 'nuxtdotjs',            color: '002E3B', text: '00DC82' },
  redux:       { logo: 'redux',                color: '764ABC', text: 'white' },
  vite:        { logo: 'vite',                 color: '646CFF', text: 'white' },

  // creative
  threejs:     { logo: 'threedotjs',           color: '000000', text: 'white' },
  opengl:      { logo: 'opengl',               color: '5586A4', text: 'white' },
  blender:     { logo: 'blender',              color: 'F5792A', text: 'white' },
  figma:       { logo: 'figma',                color: 'F24E1E', text: 'white' },
  photoshop:   { logo: 'adobephotoshop',       color: '31A8FF', text: 'white' },

  // backend
  nodejs:      { logo: 'nodedotjs',            color: '5FA04E', text: 'white' },
  express:     { logo: 'express',              color: '000000', text: 'white' },
  django:      { logo: 'django',               color: '092E20', text: 'white' },
  flask:       { logo: 'flask',                color: '000000', text: 'white' },
  fastapi:     { logo: 'fastapi',              color: '009688', text: 'white' },
  spring:      { logo: 'spring',               color: '6DB33F', text: 'white' },
  laravel:     { logo: 'laravel',              color: 'FF2D20', text: 'white' },
  rails:       { logo: 'rubyonrails',          color: 'CC0000', text: 'white' },

  // AI / data
  pytorch:     { logo: 'pytorch',              color: 'EE4C2C', text: 'white' },
  tensorflow:  { logo: 'tensorflow',           color: 'FF6F00', text: 'white' },
  numpy:       { logo: 'numpy',                color: '013243', text: 'white' },
  pandas:      { logo: 'pandas',               color: '150458', text: 'white' },
  opencv:      { logo: 'opencv',               color: '5C3EE8', text: 'white' },
  huggingface: { logo: 'huggingface',          color: 'FFD21E', text: 'black' },
  jupyter:     { logo: 'jupyter',              color: 'F37626', text: 'white' },
  anaconda:    { logo: 'anaconda',             color: '44A833', text: 'white' },

  // mobile
  android:     { logo: 'android',              color: '3DDC84', text: 'white' },
  ios:         { logo: 'apple',                color: '000000', text: 'white' },
  flutter:     { logo: 'flutter',              color: '02569B', text: 'white' },
  'react-native': { logo: 'react',             color: '20232A', text: '61DAFB' },
  dart:        { logo: 'dart',                 color: '0175C2', text: 'white' },

  // tools
  git:         { logo: 'git',                  color: 'F05032', text: 'white' },
  github:      { logo: 'github',               color: '181717', text: 'white' },
  githubactions: { logo: 'githubactions',      color: '2088FF', text: 'white' },
  gitlab:      { logo: 'gitlab',               color: '330F63', text: 'white' },
  docker:      { logo: 'docker',               color: '2496ED', text: 'white' },
  kubernetes:  { logo: 'kubernetes',           color: '326CE5', text: 'white' },
  nginx:       { logo: 'nginx',                color: '009639', text: 'white' },
  aws:         { logo: 'amazonwebservices',    color: '232F3E', text: 'white' },
  gcp:         { logo: 'googlecloud',          color: '4285F4', text: 'white' },
  azure:       { logo: 'microsoftazure',       color: '0078D4', text: 'white' },
  linux:       { logo: 'linux',                color: 'FCC624', text: 'black' },
  bash:        { logo: 'gnubash',              color: '4EAA25', text: 'white' },

  // data
  mysql:       { logo: 'mysql',                color: '4479A1', text: 'white' },
  postgres:    { logo: 'postgresql',           color: '336791', text: 'white' },
  sqlite:      { logo: 'sqlite',               color: '07405E', text: 'white' },
  mongodb:     { logo: 'mongodb',              color: '47A248', text: 'white' },
  redis:       { logo: 'redis',                color: 'DC382D', text: 'white' },
  firebase:    { logo: 'firebase',             color: 'FFCA28', text: 'black' },
  supabase:    { logo: 'supabase',             color: '3ECF8E', text: 'black' },

  // misc
  markdown:    { logo: 'markdown',             color: '000000', text: 'white' },
  json:        { logo: 'json',                 color: '000000', text: 'white' },
  xml:         { logo: '',                     color: '0060AC', text: 'white' },
  yaml:        { logo: '',                     color: 'CB171E', text: 'white' },
};

function techBadge(name) {
  const m = TECH_BADGES[name];
  const display = prettyName(name);
  if (!m) return `![${display}](https://img.shields.io/badge/${encodeURIComponent(display)}-000000?style=for-the-badge)`;
  return `<img src="${SHIELDS(display, '', m.color, m.logo)}" alt="${display}" />`;
}

function prettyName(slug) {
  // 'threejs' → 'Threejs', 'c' → 'C', 'cpp' → 'C++', 'nextjs' → 'Nextjs'
  const custom = {
    'c': 'C',
    'cpp': 'C++',
    'c--': 'C#',
    'threejs': 'Three.js',
    'nextjs': 'Next.js',
    'nuxtjs': 'Nuxt.js',
    'react-native': 'React Native',
    'githubactions': 'GitHub Actions',
    'huggingface': 'Hugging Face',
    'opencv': 'OpenCV',
    'vue': 'Vue.js',
    'scss': 'SCSS',
    'tailwind': 'Tailwind',
    'tailwindcss': 'Tailwind CSS',
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'python': 'Python',
    'java': 'Java',
    'html': 'HTML',
    'css': 'CSS',
    'sql': 'SQL',
    'graphql': 'GraphQL',
    'mysql': 'MySQL',
    'postgres': 'PostgreSQL',
    'postgresql': 'PostgreSQL',
    'mongodb': 'MongoDB',
    'redis': 'Redis',
    'sqlite': 'SQLite',
    'nginx': 'Nginx',
    'nodejs': 'Node.js',
    'react': 'React',
    'vite': 'Vite',
    'docker': 'Docker',
    'kubernetes': 'Kubernetes',
    'git': 'Git',
    'github': 'GitHub',
    'gitlab': 'GitLab',
    'linux': 'Linux',
    'bash': 'Bash',
    'aws': 'AWS',
    'gcp': 'GCP',
    'azure': 'Azure',
    'markdown': 'Markdown',
    'json': 'JSON',
    'xml': 'XML',
    'yaml': 'YAML',
    'pytorch': 'PyTorch',
    'tensorflow': 'TensorFlow',
    'numpy': 'NumPy',
    'pandas': 'pandas',
    'opengl': 'OpenGL',
    'blender': 'Blender',
    'figma': 'Figma',
    'photoshop': 'Photoshop',
    'android': 'Android',
    'ios': 'iOS',
    'flutter': 'Flutter',
    'dart': 'Dart',
    'swift': 'Swift',
    'kotlin': 'Kotlin',
    'rust': 'Rust',
    'go': 'Go',
    'angular': 'Angular',
    'svelte': 'Svelte',
    'redux': 'Redux',
    'laravel': 'Laravel',
    'rails': 'Rails',
    'django': 'Django',
    'flask': 'Flask',
    'fastapi': 'FastAPI',
    'spring': 'Spring',
    'express': 'Express',
    'bootstrap': 'Bootstrap',
    'sass': 'Sass',
    'firebase': 'Firebase',
    'supabase': 'Supabase',
    'anaconda': 'Anaconda',
    'jupyter': 'Jupyter',
  };
  if (custom[slug]) return custom[slug];
  // generic Title-Case
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function cleanURL(u) {
  return String(u).replace(/^https?:\/\//, '').replace(/\/$/, '');
}

function escape(s) {
  return String(s).replace(/[<>]/g, (c) => ({ '<': '&lt;', '>': '&gt;' })[c]);
}

export function generateREADME(s) {
  const gh = s.username;
  const lines = [];

  // =========================================================
  //  Hero
  // =========================================================
  lines.push(`<div align="center">`);
  lines.push(``);
  lines.push(`# ${s.greeting}, I'm ${s.displayName || s.username}${s.emoji ? ' ' + s.emoji : ''}`);
  lines.push(``);
  if (s.tagline) {
    lines.push(`### ${escape(s.tagline)}`);
    lines.push(``);
  }
  // Visitor badge — early, quiet
  if (s.widgets.visitor) {
    const label = encodeURIComponent(s.visitorLabel);
    lines.push(`<img src="https://komarev.com/ghpvc/?username=${gh}&label=${label}&color=0e75b6&style=flat" alt="profile views" />`);
    lines.push(``);
  }
  // Social row
  const socialImgs = SOCIALS(s.socials);
  if (socialImgs.length) {
    lines.push(socialImgs.join('\n'));
    lines.push(``);
  }
  lines.push(`</div>`);
  lines.push(``);

  // =========================================================
  //  About me — visual block
  // =========================================================
  lines.push(`---`);
  lines.push(``);
  lines.push(`## 👤 About me`);
  lines.push(``);
  const aboutBullets = [];
  if (s.about.working)  aboutBullets.push(`- 🔭 I'm currently working on **${escape(s.about.working)}**`);
  if (s.about.learning) aboutBullets.push(`- 🌱 I'm currently learning **${escape(s.about.learning)}**`);
  if (s.about.collab)   aboutBullets.push(`- 👯 I'm looking to collaborate on **${escape(s.about.collab)}**`);
  if (s.about.ask)      aboutBullets.push(`- 💬 Ask me about **${escape(s.about.ask)}**`);
  if (s.about.fun)      aboutBullets.push(`- ⚡ Fun fact: ${escape(s.about.fun)}`);
  if (aboutBullets.length) {
    lines.push(...aboutBullets);
    lines.push(``);
  }

  // =========================================================
  //  Tech stack — categorized, design-forward
  // =========================================================
  if (s.tech.length) {
    lines.push(`---`);
    lines.push(``);
    lines.push(`## 🛠 Languages & tools`);
    lines.push(``);
    lines.push(`<p align="left">`);
    for (const t of s.tech) lines.push(`  ${techBadge(t)}`);
    lines.push(`</p>`);
    lines.push(``);
  }

  // =========================================================
  //  GitHub activity (optional, single tidy card)
  // =========================================================
  if (s.widgets.stats || s.widgets.streak) {
    lines.push(`---`);
    lines.push(``);
    lines.push(`## 📊 GitHub activity`);
    lines.push(``);
    lines.push(`<div align="center">`);
    lines.push(``);
    if (s.widgets.stats) {
      lines.push(`<img height="180em" src="https://github-readme-stats.vercel.app/api?username=${gh}&show_icons=true&hide_border=true&count_private=true&include_all_commits=true&theme=tokyonight" alt="GitHub stats" />`);
    }
    if (s.widgets.streak) {
      lines.push(`<img height="180em" src="https://streak-stats.demolab.com?user=${gh}&theme=tokyonight&hide_border=true" alt="Streak stats" />`);
    }
    lines.push(``);
    lines.push(`</div>`);
    lines.push(``);
  }

  // =========================================================
  //  Selected work — hand-rolled table (no ugly third-party cards)
  // =========================================================
  if (s.pinned.length) {
    lines.push(`---`);
    lines.push(``);
    lines.push(`## 📌 Selected work`);
    lines.push(``);
    lines.push(`| | Project | What it is |`);
    lines.push(`| --- | --- | --- |`);
    for (const item of s.pinned) {
      const name = typeof item === 'string' ? item : item.name;
      const desc = (typeof item === 'object' && item.description) ? item.description : 'A project by silverenternal.';
      const stack = (typeof item === 'object' && item.stack) ? ` \`${item.stack}\`` : '';
      lines.push(`| 🎬 | **[${escape(name)}](https://github.com/${gh}/${escape(name)})** | ${escape(desc)}${stack} |`);
    }
    lines.push(``);
    lines.push(`<sub>→ <a href="https://github.com/${gh}?tab=repositories">view all repositories</a></sub>`);
    lines.push(``);
  }

  // =========================================================
  //  Footer
  // =========================================================
  lines.push(`---`);
  lines.push(``);
  lines.push(`<div align="center">`);
  lines.push(``);
  lines.push(`<sub>✏️ This README is composed via the <a href="https://silverenternal.github.io/cinematic-3d/editor.html">Year of Wonder Profile Editor</a></sub>`);
  lines.push(``);
  lines.push(`</div>`);
  lines.push(``);

  return lines.join('\n');
}
