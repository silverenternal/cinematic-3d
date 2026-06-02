// src/editor.js
// Profile README editor — form, live preview, GitHub publish.

import './editor.css';
import { renderMarkdown } from './lib/markdown.js';
import { generateREADME } from './lib/readme-gen.js';

const $  = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const TOKEN_KEY = 'mavis.github_token';

// ----- Tech stack options (skill-icons catalog) -----
const TECH_OPTIONS = [
  // languages
  'javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'c--', 'go', 'rust', 'swift', 'kotlin',
  // web
  'html', 'css', 'sass', 'tailwind', 'bootstrap', 'react', 'vue', 'angular', 'svelte', 'nextjs', 'nuxtjs', 'redux', 'vite',
  // 3D / creative
  'threejs', 'opengl', 'blender', 'figma', 'photoshop',
  // backend / infra
  'nodejs', 'express', 'django', 'flask', 'fastapi', 'spring', 'laravel', 'rails',
  // data / AI
  'pytorch', 'tensorflow', 'numpy', 'pandas', 'opencv', 'huggingface', 'jupyter', 'anaconda',
  // mobile
  'android', 'ios', 'flutter', 'react-native', 'dart', 'react',
  // tools
  'git', 'github', 'githubactions', 'gitlab', 'docker', 'kubernetes', 'nginx', 'aws', 'gcp', 'azure', 'linux', 'bash',
  // data
  'mysql', 'postgres', 'sqlite', 'mongodb', 'redis', 'firebase', 'supabase',
  // misc
  'markdown', 'json', 'xml', 'yaml',
];

const DEFAULT_SELECTED = new Set([
  'javascript', 'typescript', 'python', 'java', 'c', 'cpp',
  'html', 'css', 'react', 'vue', 'nextjs', 'vite',
  'threejs', 'nodejs',
  'pytorch', 'tensorflow', 'numpy', 'pandas', 'opencv', 'huggingface',
  'git', 'github', 'docker', 'linux',
  'mysql', 'redis', 'firebase',
]);

// ============================================================
// State
// ============================================================
const state = {
  token: localStorage.getItem(TOKEN_KEY) || '',
  githubUser: 'silverenternal',
  repos: [],
  selectedRepos: new Set(['cinematic-3d']),
  pinDescriptions: {
    'cinematic-3d': 'A cinematic 3D web experience — orbital camera, bloom, film grain, 12-chapter timeline.',
  },
  pinStacks: {
    'cinematic-3d': 'Three.js · WebGL · GLSL',
  },
};

// ============================================================
// Boot
// ============================================================
async function boot() {
  buildTechChips();
  bindForm();
  bindActions();
  bindTabs();
  initToken();
  await loadRepos();
  rebuildPinned();
  render();
}

// ----- Tech chips -----
function buildTechChips() {
  const root = $('#tech-chips');
  root.innerHTML = '';
  for (const t of TECH_OPTIONS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tchip' + (DEFAULT_SELECTED.has(t) ? ' is-on' : '');
    btn.dataset.tech = t;
    btn.textContent = t;
    btn.addEventListener('click', () => {
      btn.classList.toggle('is-on');
      render();
    });
    root.appendChild(btn);
  }
}

function readTech() {
  return $$('#tech-chips .tchip.is-on').map((b) => b.dataset.tech);
}

// ----- Token -----
function initToken() {
  const el = $('#token');
  el.value = state.token;
  el.addEventListener('input', () => {
    state.token = el.value.trim();
    if (state.token) localStorage.setItem(TOKEN_KEY, state.token);
    else localStorage.removeItem(TOKEN_KEY);
  });
  $('#clear-token').addEventListener('click', () => {
    state.token = '';
    el.value = '';
    localStorage.removeItem(TOKEN_KEY);
    setStatus('Token cleared.', 'ok');
  });
}

// ----- Repos -----
async function loadRepos() {
  try {
    const res = await fetch(`https://api.github.com/users/${state.githubUser}/repos?per_page=100&sort=updated`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    state.repos = await res.json();
  } catch (e) {
    console.warn('Failed to load repos', e);
    state.repos = [];
  }
}

function rebuildPinned() {
  const root = $('#pinned-list');
  root.innerHTML = '';
  if (state.repos.length === 0) {
    root.innerHTML = '<div class="hint">Couldn\'t load repos. Pinned section will be empty in preview.</div>';
    return;
  }
  for (const r of state.repos) {
    if (r.archived) continue; // skip archived by default
    const cbId = `pin-${r.id}`;
    const descId = `pindesc-${r.id}`;
    const stackId = `pinstack-${r.id}`;
    const wrap = document.createElement('div');
    wrap.className = 'pin';
    wrap.innerHTML = `
      <label class="pin__row" for="${cbId}">
        <input type="checkbox" id="${cbId}" ${state.selectedRepos.has(r.name) ? 'checked' : ''} data-repo="${r.name}" />
        <span class="pin__main">
          <span class="pin__name">${escapeHTML(r.name)}</span>
          <span class="pin__desc">${escapeHTML(r.description || '—')}</span>
          <span class="pin__meta">
            ${r.language ? `<span class="pin__lang">${escapeHTML(r.language)}</span>` : ''}
            <span class="pin__stat">★ ${r.stargazers_count}</span>
            <span class="pin__stat">⑂ ${r.forks_count}</span>
          </span>
        </span>
      </label>
      <div class="pin__custom" data-show-when="${escapeHTML(r.name)}">
        <label class="field field--inline">
          <span class="field__label">Display description (in Selected work)</span>
          <input type="text" id="${descId}" data-pindesc="${r.name}" value="${escapeHTML(state.pinDescriptions[r.name] || '')}" placeholder="${escapeHTML(r.description || 'A project by silverenternal.')}" />
        </label>
        <label class="field field--inline">
          <span class="field__label">Stack label</span>
          <input type="text" id="${stackId}" data-pinstack="${r.name}" value="${escapeHTML(state.pinStacks[r.name] || '')}" placeholder="e.g. Three.js · WebGL" />
        </label>
      </div>
    `;
    wrap.querySelector(`#${cbId}`).addEventListener('change', (e) => {
      if (e.target.checked) state.selectedRepos.add(r.name);
      else state.selectedRepos.delete(r.name);
      render();
    });
    wrap.querySelector(`#${descId}`).addEventListener('input', (e) => {
      state.pinDescriptions[r.name] = e.target.value;
      render();
    });
    wrap.querySelector(`#${stackId}`).addEventListener('input', (e) => {
      state.pinStacks[r.name] = e.target.value;
      render();
    });
    root.appendChild(wrap);
  }
}

// ----- Form binding -----
function bindForm() {
  const form = $('#form');
  form.addEventListener('input', () => render());
  form.addEventListener('change', () => render());
}

// ----- Tabs -----
function bindTabs() {
  $$('.tab').forEach((t) => {
    t.addEventListener('click', () => {
      $$('.tab').forEach((x) => x.classList.remove('is-active'));
      t.classList.add('is-active');
      const tab = t.dataset.tab;
      $('#preview-rendered').hidden  = (tab !== 'rendered');
      $('#preview-markdown').hidden  = (tab !== 'markdown');
    });
  });
}

// ----- Actions -----
function bindActions() {
  $('#copy-md').addEventListener('click', async () => {
    const md = buildMarkdown();
    try {
      await navigator.clipboard.writeText(md);
      setStatus('Markdown copied to clipboard.', 'ok');
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = md;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      setStatus('Markdown copied.', 'ok');
    }
  });

  $('#save').addEventListener('click', save);
  $('#load-current').addEventListener('click', loadCurrent);
  $('#reset').addEventListener('click', () => {
    if (confirm('Reset form to defaults? Unsaved changes will be lost.')) location.reload();
  });
}

// ----- Build README -----
function readForm() {
  return {
    greeting:    $('#greeting').value.trim() || 'Hi there',
    displayName: $('#displayName').value.trim() || state.githubUser,
    emoji:       $('#emoji').value.trim() || '👋',
    tagline:     $('#tagline').value.trim(),
    visitorLabel:$('#visitorLabel').value.trim() || 'profile views',

    about: {
      working:  $('#a-working').value.trim(),
      learning: $('#a-learning').value.trim(),
      collab:   $('#a-collab').value.trim(),
      ask:      $('#a-ask').value.trim(),
      fun:      $('#a-fun').value.trim(),
    },

    tech: readTech(),

    widgets: {
      stats:     $('#w-stats').checked,
      streak:    $('#w-streak').checked,
      trophies:  $('#w-trophies').checked,
      activity:  $('#w-activity').checked,
      visitor:   $('#w-visitor').checked,
    },

    pinned: Array.from(state.selectedRepos).map((name) => ({
      name,
      description: state.pinDescriptions[name] || '',
      stack: state.pinStacks[name] || '',
    })),

    socials: {
      email:    $('#s-email').value.trim(),
      blog:     $('#s-blog').value.trim(),
      twitter:  $('#s-twitter').value.trim().replace(/^@/, ''),
      linkedin: $('#s-linkedin').value.trim(),
      zhihu:    $('#s-zhihu').value.trim(),
      bilibili: $('#s-bilibili').value.trim(),
    },

    username: state.githubUser,
  };
}

function buildMarkdown() {
  return generateREADME(readForm());
}

// ----- Render preview -----
function render() {
  const md = buildMarkdown();
  $('#preview-markdown').textContent = md;
  $('#md-rendered').innerHTML = renderMarkdown(md);
}

// ----- Save to GitHub -----
async function save() {
  if (!state.token) {
    setStatus('Add a token first (with repo scope on silverenternal/silverenternal).', 'err');
    $('#token').focus();
    return;
  }
  setStatus('Reading current README…', 'info');
  const path = 'README.md';
  const owner = state.githubUser;
  const repo  = state.githubUser;
  const url   = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  let sha;
  try {
    const get = await fetch(url, {
      headers: ghHeaders(),
    });
    if (get.ok) {
      const data = await get.json();
      sha = data.sha;
    } else if (get.status !== 404) {
      throw new Error(`GET ${get.status} ${get.statusText}`);
    }
  } catch (e) {
    setStatus(`Read failed: ${e.message}`, 'err');
    return;
  }

  setStatus('Writing…', 'info');
  const content = btoa(unescape(encodeURIComponent(buildMarkdown())));
  try {
    const put = await fetch(url, {
      method: 'PUT',
      headers: ghHeaders(),
      body: JSON.stringify({
        message: `docs(profile): update README via editor at ${new Date().toISOString()}`,
        content,
        sha,
      }),
    });
    if (!put.ok) {
      const text = await put.text();
      throw new Error(`PUT ${put.status} ${put.statusText} — ${text.slice(0, 200)}`);
    }
    const data = await put.json();
    setStatus(`Saved. ${data.content.html_url}`, 'ok');
  } catch (e) {
    setStatus(`Save failed: ${e.message}`, 'err');
  }
}

async function loadCurrent() {
  if (!state.token) {
    setStatus('Add a token first to load the current README.', 'err');
    $('#token').focus();
    return;
  }
  setStatus('Loading current README…', 'info');
  const url = `https://api.github.com/repos/${state.githubUser}/${state.githubUser}/contents/README.md`;
  try {
    const res = await fetch(url, { headers: ghHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const data = await res.json();
    const md = decodeURIComponent(escape(atob(data.content.replace(/\n/g, ''))));
    $('#preview-markdown').textContent = md;
    $('#md-rendered').innerHTML = renderMarkdown(md);
    setStatus('Loaded current README (form not auto-repopulated — preview only).', 'ok');
  } catch (e) {
    setStatus(`Load failed: ${e.message}`, 'err');
  }
}

function ghHeaders() {
  return {
    'Accept': 'application/vnd.github+json',
    'Authorization': `Bearer ${state.token}`,
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

function setStatus(msg, kind = '') {
  const el = $('#status');
  el.textContent = msg;
  el.className = 'actions__status' + (kind ? ` is-${kind}` : '');
  if (kind === 'ok') setTimeout(() => { if (el.textContent === msg) el.textContent = ''; }, 6000);
}

function escapeHTML(s) {
  return String(s || '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}

boot();
