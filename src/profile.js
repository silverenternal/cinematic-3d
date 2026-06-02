// src/profile.js
// GitHub profile landing — fetches user + repos from the public API,
// renders cinematic cards, supports language filtering.

import './profile.css';

const USER = 'silverenternal';
const GH_API = 'https://api.github.com';

const $ = (sel) => document.querySelector(sel);

const el = (tag, attrs = {}, children = []) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'html') node.innerHTML = v;
    else node.setAttribute(k, v);
  }
  for (const c of children) node.appendChild(c);
  return node;
};

const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python:     '#3572A5',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  Java:       '#b07219',
  'C++':      '#f34b7d',
  C:          '#555555',
  Go:         '#00ADD8',
  Rust:       '#dea584',
  Shell:      '#89e051',
  Jupyter:    '#DA5B0B',
  Vue:        '#41b883',
  SCSS:       '#c6538c',
  MDX:        '#fcb32c',
  Swift:      '#F05138',
  Kotlin:     '#A97BFF',
};

const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatNumber = (n) => {
  if (n == null) return '0';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
};

// ----------------------------------------------------------------
// Boot
// ----------------------------------------------------------------
async function boot() {
  try {
    const [user, repos] = await Promise.all([
      fetchJSON(`${GH_API}/users/${USER}`),
      fetchJSON(`${GH_API}/users/${USER}/repos?per_page=100&sort=updated`),
    ]);

    renderHero(user);
    renderRepos(repos);
    bindFilter(repos);
  } catch (err) {
    console.error('Profile load failed', err);
    $('#repos-grid').innerHTML =
      `<div class="repos__error">Couldn't load GitHub data. ${escapeHTML(err.message)}</div>`;
  }
}

async function fetchJSON(url) {
  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status} ${res.statusText}`);
  }
  return res.json();
}

function escapeHTML(s) {
  return String(s || '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}

// ----------------------------------------------------------------
// Hero
// ----------------------------------------------------------------
function renderHero(user) {
  // avatar
  const avatarBox = $('#avatar');
  avatarBox.innerHTML = '';
  if (user.avatar_url) {
    const img = el('img', { src: user.avatar_url, alt: `${user.login} avatar` });
    img.loading = 'lazy';
    avatarBox.appendChild(img);
  }

  $('#eyebrow').textContent = user.company ? `${user.company}` : '— github —';
  $('#name').textContent    = user.name || user.login;
  $('#bio').textContent     = user.bio || '';

  // meta line
  const meta = $('#meta');
  meta.innerHTML = '';
  const items = [];
  if (user.location)   items.push({ label: user.location,  icon: '◐' });
  if (user.blog)       items.push({ label: cleanURL(user.blog), icon: '⌘', href: user.blog });
  if (user.email)      items.push({ label: user.email,     icon: '✉', href: `mailto:${user.email}` });
  if (user.hireable)   items.push({ label: 'open to work', icon: '◉' });
  items.push({ label: `@${user.login}`, icon: '◇', href: user.html_url });

  for (const item of items) {
    const li = el('li', { class: 'hero__meta-item' });
    if (item.href) {
      li.appendChild(el('a', { href: item.href, target: '_blank', rel: 'noopener', class: 'hero__meta-link' },
        [el('span', { class: 'hero__meta-icon', text: item.icon }),
         el('span', { text: item.label })]));
    } else {
      li.appendChild(el('span', { class: 'hero__meta-icon', text: item.icon }));
      li.appendChild(el('span', { text: item.label }));
    }
    meta.appendChild(li);
  }

  $('#cta-primary').href = user.html_url;
  $('#foot-sig').textContent = `— ${user.login}`;
  document.title = `${user.name || user.login} — Profile`;
}

function cleanURL(u) {
  return String(u).replace(/^https?:\/\//, '').replace(/\/$/, '');
}

// ----------------------------------------------------------------
// Repos
// ----------------------------------------------------------------
function renderRepos(repos, filterLang = 'all') {
  const grid = $('#repos-grid');
  grid.innerHTML = '';

  const filtered = (filterLang === 'all')
    ? repos
    : repos.filter((r) => r.language === filterLang);

  // Hide forks by default; show them too but lower visual weight
  const sorted = [...filtered].sort((a, b) => b.stargazers_count - a.stargazers_count);

  $('#repo-count').textContent = `${sorted.length} ${sorted.length === 1 ? 'repo' : 'repos'}`;

  if (sorted.length === 0) {
    grid.appendChild(el('div', { class: 'repos__empty', text: 'No repos in this language yet.' }));
    return;
  }

  for (const r of sorted) {
    grid.appendChild(renderRepoCard(r));
  }
}

function renderRepoCard(r) {
  const card = el('article', { class: 'card' + (r.fork ? ' card--fork' : '') + (r.archived ? ' card--archived' : '') });

  // head
  const head = el('header', { class: 'card__head' }, [
    el('a', { class: 'card__title', href: r.html_url, target: '_blank', rel: 'noopener', text: r.name }),
  ]);
  if (r.fork)      head.appendChild(el('span', { class: 'tag tag--ghost', text: 'fork' }));
  if (r.archived)  head.appendChild(el('span', { class: 'tag tag--warn',  text: 'archived' }));
  if (r.private)   head.appendChild(el('span', { class: 'tag tag--ghost', text: 'private' }));

  card.appendChild(head);

  // description
  const desc = r.description || 'No description provided.';
  card.appendChild(el('p', { class: 'card__desc', text: desc }));

  // footer
  const foot = el('footer', { class: 'card__foot' });

  if (r.language) {
    const dot = el('span', { class: 'lang-dot' });
    dot.style.background = LANG_COLORS[r.language] || '#888';
    foot.appendChild(el('span', { class: 'card__lang' }, [dot, el('span', { text: r.language })]));
  }

  foot.appendChild(el('span', { class: 'card__stat', text: '★ ' + formatNumber(r.stargazers_count) }));
  foot.appendChild(el('span', { class: 'card__stat', text: '⑂ ' + formatNumber(r.forks_count) }));
  foot.appendChild(el('span', { class: 'card__date', text: 'updated ' + formatDate(r.updated_at) }));

  // topics (if any)
  if (Array.isArray(r.topics) && r.topics.length) {
    const topics = el('div', { class: 'card__topics' });
    for (const t of r.topics.slice(0, 4)) {
      topics.appendChild(el('span', { class: 'topic', text: t }));
    }
    card.appendChild(topics);
  }

  card.appendChild(foot);
  return card;
}

function bindFilter(repos) {
  const chips = document.querySelectorAll('.chip');
  chips.forEach((c) => {
    c.addEventListener('click', () => {
      chips.forEach((x) => x.classList.remove('is-active'));
      c.classList.add('is-active');
      renderRepos(repos, c.dataset.lang);
    });
  });
}

boot();
